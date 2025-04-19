import { takeEvery, put, all, fork } from 'redux-saga/effects'
import axiosInstance from '../../utils/environment'
import { Actions } from '../actions'
import { authSuccess, authLoading, setError, setUserData, leadingDetailsLoading, setLeadDetails, setComments } from "../reducers/index";
import { getComments, getReferals, getReviews, initGetLead,  } from '../actions/creators'
import { aesEncrypt } from '../../utils/index'
import localStoreData from '../../utils/localstorage'


export default function* indexSaga() {
    function* post_data(data: any, leadId: any, URL: string): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const responseData: any = yield axiosInstance.post(`/leads/${leadId + URL}`, data);
            yield put(setError({ status: true, type: 'success', message: responseData?.data?.message ? responseData?.data?.message : ''}))
            if(URL === '/reviews'){
                yield put(getReviews(leadId))
                return;
            }
            if(URL === '/comments'){
                yield put(getComments(leadId))
                return;
            }
            yield put(initGetLead(leadId))
            yield put(leadingDetailsLoading(false))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    }

    yield takeEvery(Actions.INITIATE_AUTH, function* init_auth_saga(action: any): Generator {
        try {
            yield put(authLoading(true))
            const authResponse: any = yield axiosInstance.post('/auth/login', action.data);
            yield put(setError({ status: true, type: 'success', message: authResponse?.data?.message ? authResponse?.data?.message : ''}))
            const tokDetails: string = authResponse?.data?.data?.access?.token
            const userDetails = yield aesEncrypt(tokDetails)
            localStoreData.setAccessToken(authResponse?.data?.data?.access?.token)
            localStoreData.setRefreshToken(authResponse?.data?.data?.refresh?.token)
            document.cookie = `refreshToken=${authResponse?.data?.data?.refresh?.token}; HttpOnly;`;

            yield put(authSuccess(true))
            yield put(setUserData(userDetails))
            yield put(setError({ status: false, type: undefined, message: '' }))
            yield put(authLoading(false))
        } catch (err: any) {
            yield put(authLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

     yield takeEvery(Actions.INIT_GET_LEAD, function* init_get_lead(action: any): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const multiDep = localStoreData.getMultiDepartment()
            const userData = localStoreData.getUserData()

            let URL = ''
            if(multiDep !== null && multiDep && userData){
                URL = `/leads/${action.leadId}?deptId=${userData.departmentId}`
            }else{
                URL = `/leads/${action.leadId}`
            }
            
            const authResponse: any = yield axiosInstance.get(URL);
            const data = authResponse.data.data
            
            yield put(leadingDetailsLoading(false))
            yield put(setLeadDetails(data))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_UPDATE_LEAD, function* init_update_lead(action: any): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const responseData: any = yield axiosInstance.patch(`leads/${action.leadId}/personel-information`, action.data);
            yield put(setError({ status: true, type: 'success', message: responseData?.data?.message ? responseData?.data?.message : ''}))
            yield put(initGetLead(action.leadId))
            yield put(leadingDetailsLoading(false))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

   yield takeEvery(Actions.INIT_CREATE_LEAD, function* init_create_lead(action: any): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const response: any = yield axiosInstance.post(`leads`, action.data);
            const data: any = response.data.data;
            yield put(setError({ status: true, type: 'success', message: response?.data?.message ? response?.data?.message : ''}))
            const navigate = action.navigate
            navigate(`/leads/edit/${data.lead_id}`)
            yield put(leadingDetailsLoading(false))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_UPDATE_RESIDENCY, function* init_update_residency(action: any): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const responseData: any = yield axiosInstance.patch(`/leads/${action.leadId}/states-us-residency`, action.data);
            yield put(setError({ status: true, type: 'success', message: responseData?.data?.message ? responseData?.data?.message : ''}))
            yield put(initGetLead(action.leadId))
            yield put(leadingDetailsLoading(false))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_UPDATE_BANK_DETAILS, function* init_update_bankDetails(action: any): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const responseData: any = yield axiosInstance.patch(`/leads/${action.leadId}/bank-account-details`, action.data);
            yield put(setError({ status: true, type: 'success', message: responseData?.data?.message ? responseData?.data?.message : ''}))
            yield put(initGetLead(action.leadId))
            yield put(leadingDetailsLoading(false))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_SUBMIT_TAX_FILE, function* init_submit_tax_file(action: any): Generator {
        try {
            const responseData: any = yield axiosInstance.patch(`/leads/${action.leadId}/reviews/${action.commentId}/`, action.data);
            yield put(setError({ status: true, type: 'success', message: responseData?.data?.message ? responseData?.data?.message : ''}))
            yield put(getReviews(action.leadId))
            yield put(initGetLead(action.leadId))
        } catch (err: any) {
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_REOPEN_LEAD, function* init_reopen_lead(action: any): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const responseData: any = yield axiosInstance.patch(`/leads/${action.leadId}/reopen-request`, action.data);
            yield put(setError({ status: true, type: 'success', message: responseData?.data?.message ? responseData?.data?.message : ''}))
            yield put(initGetLead(action.leadId))
            yield put(leadingDetailsLoading(false))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_UPDATE_VERIFY_STATUS, function* intit_update_verify_status(action: any): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const responseData: any = yield axiosInstance.patch(`/leads/${action.leadId}/update-verify-status`, action.data);
            yield put(setError({ status: true, type: 'success', message: responseData?.data?.message ? responseData?.data?.message : ''}))
            yield put(initGetLead(action.leadId))
            yield put(leadingDetailsLoading(false))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_GET_COMMENTS, function* init_comments(action: any): Generator {
        try {
            const responseData: any = yield axiosInstance.get(`/leads/${action.leadId}/comments`);
            const data = responseData.data.data
            yield put(setComments(data))
        } catch (err: any) {
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_GET_REVIEWS, function* init_comments(action: any): Generator {
        try {
            const responseData: any = yield axiosInstance.get(`/leads/${action.leadId}/reviews`);
            const data = responseData.data.data
            yield put(setComments(data))
        } catch (err: any) {
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

     yield takeEvery(Actions.INIT_ADD_INCOME_INFO, function* init_add_income_info(action: any): Generator {
        try {
            yield put(leadingDetailsLoading(true))
            const responseData: any = yield axiosInstance.patch(`leads/${action.leadId}/income-information`, action.data);
            yield put(setError({ status: true, type: 'success', message: responseData?.data?.message ? responseData?.data?.message : ''}))
            yield put(initGetLead(action.leadId))
            yield put(leadingDetailsLoading(false))
        } catch (err: any) {
            yield put(leadingDetailsLoading(false))
            yield put(setError({ status: true, type: 'error', message: err }))
        }
    })

    yield takeEvery(Actions.INIT_SIGNATURE, function* init_signature(action: any): Generator {
        yield post_data(action.data, action.leadId, '/upload-signature')
    })

    yield takeEvery(Actions.INIT_DAY_CARE_DETAILS, function* init_dayCare_details(action: any): Generator {
        yield post_data(action.data, action.leadId, '/daycare-expenses')
    })

    yield takeEvery(Actions.INIT_RENTAL_INCOME_DETAILS, function* int_rentalIncome_details(action: any): Generator {
        yield post_data(action.data, action.leadId, '/rental-income-expenses')
    })

    yield takeEvery(Actions.INIT_SELF_EMPLOYMENT, function* init_self_employment(action: any): Generator {
        yield post_data(action.data, action.leadId, '/self-employment-info')
    })

     yield takeEvery(Actions.INIT_ESTIMATED_TAX_PAYER, function* init_estimated_taxPayer(action: any): Generator {
        yield post_data(action.data, action.leadId, '/estimated-tax-payments')
    })

    yield takeEvery(Actions.INTI_FBAR_FATCA, function* init_fbar_fatca(action: any): Generator {
        yield post_data(action.data, action.leadId, '/fbar-fatca-settings')
    })

    yield takeEvery(Actions.INIT_OTHER_INCOME, function* init_other_icome(action: any): Generator {
        yield post_data(action.data, action.leadId, '/other-income')
    })

    yield takeEvery(Actions.INIT_ADJUSTMENT_INCOME, function* init_adjustment_income(action: any): Generator {
        yield post_data(action.data, action.leadId, '/adjustments-income')
    })

    yield takeEvery(Actions.INIT_MEDICAL_EXPENSE, function* init_medical_expense(action: any): Generator {
        yield post_data(action.data, action.leadId, '/medical-expenses')
    })

    yield takeEvery(Actions.INIT_TAX_PAID, function* init_tax_paid(action: any): Generator {
        yield post_data(action.data, action.leadId, '/taxes-paid')
    })

    yield takeEvery(Actions.INIT_DOCUMENTS, function* init_documents(action: any): Generator {
        yield post_data(action.data, action.leadId, '/upload-documents')
    })

    yield takeEvery(Actions.INIT_CREATE_REVIEW, function* init_create_review(action: any): Generator {
        yield post_data(action.data, action.leadId, '/reviews')
    })

    yield takeEvery(Actions.INIT_CREATE_COMMENT, function* init_create_comment(action: any): Generator {
        yield post_data(action.data, action.leadId, '/comments')
    })
}


export const rootSaga = function* () {
  yield all([
    fork(indexSaga),
  ]);
};