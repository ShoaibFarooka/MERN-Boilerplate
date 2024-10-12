import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import userService from './userService';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Define the shape of the response data you expect from the refresh token service
interface RefreshTokenResponse {
    token: string;
}

// Extend AxiosRequestConfig to include custom properties
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean; // To track if the request is being retried
}

axiosInstance.interceptors.request.use(
    async (config: CustomAxiosRequestConfig): Promise<CustomAxiosRequestConfig> => {
        if (!config.skipAuthRefresh) {
            const token = Cookies.get('jwt-token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onRefreshed = (token: string): void => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void): void => {
    refreshSubscribers.push(callback);
};

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError): Promise<Promise<AxiosResponse> | undefined> => {
        const { config, response } = error;

        // Ensure config is defined and use type assertion
        const originalRequest = config as CustomAxiosRequestConfig;

        if (response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuthRefresh) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    console.log('Refreshing token...');
                    const refreshResponse: RefreshTokenResponse = await userService.refreshToken();
                    const { token } = refreshResponse;
                    Cookies.set('jwt-token', token);
                    console.log('Refresh token done!');
                    onRefreshed(token);
                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.log('Error in refreshing token: ', err);
                    Cookies.remove('jwt-token');
                    window.location.href = '/login';
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            console.log('Refresh token already in progress, falling back to queue');
            return new Promise((resolve) => {
                const callback = (token: string) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    resolve(axiosInstance(originalRequest));
                };
                addRefreshSubscriber(callback);
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
