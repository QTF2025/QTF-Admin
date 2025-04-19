import axiosInstance from '../utils/environment'

class SalesServices{
    public async getsalesList(URL: string){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async generateCronJob(){
        try {
            const response: any = await axiosInstance.get('/sales/remove-sales-contacts');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async generateSubmissionLeadsJob(){
        try {
            const response: any = await axiosInstance.post('/sales/success-contacts-renewal');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async generateVoicemailsJob(){
        try {
            const response: any = await axiosInstance.post('/sales/voicemail-pending-contacts-renewal');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async generateWalkoutLeadsJob(){
        try {
            const response: any = await axiosInstance.post('/sales/pending-contacts-renewal');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async getsales(id: any){
        try {
            const response: any = await axiosInstance.get(`/contacts/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async editsales(data: any, id: any){
        try {
            const response: any = await axiosInstance.patch(`/contacts/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async patchFollowps(URL: string, data: any){
        try {
            const response: any = await axiosInstance.patch(URL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createsales(data: any){
        try {
            const response: any = await axiosInstance.post('/contacts', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createFollowUp(id: any, data: any){
        try {
            const response: any = await axiosInstance.post(`/sales/${id}/create-follow-up`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deletesales(id: any){
        try {
            const response: any = await axiosInstance.delete(`/contacts/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async uploadSalesData(data: any){
        try {
            const response: any = await axiosInstance.post(`/sales/upload-contacts`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async reassignRandomData(){
        try {
            const response: any = await axiosInstance.post(`/sales/shuffle-sales-contacts`, {});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async reassignCallmData(){
        try {
            const response: any = await axiosInstance.post(`/sales/voicemail-pending-contacts-renewal`, {});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async salesFileList(){
        try {
            const response: any = await axiosInstance.get(`/sales//sales_files-list`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deleteFileList(data: any){
        try {
            const response: any = await axiosInstance.delete(`/sales/remove-contacts-file`, { data: data });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getFileDataPath(data: any){
        try {
            const response: any = await axiosInstance.post(`/sales/export-file-contacts`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async editLeadData(contactId: any, data: any){
        try {
            const response: any = await axiosInstance.patch(`/sales/${contactId}/update-contact`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async  leadExist(data: any) {
        try {
          const response = await axiosInstance.post(`/sales/check-lead-with-email`, data);
          return response.data; // Ensure the API response contains the `status` field
        } catch (error) {
          console.error('Error in leadExist API:', error);
          throw error;
        }
      }
      
}

const SalesService = new SalesServices()

export default SalesService