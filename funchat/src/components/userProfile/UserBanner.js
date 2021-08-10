import React, { Fragment, memo, useEffect, useState, Suspense, lazy } from 'react';
import useUserAxios from '../../hooks/useUserAxios';
import useFollowFollowingAxios from '../../hooks/useFollowFollowingAxios';
import { CalenderIcon } from '../../UI/Icons';
import { convertFullDateToLong } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { followUnfollowApi } from '../../utils/APIUtil';
import { EditIcon, CancelIcon } from '../../UI/Icons';

const ProfileEdit = lazy(() => import('../../UI/model/ProfileEdit'));

const UserBanner = (props) => {

    // props
    const { userID, visitorPageType } = props;

    // stats
    const [userInfo, setUserInfo] = useState(null);
    const [showEditModel, setShowEditModel] = useState(false);

    // hooks
    const { getAction } = useUserAxios();
    const { postAction, loading } = useFollowFollowingAxios();

    // redux-state
    const { loggedUserInfo, loggedUserFollowingList } = useSelector(state => state.userReducer);

    // dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        if (loggedUserInfo._id !== userID) {
            getUserInfo();
        }
        else {
            setUserInfo(loggedUserInfo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userID, loggedUserInfo])

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

    const followUnfollowUser = async (type) => {
        const inputObj = {
            visitorId: userID,
            loggedUserInfoId: loggedUserInfo._id,
            followerId: userID,
            type,
            visitorPageType
        }
        try {
            await followUnfollowApi(inputObj, postAction, dispatch);
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
                                    <button disabled={loading} className="user_banner_user_follow_btn" onClick={() => followUnfollowUser('unfollow')}>{loading ? 'UnFollowing...' : 'UnFollow'}</button>
                                    :
                                    <button disabled={loading} className="user_banner_user_follow_btn" onClick={() => followUnfollowUser('follow')}>{loading ? 'Following...' : 'Follow'}</button>
                                : null
                        }
                        <div className="user_banner_sub_container">
                            <div className="user_banner_name_container">
                                <div className="user_banner_user_name">{userInfo?.username ?? ''}</div>
                                {
                                    loggedUserInfo._id === userID &&
                                    <EditIcon cssClass="user_banner_name_edit_icon" handleEvent={() => setShowEditModel(true)} />
                                }
                            </div>
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
            {
                showEditModel &&
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="overlay">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-5 mx-auto">
                                    <div className="form_model_container">
                                        <div className="form_model_header">
                                            <div className="form_model_header_title">Edit Profile</div>
                                            <CancelIcon cssClass={'form_model_header_cancel_icon'} handleEvent={() => setShowEditModel(false)} />
                                        </div>
                                        <ProfileEdit />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Suspense>
            }
        </Fragment>
    )

};

export default memo(UserBanner);
