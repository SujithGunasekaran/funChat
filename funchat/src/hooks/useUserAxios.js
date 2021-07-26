import { useState } from 'react';
import { userAxios } from '../config/AxiosInstance/index';

const useUserAxios = () => {

    const [loading, setLoading] = useState(false);

    const getAction = async (url) => {
        setLoading(true);
        try {
            const response = await userAxios.get(`${url}`);
            return { data: response.data, error: null }
        }
        catch (err) {
            console.log(err);
            return { data: null, error: err.response }
        }
        finally {
            setLoading(false);
        }
    };

    return { getAction, loading };

};

export default useUserAxios;
