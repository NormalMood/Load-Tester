import { ILoadFromServer } from "../@types/interfaces/ILoadFromServer";
import { ISSHSettings } from "../@types/interfaces/ISSHSettings";
import { BASE_API_URL, axiosInstance } from "../api/axiosInstance";

export class SSHConnectionService {

    static async openSSHConnection() {
        return await axiosInstance.get<Boolean>(
            BASE_API_URL + '/ssh-connection'
        )
    }

    static async getLoadFromServer() {
        const response = await axiosInstance.get<ILoadFromServer>(
            BASE_API_URL + '/server/memory-cpu'
        )
        return response.data
    }

    static async closeSSHConnection() {
        return await axiosInstance.delete<Boolean>(
            BASE_API_URL + '/ssh-connection'
        )
    }

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