import axiosInstance from '../utils/environment'

class reportsServices{
    public async getreportsList(URL: string){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async getreports(id: any){
        try {
            const response: any = await axiosInstance.get(`/reports/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async editreports(data: any, id: any){
        try {
            const response: any = await axiosInstance.patch(`/reports/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createreports(data: any){
        try {
            const response: any = await axiosInstance.post('/reports', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deletereports(id: any){
        try {
            const response: any = await axiosInstance.delete(`/reports/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const reportsService = new reportsServices()

export default reportsService