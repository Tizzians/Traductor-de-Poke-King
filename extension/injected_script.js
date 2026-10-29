// injected_script.js - runs in the page's own JS world.
// It cannot use extension APIs, so it forwards alerts to the content script via a DOM event.
(function () {
    if (window.__pokekingAlertPatched) return; // never patch twice
    window.__pokekingAlertPatched = true;

    const originalAlert = window.alert;

    window.alert = function (message) {
        try {
            // The detail is a plain string: objects created in the page world can be
            // unreadable from the content script's world (notably in Firefox).
            window.dispatchEvent(new CustomEvent('pokekingAlertIntercepted', {
                detail: JSON.stringify({ message: String(message === undefined ? '' : message) })
            }));
        } catch (error) {
            // If forwarding fails for any reason, fall back to the native alert
            // so the site's message is never silently lost.
            originalAlert.call(window, message);
        }
    };
})();
