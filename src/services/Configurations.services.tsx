import axiosInstance from '../utils/environment'

class ConfigurationServices{
    public async getConfiguration(){
        try {
            const response: any = await axiosInstance.get('/configurations');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async createConfiguration(data: any){
        try {
            const response: any = await axiosInstance.post('/configurations', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
const ConfigurationService = new ConfigurationServices()
export default ConfigurationService