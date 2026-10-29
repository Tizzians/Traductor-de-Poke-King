/**
 * Recibe los reportes de error de la extensión y los guarda en una hoja de cálculo.
 * Se pega en: Hoja de cálculo → Extensiones → Apps Script.
 * Pasos completos en docs/crear-hoja-de-reportes.md
 */

const SHEET_NAME = "Reportes";

// Debe coincidir con los campos que envía background.js (REPORT_FIELDS).
const FIELDS = [
  "contributor", "teamUsed", "pokekingCode", "pokemonRegion", "eliteFourMember",
  "leadPokemon", "chineseText", "currentTranslation", "userSuggestedCorrection", "pageUrl"
];

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    if (!params.chineseText && !params.userSuggestedCorrection) {
      return json_({ success: false, message: "Reporte vacío." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const row = [new Date()].concat(FIELDS.map((field) => clean_(params[field])));
      getSheet_().appendRow(row);
    } finally {
      lock.releaseLock();
    }
    return json_({ success: true, message: "Reporte recibido." });
  } catch (error) {
    return json_({ success: false, message: "Error: " + error.message });
  }
}

// Abrir la URL en el navegador sirve para comprobar que el servicio está activo.
function doGet() {
  return json_({ success: true, message: "El servicio de reportes está activo." });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(["Fecha"].concat(FIELDS));
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Limita la longitud y evita que un texto que empiece por = + - @ se interprete como fórmula.
function clean_(value) {
  let text = String(value == null ? "" : value).slice(0, 2000);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function json_(object) {
  return ContentService.createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
