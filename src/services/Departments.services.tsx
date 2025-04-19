import axiosInstance from '../utils/environment'

class DepartmentServices{
    public async getDepartmentList(){
        try {
            const response: any = await axiosInstance.get('/departments');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async getDepartment(id: any){
        try {
            const response: any = await axiosInstance.get(`/departments/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async editDepartment(data: any, id: any){
        try {
            const response: any = await axiosInstance.patch(`/departments/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createDepartment(data: any){
        try {
            const response: any = await axiosInstance.post('/departments', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deleteDepartment(id: any){
        try {
            const response: any = await axiosInstance.delete(`/departments/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const DepartmentService = new DepartmentServices()

export default DepartmentService