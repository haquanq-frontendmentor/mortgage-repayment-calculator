const helper = {
    findFirstApeearance: (str, c) => {
        for (let i = 0; i < str.length; i++) {
            if (str[i] == c) return i;
        }
    },
    isDigit: (c) => /\d/.test(c),
};

const inputErrorMessages = {
    EMPTY_FIELD: "This field is required",
};

const mortgageAmountController = {
    wrapperElement: document.querySelector(".textbox.mortgage-amount"),
    inputElement: document.querySelector(".textbox.mortgage-amount input"),
    messageElement: document.querySelector(".textbox.mortgage-amount .error-msg"),
    decimals: "",
    integers: "",
    getValue() {
        return parseFloat(this.inputElement.value.replace(/\,/g, ""));
    },
    clearInput() {
        this.inputElement.value = "";
    },
    checkEmpty() {
        if (this.inputElement.value == "") {
            this.wrapperElement.classList.add("error");
            this.messageElement.textContent = inputErrorMessages.EMPTY_FIELD;
            return true;
        }
        return false;
    },

    /// events
    handleInputEvent(e) {
        if (e.target.value.length > 15) e.target.value = "";
        const str = e.target.value;

        let dotIndex = helper.findFirstApeearance(e.target.value, ".");
        let integers = "";
        let decimals = "";

        let cursorAt = this.inputElement.selectionStart;

        for (let i = 0; i < str.length; i++) {
            if (helper.isDigit(str[i])) {
                integers += str[i];
            }
            if (integers.length == 12 || str[i] == ".") break;
        }

        if (dotIndex != undefined) {
            decimals = ".";
            for (let i = dotIndex + 1; i < str.length; i++) {
                if (helper.isDigit(str[i])) {
                    decimals += str[i];
                }
                if (decimals.length == 3) break;
            }
        }

        console.log(this.integers, integers);
        console.log(this.decimals, decimals);

        if (integers.length > 9) {
            integers = "999999999";
            decimals = "";
        } else if (integers == "" && decimals != "") {
            integers = "0";
        }

        const addedComma =
            (this.integers.length == 3 && integers.length == 4) ||
            (this.integers.length == 6 && integers.length == 7);
        const addedFraction = this.decimals == "" && decimals != "";
        const removedComma =
            (this.integers.length == 4 && integers.length == 3) ||
            (this.integers.length == 7 && integers.length == 6);
        if (addedFraction || addedComma) {
            cursorAt++;
        } else if (removedComma) {
            cursorAt--;
        }

        e.target.value = (integers != "" ? Number(integers).toLocaleString() : "") + decimals;
        this.integers = integers;
        this.decimals = decimals;
        this.inputElement.setSelectionRange(cursorAt, cursorAt);
    },
    handleFocusEvent(e) {
        this.messageElement.textContent = "";
        this.wrapperElement.classList.remove("error");
    },
    init() {
        this.inputElement.addEventListener("input", (e) => this.handleInputEvent(e));
        this.inputElement.addEventListener("focus", (e) => this.handleFocusEvent(e));
    },
};

const mortgageTermController = {
    wrapperElement: document.querySelector(".textbox.mortgage-term"),
    messageElement: document.querySelector(".textbox.mortgage-term .error-msg"),
    inputElement: document.querySelector(".textbox.mortgage-term input"),
    getValue() {
        return parseInt(this.inputElement.value);
    },
    clearInput() {
        this.inputElement.value = "";
    },
    checkEmpty() {
        if (this.inputElement.value == "") {
            this.wrapperElement.classList.add("error");
            this.messageElement.textContent = inputErrorMessages.EMPTY_FIELD;
            return true;
        }
        return false;
    },

    /// events
    handleInputEvent(e) {
        if (e.target.value.length > 3) e.target.value = "";
        let displayValue = "";
        for (let i = 0; i < e.target.value.length; i++) {
            const c = e.target.value[i];
            if (helper.isDigit(c)) displayValue += c;
            if (displayValue.length == 3) break;
        }
        e.target.value = parseInt(displayValue) > 99 ? "99" : displayValue;
    },
    handleFocusEvent(e) {
        this.messageElement.textContent = "";
        this.wrapperElement.classList.remove("error");
    },
    init() {
        this.inputElement.addEventListener("input", (e) => this.handleInputEvent(e));
        this.inputElement.addEventListener("focus", (e) => this.handleFocusEvent(e));
    },
};

