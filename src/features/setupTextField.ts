type TextFieldPresets =
    | { type: "integer" | "float"; min: number; max: number; required: boolean }
    | { type: "text"; minLength: number; maxLength: number; required: boolean };

export const setupTextField = (id: `#${string}`, preset: TextFieldPresets) => {
    const wrapper = document.querySelector(id) as HTMLElement;
    const input = wrapper.querySelector(".text-field__input") as HTMLInputElement;
    const hint = wrapper.querySelector(".text-field__hint") as HTMLParagraphElement;
    const adornment = wrapper.querySelector(".text-field__adornment") as HTMLElement;

    if (adornment) {
        adornment.addEventListener("mousedown", (event) => {
            event.preventDefault();
        });
        adornment.addEventListener("click", () => {
            input.focus();
        });
    }

    input.required = preset.required;

    if (preset.type === "text") {
        input.minLength = preset.minLength;
        input.maxLength = preset.maxLength;
    } else {
        input.inputMode = "numeric";
        input.minLength = 1;
        input.maxLength = 30;
    }

    const validate = () => {
        let errorMessage = "";
        if (input.validity.valueMissing) {
            errorMessage = "PLease fill out this field.";
        } else if (input.validity.tooShort || input.validity.tooLong) {
            errorMessage = `Must be beetween ${input.minLength} and ${input.maxLength} characters.`;
        } else if (preset.type !== "text") {
            const rawValue = parseFloat(input.value.replaceAll(",", ""));
            if (rawValue < preset.min || rawValue > preset.max) {
                errorMessage = `Must be between ${preset.min} and ${preset.max.toLocaleString()}`;
            }
        }

        if (errorMessage !== "") {
            wrapper.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-invalid", "true");
            hint.textContent = errorMessage;
            return false;
        }

        wrapper.setAttribute("aria-invalid", "false");
        input.setAttribute("aria-invalid", "false");
        hint.textContent = "";
        return true;
    };

    const getName = () => {
        return input.name;
    };

    const getValue = () => {
        if (preset.type === "float" || preset.type === "integer") {
            return parseFloat(input.value.replaceAll(",", ""));
        }
        return input.value;
    };

    const focus = () => {
        input.focus();
    };

    const reset = () => {
        wrapper.setAttribute("aria-invalid", "false");
        input.setAttribute("aria-invalid", "false");
        hint.textContent = "";
    };

    const handleBeforeInputEvent = (e: InputEvent) => {
        if (preset.type === "float") {
            if (e.data === "." && input.value.includes(".")) {
                e.preventDefault();
            }
        }
    };

    const handleInputEvent = () => {
        if (preset.type === "float" || preset.type === "integer") {
            const regex = preset.type === "float" ? /[^0-9.]/g : /[^0-9]/g;
            const parsedValue = input.value.replaceAll(regex, "");
            input.value = parsedValue;
        }
    };

    const handleBlurEvent = () => {
        if (preset.type === "float" || preset.type === "integer") {
            const newValue = parseFloat(input.value).toLocaleString("en-US", {
                maximumFractionDigits: 2,
            });
            input.value = newValue === "NaN" ? "" : newValue;
        }
        validate();
    };

    const handleFocusEvent = () => {
        input.value = input.value.replaceAll(",", "");
    };

    input.addEventListener("beforeinput", handleBeforeInputEvent);
    input.addEventListener("input", handleInputEvent);
    input.addEventListener("blur", handleBlurEvent);
    input.addEventListener("focus", handleFocusEvent);
    return { validate, getName, focus, reset, getValue };
};
