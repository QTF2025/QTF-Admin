import axiosInstance from '../utils/environment'

class ReferalsServices{
    public async getReferalsList(URL: string){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async getReferals(id: any){
        try {
            const response: any = await axiosInstance.get(`/referals/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async editReferal(URL: any, data: any){
        try {
            const response: any = await axiosInstance.patch(URL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createReferals(data: any){
        try {
            const response: any = await axiosInstance.post('/referral', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deleteReferal(id: any){
        try {
            const response: any = await axiosInstance.delete(`/referals/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const ReferalsService = new ReferalsServices()

export default ReferalsService