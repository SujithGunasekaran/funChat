import { useState } from 'react';
import { roomAxios } from '../config/AxiosInstance/index';

const useRoomAxios = () => {

    const [loading, setLoading] = useState(false);

    const getAction = async (url, isLoaderNeeded = true) => {
        if (isLoaderNeeded) setLoading(true);
        try {
            const response = await roomAxios.get(`${url}`);
            return { data: response.data, error: null };
        }
        catch (err) {
            return { data: null, error: err.response };
        }
        finally {
            if (isLoaderNeeded) setLoading(false);
        }
    };

    const postAction = async (url, data) => {
        setLoading(true);
        try {
            const response = await roomAxios.post(`${url}`, data);
            return { data: response.data, error: null };
        }
        catch (err) {
            return { data: null, error: err.response };
        }
        finally {
            setLoading(false);
        }
    }

    const deleteAction = async (url) => {
        try {
            const response = await roomAxios.delete(`${url}`);
            return { data: response.data, error: null };
        }
        catch (err) {
            console.log(err);
            return { data: null, error: err.response };
        }
    }

    return { getAction, postAction, deleteAction, loading };

};

export default useRoomAxios;
