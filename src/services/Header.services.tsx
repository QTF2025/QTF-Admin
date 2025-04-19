import axiosInstance from '../utils/environment'

class HeaderServices{
    public async getNotifications(URL: string){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async multiDepartment(){
        try {
            const response: any = await axiosInstance.get('/multi-department');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async patchDepartment(data: any){
        try {
            const response: any = await axiosInstance.post('/multi-department/change', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
const HeaderService = new HeaderServices()
export default HeaderService