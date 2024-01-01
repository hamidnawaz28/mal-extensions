import axios from "axios";


export const get = async (url: string, config = {}) => {
    try {
        let res = null;
        res = await axios.get(url, { ...config });
        return {
            success: res.status,
            data: res.data,
            message: res.statusText,
        };
    } catch (error: any) {
        return parseErrors(error.response);
    }
};

export const getById = async (url: string, id: any) => {
    try {
        let res = null;
        res = await axios.get(`${url}/${id}`);
        return {
            success: res.status,
            data: res.data,
            message: res.statusText,
        };
    } catch (error: any) {
        return parseErrors(error.response);
    }
};

export const create = async (url: string, data: any) => {
    try {
        let res = null;
        res = await axios.post(url, data);
        return {
            success: res.status,
            data: res.data,
            message: res.statusText,
        };
    } catch (error: any) {
        return parseErrors(error.response);
    }
};

export const update = async (url: string, id: any, data: any) => {
    try {
        let res = null;
        res = await axios.put(`${url}/${id}`, data);
        return {
            success: res.status,
            data: res.data,
            message: res.statusText,
        };
    } catch (error: any) {
        return parseErrors(error.response);
    }
};

export const del = async (url: string, id: any) => {
    try {
        let res = null;
        res = await axios.delete(`${url}/${id}`);
        return {
            success: res.status,
            data: res.data,
            message: res.statusText,
        };
    } catch (error: any) {
        return parseErrors(error.response);
    }
};

const parseErrors = (errObj: any) => {
    try {
        let message = "";
        const { errors } = errObj.data;
        switch (errObj.status) {
            case 400:
                errors.map((obj: any, index: number) => {
                    message = `${message + obj.param.toUpperCase()}: ${obj.msg}`;
                    message = index === errors.length - 1 ? message : `${message} ,`;
                    return message;
                });
                return {
                    success: false,
                    message,
                };
            case 401:
                return {
                    success: false,
                    message:
                        errObj.data && errObj.statusText
                            ? errObj.statusText
                            : "You are not authorized. Please login",
                };
            case 403:
            case 404:
            case 409:
            case 422:
                return {
                    success: false,
                    message: errObj.data
                        ? errObj.statusText
                        : errObj.message
                            ? errObj.message
                            : "An error occured while processing your request.",
                };
            default:
                return {
                    success: false,
                    message: "An error occured while processing your request.",
                };
        }
    } catch (error) {
        return {
            success: false,
            message: "An error occured while processing your request.",
        };
    }
};