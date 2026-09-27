(function () {
    var RELEASE_BASE = "https://github.com/moonli-lang/moonli/releases/latest/download/";

    var MATRIX = {
        "linux|x86_64|repl": "moonli-v0.0.10.repl.linux.x86_64.bin",
        "linux|arm64|repl":  "moonli-v0.0.10.repl.linux.arm64.bin",
        "linux|x86_64|ciel": "moonli-v0.0.10.ciel.linux.x86_64.bin",
        "linux|arm64|ciel":  "moonli-v0.0.10.ciel.linux.aarch64.bin",
        "linux|x86_64|basic": "moonli-v0.0.10.linux.x86_64.bin",
        "linux|arm64|basic":  "moonli-v0.0.10.linux.aarch64.bin",

        "darwin|x86_64|repl": "moonli-v0.0.10.repl.darwin.x86_64.bin",
        "darwin|arm64|repl":  "moonli-v0.0.10.repl.darwin.arm64.bin",
        "darwin|x86_64|ciel": "moonli-v0.0.10.ciel.darwin.x86_64.bin",
        "darwin|arm64|ciel":  "moonli-v0.0.10.ciel.darwin.arm64.bin",
        "darwin|x86_64|basic": "moonli-v0.0.10.darwin.x86_64.bin",
        "darwin|arm64|basic":  "moonli-v0.0.10.darwin.arm64.bin",

        "windows|x86_64|repl":  "moonli-v0.0.10.repl.windows.x86_64.exe",
        "windows|x86_64|basic": "moonli-v0.0.10.windows.x86_64.exe",

        // Not available
        // "windows|x86_64|ciel": "moonli-windows-x86_64.lisp"
        // windows|arm64 intentionally omitted -> triggers fallback message
    };
    // ---------------------------------------------------------------------

    var osSel = document.getElementById("moonli-os");
    var archSel = document.getElementById("moonli-arch");
    var variantSel = document.getElementById("moonli-variant");
    var link = document.getElementById("moonli-download-link");
    var filenameLabel = document.getElementById("moonli-download-filename");
    var fallback = document.getElementById("moonli-download-fallback");

    function update() {
        var key = osSel.value + "|" + archSel.value + "|" + variantSel.value;
        var file = MATRIX[key];

        if (file) {
            link.href = RELEASE_BASE + file;
            link.style.display = "";
            filenameLabel.textContent = "(" + file + ")";
            fallback.style.display = "none";
        } else {
            link.style.display = "none";
            fallback.style.display = "";
        }
    }

    // Best-effort OS auto-detection, defaults to Linux if unsure.
    function detectOS() {
        var p = (navigator.userAgentData && navigator.userAgentData.platform) ||
            navigator.platform || navigator.userAgent || "";
        p = p.toLowerCase();
        if (p.indexOf("mac") !== -1) return "darwin";
        if (p.indexOf("win") !== -1) return "windows";
        return "linux";
    }
    function detectArch() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("arm64") !== -1 || ua.indexOf("aarch64") !== -1) return "arm64";
        return "x86_64";
    }

    osSel.value = detectOS();
    archSel.value = detectArch();

    [osSel, archSel, variantSel].forEach(function (el) {
        el.addEventListener("change", update);
    });

    update();
})();
