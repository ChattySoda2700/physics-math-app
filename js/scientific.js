let angleMode = "DEG";

let expression = "";
let history = [];

const historyList = document.getElementById("history-list");

const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

const degButton = document.getElementById("deg-button");
const radButton = document.getElementById("rad-button");


// ====================
// DEG / RAD
// ====================

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


// ====================
// 表示
// ====================

function updateDisplay() {
    expressionDisplay.textContent = expression;
    resultDisplay.textContent = expression || "0";
}


// ====================
// 数字・記号入力
// ====================

function addValue(value) {
    expression += value;
    updateDisplay();
}


// ====================
// AC
// ====================

function clearCalculator() {
    expression = "";
    updateDisplay();
}


// ====================
// バックスペース
// ====================

function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}


// ====================
// 計算
// ====================

function calculate() {

    try {

        let exp = expression;

        // π
        exp = exp.replaceAll("π", "Math.PI");

        // e
        exp = exp.replaceAll("e", "Math.E");

        // 四則演算
        exp = exp.replaceAll("×", "*");
        exp = exp.replaceAll("÷", "/");


        // ====================
        // 三角関数
        // ====================

        if (angleMode === "DEG") {

            // DEG
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

            // RAD
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


        // ====================
        // √
        // ====================

        exp = exp.replace(
            /√\(([^()]*)\)/g,
            "Math.sqrt($1)"
        );


        // ====================
        // log
        // ====================

        exp = exp.replace(
            /log\(([^()]*)\)/g,
            "Math.log10($1)"
        );


        // ====================
        // ln
        // ====================

        exp = exp.replace(
            /ln\(([^()]*)\)/g,
            "Math.log($1)"
        );


        // ====================
        // x²
        // ====================

        exp = exp.replace(
            /([0-9.]+)²/g,
            "($1**2)"
        );


        // ====================
        // xʸ
        // ====================

        exp = exp.replaceAll("^", "**");


        // ====================
        // 計算
        // ====================

        let result = Function(
            `"use strict"; return (${exp})`
        )();


        // 未定義
        if (!Number.isFinite(result)) {
            expressionDisplay.textContent = expression;
            resultDisplay.textContent = "未定義";
            return;
        }


        // ====================
        // 小数誤差修正
        // ====================

        if (Math.abs(result) < 1e-12) {

            result = 0;

        } else {

            result = Number(
                result.toPrecision(12)
            );

        }


        // ====================
        // 結果表示
        // ====================

        const originalExpression = expression;

        expressionDisplay.textContent = originalExpression;
        resultDisplay.textContent = result;

        addHistory(

            `${originalExpression} = ${result}`,
            result
        );

        expression = String(result);

    } catch (error) {

        expressionDisplay.textContent = expression;
        resultDisplay.textContent = "未定義";

    }
}


// ====================
// 関数ボタン
// ====================

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


    // x²

    if (type === "square") {

        expression += "²";

        updateDisplay();

        return;
    }


    // xʸ

    if (type === "power") {

        expression += "^";

        updateDisplay();

        return;
    }
}


// ====================
// 数字・記号ボタン
// ====================

document.querySelectorAll("[data-value]").forEach(button => {

    button.addEventListener("click", () => {

        addValue(button.dataset.value);

    });

});


// ====================
// 関数ボタン
// ====================

document.querySelectorAll("[data-function]").forEach(button => {

    button.addEventListener("click", () => {

        scientificFunction(
            button.dataset.function
        );

    });

});


// ====================
// AC
// ====================

document
    .querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);


// ====================
// バックスペース
// ====================

document
    .querySelector('[data-action="backspace"]')
    .addEventListener("click", backspace);


// ====================
// =
// ====================

document
    .querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);


// ====================
// ±
// ====================

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


// ====================
// 初期表示
// ====================

updateDisplay();
