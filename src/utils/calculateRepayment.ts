export const calculateRepayment = (loanAmount: number, numberOfMonths: number, monthlyInterestRate: number) => {
    const x = Math.pow(1 + monthlyInterestRate, numberOfMonths);
    const monthlyPaymentAmount = (loanAmount * monthlyInterestRate * x) / (x - 1);
    return {
        monthly: monthlyPaymentAmount,
        total: monthlyPaymentAmount * numberOfMonths,
    };
};
