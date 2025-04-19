import axiosInstance from '../utils/environment'

class SuppoertServices{
    public async createTicket(data: any){
        try {
            const response: any = await axiosInstance.post('/tickets', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async getTickets(querystring:any){
        try {
            let response;
        if (querystring) {
             response = await axiosInstance.get(`/tickets${querystring}&isUser=1`);
        } else {
             response = await axiosInstance.get(`/tickets?isUser=1`);
        }
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async getTicketsUser(querystring:any){
        try {
            const response: any = await axiosInstance.get(`/tickets${querystring}?isUser=2`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async updateTicket(body: any, ticketId:any){
        try {
            const response: any = await axiosInstance.patch(`/tickets/${ticketId}`, body);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async getTicketById(ticketId:any){
        try {
            const response: any = await axiosInstance.get(`/tickets/${ticketId}`,);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async getComments(ticketId:any){
        try {
            const response: any = await axiosInstance.get(`/tickets/${ticketId}/comments`,);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async updateTicketStatus(ticketId:any, body:any){
        try {
            const response: any = await axiosInstance.patch(`/tickets/${ticketId}/update-ticket-status`,body);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async postComments(ticketId:any, body:any){
        try {
            const response: any = await axiosInstance.post(`/tickets/${ticketId}/comments`,body);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async deleteTicket(ticketId:any){
        try {
            const response: any = await axiosInstance.delete(`/tickets/${ticketId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

const SuppoertService = new SuppoertServices()

export default SuppoertService