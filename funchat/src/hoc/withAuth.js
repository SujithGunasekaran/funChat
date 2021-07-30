import React, { useState, useEffect } from 'react';
import useUserAxios from '../hooks/useUserAxios';
import CircularLoading from '../UI/loading/CircularLoading';
import { useHistory, Redirect } from 'react-router-dom';

const IsUserAuthenticated = ({ Component, name }) => {

    const NewComponent = (props) => {

        // states
        const [IsUserAuthenticated, setIsUserAuthenticated] = useState(false);

        // hooks
        const { getAction } = useUserAxios();

        // history route
        const history = useHistory();

        useEffect(() => {
            getUserInfo();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        const getUserInfo = async () => {
            try {
                const { data, error } = await getAction('/');
                if (error) throw new Error('Error while Authenticating user');
                if (data.status === 'Success' && data.data.isUserLoggedIn) {
                    setIsUserAuthenticated(true);
                }
                else {
                    history.push('/');
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        if (IsUserAuthenticated) {
            return name === 'login' ? <Redirect path='home' /> : <Component {...props} />
        }

        return (
            <CircularLoading />
        )

    }

    return NewComponent;

}

export default IsUserAuthenticated;
