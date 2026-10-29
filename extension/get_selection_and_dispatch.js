// This file will be injected and executed in the content script's isolated world.

// The contents of the getSelectionAndDispatchReportEvent function:
(function() { // Wrap it in an IIFE to keep it self-contained
    let originalChineseText = "";
    let currentTranslation = "";
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString().trim();

        const commonAncestor = range.commonAncestorContainer;
        const closestWrapper = commonAncestor.nodeType === Node.ELEMENT_NODE ?
                                commonAncestor.closest('.pokeking-translated-wrapper') :
                                commonAncestor.parentElement ? commonAncestor.parentElement.closest('.pokeking-translated-wrapper') : null;

        if (closestWrapper) {
            const translatedSpan = closestWrapper.querySelector('.pokeking-translated');
            if (translatedSpan) {
                originalChineseText = translatedSpan.dataset.original || selectedText;
                currentTranslation = translatedSpan.textContent || selectedText;
            } else {
                originalChineseText = selectedText;
                currentTranslation = "No se pudo identificar la traducción de la selección.";
            }
        } else {
            originalChineseText = selectedText;
            currentTranslation = "No se aplicó ninguna traducción a este texto seleccionado.";
        }
    } else {
        originalChineseText = "Indica el texto en chino manualmente.";
        currentTranslation = "N/D - No hay texto seleccionado.";
    }

    // Dispatch the custom event to the main content.js script's scope
    window.dispatchEvent(new CustomEvent('pokekingReportRequest', {
        detail: {
            originalText: originalChineseText,
            currentTranslatedText: currentTranslation,
            pageUrl: window.location.href
        }
    }));
    console.log("Injected script (get_selection_and_dispatch.js): Dispatched 'pokekingReportRequest' event.");
})(); // Immediately invoke the function