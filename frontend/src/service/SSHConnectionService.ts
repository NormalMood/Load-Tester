import { ISSHSettings } from "../@types/interfaces/ISSHSettings";
import { BASE_API_URL, axiosInstance } from "../api/axiosInstance";

export class SSHConnectionService {

    static async getSSHSettings() {
        const response = await axiosInstance.get<ISSHSettings>(
            BASE_API_URL + '/ssh-connection/settings'
        )
        return response.data
    }

    static async updateSSHSettings(updatedSSHSettings: ISSHSettings) {
        return await axiosInstance.put<Boolean>(
            BASE_API_URL + '/ssh-connection/settings',
            updatedSSHSettings
        )
    }

}