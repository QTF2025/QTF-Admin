import { Actions } from './'

export const initAuth = (data: any) => {
    return {
        type: Actions.INITIATE_AUTH,
        data
    }
}

export const initGetLead = (data: any) => {
    return {
        type: Actions.INIT_GET_LEAD,
        leadId: data
    }
}

export const initCreateLead = (data: any, navigate: any) => {
    return {
        type: Actions.INIT_CREATE_LEAD,
        data: data,
        navigate: navigate
    }
}

export const updateLead = (leadId: any, data: any) => {
    return {
        type: Actions.INIT_UPDATE_LEAD,
        leadId,
        data
    }
}

export const updateStateResidency = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_UPDATE_RESIDENCY,
        data,
        leadId
    }
}

export const updateBankDetails = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_UPDATE_BANK_DETAILS,
        data,
        leadId
    }
}

export const addDayCareDetails = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_DAY_CARE_DETAILS,
        data,
        leadId
    }
}


export const addRentalIncomes = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_RENTAL_INCOME_DETAILS,
        data,
        leadId
    }
}

export const addSelfEmployment = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_SELF_EMPLOYMENT,
        data,
        leadId
    }
}

export const addEstimatedTaxPayer = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_ESTIMATED_TAX_PAYER,
        data,
        leadId
    }
}

export const addFbarFatca = (data: any, leadId: any) => {
    return {
        type: Actions.INTI_FBAR_FATCA,
        data,
        leadId
    }
}

export const addOtherIncome = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_OTHER_INCOME,
        data,
        leadId
    }
}

export const addAdjustmentIncome = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_ADJUSTMENT_INCOME,
        data,
        leadId
    }
}

export const addMedicalExpenses = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_MEDICAL_EXPENSE,
        data,
        leadId
    }
}

export const addTaxFile = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_TAX_PAID,
        data,
        leadId
    }
}

export const addDocuments = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_DOCUMENTS,
        data,
        leadId
    }
}

export const getComments = (leadId: any) => {
    return {
        type: Actions.INIT_GET_COMMENTS,
        leadId
    }
}

export const postComment = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_CREATE_COMMENT,
        data,
        leadId
    }
}

export const getReviews = (leadId: any) => {
    return {
        type: Actions.INIT_GET_REVIEWS,
        leadId
    }
}

export const postReview = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_CREATE_REVIEW,
        data,
        leadId
    }
}

export const reOpenLead = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_REOPEN_LEAD,
        data,
        leadId
    }
}

export const selectedReviewFile = (data: any, leadId: any, commentId: any) => {
    return {
        type: Actions.INIT_SUBMIT_TAX_FILE,
        data,
        leadId,
        commentId
    }
}

export const initSignature = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_SIGNATURE,
        data,
        leadId,
    }
}

export const resendOtp = (data: any) => {
    return {
        type: Actions.INIT_RESEND_OTP,
        data,
    }
}

export const submitOtp = (data: any) => {
    return {
        type: Actions.INIT_SUBMIT_OTP,
        data,
    }
}


export const createReferal = (data: any) => {
    return {
        type: Actions.INIT_CREATE_REFERAL,
        data,
    }
}

export const getReferals = (data: any) => {
    return {
        type: Actions.INIT_GET_REFERAL,
        data,
    }
}

export const initUpdateVerifyStatus = (leadId: any, data: any) => {
    return {
        type: Actions.INIT_UPDATE_VERIFY_STATUS,
        leadId,
        data,
    }
}

export const addIncomeInformation = (data: any, leadId: any) => {
    return {
        type: Actions.INIT_ADD_INCOME_INFO,
        data,
        leadId
    }
}