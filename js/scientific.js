let angleMode = "DEG";

const degButton = document.getElementById("deg-button");
const radButton = document.getElementById("rad-button");

degButton.addEventListener("click", () => {
    angleMode = "DEG";

    degButton.classList.add("mode-active");
    radButton.classList.remove("mode-active");
});

radButton.addEventListener("click", () => {
    angleMode = "RAD";

    radButton.classList.add("mode-active");
    degButton.classList.remove("mode-active");
});

let expression = "";

const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

function updateDisplay() {
    expressionDisplay.textContent = expression;
    resultDisplay.textContent = expression || "0";
}

function addValue(value) {
    expression += value;
    updateDisplay();
}

function clearCalculator() {
    expression = "";
    updateDisplay();
}

function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function calculate() {

    try {

        let exp = expression;

        // π・e
        exp = exp.replaceAll("π", "Math.PI");
        exp = exp.replaceAll("e", "Math.E");

        // 四則演算
        exp = exp.replaceAll("×", "*");
        exp = exp.replaceAll("÷", "/");

        // 三角関数
        if (angleMode === "DEG") {

            // 度数法
            exp = exp.replace(
                /sin\(([^()]*)\)/g,
                "Math.sin(($1) * Math.PI / 180)"
            );

            exp = exp.replace(
                /cos\(([^()]*)\)/g,
                "Math.cos(($1) * Math.PI / 180)"
            );

            exp = exp.replace(
                /tan\(([^()]*)\)/g,
                "Math.tan(($1) * Math.PI / 180)"
            );
        
        } else {

            // ラジアン
            exp = exp.replace(
                /sin\(([^()]*)\)/g,
                "Math.sin($1)"
            );

            exp = exp.replace(
                /cos\(([^()]*)\)/g,
                "Math.cos($1)"
            );

            exp = exp.replace(
                /tan\(([^()]*)\)/g,
                "Math.tan($1)"
                );
        }

        // √
        exp = exp.replace(
            /√\(([^()]*)\)/g,
            "Math.sqrt($1)"
        );

        // log
        exp = exp.replace(
            /log\(([^()]*)\)/g,
            "Math.log10($1)"
        );

        // ln
        exp = exp.replace(
            /ln\(([^()]*)\)/g,
            "Math.log($1)"
        );

        // x²
        exp = exp.replace(
            /([0-9.]+)²/g,
            "($1**2)"
        );

        // xʸ
        exp = exp.replaceAll("^", "**");

        // ★ const → let
        let result = Function(
            `"use strict"; return (${exp})`
        )();

        if (!Number.isFinite(result)) {
            resultDisplay.textContent = "未定義";
            return;
        }

        // 小数誤差を修正
        if (Math.abs(result) < 1e-12) {
            result = 0;
        } else {
            result = Number(result.toPrecision(12));
        }

        expressionDisplay.textContent = expression;
        resultDisplay.textContent = result;

        expression = String(result);

    } catch {
        resultDisplay.textContent = "未定義";
    }
}

function scientificFunction(type) {

    const functionNames = {
        sin: "sin(",
        cos: "cos(",
        tan: "tan(",
        sqrt: "√(",
        log: "log(",
        ln: "ln("
    };

    if (functionNames[type]) {
        expression += functionNames[type];
        updateDisplay();
        return;
    }

    if (type === "square") {
        expression += "²";
        updateDisplay();
        return;
    }

    if (type === "power") {
        expression += "^";
        updateDisplay();
        return;
    }
}

document.querySelectorAll("[data-value]").forEach(button => {

    button.addEventListener("click", () => {
        addValue(button.dataset.value);
    });

});

document.querySelectorAll("[data-function]").forEach(button => {

    button.addEventListener("click", () => {
        scientificFunction(button.dataset.function);
    });

});

document
    .querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document
    .querySelector('[data-action="backspace"]')
    .addEventListener("click", backspace);

document
    .querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);

document
    .querySelector('[data-action="sign"]')
    .addEventListener("click", () => {

        if (expression.startsWith("-")) {
            expression = expression.slice(1);
        } else {
            expression = "-" + expression;
        }

        updateDisplay();
    });

updateDisplay();
