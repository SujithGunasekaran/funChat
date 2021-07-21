import React, { Fragment, useEffect } from 'react';
import useUserAxios from '../hooks/useUserAxios';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Logout = (props) => {

    // hooks
    const { getAction } = useUserAxios();
    const dispatch = useDispatch();

    useEffect(() => {
        logoutUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const logoutUser = async () => {
        const { data, error } = await getAction('/logout');
        if (error) {
            console.log('error');
        }
        if (data.status === 'Success') {
            dispatch({
                type: 'SET_USER_LOGGED_IN',
                isUserLoggedIn: false
            });
            dispatch({
                type: 'SET_USER_INFO',
                userInfo: {}
            });
            props.history.push('/');
        }
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        <div className="form_container">
                            <div className="form_heading">Signing out from <span className="text-highlight">FunChat</span></div>
                            <div className="form_sub_heading">Please wait while we are signing out...</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};

export default withRouter(Logout);
