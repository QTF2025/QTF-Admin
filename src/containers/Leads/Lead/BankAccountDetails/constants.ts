export const emptyBankContext = {
    accountNumber: '',
    accountOwnerName: '',
    accountType: '',
    bankName: '',
    routingNumber: '',
    taxPayer: '',
    paymentType: '',
    paymentDate: '',
}

export const bankAccountTypeOptions = [
    {
        value: "1",
        label: "Savings",
    },
    {
        value: "2",
        label: "Checking",
    }
]

export const paymentTypeOptions = [
    {
        value: "",
        label: "None",
    },
    {
        value: "1",
        label: "Auto Withdrawal",
    },
    {
        value: "2",
        label: "Direct Pay",
    },
    {
        value: "3",
        label: "Refund",
    }
]