import axiosInstance from '../utils/environment'

class TeamServices{
    public async getTeamList(URL: string){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

     public async getTeam(id: any){
        try {
            const response: any = await axiosInstance.get(`/team/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async editTeam(data: any, id: any){
        try {
            const response: any = await axiosInstance.patch(`/team/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async createTeam(data: any){
        try {
            const response: any = await axiosInstance.post('/team', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async deleteTeam(id: any){
        try {
            const response: any = await axiosInstance.delete(`/team/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async filterTeamLeadByDept(data:any) {
        try {
            const response: any = await axiosInstance.post('/team/department-team-leads', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const TeamService = new TeamServices()

export default TeamService