import { useState } from 'react';
import { roomAxios } from '../config/AxiosInstance/index';

const useRoomAxios = () => {

    const [loading, setLoading] = useState(false);

    const getAction = async (url) => {
        setLoading(true);
        try {
            const response = await roomAxios.get(`${url}`);
            return { data: response.data, error: null }
        }
        catch (err) {
            return { data: null, error: err.response }
        }
        finally {
            setLoading(false);
        }
    };

    const postAction = async (url, data) => {
        setLoading(true);
        try {
            const response = await roomAxios.post(`${url}`, data);
            return { data: response.data, error: null }
        }
        catch (err) {
            return { data: null, error: err.response }
        }
        finally {
            setLoading(false);
        }
    }

    return { getAction, postAction, loading };

};

export default useRoomAxios;
