import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.url = config.url?.includes("?") ?
            `${config.url}&app_id=${process.env.REACT_APP_RATES_API_KEY}` :
            `${config.url}?&app_id=${process.env.REACT_APP_RATES_API_KEY}`;
        return config;
    }
);

export interface IApiBaseResponse {
    error?: string
}

interface IApi {
    getRates: AxiosRequestConfig
}

export const Api: IApi = {
    getRates: {
        url: `/api/latest.json`,
        method: "get",
        responseType: "json"
    }
};

interface UrlParams {
    [key: string]: string
}

export const apiCall = async <T,> (api: AxiosRequestConfig, urlParams?: UrlParams): Promise<T | IApiBaseResponse> => {
    const apiRequest = { ...api };
    if(urlParams && Object.keys(urlParams).length) {
        const urlParameters = Object.keys(urlParams).reduce((params, key) => {
            params.set(key, urlParams[key]);
            return params;
        }, new URLSearchParams());
        apiRequest.url = `${apiRequest.url}?${urlParameters.toString()}`.replace(/&$/, "");
    }
    try {
        const response: AxiosResponse<T> = await axiosInstance({
            ...apiRequest
        });
        return response ? response.data : { error: "Data not found." };
    } catch(error: any) {
        return { error: "Unexpected error." };
    }
};

