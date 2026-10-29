(function initializePokekingTraductor() {
    // Guard against the script being evaluated twice in the same page.
    if (window.__pokekingTraductorLoaded) return;
    window.__pokekingTraductorLoaded = true;

    const DEBUG = false;
    const log = (...args) => { if (DEBUG) console.log("Pokeking Traductor:", ...args); };

    // `browser` is provided by browser-polyfill.min.js (loaded first in the manifest).
    const api = typeof browser !== "undefined" ? browser : chrome;

    // --- Constants ---
    const DICTIONARY_STORAGE_KEY = "myDictionary";
    const SHOW_ORIGINAL_KEY = "showOriginal";

    const TRANSLATED_CLASS = "pokeking-translated";
    const WRAPPER_CLASS = "pokeking-translated-wrapper";
    const TOGGLE_BUTTON_CLASS = "pokeking-toggle-button";
    const ERROR_BUTTON_CLASS = "pokeking-error-button";
    const ORIGINAL_ATTR = "original";
    const TRANSLATED_ATTR = "translated";

    const CUSTOM_ALERT_ID = "pokeking-custom-alert";
    const CUSTOM_ALERT_MESSAGE_CLASS = "pokeking-custom-alert-message";
    const CUSTOM_ALERT_BUTTON_CLASS = "pokeking-custom-alert-button";
    const ERROR_FORM_ID = "pokeking-error-report-form";
    const BUTTONS_CONTAINER_ID = "pokeking-buttons-container";

    // Anything inside one of these belongs to the extension and must never be translated.
    const OWN_UI_SELECTOR = `.${WRAPPER_CLASS}, #${CUSTOM_ALERT_ID}, #${ERROR_FORM_ID}, #${BUTTONS_CONTAINER_ID}`;
    const SKIP_TAGS = new Set(["script", "style", "noscript", "template", "textarea"]);

    const MUTATION_DELAY_MS = 50;

    // --- State ---
    let isShowingOriginal = false;
    let isDark = false;
    let dictMap = new Map();
    let keywordRegex = null;

    // --- Utilities ---
    function whenBodyReady(fn) {
        if (document.body) fn();
        else document.addEventListener("DOMContentLoaded", fn, { once: true });
    }

    function parseEventDetail(detail) {
        if (typeof detail === "string") {
            try { return JSON.parse(detail) || {}; } catch { return { message: detail }; }
        }
        return detail || {};
    }

    // --- Dictionary / matcher ---
    // Capa inglés -> español (dictionary_es.js). Sin ella, el texto queda en inglés.
    const toSpanish = (globalThis.POKEKING_ES && globalThis.POKEKING_ES.translateValue) || (v => v);
    const applyExtras = (globalThis.POKEKING_ES && globalThis.POKEKING_ES.translateExtras) || (t => t);
    const applyEnglish = (globalThis.POKEKING_ES && globalThis.POKEKING_ES.translateEnglish) || (t => t);
    const EXACT = (globalThis.POKEKING_ES && globalThis.POKEKING_ES.exact) || Object.create(null);

    function buildMatcher(dict) {
        dictMap = new Map();
        for (const [key, value] of Object.entries(dict || {})) {
            // An empty key would make the regex match everywhere.
            // El diccionario remoto es chino -> inglés; aquí el inglés pasa a español.
            // Las claves solo numéricas se ignoran: convertían partes de los códigos (UUID) en palabras.
            if (key && typeof value === "string" && !/^\d+$/.test(key)) dictMap.set(key, toSpanish(value));
        }
        // Correcciones propias (chino -> español) que mandan sobre el diccionario remoto.
        const overrides = (globalThis.POKEKING_ES && globalThis.POKEKING_ES.overrides) || {};
        for (const [key, value] of Object.entries(overrides)) dictMap.set(key, value);
        const words = (globalThis.POKEKING_ES && globalThis.POKEKING_ES.words) || {};
        for (const [key, value] of Object.entries(words)) {
            dictMap.set(key, /\s$/.test(value) ? value : value + " ");
        }

        if (dictMap.size === 0) {
            keywordRegex = null;
            return;
        }
        // Longest keys first so "Mega Charizard X" wins over "Charizard".
        const pattern = [...dictMap.keys()]
            .sort((a, b) => b.length - a.length)
            .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|");
        keywordRegex = new RegExp(pattern, "g");
        log(`Matcher built with ${dictMap.size} entries.`);
    }

    function translateText(text) {
        // Texto que es exactamente un tipo ("龙" -> "Dragón"), sin tocar los espacios de alrededor.
        const trimmed = text.trim();
        if (trimmed && EXACT[trimmed]) return text.replace(trimmed, EXACT[trimmed]);

        const prepared = applyExtras(text); // fechas, antes que las palabras sueltas
        if (!keywordRegex) return applyEnglish(prepared);
        // String.prototype.replace resets lastIndex itself, so no stateful .test() is needed.
        let lastEnd = -1;
        let lastReplacement = "";
        const translated = prepared.replace(keywordRegex, (match, offset, whole) => {
            const replacement = dictMap.get(match) ?? match;
            const startsWord = /^[A-Za-zÁÉÍÓÚÜÑáéíóúñ¡¿(]/.test(replacement);
            // Si va pegado a un número o letra latina ("2跑" -> "2correr"), se separa con un espacio.
            const prev = offset > 0 ? whole[offset - 1] : "";
            let out = replacement;
            if (prev && /[0-9A-Za-z%)]/.test(prev) && startsWord) {
                out = " " + replacement;
            } else if (offset === lastEnd && /[0-9A-Za-zÁÉÍÓÚÜÑáéíóúñ%.)]$/.test(lastReplacement) && startsWord) {
                // Dos palabras traducidas seguidas sin espacio ("Heatran" + "rápido").
                out = " " + replacement;
            }
            lastEnd = offset + match.length;
            lastReplacement = replacement;
            return out;
        });
        // Texto que ya venía en inglés (equipos escritos por la comunidad).
        const withEnglish = applyEnglish(translated);
        // "cuenta ?" -> "cuenta?", "Scrafty ," -> "Scrafty,", "[ Vidasfera ]" -> "[Vidasfera]"
        return withEnglish.replace(/ +([,.;:?!\])])/g, "$1").replace(/([\[(]) +/g, "$1");
    }

    // Dentro del <span> los espacios finales se colapsan ("Dragonite8.4%"). Si algo sigue al
    // texto y el original no terminaba en espacio, se usa un espacio duro para conservarlo.
    // --- Mayúscula inicial ---
    // Un texto traducido que abre una línea, botón o celda empieza con mayúscula
    // ("seleccionado" -> "Seleccionado"). A mitad de frase (tras un enlace, por ejemplo) no.
    const LEADING_PUNCT = /^[\s:：,，;；.()（）\[\]【】\-–—>→/·•]*/;

    function startsBlock(node) {
        let current = node;
        while (current) {
            for (let s = current.previousSibling; s; s = s.previousSibling) {
                const hasText = s.nodeType === Node.TEXT_NODE
                    ? s.nodeValue.trim()
                    : (s.nodeType === Node.ELEMENT_NODE && s.textContent.trim());
                if (hasText) return false;
            }
            const parent = current.parentElement;
            if (!parent) return true;
            // Solo se sigue subiendo mientras el contenedor sea "inline" puro.
            if (getComputedStyle(parent).display !== "inline") return true;
            current = parent;
        }
        return true;
    }

    function capitalizeStart(original, translated, node) {
        const prefix = translated.match(LEADING_PUNCT)[0];
        const first = translated.charAt(prefix.length);
        if (!/[a-záéíóúñü]/.test(first)) return translated;
        // Solo si esa palabra sale de una traducción: el original no empezaba con letras latinas.
        const originalRest = original.slice(original.match(LEADING_PUNCT)[0].length);
        if (!originalRest || /^[\x00-\x7F]/.test(originalRest)) return translated;
        if (!startsBlock(node)) return translated;
        return translated.slice(0, prefix.length) + first.toUpperCase() + translated.slice(prefix.length + 1);
    }

    // Se excluyen los botones: ahí el espacio final solo descentraría el texto.
    const allowsTrailingNbsp = (el) => !(el && el.closest && el.closest("button, .btn"));

    function keepTrailingSpace(original, translated, allowed) {
        if (!allowed || /\s$/.test(original)) return translated;
        return translated.replace(/ +$/, (m) => "\u00A0".repeat(m.length));
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function getDictionaryWithRetry(retries = 5, delay = 500) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await api.runtime.sendMessage({ action: "getDictionary" });
                if (response && response.dictionary) return response.dictionary;
                throw new Error("Empty response from background script");
            } catch (error) {
                const message = String((error && error.message) || error);
                const retryable = /Receiving end does not exist|Could not establish connection|Empty response/i.test(message);
                if (retryable && i < retries - 1) {
                    await sleep(delay * (i + 1));
                    continue;
                }
                console.error("Pokeking Traductor: Failed to get dictionary from background:", error);
                return {};
            }
        }
        return {};
    }

    // --- DOM translation ---

    /**
     * Collects the text nodes under `root` that are eligible for translation.
     * Skips the extension's own UI, already translated text, scripts/styles and editable fields.
     */
    function getAllStaticTextElements(root = document.body) {
        const nodes = [];
        if (!root) return nodes;

        const isExcluded = (parent) =>
            !parent ||
            SKIP_TAGS.has(parent.localName) ||
            parent.isContentEditable ||
            !!parent.closest(OWN_UI_SELECTOR);

        if (root.nodeType === Node.TEXT_NODE) {
            if (root.nodeValue.trim() && !isExcluded(root.parentElement)) nodes.push(root);
            return nodes;
        }
        if (root.nodeType !== Node.ELEMENT_NODE) return nodes;
        // closest() includes the element itself, so our own wrappers/modals are skipped entirely.
        if (root.closest(OWN_UI_SELECTOR)) return nodes;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                return isExcluded(node.parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
        });
        while (walker.nextNode()) nodes.push(walker.currentNode);
        return nodes;
    }

    /** Replaces dictionary keywords in the given text nodes, wrapping them in toggleable spans. */
    function replaceKeywords(nodes) {

        let translationsMade = 0;
        for (const node of nodes) {
            // The node may have been removed or already wrapped since it was collected.
            if (!node.isConnected || !node.parentNode) continue;
            if (node.parentElement && node.parentElement.closest(OWN_UI_SELECTOR)) continue;

            const originalText = node.nodeValue;
            let translatedText = translateText(originalText);
            if (translatedText === originalText) continue;
            translatedText = capitalizeStart(originalText, translatedText, node);
            translatedText = keepTrailingSpace(originalText, translatedText, allowsTrailingNbsp(node.parentElement));

            const span = document.createElement("span");
            span.className = TRANSLATED_CLASS;
            span.dataset[ORIGINAL_ATTR] = originalText;
            span.dataset[TRANSLATED_ATTR] = translatedText;
            span.textContent = isShowingOriginal ? originalText : translatedText;
            // Al pasar el ratón se ve el texto chino original.
            span.title = originalText.trim();

            const wrapper = document.createElement("span");
            wrapper.className = WRAPPER_CLASS;
            wrapper.appendChild(span);

            node.parentNode.replaceChild(wrapper, node);
            translationsMade++;
        }
        if (translationsMade > 0) log(`Performed ${translationsMade} keyword replacements.`);
    }

    function scanWholeDocument() {
        replaceKeywords(getAllStaticTextElements());
        translateFormFields();
    }

    /** Swaps every translated span between original and translated text. */
    function toggleTranslationDisplay() {
        setFieldsDisplay();
        document.querySelectorAll(`.${TRANSLATED_CLASS}`).forEach(span => {
            span.textContent = isShowingOriginal
                ? span.dataset[ORIGINAL_ATTR]
                : span.dataset[TRANSLATED_ATTR];
        });
        // Content added while "original" was showing was ignored; catch up now.
        if (!isShowingOriginal) scanWholeDocument();
    }

    /** Applies a new dictionary (e.g. after the hourly background update) without a page reload. */
    function applyDictionary(newDict) {
        buildMatcher(newDict);
        refreshFieldTranslations();
        document.querySelectorAll(`.${TRANSLATED_CLASS}`).forEach(span => {
            const original = span.dataset[ORIGINAL_ATTR];
            const capitalized = capitalizeStart(original, translateText(original), span.parentNode);
            const translated = keepTrailingSpace(original, capitalized, allowsTrailingNbsp(span.parentElement));
            span.dataset[TRANSLATED_ATTR] = translated;
            if (!isShowingOriginal) span.textContent = translated;
        });
        if (!isShowingOriginal) scanWholeDocument();
    }

    // --- Campos de formulario ---
    // El texto de un <input> (valores de solo lectura, botones, placeholders) no es un nodo
    // de texto, así que se traduce aparte. Los campos que el usuario puede editar nunca se tocan.

    function valueIsTranslatable(el) {
        const type = (el.type || "text").toLowerCase();
        if (type === "button" || type === "submit" || type === "reset") return true;
        if (el.tagName === "TEXTAREA" || ["text", "search", "email", "url", "tel"].includes(type)) {
            return el.readOnly || el.disabled;
        }
        return false;
    }

    function syncField(el, prop) {
        const origKey = `pk${prop}Orig`;
        const trKey = `pk${prop}Tr`;
        const current = el[prop];
        if (!current) return;
        if (el.dataset[trKey] !== undefined && current === el.dataset[trKey]) return; // ya traducido
        const translated = translateText(current);
        if (translated === current) {
            delete el.dataset[origKey];
            delete el.dataset[trKey];
            return;
        }
        el.dataset[origKey] = current;
        el.dataset[trKey] = translated;
        el[prop] = translated;
    }

    function translateFormFields() {
        if (isShowingOriginal || !document.body) return;
        document.querySelectorAll("input, textarea").forEach((el) => {
            if (el.closest(OWN_UI_SELECTOR)) return;
            if (el.placeholder) syncField(el, "placeholder");
            if (valueIsTranslatable(el)) syncField(el, "value");
        });
    }

    function setFieldsDisplay() {
        for (const prop of ["value", "placeholder"]) {
            document.querySelectorAll(`[data-pk${prop}-orig]`).forEach((el) => {
                el[prop] = isShowingOriginal ? el.dataset[`pk${prop}Orig`] : el.dataset[`pk${prop}Tr`];
            });
        }
    }

    function refreshFieldTranslations() {
        for (const prop of ["value", "placeholder"]) {
            document.querySelectorAll(`[data-pk${prop}-orig]`).forEach((el) => {
                const translated = translateText(el.dataset[`pk${prop}Orig`]);
                el.dataset[`pk${prop}Tr`] = translated;
                if (!isShowingOriginal) el[prop] = translated;
            });
        }
        translateFormFields();
    }

    // --- Feedback UI ---

    function showCustomAlert(originalMessage) {
        whenBodyReady(() => {
            let alertDiv = document.getElementById(CUSTOM_ALERT_ID);
            if (!alertDiv) {
                alertDiv = document.createElement("div");
                alertDiv.id = CUSTOM_ALERT_ID;
                alertDiv.setAttribute("role", "alertdialog");

                const alertContent = document.createElement("div");
                alertContent.className = "pokeking-custom-alert-content";

                const messageElement = document.createElement("p");
                messageElement.className = CUSTOM_ALERT_MESSAGE_CLASS;
                alertContent.appendChild(messageElement);

                const okButton = document.createElement("button");
                okButton.className = CUSTOM_ALERT_BUTTON_CLASS;
                okButton.textContent = "OK";
                okButton.addEventListener("click", () => { alertDiv.style.display = "none"; });
                alertContent.appendChild(okButton);

                alertDiv.appendChild(alertContent);
                document.body.appendChild(alertDiv);
            }

            // Whole-message lookup AND partial keyword replacement (longest match wins).
            alertDiv.querySelector(`.${CUSTOM_ALERT_MESSAGE_CLASS}`).textContent =
                translateText(String(originalMessage).trim());
            alertDiv.style.display = "flex";
            const ok = alertDiv.querySelector(`.${CUSTOM_ALERT_BUTTON_CLASS}`);
            if (ok) ok.focus();
        });
    }

    function showTemporaryMessage(message) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7); color: white; padding: 10px 20px;
            border-radius: 5px; z-index: 10002; opacity: 0;
            transition: opacity 0.5s ease-in-out; pointer-events: none;
        `;
        document.body.appendChild(messageDiv);
        setTimeout(() => { messageDiv.style.opacity = 1; }, 10);
        setTimeout(() => { messageDiv.style.opacity = 0; }, 2000);
        setTimeout(() => messageDiv.remove(), 2600);
    }

    // --- Error report form ---

    const errorReportFormHTML = `
        <div id="${ERROR_FORM_ID}" role="dialog" aria-modal="true" aria-labelledby="pokeking-error-form-title">
            <div class="pokeking-error-form-content">
                <h3 id="pokeking-error-form-title">Reportar error de traducción</h3>

                <p><strong>Texto original en chino:</strong> <span id="pokeking-display-chinese-text"></span></p>
                <label for="pokeking-user-provided-chinese-text">Texto chino correcto (si es distinto o falta):</label>
                <input type="text" id="pokeking-user-provided-chinese-text" maxlength="500" placeholder="p. ej., 请输入正确的中文文本">

                <p><strong>Traducción actual:</strong> <span id="pokeking-display-current-translation"></span></p>

                <label for="pokeking-contributor-ign">Tu nombre en el juego (opcional):</label>
                <input type="text" id="pokeking-contributor-ign" maxlength="100" placeholder="p. ej., abc">

                <label for="pokeking-team-used">Tu equipo (opcional):</label>
                <input type="text" id="pokeking-team-used" maxlength="100" placeholder="p. ej., wild taste">

                <label for="pokeking-pokeking-code">Código de Pokeking (opcional):</label>
                <input type="text" id="pokeking-pokeking-code" maxlength="64" placeholder="p. ej., 8E8EBC6ECBC9DEE4FE9BFAEC97A05375">

                <input type="hidden" id="pokeking-pokemon-region">
                <input type="hidden" id="pokeking-elite-four-member">
                <input type="hidden" id="pokeking-lead-pokemon">

                <label for="pokeking-user-suggested-correction">Corrección sugerida / información extra (opcional):</label>
                <textarea id="pokeking-user-suggested-correction" maxlength="1000" placeholder="p. ej., Debería ser 'Snorlax'"></textarea>

                <p id="pokeking-report-status" role="status" style="color:#ff6b6b;min-height:1.2em;"></p>

                <div class="pokeking-error-form-buttons">
                    <button id="pokeking-submit-error-btn">Enviar reporte</button>
                    <button id="pokeking-cancel-report-btn">Cancelar</button>
                </div>
            </div>
        </div>
    `;

    /** Reads region / Elite 4 member / lead Pokémon from the page breadcrumb. */
    function parseUrlForContext() {
        const items = document.querySelectorAll("ol.breadcrumb > li");
        const extractText = (item) => {
            if (!item) return "";
            const translatedSpan = item.querySelector(`.${TRANSLATED_CLASS}`);
            if (translatedSpan && translatedSpan.dataset[TRANSLATED_ATTR]) {
                return translatedSpan.dataset[TRANSLATED_ATTR].trim();
            }
            const link = item.querySelector("a");
            return (link ? link.textContent : item.textContent).trim();
        };
        return {
            region: extractText(items[1]),
            eliteFourMember: extractText(items[2]),
            leadPokemon: extractText(items[3])
        };
    }

    function hideErrorForm() {
        const form = document.getElementById(ERROR_FORM_ID);
        if (form) form.style.display = "none";
    }

    function isErrorFormOpen() {
        const form = document.getElementById(ERROR_FORM_ID);
        return !!form && form.style.display !== "none" && form.style.display !== "";
    }

    function createErrorForm() {
        const temp = document.createElement("div");
        temp.innerHTML = errorReportFormHTML;
        const form = temp.firstElementChild;
        document.body.appendChild(form);

        document.getElementById("pokeking-submit-error-btn").addEventListener("click", handleSubmitError);
        document.getElementById("pokeking-cancel-report-btn").addEventListener("click", hideErrorForm);

        // Close with Escape, or by clicking the dark backdrop. The mousedown check avoids
        // closing the form when a text selection drag ends outside the dialog.
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && isErrorFormOpen()) hideErrorForm();
        });
        let downOnBackdrop = false;
        form.addEventListener("mousedown", (e) => { downOnBackdrop = e.target === form; });
        form.addEventListener("click", (e) => {
            if (downOnBackdrop && e.target === form) hideErrorForm();
            downOnBackdrop = false;
        });
        return form;
    }

    function showErrorReportForm(originalChineseText, currentTranslation) {
        whenBodyReady(() => {
            const form = document.getElementById(ERROR_FORM_ID) || createErrorForm();

            // Keep the raw values in data attributes so the submit never depends on display text.
            form.dataset.original = originalChineseText || "";
            form.dataset.current = currentTranslation || "";
            document.getElementById("pokeking-display-chinese-text").textContent = originalChineseText || "(nada seleccionado)";
            document.getElementById("pokeking-display-current-translation").textContent = currentTranslation || "N/D";

            for (const id of ["pokeking-contributor-ign", "pokeking-team-used", "pokeking-pokeking-code",
                              "pokeking-user-suggested-correction", "pokeking-user-provided-chinese-text"]) {
                document.getElementById(id).value = "";
            }
            document.getElementById("pokeking-report-status").textContent = "";

            const submitBtn = document.getElementById("pokeking-submit-error-btn");
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar reporte";

            const context = parseUrlForContext();
            document.getElementById("pokeking-pokemon-region").value = context.region;
            document.getElementById("pokeking-elite-four-member").value = context.eliteFourMember;
            document.getElementById("pokeking-lead-pokemon").value = context.leadPokemon;

            form.style.display = "flex";
            // If nothing was selected, put the cursor where the user needs to type.
            if (!originalChineseText) document.getElementById("pokeking-user-provided-chinese-text").focus();
        });
    }

    async function handleSubmitError() {
        const form = document.getElementById(ERROR_FORM_ID);
        const submitBtn = document.getElementById("pokeking-submit-error-btn");
        const status = document.getElementById("pokeking-report-status");
        const value = id => document.getElementById(id).value.trim();

        const finalChineseText = value("pokeking-user-provided-chinese-text") || form.dataset.original || "";
        const suggestedCorrection = value("pokeking-user-suggested-correction");

        if (!finalChineseText && !suggestedCorrection) {
            status.textContent = "Indica el texto en chino o una corrección sugerida.";
            return;
        }

        const payload = {
            contributor: value("pokeking-contributor-ign"),
            teamUsed: value("pokeking-team-used"),
            pokekingCode: value("pokeking-pokeking-code"),
            pokemonRegion: document.getElementById("pokeking-pokemon-region").value,
            eliteFourMember: document.getElementById("pokeking-elite-four-member").value,
            leadPokemon: document.getElementById("pokeking-lead-pokemon").value,
            chineseText: finalChineseText,
            currentTranslation: form.dataset.current || "",
            userSuggestedCorrection: suggestedCorrection,
            pageUrl: window.location.href
        };

        // Prevent double submissions while the request is in flight.
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando…";
        status.textContent = "";

        try {
            // The background script performs the request (not subject to the page's CORS/CSP).
            const result = await api.runtime.sendMessage({ action: "submitReport", payload });
            if (result && result.success) {
                hideErrorForm();
                showCustomAlert("¡Error de traducción reportado correctamente! Gracias por tu aportación.");
            } else {
                // Shown inside the form: the generic alert would render behind the form overlay.
                status.textContent = "No se pudo enviar el reporte: " + ((result && result.message) || "error desconocido.");
            }
        } catch (error) {
            console.error("Pokeking Traductor: report failed:", error);
            status.textContent = "Ocurrió un error al enviar el reporte. Revisa tu conexión a internet.";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar reporte";
        }
    }

    // --- Extension buttons ---

    function handleErrorButtonClick() {
        const selection = window.getSelection();
        let originalChineseText = "";
        let currentTranslation = "";

        if (selection && selection.rangeCount > 0) {
            const container = selection.getRangeAt(0).startContainer;
            const element = container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;
            const span = element && element.closest(`.${TRANSLATED_CLASS}`);

            if (span) {
                originalChineseText = span.dataset[ORIGINAL_ATTR] || "";
                currentTranslation = span.dataset[TRANSLATED_ATTR] || "";
            } else {
                originalChineseText = selection.toString().trim();
                currentTranslation = originalChineseText ? translateText(originalChineseText) : "";
            }
        }
        // With no usable selection the form still opens, with the "Correct Chinese Text"
        // field focused, instead of the old blocking prompt() dialog.
        showErrorReportForm(originalChineseText, currentTranslation);
    }

    function addExtensionButtons() {
        if (!document.body) return;

        let container = document.getElementById(BUTTONS_CONTAINER_ID);
        if (!container) {
            container = document.createElement("div");
            container.id = BUTTONS_CONTAINER_ID;
            document.body.appendChild(container);
        }

        if (!document.getElementById("myDarkModeButton")) {
            const button = document.createElement("button");
            button.id = "myDarkModeButton";
            button.className = TOGGLE_BUTTON_CLASS;
            button.textContent = isDark ? "Claro" : "Oscuro";
            button.title = "Cambiar entre modo oscuro y modo claro";
            button.setAttribute("aria-pressed", String(isDark));
            button.addEventListener("click", () => setDarkMode(!isDark));
            container.insertBefore(button, container.firstChild);
        }

        if (!document.getElementById("myTranslationToggleButton")) {
            const button = document.createElement("button");
            button.id = "myTranslationToggleButton";
            button.className = TOGGLE_BUTTON_CLASS;
            button.textContent = isShowingOriginal ? "ES" : "CN";
            button.title = "Cambiar entre el texto original en chino y la traducción al español";
            button.addEventListener("click", () => {
                if (isErrorFormOpen()) {
                    hideErrorForm();
                    return;
                }
                isShowingOriginal = !isShowingOriginal;
                toggleTranslationDisplay();
                // Se recuerda la preferencia para las próximas visitas.
                api.storage.local.set({ [SHOW_ORIGINAL_KEY]: isShowingOriginal }).catch(() => {});
                button.textContent = isShowingOriginal ? "ES" : "CN";
            });
            container.appendChild(button);
        }

        if (!document.getElementById("myErrorReportButton")) {
            const button = document.createElement("button");
            button.id = "myErrorReportButton";
            button.className = ERROR_BUTTON_CLASS;
            button.textContent = "Reportar error";
            button.title = "Selecciona o toca primero el texto incorrecto y luego pulsa este botón";
            button.addEventListener("click", handleErrorButtonClick);
            container.appendChild(button);
        }
    }

    // --- Mutation handling (throttled; the walk happens once per batch, not per mutation) ---

    const pendingRoots = new Set();
    let pendingTimer = null;

    function processPending() {
        pendingTimer = null;
        const roots = [...pendingRoots];
        pendingRoots.clear();
        if (isShowingOriginal) return; // toggling back triggers a full rescan

        const nodes = new Set();
        for (const root of roots) {
            if (!root.isConnected) continue;
            for (const node of getAllStaticTextElements(root)) nodes.add(node);
        }
        if (nodes.size > 0) replaceKeywords([...nodes]);

        translateFormFields();
        applyAdminLayoutFixes();
        // Single-page navigation can wipe our buttons; restore them if they disappeared.
        addExtensionButtons();
    }

    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            if (isDark) {
                for (const mutation of mutations) {
                    if (mutation.type === "attributes") {
                        pendingDark.add(mutation.target);
                    } else if (mutation.type === "childList") {
                        for (const added of mutation.addedNodes) {
                            if (added.nodeType === Node.ELEMENT_NODE) pendingDark.add(added);
                        }
                    }
                }
                if (pendingDark.size) scheduleDarkPass();
            }
            if (isShowingOriginal) return;
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const added of mutation.addedNodes) {
                        if (added.nodeType === Node.ELEMENT_NODE || added.nodeType === Node.TEXT_NODE) {
                            pendingRoots.add(added);
                        }
                    }
                } else if (mutation.type === "characterData") {
                    pendingRoots.add(mutation.target);
                }
            }
            // Throttle rather than debounce: a page that mutates constantly still gets translated.
            if (pendingRoots.size > 0 && !pendingTimer) {
                pendingTimer = setTimeout(processPending, MUTATION_DELAY_MS);
            }
        });
        observer.observe(document.body, {
            childList: true, subtree: true, characterData: true,
            attributes: true, attributeFilter: ["class"]
        });
        log("MutationObserver active.");
    }

    // --- Modo oscuro ---
    // Sin conocer el HTML de la web, no se usa una lista fija de colores: cada elemento se mide
    // (fondo, texto y bordes reales) y solo se oscurece lo claro y neutro. Lo que ya tiene color
    // propio (botones verdes, etiquetas amarillas, texto rojo) se respeta.
    // Los colores nuevos se guardan en variables CSS del propio elemento y solo se aplican
    // mientras <html> tenga la clase "pokeking-dark"; por eso desactivarlo es instantáneo.

    const DARK_KEY = "darkMode";
    const DARK_CLASS = "pokeking-dark";
    const DARK_PAGE_BG = { r: 0, g: 0, b: 0 };
    const DARK_SKIP = new Set(["script", "style", "noscript", "template", "img", "svg", "canvas", "video",
        "audio", "iframe", "picture", "source", "link", "meta", "head", "title", "br"]);
    const darkBgRgb = new WeakMap();   // fondo efectivo (RGB, ya oscurecido) de cada elemento
    const darkFinalFg = new WeakMap(); // color final del texto de cada elemento
    const pendingDark = new Set();
    let darkTimer = null;

    function parseColor(text) {
        const m = text && text.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
        if (p.length < 3 || p.some(Number.isNaN)) return null;
        return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    }

    function rgbToHsl({ r, g, b }) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        const d = max - min;
        let h = 0;
        let s = 0;
        if (d) {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h *= 60;
        }
        return { h, s, l };
    }

    const hslCss = (h, s, l, a = 1) =>
        `hsla(${h.toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%, ${a})`;

    const DARK_BORDER_SIDES = [
        ["Top", "t", "pkdBt"], ["Right", "r", "pkdBr"], ["Bottom", "b", "pkdBb"], ["Left", "l", "pkdBl"]
    ];

    function hslToRgb(h, s, l) {
        const k = (n) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
    }

    function luminance({ r, g, b }) {
        const lin = (v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    }

    function contrastRatio(a, b) {
        const la = luminance(a);
        const lb = luminance(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    }

    const blendRgb = (top, bottom, alpha) => ({
        r: top.r * alpha + bottom.r * (1 - alpha),
        g: top.g * alpha + bottom.g * (1 - alpha),
        b: top.b * alpha + bottom.b * (1 - alpha)
    });

    const rgbCss = ({ r, g, b }) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

    // Fase 1: solo lecturas (decide los colores). Fase 2: escrituras. Así no se fuerza
    // un recálculo de estilos por cada elemento.
    function planDarkElement(el, ops) {
        if (DARK_SKIP.has(el.localName) || el.closest(OWN_UI_SELECTOR) || el.closest("svg")) return;

        if (el === document.documentElement || el === document.body) {
            darkBgRgb.set(el, DARK_PAGE_BG);
            darkFinalFg.set(el, "rgb(255, 255, 255)");
            ops.push({ el, vars: { "--pkd-fg": "rgb(255, 255, 255)" }, attrs: ["pkdFg"] });
            return;
        }

        const cs = getComputedStyle(el);
        const parent = el.parentElement;
        const op = { el, vars: {}, attrs: [] };

        // Fondo: lo claro se oscurece conservando el tono (y suavizando la saturación);
        // lo medio u oscuro (botones verdes, etiquetas amarillas…) se respeta.
        const parentBg = (parent && darkBgRgb.get(parent)) || DARK_PAGE_BG;
        let effectiveBg = parentBg;
        let keepsOwnColors = false; // fondo propio que no se toca: su texto ya está pensado para él
        const bg = parseColor(cs.backgroundColor);
        if (bg && bg.a > 0.25) {
            const hsl = rgbToHsl(bg);
            let rgb = { r: bg.r, g: bg.g, b: bg.b };
            const isCyan = hsl.h >= 170 && hsl.h <= 200 && hsl.s > 0.4 && hsl.l > 0.2 && hsl.l < 0.65;
            keepsOwnColors = !(hsl.l > 0.7);
            if (hsl.l > 0.7) {
                // Negro de verdad: los fondos neutros claros pasan a negro puro (o casi);
                // los que tienen tinte (beige, azul claro, verde claro) a un tono muy oscuro.
                const lightness = hsl.s < 0.15
                    ? Math.max(0, (1 - hsl.l) * 0.55 - 0.02)
                    : 0.035 + (1 - hsl.l) * 0.4;
                const isGreen = hsl.h >= 90 && hsl.h <= 170 && hsl.s >= 0.2;
                // Los verdes claros (avisos) quedan en un verde medio, más claro que el resto.
                rgb = isGreen ? hslToRgb(hsl.h, 0.45, 0.28) : hslToRgb(hsl.h, Math.min(hsl.s, 0.5), lightness);
                op.vars["--pkd-bg"] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bg.a})`;
                op.attrs.push("pkdBg");
            } else if (isCyan) {
                // El cian (cabeceras y botones "info") pasa a rojo.
                rgb = { r: 179, g: 0, b: 27 };
                op.vars["--pkd-bg"] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bg.a})`;
                op.attrs.push("pkdBg");
            }
            effectiveBg = blendRgb(rgb, parentBg, bg.a);
        }
        darkBgRgb.set(el, effectiveBg);

        // Texto: se comprueba el contraste REAL contra el fondo que va a quedar.
        // Si es ilegible se prueba una versión del mismo tono y, si no basta, blanco o negro.
        let finalFg = cs.color;
        const fg = parseColor(cs.color);
        if (fg && !keepsOwnColors) {
            const f = rgbToHsl(fg);
            const onDark = luminance(effectiveBg) < 0.4;
            const isRed = (f.h <= 15 || f.h >= 345) && f.s > 0.6 && f.l > 0.3 && f.l < 0.7;
            if (onDark && !isRed) {
                // Letras blancas de verdad: todo el texto, incluidos enlaces y nombres.
                // Solo se conserva el rojo (las líneas del paso a paso).
                finalFg = "rgb(255, 255, 255)";
            } else if (contrastRatio(fg, effectiveBg) < 3.5) {
                const tries = onDark
                    ? [hslToRgb(f.h, Math.min(f.s, 0.5), 0.82), { r: 255, g: 255, b: 255 }]
                    : [hslToRgb(f.h, Math.min(f.s, 0.5), 0.18), { r: 17, g: 17, b: 17 }];
                finalFg = rgbCss(tries.find((c) => contrastRatio(c, effectiveBg) >= 4.5) || tries[tries.length - 1]);
            }
        }
        // Se fija explícitamente cuando lo hemos cambiado o difiere del que heredaría del padre
        // (un color declarado en la hoja de estilos del propio elemento no se hereda).
        const parentFg = parent ? darkFinalFg.get(parent) : null;
        darkFinalFg.set(el, finalFg);
        if (finalFg !== cs.color || finalFg !== parentFg) {
            op.vars["--pkd-fg"] = finalFg;
            op.attrs.push("pkdFg");
        }

        // Elementos atenuados (opacity < 0.85, p. ej. botones desactivados): sobre fondo oscuro
        // el texto se hunde, así que se suben a 0.85.
        const opacity = parseFloat(cs.opacity);
        if (opacity >= 0.1 && opacity < 0.85) {
            op.vars["--pkd-op"] = "0.85";
            op.attrs.push("pkdOp");
        }

        // Bordes claros y neutros.
        for (const [side, letter, attr] of DARK_BORDER_SIDES) {
            if (!(parseFloat(cs[`border${side}Width`]) > 0)) continue;
            const c = parseColor(cs[`border${side}Color`]);
            if (!c || c.a <= 0.25) continue;
            const h = rgbToHsl(c);
            if (h.l > 0.6 && h.s < 0.4) {
                op.vars[`--pkd-b${letter}`] = hslCss(h.h, h.s, 0.3, c.a);
                op.attrs.push(attr);
            }
        }
        ops.push(op);
    }

    const DARK_ATTR_KEYS = ["pkdBg", "pkdFg", "pkdOp", "pkdBt", "pkdBr", "pkdBb", "pkdBl"];

    function runDarkPass(roots) {
        // Se recorren solo los elementos afectados y se les quitan sus marcas propias: así
        // getComputedStyle devuelve sus colores originales SIN tocar la clase de <html>
        // (quitarla y ponerla obligaba al navegador a recalcular los estilos de toda la página).
        const elements = [];
        for (const root of roots) {
            if (!root.isConnected) continue;
            elements.push(root);
            for (const el of root.querySelectorAll("*")) elements.push(el);
        }
        for (const el of elements) {
            if (!el.dataset) continue;
            for (const key of DARK_ATTR_KEYS) if (key in el.dataset) delete el.dataset[key];
        }
        const ops = [];
        for (const el of elements) planDarkElement(el, ops);
        for (const { el, vars, attrs } of ops) {
            for (const [name, value] of Object.entries(vars)) el.style.setProperty(name, value);
            for (const key of attrs) el.dataset[key] = "";
        }
    }

    function scheduleDarkPass() {
        if (darkTimer) return;
        darkTimer = setTimeout(() => {
            darkTimer = null;
            const roots = [...pendingDark];
            pendingDark.clear();
            if (isDark && roots.length) runDarkPass(roots);
        }, 120);
    }

    function updateDarkButton() {
        const button = document.getElementById("myDarkModeButton");
        if (button) {
            button.textContent = isDark ? "Claro" : "Oscuro";
            button.setAttribute("aria-pressed", String(isDark));
        }
    }

    function setDarkMode(on, save = true) {
        isDark = on;
        const html = document.documentElement;
        if (on) {
            runDarkPass([html]);
            html.classList.add(DARK_CLASS);
        } else {
            html.classList.remove(DARK_CLASS);
        }
        updateDarkButton();
        if (save) api.storage.local.set({ [DARK_KEY]: on }).catch(() => {});
    }

    // --- Páginas de acceso (admin.html: iniciar sesión / registrarse) ---
    // Sin ver el HTML de estas páginas, se localizan los bloques por su texto traducido
    // y se centran. Es idempotente: cada elemento se marca para no tocarlo dos veces.

    const setImportant = (el, prop, value) => el.style.setProperty(prop, value, "important");

    function blockOf(el) {
        let node = el;
        while (node && node !== document.body) {
            const display = getComputedStyle(node).display;
            if (display !== "inline" && display !== "contents") return node;
            node = node.parentElement;
        }
        return null;
    }

    function centerText(el) {
        if (!el || el.dataset.pkCentered) return;
        el.dataset.pkCentered = "1";
        setImportant(el, "text-align", "center");
    }

    // La tarjeta es el ancestro más grande que sigue siendo estrecho (< 60 % del ancho de la ventana).
    function cardOf(el) {
        let card = el;
        while (card && card.parentElement && card.parentElement !== document.body) {
            if (card.parentElement.getBoundingClientRect().width > window.innerWidth * 0.6) break;
            card = card.parentElement;
        }
        return card;
    }

    function centerCard(card) {
        if (!card || card.dataset.pkCentered) return;
        card.dataset.pkCentered = "1";
        const position = getComputedStyle(card).position;
        if (position === "absolute" || position === "fixed") {
            setImportant(card, "left", "50%");
            setImportant(card, "right", "auto");
            setImportant(card, "transform", "translateX(-50%)");
        } else {
            setImportant(card, "float", "none");
            setImportant(card, "margin-left", "auto");
            setImportant(card, "margin-right", "auto");
            const parent = card.parentElement;
            if (parent) {
                const display = getComputedStyle(parent).display;
                if (display.includes("flex")) setImportant(parent, "justify-content", "center");
                else if (display === "grid") setImportant(parent, "justify-items", "center");
                else setImportant(parent, "text-align", "center");
            }
        }
        // El texto en español es más largo: la tarjeta crece en vez de solapar los botones.
        setImportant(card, "height", "auto");
        setImportant(card, "overflow", "visible");
    }

    function applyAdminLayoutFixes() {
        if (!/admin\.html/i.test(location.pathname) || isShowingOriginal || !document.body) return;
        document.documentElement.classList.add("pokeking-admin");

        const spans = [...document.querySelectorAll(`.${TRANSLATED_CLASS}`)];
        const textOf = (span) => span.textContent.replace(/\u00A0/g, " ").trim();

        for (const span of spans) {
            const text = textOf(span);
            const link = span.closest("a");
            if (/^Bienvenido/i.test(text)) {
                const block = blockOf(span);
                centerText(block);
                if (block) centerText(block.parentElement);
            } else if (link && /^(Regístrate|Restablecer)$/i.test(text)) {
                centerText(link.parentElement);
            }
        }

        if (/register/i.test(location.hash)) {
            const heading = spans.find((s) => /^Regístrate$/i.test(textOf(s)) && !s.closest("a"));
            if (heading) centerCard(cardOf(blockOf(heading)));
        }
    }

    // --- Start-up ---

    // 1) Listeners and the alert hook go first, so nothing is lost while the dictionary loads.
    const injected = document.createElement("script");
    injected.src = api.runtime.getURL("injected_script.js");
    injected.onload = () => injected.remove();
    (document.head || document.documentElement).prepend(injected);

    window.addEventListener("pokekingAlertIntercepted", (event) => {
        const { message } = parseEventDetail(event.detail);
        showCustomAlert(message === undefined ? "" : message);
    });

    // Al enviar un formulario se mandan los valores originales, no los traducidos.
    document.addEventListener("submit", () => {
        document.querySelectorAll("[data-pkvalue-orig]").forEach((el) => { el.value = el.dataset.pkvalueOrig; });
        setTimeout(() => { if (!isShowingOriginal) setFieldsDisplay(); }, 0);
    }, true);

    window.addEventListener("pokekingReportRequest", (event) => {
        const { originalText, currentTranslatedText } = parseEventDetail(event.detail);
        showErrorReportForm(originalText || "", currentTranslatedText || "");
    });

    // 2) Pick up dictionary updates from the background script while the page is open.
    api.storage.onChanged.addListener((changes, area) => {
        if (area !== "local" || !changes[DICTIONARY_STORAGE_KEY]) return;
        const { oldValue, newValue } = changes[DICTIONARY_STORAGE_KEY];
        if (!newValue) return;
        if (oldValue && JSON.stringify(oldValue) === JSON.stringify(newValue)) return;
        log("Dictionary changed in storage; applying it.");
        applyDictionary(newValue);
    });

    // 3) Load the dictionary, then translate and watch the page.
    (async () => {
        try {
            const saved = await api.storage.local.get([SHOW_ORIGINAL_KEY, DARK_KEY]);
            isShowingOriginal = !!saved[SHOW_ORIGINAL_KEY];
            isDark = !!saved[DARK_KEY];
            // La clase se pone ya, para que no se vea un destello blanco mientras carga la página.
            if (isDark) document.documentElement.classList.add(DARK_CLASS);
        } catch { /* sin preferencia guardada: se muestra la traducción */ }
        buildMatcher(await getDictionaryWithRetry());
        if (!keywordRegex) {
            console.warn("Pokeking Traductor: Dictionary is empty; waiting for the background update.");
        }
        whenBodyReady(() => {
            scanWholeDocument();
            addExtensionButtons();
            startObserver();
            if (isDark) runDarkPass([document.documentElement]);
            // Algunas páginas rellenan los <input> por script (no genera mutaciones del DOM).
            setInterval(() => { if (!document.hidden) translateFormFields(); }, 1500);
            applyAdminLayoutFixes();
            window.addEventListener("hashchange", () => setTimeout(applyAdminLayoutFixes, 400));
        });
    })();
})();
