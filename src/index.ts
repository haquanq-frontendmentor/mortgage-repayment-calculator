const setupTextField = (
    id: `#${string}`,
    props: {
        required?: boolean;
        maxLength?: number;
        minLength?: number;
        onValidate?: (value: string) => string;
        onInput?: (event: Event) => void;
    },
) => {
    const wrapper = document.querySelector(id) as HTMLElement;
    const input = wrapper.querySelector("[data-text-field-input]") as HTMLInputElement;
    const hint = wrapper.querySelector("[data-text-field-hint]") as HTMLParagraphElement;
    const label = wrapper.querySelector("[data-text-field-label]") as HTMLLabelElement;

    if (props.maxLength) {
        input.maxLength = props.maxLength;
    }
    if (props.minLength) {
        input.minLength = props.minLength;
    }
    if (props.required) {
        input.required = props.required;
        label.textContent += " *";
    }

    const validate = () => {
        let errorMessage = "";
        if (input.validity.valueMissing) {
            errorMessage = "PLease fill out this field.";
        } else if (input.validity.tooShort || input.validity.tooLong) {
            errorMessage = `Must be beetween ${props.minLength} and ${props.maxLength} characters.`;
        } else if (props.onValidate) {
            errorMessage = props.onValidate(input.value);
        }

        if (errorMessage !== "") {
            input.setAttribute("aria-invalid", "true");
            hint.textContent = errorMessage;
            return false;
        }

        input.setAttribute("aria-invalid", "false");
        hint.textContent = "";
        return true;
    };

    const getName = () => {
        return label.textContent;
    };

    const getValue = () => {
        return input.value;
    };

    const focus = () => {
        input.focus();
    };

    if (props.onInput) {
        input.addEventListener("input", props.onInput);
    }
    input.addEventListener("blur", () => validate());
    return { validate, getName, getValue, focus };
};

const mortgageAmountTextField = setupTextField("#mortgage-amount", {
    required: true,
    minLength: 1,
    maxLength: 30,
});

const mortgageTermTextField = setupTextField("#mortgage-term", {
    required: true,
    minLength: 1,
    maxLength: 5,
});

const mortgageInterestRateTextField = setupTextField("#mortgage-interest-rate", {
    required: true,
    minLength: 1,
    maxLength: 5,
});

const mortgageTypeField = {
    wrapper: document.querySelector(".mortgage-type-wrapper") as HTMLElement,
    options: document.querySelectorAll(
        ".mortgage-type-wrapper input[name=mortgage-type]",
    ) as NodeListOf<HTMLInputElement>,
    hint: document.querySelector(".mortgage-type-wrapper .error-msg") as HTMLElement,
    validate() {
        if (!Array.from(this.options.values()).some((v) => v.checked)) {
            this.wrapper.classList.add("error");
            this.hint.textContent = "Please select mortgage type.";
            return false;
        }

        this.wrapper.classList.remove("error");
        return true;
    },
    init() {
        this.options.forEach((el) =>
            el.addEventListener("blur", () => {
                this.validate();
                console.log("Awdaw");
            }),
        );
    },
};

const form = document.querySelector("#calculator-form") as HTMLFormElement;
const formResetButton = document.querySelector("#clear-btn") as HTMLButtonElement;

const calculateRepayment = (loanAmount: number, numberOfMonths: number, monthlyInterestRate: number) => {
    console.log(loanAmount, numberOfMonths, monthlyInterestRate);
    const x = Math.pow(1 + monthlyInterestRate, numberOfMonths);
    const monthlyPaymentAmount = (loanAmount * monthlyInterestRate * x) / (x - 1);
    return { monthly: monthlyPaymentAmount, total: monthlyPaymentAmount * numberOfMonths };
};

const formatPrice = (value: number) => {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currency: "EUR",
        style: "currency",
    });
};

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;

    if (mortgageAmountTextField.validate() === false) {
        valid = false;
    }
    if (mortgageTermTextField.validate() === false) {
        valid = false;
    }
    if (mortgageInterestRateTextField.validate() === false) {
        valid = false;
    }
    if (mortgageTypeField.validate() === false) {
        valid = false;
    }

    console.log(valid);

    if (valid) {
        const repayment = calculateRepayment(
            parseFloat(mortgageAmountTextField.getValue().replaceAll(",", "")),
            parseFloat(mortgageTermTextField.getValue()) * 12,
            parseFloat(mortgageInterestRateTextField.getValue().replaceAll(",", "")) / 1200,
        );

        (document.querySelector(".result-empty") as HTMLElement).style.display = "none";
        (document.querySelector(".result-shown") as HTMLElement).style.display = "block";
        (document.querySelector(".repayment-wrapper .monthly .value") as HTMLElement).textContent = formatPrice(
            repayment.monthly,
        );
        (document.querySelector(".repayment-wrapper .termly .value") as HTMLElement).textContent = formatPrice(
            repayment.total,
        );
    }
});

formResetButton.addEventListener("click", () => {
    (document.querySelector(".result-empty") as HTMLElement).style.display = "";
    (document.querySelector(".result-shown") as HTMLElement).style.display = "";
    form.reset();
});
