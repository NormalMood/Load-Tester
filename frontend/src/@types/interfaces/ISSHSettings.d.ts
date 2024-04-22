export interface ISSHSettings {
    guid?: string;
    user: string;
    password: string;
    server: string;
    port: number;
    interval: number;
    isConnectionOn: boolean;
}