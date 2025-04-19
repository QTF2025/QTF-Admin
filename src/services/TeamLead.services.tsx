import axiosInstance from '../utils/environment'

class TeamLeadServices
{
    public async getTeamLeadList(page:any){
        try {
            const response: any = await axiosInstance.get('/team-lead?page='+page);
            return response.data;
        } catch (error) {            
            throw error;
        }
    }
    
    public async getTeamLeadSearchDropdownList(){
        try {
            const response: any = await axiosInstance.get('/team-lead/search-team-leads');
            return response.data;
        } catch (error) {            
            throw error;
        }
    }

     public async getTeamLead(id: any){
        try {
            const response: any = await axiosInstance.get(`/team-lead/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async editTeamLead(data: any, id: any){
        try {
            const response: any = await axiosInstance.patch(`/team-lead/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createTeamLead(data: any){
        try {
            const response: any = await axiosInstance.post('team-lead', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deleteTeamLead(id: any){
        try {
            const response: any = await axiosInstance.delete(`/team-lead/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const TeamLeadService = new TeamLeadServices
()

export default TeamLeadService