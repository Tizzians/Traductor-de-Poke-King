// Chrome runs this as a service worker (importScripts exists); Firefox loads the
// polyfill through "background.scripts" in the manifest, so importScripts is absent there.
if (typeof importScripts === 'function') {
    importScripts('browser-polyfill.min.js');
}

const DICTIONARY_URL = "https://compscimmo.github.io/pokeking-translator/dictionary.json";
const DICTIONARY_STORAGE_KEY = "myDictionary";
const UPDATE_INTERVAL_MINUTES = 60;
const ALARM_NAME = "updateDictionary";
const MENU_ID = "pokekingReportError";
const FETCH_TIMEOUT_MS = 15000;
// Pega aquí la URL de tu aplicación web de Google Apps Script (termina en /exec).
// Pasos para crearla: docs/crear-hoja-de-reportes.md. Si la dejas vacía, los reportes no se envían a ningún sitio.
const REPORT_URL = "https://script.google.com/macros/s/AKfycbwNPoqf46FkoNa06AocDrXtVm-0tpGeowfwDhWZfRAWBd83dZuPeBT5_dxkd0V0udSR9A/exec";

// Only these fields are forwarded to the report endpoint, each capped in length.
const REPORT_FIELDS = [
    "contributor", "teamUsed", "pokekingCode", "pokemonRegion", "eliteFourMember",
    "leadPokemon", "chineseText", "currentTranslation", "userSuggestedCorrection", "pageUrl"
];
const REPORT_FIELD_MAX_LENGTH = 2000;

// --- Helpers ---

function isValidDictionary(dict) {
    return dict !== null && typeof dict === "object" && !Array.isArray(dict) && Object.keys(dict).length > 0;
}

async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

// --- Dictionary ---

// Concurrent callers share the same request instead of firing several fetches at once.
let inflightUpdate = null;

function fetchAndUpdateDictionary() {
    if (inflightUpdate) return inflightUpdate;

    inflightUpdate = (async () => {
        try {
            const response = await fetchWithTimeout(DICTIONARY_URL, { cache: "no-cache" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const dictionary = await response.json();
            // Never overwrite a good local copy with an empty or malformed one.
            if (!isValidDictionary(dictionary)) {
                throw new Error("Remote dictionary is empty or malformed; keeping the previous copy.");
            }
            // Single write -> a single storage.onChanged event in the content scripts.
            await browser.storage.local.set({
                [DICTIONARY_STORAGE_KEY]: dictionary,
                lastDictionaryUpdate: Date.now()
            });
            return dictionary;
        } catch (error) {
            console.error("Background: Failed to fetch or update dictionary:", error);
            return null;
        } finally {
            inflightUpdate = null;
        }
    })();

    return inflightUpdate;
}

async function getDictionary() {
    const result = await browser.storage.local.get(DICTIONARY_STORAGE_KEY);
    const stored = result[DICTIONARY_STORAGE_KEY];
    if (isValidDictionary(stored)) {
        return stored;
    }
    // First run (or storage cleared): wait for the download so the first page
    // load is already translated, instead of returning {} and fetching in the background.
    const fresh = await fetchAndUpdateDictionary();
    return fresh || {};
}

// --- Report submission (done here so page CORS/CSP can never block it) ---

async function submitReport(payload) {
    if (!payload || typeof payload !== "object") {
        return { success: false, message: "Invalid report." };
    }
    if (!REPORT_URL) {
        return { success: false, message: "los reportes aún no están configurados." };
    }

    const formData = new FormData();
    for (const field of REPORT_FIELDS) {
        const value = payload[field];
        formData.append(field, typeof value === "string" ? value.slice(0, REPORT_FIELD_MAX_LENGTH) : "");
    }

    try {
        const response = await fetchWithTimeout(REPORT_URL, { method: "POST", body: formData });
        const text = await response.text();
        try {
            const result = JSON.parse(text);
            return { success: !!result.success, message: result.message || "" };
        } catch {
            return { success: false, message: `Unexpected response from server (HTTP ${response.status}).` };
        }
    } catch (error) {
        console.error("Background: Failed to submit report:", error);
        return { success: false, message: error.name === "AbortError" ? "The request timed out." : "Network error." };
    }
}

// --- Context menu & alarm setup ---

function createContextMenuItem() {
    // removeAll first so reinstalling/updating never throws "duplicate id".
    return browser.contextMenus.removeAll().then(() => {
        browser.contextMenus.create({
            id: MENU_ID,
            title: "Pokeking Traductor: Reportar error / mala traducción",
            contexts: ["selection", "page"],
            // The content script that handles the report only exists on Pokeking.
            documentUrlPatterns: ["*://*.pokeking.icu/*"]
        });
    });
}

// Creating an alarm with an existing name resets it; only create it when it is missing,
// otherwise a service worker that wakes often could keep postponing the update forever.
async function ensureUpdateAlarm() {
    const existing = await browser.alarms.get(ALARM_NAME);
    if (!existing) {
        browser.alarms.create(ALARM_NAME, { periodInMinutes: UPDATE_INTERVAL_MINUTES });
    }
}

// --- Event listeners ---

browser.runtime.onInstalled.addListener(() => {
    fetchAndUpdateDictionary();
    createContextMenuItem();
    ensureUpdateAlarm();
});

// Browser restarted: alarms can be missed while the browser was closed, so refresh now.
browser.runtime.onStartup.addListener(() => {
    fetchAndUpdateDictionary();
    ensureUpdateAlarm();
});

ensureUpdateAlarm();

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        fetchAndUpdateDictionary();
    }
});

// Returning a Promise works in both Chrome (via the polyfill) and Firefox.
browser.runtime.onMessage.addListener((request) => {
    if (!request || typeof request !== "object") return;

    switch (request.action) {
        case "getDictionary":
            return getDictionary().then((dictionary) => ({ dictionary }));
        case "submitReport":
            return submitReport(request.payload);
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== MENU_ID || !tab || tab.id == null) return;
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["get_selection_and_dispatch.js"]
    }).catch((error) => {
        console.error("Background: Could not run the report script:", error);
    });
});
