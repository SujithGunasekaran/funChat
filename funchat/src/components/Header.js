import React, { Fragment, useEffect } from 'react';
import { ChatIcon } from '../UI/Icons';
import PageLink from '../UI/PageLink';
import useUserAxios from '../hooks/useUserAxios';
import { useSelector, useDispatch } from 'react-redux';
import { prettyUserName } from '../utils';
import '../css/header.css';


const Header = () => {

    // dispatch
    const dispatch = useDispatch();

    //selector
    const userReducer = useSelector(state => state.userReducer);
    const { isUserLoggedIn, loggedUserInfo } = userReducer;

    // hooks
    const { getUserData } = useUserAxios();

    useEffect(() => {
        getLoggedUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getLoggedUser = async () => {
        const { data, error } = await getUserData('/');
        if (error) return;
        dispatch({
            type: 'SET_USER_LOGGED_IN',
            isUserLoggedIn: data.data.isUserLoggedIn
        })
        dispatch({
            type: 'SET_USER_INFO',
            userInfo: data.data.userInfo
        })
    }

    return (
        <Fragment>
            <div className="header_container">
                <div className="header_intro_container">
                    <ChatIcon cssClass="header_logo_icon" />
                    <PageLink pathname={'/'}>
                        <div className="header_logo_name">FunChat</div>
                    </PageLink>
                </div>
                {
                    !isUserLoggedIn &&
                    <div className="header_right_container">
                        <PageLink pathname={'/login'}>
                            <div className="header_login_name">Login</div>
                        </PageLink>
                    </div>
                }
                {
                    isUserLoggedIn && Object.keys(loggedUserInfo).length > 0 &&
                    <div className="header_right_container">
                        <div className="header_user_name">{prettyUserName(loggedUserInfo.username)}</div>
                        <img src={loggedUserInfo.profile} className="header_user_profile" loading="lazy" alt={loggedUserInfo?.username} />
                    </div>
                }
            </div>
        </Fragment>
    )

};

export default Header;
