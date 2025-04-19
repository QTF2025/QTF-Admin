import axiosInstance from '../utils/environment'

class LeadServices{
    public async getleadList(URL: any){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getAgentleadList(){
        try {
            const response: any = await axiosInstance.get('/leads/team-members');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async updateAgentlead(leadId: any, values: any){
        try {
            const response: any = await axiosInstance.patch(`/leads/${leadId}/assign-agent`, values)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async updatePaymentStatus(leadId: any, values: any){
        try {
            const response: any = await axiosInstance.patch(`/leads/${leadId}/update-payment-status`, values)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async reopenLead(leadId: any){
        try {
            const response: any = await axiosInstance.post(`/leads/${leadId}/reopen-lead`)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async generateUnknowLeadsJob(){
        try {
            const response: any = await axiosInstance.post('/leads/assign-department');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async getlead(id: any){
        try {
            const response: any = await axiosInstance.get(`/lead/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // public async getleadHistory(leadId: any, deptId: any) {
    //     try {
    //         const URL = `/leads/${leadId}/lead-history`;
    //         const params = deptId ? { deptId } : {};  // Correctly structure params
    //         const response: any = await axiosInstance.get(URL, { params });  // Pass params directly
    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    

    public async getleadHistory(URL: any){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getleadTrackingHistory(URL: any){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    

    public async editlead(data: any, id: any){
        try {
            const response: any = await axiosInstance.patch(`/lead/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createlead(data: any){
        try {
            const response: any = await axiosInstance.post('/lead', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deletelead(id: any){
        try {
            const response: any = await axiosInstance.delete(`/lead/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async deleteleadDocuments(id: any, data:any){
        try {
            const response: any = await axiosInstance.delete(`/leads/${id}/delete-documents`, { data: data});
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async  deletereviewDocuments(leadId: any, commentId: any, select: boolean) {
        try {
            // Send the delete request with the required "select" field
            const response = await axiosInstance.delete(`/leads/${leadId}/reviews/${commentId}`, {
                data: { select: select } // Add the select parameter here
            });
            return response.data; // Handle success
        } catch (error) {
            console.error('Error deleting review document:', error);
            throw error; // Throw error for further handling
        }
    }
    

    public async createComment(currentLeadId: any, data: any){
        try {
            const response: any = await axiosInstance.post(`/leads/${currentLeadId}/comments`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getComments(currentLeadId: any, deptId: any) {
        try {
            const response: any = await axiosInstance.get(`/leads/${currentLeadId}/comments`, {
                params: { deptId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    

    public async createReview(currentLeadId: any, data: any){
        try {
            const response: any = await axiosInstance.post(`/leads/${currentLeadId}/reviews`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async onlineOfflineSubmission(currentLeadId: any, data: any){
        try {
            const response: any = await axiosInstance.post(`/leads/${currentLeadId}/upload-online-offline-attachments`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async onlineFinalSubmission(currentLeadId: any, data: any){
        try {
            const response: any = await axiosInstance.post(`/leads/${currentLeadId}/online-final_submission`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async submissionBack(currentLeadId: any, data: any){
        try {
            const response: any = await axiosInstance.patch(`/leads/${currentLeadId}/update-status-to-back`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async updateServiceCharge(currentLeadId: any, data: any){
        try {
            const response: any = await axiosInstance.patch(`/leads/${currentLeadId}/update-service-charge`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getServiceChargeList(currentLeadId: any){
        try {
            const response: any = await axiosInstance.get(`/leads/${currentLeadId}/service-charge-comments`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async submissionNext(currentLeadId: any, data: any){
        try {
            const response: any = await axiosInstance.patch(`/leads/${currentLeadId}/update_status`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getReviews(currentLeadId: any){
        try {
            const response: any = await axiosInstance.get(`/leads/${currentLeadId}/reviews`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const LeadService = new LeadServices()

export default LeadService