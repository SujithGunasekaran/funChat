import React, { Fragment, memo, useEffect, useState } from 'react';
import useUserAxios from '../../hooks/useUserAxios';
import useFollowFollowingAxios from '../../hooks/useFollowFollowingAxios';
import { CalenderIcon } from '../../UI/Icons';
import { convertFullDateToLong } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';

const UserBanner = (props) => {

    // props
    const { userID, visitorPageType } = props;

    // stats
    const [userInfo, setUserInfo] = useState(null);

    // hooks
    const { getAction } = useUserAxios();
    const { postAction } = useFollowFollowingAxios();

    // redux-state
    const { loggedUserInfo, loggedUserFollowingList } = useSelector(state => state.userReducer);

    // dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userID])

    const getUserInfo = async () => {
        try {
            const { data, error } = await getAction(`/userID?userID=${userID}`);
            if (error) throw new Error('Error while getting userInfo');
            if (data.status === 'Success') {
                setUserInfo(data.data.userInfo);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const followUser = async () => {
        try {
            const { data, error } = await postAction(`/followFollowing?visitorUserId=${userID}&loggedUserId=${loggedUserInfo._id}&followerId=${userID}&type=follow&visitorPageType=${visitorPageType}`)
            if (error) throw new Error(error.message);
            if (data && data.status === 'Success') {
                dispatch({
                    type: 'SET_USER_FOLLOWER_COUNT',
                    userFollowerCount: data.data.userFollowerCount,
                })
                dispatch({
                    type: 'SET_USER_FOLLOWING_COUNT',
                    userFollowingCount: data.data.userFollowingCount,
                })
                dispatch({
                    type: 'SET_LOGGEDUSER_FOLLOWING_LIST',
                    loggedUserFollowingList: new Set(data.data.loggedUserFollowingList)
                });
                dispatch({
                    type: 'SET_VISITOR_FOLLOW_FOLLOWING_LIST',
                    visitorFollowFollowingList: data.data.userList
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const unFollowUser = async () => {
        try {
            const { data, error } = await postAction(`/followFollowing?visitorUserId=${userID}&loggedUserId=${loggedUserInfo._id}&followerId=${userID}&type=unFollow&visitorPageType=${visitorPageType}`)
            if (error) throw new Error(error.message);
            if (data && data.status === 'Success') {
                dispatch({
                    type: 'SET_USER_FOLLOWER_COUNT',
                    userFollowerCount: data.data.userFollowerCount,
                })
                dispatch({
                    type: 'SET_USER_FOLLOWING_COUNT',
                    userFollowingCount: data.data.userFollowingCount,
                })
                dispatch({
                    type: 'SET_LOGGEDUSER_FOLLOWING_LIST',
                    loggedUserFollowingList: new Set(data.data.loggedUserFollowingList)
                });
                dispatch({
                    type: 'SET_VISITOR_FOLLOW_FOLLOWING_LIST',
                    visitorFollowFollowingList: data.data.userList
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="user_banner_container">
                {
                    userInfo &&
                    <Fragment>
                        <img src={userInfo.profile} className="user_banner_profile" alt={userInfo?.username ?? ''} loading="lazy" />
                        {
                            loggedUserInfo._id !== userID ?
                                loggedUserFollowingList.has(userID) ?
                                    <button className="user_banner_user_follow_btn" onClick={() => unFollowUser()}>UnFollow</button>
                                    :
                                    <button className="user_banner_user_follow_btn" onClick={() => followUser()}>Follow</button>
                                : null
                        }
                        <div className="user_banner_sub_container">
                            <div className="user_banner_user_name">{userInfo?.username ?? ''}</div>
                            <div className="user_banner_user_description">{userInfo?.description ?? ''}</div>
                            <hr className="user_banner_hr" />
                            <div className="user_banner_info_container">
                                <div className="user_banner_info_sub_container">
                                    <CalenderIcon cssClass="user_banner_info_icon" />
                                    <div className="user_banner_info_name">Joined on {convertFullDateToLong(userInfo.joined)}</div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                }

            </div>
        </Fragment>
    )

};

export default memo(UserBanner);
