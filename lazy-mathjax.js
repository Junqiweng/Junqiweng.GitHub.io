(function () {
    let mathJaxLoadPromise = null;

    function ensureMathJaxConfig() {
        if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') {
            window.MathJax = Object.assign({
                tex: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']],
                    processEscapes: true
                },
                chtml: {
                    scale: 1.05
                },
                startup: {
                    typeset: false
                },
                options: {
                    enableMenu: false
                }
            }, window.MathJax || {});

            window.MathJax.startup = Object.assign({}, window.MathJax.startup || {}, { typeset: false });
        }
    }

    window.ensureMathJaxReady = function ensureMathJaxReady(timeoutMs = 5000) {
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            return Promise.resolve(window.MathJax);
        }

        ensureMathJaxConfig();

        if (mathJaxLoadPromise) {
            return mathJaxLoadPromise;
        }

        mathJaxLoadPromise = new Promise((resolve) => {
            if (!document.getElementById('MathJax-script')) {
                const script = document.createElement('script');
                script.id = 'MathJax-script';
                script.async = true;
                script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
                script.onerror = () => resolve(null);
                document.head.appendChild(script);
            }

            const startedAt = Date.now();
            const timer = setInterval(() => {
                if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                    clearInterval(timer);
                    resolve(window.MathJax);
                } else if (Date.now() - startedAt > timeoutMs) {
                    clearInterval(timer);
                    resolve(null);
                }
            }, 50);
        });

        return mathJaxLoadPromise;
    };

    window.scheduleMathJaxTypeset = function scheduleMathJaxTypeset(target, timeout = 1500) {
        const targets = Array.isArray(target) ? target.filter(Boolean) : [target].filter(Boolean);

        const render = async () => {
            const mathJax = await window.ensureMathJaxReady();
            if (mathJax && targets.length) {
                try {
                    await mathJax.typesetPromise(targets);
                } catch (error) {
                    console.error('MathJax typesetting error:', error);
                }
            }

            targets.forEach((item) => {
                if (item && typeof item.querySelectorAll === 'function') {
                    item.querySelectorAll('.formula-math.loading').forEach((el) => el.classList.remove('loading'));
                }
            });
        };

        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(render, { timeout });
        } else {
            window.setTimeout(render, 0);
        }
    };

    window.hideLoadingOverlay = function hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.remove('show');
    };

    window.addEventListener('pageshow', window.hideLoadingOverlay);
    window.addEventListener('DOMContentLoaded', window.hideLoadingOverlay);
})();
