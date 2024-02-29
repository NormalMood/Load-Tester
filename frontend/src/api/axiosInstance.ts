import axios from 'axios';

const SERVER_URL = 'http://localhost:8080'

export const BASE_API_URL = '/api'

export const OK_RESPONSE_CODE = 200

export const axiosInstance = axios.create({
    baseURL: SERVER_URL
})