import axiosInstance from '../utils/environment'

class NotificationsServices{
    public async getNotifications(URL: string){
        try {
            const response: any = await axiosInstance.get(URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
const NotificationsService = new NotificationsServices()
export default NotificationsService