import { NoticeType } from "antd/es/message/interface"

export interface IInitialState {
    isAuthLoading: boolean,
    isAuthenticated: boolean,
    accessToken: string,
    refreshToken: string,
    userData: any,
    leadData: any,
    isleadDetailsLoading: boolean,
    showAlert: boolean,
    alertMessage: string,
    alertType: NoticeType | undefined,
    comments: any[],
    selectedSections: any[]
}

export interface IActionData {
    type: string,
    data: any
}
export interface IIndexReducer {
    state: IInitialState,
    action: IActionData
}
