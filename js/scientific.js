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
        let exp = expression
            .replaceAll("π", "Math.PI")
            .replaceAll("e", "Math.E")
            .replaceAll("×", "*")
            .replaceAll("÷", "/");

        exp = exp.replace(/(\d+(\.\d+)?)²/g, "($1**2)");

        const result = Function(`"use strict"; return (${exp})`)();

        if (!Number.isFinite(result)) {
            resultDisplay.textContent = "未定義";
            return;
        }

        expressionDisplay.textContent = expression;
        resultDisplay.textContent = result;

        expression = String(result);

    } catch {
        resultDisplay.textContent = "未定義";
    }
}

function scientificFunction(type) {

    try {

        const value = parseFloat(expression);

        if (Number.isNaN(value)) {
            return;
        }

        let result;

        switch (type) {

            case "sin":
                result = Math.sin(value * Math.PI / 180);
                break;

            case "cos":
                result = Math.cos(value * Math.PI / 180);
                break;

            case "tan":
                result = Math.tan(value * Math.PI / 180);
                break;

            case "sqrt":
                result = Math.sqrt(value);
                break;

            case "log":
                result = Math.log10(value);
                break;

            case "ln":
                result = Math.log(value);
                break;

            case "square":
                result = value ** 2;
                break;

            case "power":
                expression = `${value}**`;
                updateDisplay();
                return;
        }

        if (!Number.isFinite(result)) {
            resultDisplay.textContent = "未定義";
            return;
        }

        expressionDisplay.textContent =
            `${type}(${value})`;

        resultDisplay.textContent = result;

        expression = String(result);

    } catch {
        resultDisplay.textContent = "未定義";
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
