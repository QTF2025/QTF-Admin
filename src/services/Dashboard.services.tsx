import axiosInstance from '../utils/environment'
import localStorageContent from '../utils/localstorage';
import TeamService from '../services/Team.services';

const { getTeamList } = TeamService
const localUserData = localStorageContent.getUserData()


class DashboardServices{
    public async getDashboardDetails(URL: string){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    public async getDashboardDepartmentTeamWiseDetails(URL: string){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async getDashboardLeadwiseWiseteammembersDetails(id: string){
        try {
            const response: any = await axiosInstance.get('/team/search-teams?teamLeadId='+ id);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // public async getDashboardLeadwiseWiseteammembersDetails(value: any) {
    //     try {
    //         const teamLeadid = value ? value : (localUserData?.role === '1' ? 1 : localUserData?.userId);
    //         //console.log("Department ID being sent:", departmentId);
    //         console.log("vee", teamLeadid)
    
    //         // Fetch the team list using the department ID
    //         //const response = await getTeamList(`/dashboard/department-wise-team-members?departmentId=${departmentId}`);
    //         const response = await getTeamList(`/team/search-teams?teamLeadId=${teamLeadid}`);
    //         console.log("API Response:", response);
            
    //         return response.data; // Ensure you return the correct part of the response
    //     } catch (error) {
    //         console.error("Error fetching team members:", error);
    //         throw error;
    //     }
    // }
    
}
const DashboardService = new DashboardServices()
export default DashboardService