import React, { Fragment, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import useFollowFollowingAxios from '../../hooks/useFollowFollowingAxios';
import CircularLoading from '../../UI/loading/CircularLoading';
import { useDispatch, useSelector } from 'react-redux';

const UserList = lazy(() => import('../../UI/card/User/UserList'));

const UserFollowFollowing = (props) => {

    // props
    const { type, visitorId } = props;

    // hooks
    const { getAction, loading } = useFollowFollowingAxios();

    // dispatch
    const dispatch = useDispatch();

    // redux-state
    const { visitorFollowFollowingList } = useSelector(state => state.userReducer);

    useEffect(() => {
        getuserFollowFollowingList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, visitorId])

    const getuserFollowFollowingList = async () => {
        try {
            const { data, error } = await getAction(`/followFollowing?userID=${visitorId}&type=${type}`);
            if (error) throw new Error(`Error while getting ${type} user list`);
            if (data && data.status === 'Success') {
                dispatch({
                    type: 'SET_VISITOR_FOLLOW_FOLLOWING_LIST',
                    visitorFollowFollowingList: data.data.userList.userData
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            {
                loading && <CircularLoading />
            }
            {
                !loading && visitorFollowFollowingList.length === 0 && <div className="user_profile_list_empty_message">{type === 'follower' ? 'No one has followed you' : 'You are not following anyone'}</div>
            }
            {
                !loading && visitorFollowFollowingList.length > 0 &&
                <Suspense fallback={<div>Loading...</div>}>
                    <UserList
                        userData={visitorFollowFollowingList}
                        visitorId={visitorId}
                        visitorPageType={type}
                    />
                </Suspense>
            }
        </Fragment>
    )

};

UserFollowFollowing.propTypes = {
    type: PropTypes.string.isRequired,
    visitorId: PropTypes.string.isRequired
}

export default UserFollowFollowing;
