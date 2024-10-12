import axiosInstance from './axiosInstance';
import { AxiosRequestConfig } from 'axios';

// Extend the AxiosRequestConfig interface to include your custom property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    skipAuthRefresh?: boolean; // Optional custom property
}

// Define interfaces for the expected response data
interface RefreshTokenResponse {
    token: string;
}

interface UserInfo {
    id: string;
    name: string;
    email: string;
    // Add other user properties as needed
}

const BASE_URL = '/api/user';

const userService = {
    refreshToken: async (): Promise<RefreshTokenResponse> => {
        try {
            const config: CustomAxiosRequestConfig = {
                withCredentials: true,
                skipAuthRefresh: true,
            };
            const response = await axiosInstance.post<RefreshTokenResponse>(
                `${BASE_URL}/refresh-token`,
                {},
                config
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUserInfo: async (): Promise<UserInfo> => {
        try {
            const response = await axiosInstance.get<UserInfo>(`${BASE_URL}/fetch-user-info`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;
