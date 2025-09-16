export const setupRedioField = (id: string) => {
    const wrapper = document.querySelector(id) as HTMLElement;
    const hint = wrapper.querySelector(".radio-field__hint") as HTMLElement;

    const options = Array.from(wrapper.querySelectorAll(".radio-field__input") as NodeListOf<HTMLInputElement>);

    const validate = () => {
        const notSelected: boolean = options.every((v) => v.checked === false);

        if (notSelected) {
            hint.textContent = "Please select one.";
            wrapper.setAttribute("aria-invalid", "true");
            return false;
        }

        hint.textContent = "";
        wrapper.setAttribute("aria-invalid", "false");
        return true;
    };

    const getName = () => {
        return options[0].name;
    };

    options.forEach((input) => {
        input.addEventListener("blur", () => {
            validate();
        });
    });

    const focus = () => {
        options.at(0)?.focus();
    };

    const reset = () => {
        options.forEach((input) => (input.checked = false));
        hint.textContent = "";
        wrapper.setAttribute("aria-invalid", "false");
    };

    return { validate, getName, focus, reset };
};
