import axiosInstance from '../utils/environment'

class Authservices{
    public async signIn(data: any){
        try {
            const response: any = await axiosInstance.post('/auth/signupOrLogin', data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    public async logout(data: any){
        try {
            const response: any = await axiosInstance.post('/auth/logout', data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default Authservices