import axiosInstance from '../utils/environment'

class AdminServices{
    public async getAdminList(page:any){
        try {
            const response: any = await axiosInstance.get('/admin?page='+page);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async getAdmin(id: any){
        try {
            const response: any = await axiosInstance.get(`/admin/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async editAdmin(data: any, id: any){
        try {
            const response: any = await axiosInstance.patch(`/admin/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createAdmin(data: any){
        try {
            const response: any = await axiosInstance.post('/admin', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deleteAdmin(id: any){
        try {
            const response: any = await axiosInstance.delete(`/admin/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const AdminService = new AdminServices()

export default AdminService