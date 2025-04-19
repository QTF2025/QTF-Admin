import axiosInstance from '../utils/environment'

class TaxConfigurationServices{
    public async getTaxConfiguration(){
        try {
            const response: any = await axiosInstance.get('/tax-configurations');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async createTaxConfiguration(data: any){
        try {
            const response: any = await axiosInstance.post('/tax-configurations', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async updateLeadTaxConfiguration(leadId: any, data: any){
        try {
            const response: any = await axiosInstance.patch(`/leads/${leadId}/tax-calculations`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
const TaxConfigurationService = new TaxConfigurationServices()
export default TaxConfigurationService