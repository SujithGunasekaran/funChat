import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ChatIcon } from '../UI/Icons';
import PageLink from '../UI/PageLink';
import useUserAxios from '../hooks/useUserAxios';
import { useSelector, useDispatch, batch } from 'react-redux';
import { prettyUserName } from '../utils';
import { PersonIcon, LogoutIcon } from '../UI/Icons';
import ConfirmModel from '../UI/model/confirmModel';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import useBrowserClose from '../hooks/useBrowserClose';

let socket;

const Header = (props) => {

    // state
    const [showConfirmModel, setShowConfirModel] = useState(false);

    // dispatch
    const dispatch = useDispatch();

    //selector
    const userReducer = useSelector(state => state.userReducer);
    const { isUserLoggedIn, loggedUserInfo } = userReducer;

    // hooks
    const { getAction } = useUserAxios();
    useBrowserClose();

    // refs
    const profileDropdown = useRef();

    useEffect(() => {
        socket = io('localhost:5000');
        getLoggedUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        const hideProfileDropdown = (e) => {
            if (profileDropdown.current && profileDropdown.current.classList.contains('show')) {
                profileDropdown.current.classList.remove('show');
            }
        }
        document.body.addEventListener('click', hideProfileDropdown);

        return () => {
            document.body.removeEventListener('click', hideProfileDropdown);
        }

    }, [])



    const getLoggedUser = async () => {
        const { data, error } = await getAction('/');
        if (error) return;
        if (data && data.status === "Success") {
            socket.emit('setOnlineUser', { userName: data.data.userInfo._id }, (err) => {
                if (err) throw new Error('Error while getting setting online user');
            })
            batch(() => {
                dispatch({
                    type: 'SET_LOGGEDUSER_FOLLOWING_LIST',
                    loggedUserFollowingList: new Set(data.data.followingList)
                })
                dispatch({
                    type: 'SET_LOGGEDUSER_FOLLOWER_LIST',
                    loggedUserFollowerList: new Set(data.data.followerList)
                })
                dispatch({
                    type: 'SET_USER_LOGGED_IN',
                    isUserLoggedIn: data.data.isUserLoggedIn
                })
                dispatch({
                    type: 'SET_USER_INFO',
                    userInfo: data.data.userInfo
                })
            })
        }
    }

    const showDropdown = (e) => {
        e.stopPropagation();
        profileDropdown.current.classList.toggle('show');
    }

    const handleCancelModel = () => {
        setShowConfirModel(false);
    }

    const handleLogoutUser = () => {
        setShowConfirModel(false);
        props.history.push('/logout');
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
                {/* {
                    !isUserLoggedIn &&
                    <div className="header_right_container">
                        <PageLink pathname={'/login'}>
                            <div className="header_login_name">Login</div>
                        </PageLink>
                    </div>
                } */}
                {
                    isUserLoggedIn && Object.keys(loggedUserInfo).length > 0 &&
                    <Fragment>
                        <div className="header_right_container">
                            <div className="header_user_name">{prettyUserName(loggedUserInfo.username)}</div>
                            <img onClick={(e) => showDropdown(e)} src={loggedUserInfo.profile} className="header_user_profile" loading="lazy" alt={loggedUserInfo?.username} />
                        </div>
                        <div className="header_user_dropdown_container" ref={profileDropdown}>
                            <PageLink pathname={`/user/${loggedUserInfo._id}`}>
                                <div className="header_user_dropdown_list">
                                    <PersonIcon cssClass="header_user_dropdown_list_icon" />
                                    <div className="header_user_dropdown_list_name">Profile</div>
                                </div>
                            </PageLink>
                            <div className="header_user_dropdown_list" onClick={() => setShowConfirModel(true)}>
                                <LogoutIcon cssClass="header_user_dropdown_list_icon" />
                                <div className="header_user_dropdown_list_name">Logout</div>
                            </div>
                        </div>
                    </Fragment>
                }
                {
                    showConfirmModel &&
                    <div className="overlay">
                        <ConfirmModel
                            title={'Are you sure you want to Logout'}
                            cancelAction={handleCancelModel}
                            successAction={handleLogoutUser}
                            confirmBtnText={'Logout'}
                        />
                    </div>
                }
            </div>
        </Fragment>
    )

};

export default withRouter(Header);
