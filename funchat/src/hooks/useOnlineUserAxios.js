import { useState } from 'react';
import { onlineAxios } from '../config/AxiosInstance';

const useOnlineUserAxios = () => {

    const [loading, setLoading] = useState(false);

    const getAction = async (url) => {
        try {
            const response = await onlineAxios.get(`${url}`);
            return { data: response.data, error: null };
        }
        catch (err) {
            return { data: null, error: err.response };
        }
        finally {
            setLoading(false);
        }
    }

    const postAction = async (url, data) => {
        setLoading(true);
        try {
            const response = await onlineAxios.post(`${url}`, data);
            return { data: response.data, error: null };
        }
        catch (err) {
            return { data: null, error: err.response };
        }
        finally {
            setLoading(false);
        }
    }

    return { loading, getAction, postAction };

}

export default useOnlineUserAxios;
