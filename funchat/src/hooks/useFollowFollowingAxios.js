import { useState } from 'react';
import { userAxios } from '../config/AxiosInstance/index';


const useFollowFollowingAxios = () => {

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
    }

    const postAction = async (url, inputData) => {
        setLoading(true);
        try {
            const response = await userAxios.post(`${url}`, inputData)
            return { data: response.data, error: null };
        }
        catch (err) {
            console.log(err);
            return { data: null, error: err.response };
        }
        finally {
            setLoading(false);
        }
    }

    return { getAction, postAction, loading }

};


export default useFollowFollowingAxios;
