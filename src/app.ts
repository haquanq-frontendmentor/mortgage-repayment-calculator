import { setupRedioField } from "./features/setupRadioField";
import { setupTextField } from "./features/setupTextField";
import { calculateRepayment } from "./utils/calculateRepayment";
import { formatPrice } from "./utils/formatPrice";

const mortgageAmountTextField = setupTextField("#mortgage-amount", {
    type: "float",
    min: 1,
    max: 1000000000,
    required: true,
});

const mortgageTermTextField = setupTextField("#mortgage-term", {
    type: "integer",
    min: 1,
    max: 100,
    required: true,
});

const mortgageInterestRateTextField = setupTextField("#mortgage-interest-rate", {
    type: "float",
    min: 0.5,
    max: 100,
    required: true,
});

const mortgageTypeRadioField = setupRedioField("#mortgage-type");

const form = document.querySelector("#calculator-form") as HTMLFormElement;
const formResetButton = document.querySelector("#clear-btn") as HTMLButtonElement;
const formHint = document.querySelector("#calculator-form-hint") as HTMLElement;
const repaymentMonthly = document.querySelector(".result__monthly--value") as HTMLElement;
const repaymentTotal = document.querySelector(".result__total--value") as HTMLElement;
const resultWrapper = document.querySelector(".result") as HTMLElement;

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields: Array<{ getName: () => string; focus: () => void; reset: () => void }> = [];

    if (mortgageAmountTextField.validate() === false) {
        invalidFields.push(mortgageAmountTextField);
    }
    if (mortgageTermTextField.validate() === false) {
        invalidFields.push(mortgageTermTextField);
    }
    if (mortgageInterestRateTextField.validate() === false) {
        invalidFields.push(mortgageInterestRateTextField);
    }
    if (mortgageTypeRadioField.validate() === false) {
        invalidFields.push(mortgageTypeRadioField);
    }

    formResetButton.addEventListener("click", () => {
        resultWrapper.removeAttribute("data-show");
        form.reset();
        invalidFields.forEach((field) => field.reset());
    });

    if (invalidFields.length === 0) {
        formHint.textContent = "";
        const formData = new FormData(form);

        const loanAmount = mortgageAmountTextField.getValue() as number;
        const numberOfMonths = (mortgageTermTextField.getValue() as number) * 12;
        const monthlyInterestRate = (mortgageInterestRateTextField.getValue() as number) / 1200;

        const repayment = calculateRepayment(loanAmount, numberOfMonths, monthlyInterestRate);

        const mortgageType = formData.get(mortgageTypeRadioField.getName()) as string;

        if (mortgageType === "interest-only") {
            repayment.total -= loanAmount;
            repayment.monthly = repayment.total / numberOfMonths;
        }

        resultWrapper.setAttribute("data-show", "");
        repaymentMonthly.textContent = formatPrice(repayment.monthly);
        repaymentTotal.textContent = formatPrice(repayment.total);
    } else {
        formHint.textContent = `Submission failed, ${
            invalidFields.length
        } errors, please check these fields: ${invalidFields.map((x) => x.getName().replaceAll("-", " ")).join("")}`;

        invalidFields[0].focus();
    }
});
