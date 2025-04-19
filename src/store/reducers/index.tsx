import { createSlice, current } from "@reduxjs/toolkit";
import { IInitialState } from './models'

const initialState: IInitialState  = {
    isAuthLoading: false,
    isAuthenticated: false,
    accessToken: '',
    refreshToken: '',
    userData: null,
    leadData: null,
    isleadDetailsLoading: false,
    showAlert: false,
    alertMessage: '',
    alertType: undefined,
    comments: [],
    selectedSections: []
}

const CTFStore = createSlice({
  name: "store",
  initialState: initialState,
  reducers: {
    authSuccess: (state, action) => {
        const { access, refresh } = action.payload
        state.accessToken = access
        state.refreshToken = refresh
        state.isAuthenticated = true
    },
    authLogout: (state, action) => {
        state.accessToken = action.payload
        state.refreshToken = action.payload
        state.isAuthenticated = false
    },
    setUserData: (state, action) => {
        state.userData = action.payload
    },
    authLoading: (state, action) => {
        state.isAuthLoading = action.payload
    },
    setLeadDetails: (state, action) => {
        state.leadData = action.payload
    },
    clearLeadDetails: (state, action) => {
        state.leadData = null
    },
    leadingDetailsLoading: (state, action) => {
        state.isleadDetailsLoading = action.payload
    },
    setError:(state, action) => {
        state.showAlert = action.payload.status;
        state.alertMessage = action.payload.message;
        state.alertType = action.payload.type
    },
    setComments:(state, action) => {
        state.comments = action.payload;
    },
    setSections: (state: any, action) => {
        const currentState = current(state);
        const { selectedSections } = currentState;
        if(selectedSections.includes(action.payload)){
            state.selectedSections = selectedSections.filter((section: any) => section !== action.payload)
        }else{
            state.selectedSections = [...selectedSections, action.payload]
        }
    },
    clearSections:(state, action) => {
        state.selectedSections = [];
    },
    clearData:(state) => {
        state.accessToken = ''
        state.refreshToken = ''
        state.userData = null
        state.leadData = null
        state.isAuthenticated = false
        state.comments = []
    },
  },
});

export const { 
    authSuccess,
    authLogout,
    setUserData,
    authLoading,
    setLeadDetails,
    leadingDetailsLoading,
    setError,
    setComments,
    clearData,
    clearLeadDetails,
    setSections,
    clearSections
 } = CTFStore.actions;

export default CTFStore.reducer;