const interestRateController = {
    wrapperElement: document.querySelector(".textbox.interest-rate"),
    inputElement: document.querySelector(".textbox.interest-rate input"),
    messageElement: document.querySelector(".textbox.interest-rate .error-msg"),
    decimals: "",
    integers: "",
    getValue() {
        return parseFloat(this.inputElement.value) / 100;
    },
    clearInput() {
        this.inputElement.value = "";
    },
    checkEmpty() {
        if (this.inputElement.value == "") {
            this.wrapperElement.classList.add("error");
            this.messageElement.textContent = inputErrorMessages.EMPTY_FIELD;
            return true;
        }
        return false;
    },

    /// events
    handleInputEvent(e) {
        if (e.target.value.length > 7) e.target.value = "";
        const str = e.target.value;

        let dotIndex = helper.findFirstApeearance(e.target.value, ".");
        let integers = "";
        let decimals = "";

        for (let i = 0; i < str.length; i++) {
            if (helper.isDigit(str[i])) {
                integers += str[i];
            }
            if (integers.length == 5 || str[i] == ".") break;
        }

        if (dotIndex != undefined) {
            decimals = ".";
            for (let i = dotIndex + 1; i < str.length; i++) {
                if (helper.isDigit(str[i])) {
                    decimals += str[i];
                }
                if (decimals.length == 4) break;
            }
        }

        if (integers.length > 2) {
            if (this.decimals != "" && integers == this.integers + this.decimals.slice(1, 5)) {
                integers = this.integers;
                decimals = "";
            } else {
                integers = "100";
                decimals = "";
            }
        } else if (integers == "" && decimals != "") {
            integers = "0";
        }

        e.target.value = (integers != "" ? Number(integers) : integers) + decimals;
        this.integers = integers;
        this.decimals = decimals;
    },
    handleFocusEvent(e) {
        this.messageElement.textContent = "";
        this.wrapperElement.classList.remove("error");
    },
    init() {
        this.inputElement.addEventListener("input", (e) => this.handleInputEvent(e));
        this.inputElement.addEventListener("focus", (e) => this.handleFocusEvent(e));
    },
};

const mortgageTypeController = {
    wrapperElement: document.querySelector(".mortgage-type-wrapper"),
    optionElements: document.querySelectorAll(".mortgage-type-wrapper input[name=mortgage-type]"),
    messageElement: document.querySelector(".mortgage-type-wrapper .error-msg"),
    clearSelection() {
        this.optionElements.forEach((el) => {
            el.checked = false;
        });
    },
    checkSelected() {
        if (!this.optionElements.values().some((v) => v.checked)) {
            this.wrapperElement.classList.add("error");
            this.messageElement.textContent = inputErrorMessages.EMPTY_FIELD;
            return true;
        }
        return false;
    },

    /// events
    handleFocusEvent(e) {
        this.messageElement.textContent = "";
        this.wrapperElement.classList.remove("error");
    },
    init() {
        this.optionElements.forEach((el) =>
            el.addEventListener("focus", (e) => this.handleFocusEvent(e))
        );
    },
};

const repaymentCaculatorController = {
    formElement: document.querySelector("#calculator-form"),
    clearButton: document.querySelector("#clear-btn"),
    clearAll: () => {
        interestRateController.clearInput();
        mortgageAmountController.clearInput();
        mortgageTermController.clearInput();
        mortgageTypeController.clearSelection();

        document.querySelector(".result-empty").style.display = "";
        document.querySelector(".result-shown").style.display = "";
    },
    calculateRepayment() {
        const n = mortgageTermController.getValue() * 12;
        const P = mortgageAmountController.getValue();
        const r = interestRateController.getValue() / 12;
        const temp = Math.pow(1 + r, n);
        const monthlyPayment = (P * r * temp) / (temp - 1);
        return [monthlyPayment, monthlyPayment * n];
    },

    // events
    handleSubmitEvent(e) {
        e.preventDefault();
        const check = [
            mortgageAmountController.checkEmpty(),
            mortgageTermController.checkEmpty(),
            interestRateController.checkEmpty(),
            mortgageTypeController.checkSelected(),
        ];

        if (check.some((v) => v)) return;
        const res = this.calculateRepayment();

        document.querySelector(".result-empty").style.display = "none";
        document.querySelector(".result-shown").style.display = "block";
        document.querySelector(".repayment-wrapper .monthly .value").innerHTML =
            "&#163;" +
            res[0].toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        document.querySelector(".repayment-wrapper .termly .value").innerHTML =
            "&#163;" +
            res[1].toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
    },
    init() {
        this.clearButton.addEventListener("click", () => this.clearAll());
        this.formElement.addEventListener("submit", (e) => this.handleSubmitEvent(e));
    },
};

repaymentCaculatorController.init();
interestRateController.init();
mortgageAmountController.init();
mortgageTermController.init();
mortgageTypeController.init();
