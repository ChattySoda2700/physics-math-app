let current = "0";
let previous = null;
let operator = null;
let resetDisplay = false;
let history = [];

const historyList = document.getElementById("history-list");
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

function updateDisplay() {
    resultDisplay.textContent = current;

    if (previous !== null && operator !== null) {
        expressionDisplay.textContent =
            `${previous} ${getOperatorSymbol(operator)}`;
    } else {
        expressionDisplay.textContent = "";
    }
}

function getOperatorSymbol(op) {
    if (op === "+") return "＋";
    if (op === "-") return "−";
    if (op === "*") return "×";
    if (op === "/") return "÷";
    return op;
}

function inputNumber(number) {

    if (resetDisplay) {
        current = number;
        resetDisplay = false;
    } else if (number === "." && current.includes(".")) {
        return;
    } else if (current === "0" && number !== ".") {
        current = number;
    } else {
        current += number;
    }

    updateDisplay();
}

function chooseOperator(op) {

    if (operator !== null && !resetDisplay) {
        calculate();
    }

    previous = parseFloat(current);
    operator = op;
    resetDisplay = true;

    updateDisplay();
}

function calculate() {

    if (previous === null || operator === null) {
        return;
    }

    const currentNumber = parseFloat(current);
    let result;

    switch (operator) {

        case "+":
            result = previous + currentNumber;
            break;

        case "-":
            result = previous - currentNumber;
            break;

        case "*":
            result = previous * currentNumber;
            break;

        case "/":

            if (currentNumber === 0) {

                const expression =
                    `${previous} ${getOperatorSymbol(operator)} 0 = 未定義`;

                history.unshift({
                    expression: expression,
                    result: "未定義"
                });

                updateHistory();

                current = "未定義";
                previous = null;
                operator = null;
                resetDisplay = true;

                updateDisplay();

                return;
            }

            result = previous / currentNumber;
            break;
    }

    // 計算履歴を追加
    const expression =
        `${previous} ${getOperatorSymbol(operator)} ${currentNumber} = ${result}`;

    history.unshift({
        expression: expression,
        result: result
    });

    updateHistory();

    current = String(result);

    previous = null;
    operator = null;
    resetDisplay = true;

    updateDisplay();
}

function clearCalculator() {

    current = "0";
    previous = null;
    operator = null;
    resetDisplay = false;

    updateDisplay();
}

function changeSign() {

    if (current === "0" || current === "Error" || current === "未定義") {
        return;
    }

    current = String(parseFloat(current) * -1);

    updateDisplay();
}

function percent() {

    if (current === "Error" || current === "未定義") {
        return;
    }

    current = String(parseFloat(current) / 100);

    updateDisplay();
}

function updateHistory() {

    historyList.innerHTML = "";

    history.forEach(item => {

        const element = document.createElement("div");

        element.className = "history-item";
        element.textContent = item.expression;

        element.addEventListener("click", () => {

            current = String(item.result);

            previous = null;
            operator = null;
            resetDisplay = false;

            updateDisplay();
        });

        historyList.appendChild(element);
    });
}

document.querySelectorAll("[data-number]").forEach(button => {

    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });

});

document.querySelectorAll("[data-operator]").forEach(button => {

    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });

});

document
    .querySelector('[data-action="equals"]')
    .addEventListener("click", calculate);

document
    .querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document
    .querySelector('[data-action="sign"]')
    .addEventListener("click", changeSign);

document
    .querySelector('[data-action="percent"]')
    .addEventListener("click", percent);

updateDisplay();
updateHistory();
