class localStorageData {
    private set(data: any, key: string) {
        if(typeof data === 'string'){
            localStorage.setItem(key, data)
        }else{
            localStorage.setItem(key, JSON.stringify(data))
        }
    }

    private get(key: string) {
        const data: any = localStorage.getItem(key)
        const parseData = JSON.parse(data);
        return parseData;
    }

    setUserData(data: any){
        return this.set(data, 'user_details')
    }

    getUserData() {
        return this.get('user_details')
    }

    setAccessToken(data: any) {
        return this.set(data, 'access_token')
    }

    getAccessToken() {
        return localStorage.getItem('access_token')
    }

    setRefreshToken(data: any) {
        return this.set(data, 'refresh_token')
    }

    setMultiDepartment(data: any) {
        return this.set(data, 'multi_department')
    }

    getMultiDepartment() {
        return this.get('multi_department')
    }

    getRefreshToken() {
        return localStorage.getItem('access_token')
    }

}

const localStorageContent = new localStorageData()

export default localStorageContent;