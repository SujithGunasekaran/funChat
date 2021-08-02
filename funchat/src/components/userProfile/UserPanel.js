import React, { Fragment, memo, useEffect } from 'react';
import { PeoplesIcon } from '../../UI/Icons';
import { useSelector, useDispatch } from 'react-redux';
import useUserAxios from '../../hooks/useUserAxios';

const UserPanel = ({ userSelectedPage, selectPage, userID }) => {

    // redux-state
    const { userFollowingCount, userFollowerCount, userGroupCount } = useSelector(state => state.userReducer);

    // hooks
    const { getAction } = useUserAxios();

    //dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        getUserPanelInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userID])

    const getUserPanelInfo = async () => {
        try {
            const { data, error } = await getAction(`/getUserPanelCount?userID=${userID}`);
            if (error) throw new Error('Error while getting panelInfo');
            console.log(data.data);
            if (data && data.status === 'Success') {
                dispatch({
                    type: 'SET_USER_FOLLOWING_COUNT',
                    userFollowingCount: data.data.followingCount
                });
                dispatch({
                    type: 'SET_USER_FOLLOWER_COUNT',
                    userFollowerCount: data.data.followerCount
                });
                dispatch({
                    type: 'SET_USER_GROUP_COUNT',
                    userGroupCount: data.data.groupCount
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="user_panel_container">
                <div className={`user_panel_list ${userSelectedPage === 'follower' ? 'active' : ''}`} onClick={() => selectPage('follower')}>
                    <PeoplesIcon cssClass="user_panel_list_item_icon" />
                    <div className="user_panel_list_item_name">{userFollowerCount} Follower</div>
                </div>
                <div className={`user_panel_list ${userSelectedPage === 'following' ? 'active' : ''}`} onClick={() => selectPage('following')}>
                    <PeoplesIcon cssClass="user_panel_list_item_icon" />
                    <div className="user_panel_list_item_name">{userFollowingCount} Following</div>
                </div>
                <div className={`user_panel_list ${userSelectedPage === 'group' ? 'active' : ''}`} onClick={() => selectPage('group')}>
                    <PeoplesIcon cssClass="user_panel_list_item_icon" />
                    <div className="user_panel_list_item_name">{userGroupCount} Groups</div>
                </div>
            </div>
        </Fragment>
    )

};


export default memo(UserPanel);
