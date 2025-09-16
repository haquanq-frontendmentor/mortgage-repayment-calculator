export const formatPrice = (value: number) => {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currency: "EUR",
        style: "currency",
    });
};
