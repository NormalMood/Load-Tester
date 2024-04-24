import { ILoadFromServer } from "../@types/interfaces/ILoadFromServer";
import { ISSHSettings } from "../@types/interfaces/ISSHSettings";
import { BASE_API_URL, axiosInstance } from "../api/axiosInstance";

export class SSHConnectionService {

    static async openSSHConnection() {
        return await axiosInstance.get<ISSHSettings[]>(
            BASE_API_URL + '/ssh-connection'
        )
    }

    static async getLoadFromServer(sshSettingsGuid: string) {
        const response = await axiosInstance.get<ILoadFromServer>(
            BASE_API_URL + '/server/memory-cpu',
            {
                params: {
                    sshSettingsGuid
                }
            }
        )
        return response.data
    }

    static async closeSSHConnection() {
        return await axiosInstance.delete<Boolean>(
            BASE_API_URL + '/ssh-connection'
        )
    }

    static async getSSHSettings() {
        const response = await axiosInstance.get<ISSHSettings[]>(
            BASE_API_URL + '/ssh-connection/settings'
        )
        return response.data
    }

    static async addSSHSettings(sshSettings: ISSHSettings) {
        const response = await axiosInstance.post<ISSHSettings>(
            BASE_API_URL + '/ssh-connection/settings',
            sshSettings
        )
        return response
    }

    static async updateSSHSettings(updatedSSHSettings: ISSHSettings) {
        return await axiosInstance.put<Boolean>(
            BASE_API_URL + '/ssh-connection/settings',
            updatedSSHSettings
        )
    }

    static async deleteSSHSettings(guid: string) {
        return await axiosInstance.delete<Boolean>(
            BASE_API_URL + '/ssh-connection/settings',
            {
                params: {
                    guid
                }
            }
        )
    }

}