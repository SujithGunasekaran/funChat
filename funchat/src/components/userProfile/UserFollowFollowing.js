import React, { Fragment, useState, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import useFollowFollowingAxios from '../../hooks/useFollowFollowingAxios';
import CircularLoading from '../../UI/loading/CircularLoading';

const UserList = lazy(() => import('../../UI/card/User/UserList'));

const UserFollowFollowing = (props) => {

    // stats
    const [userList, setUserList] = useState([]);

    // props
    const { type, visitorId } = props;

    // hooks
    const { getAction, loading } = useFollowFollowingAxios();

    useEffect(() => {
        getuserFollowFollowingList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type])

    const getuserFollowFollowingList = async () => {
        try {
            const { data, error } = await getAction(`/followFollowing?userID=${visitorId}&type=${type}`);
            if (error) throw new Error(`Error while getting ${type} user list`);
            if (data && data.status === 'Success') {
                setUserList(prevList => {
                    let userList = prevList.slice();
                    userList = data.data.userList.userData;
                    return userList;
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
                !loading && userList.length === 0 && <div className="user_profile_list_empty_message">{type === 'follower' ? 'No one has followed you' : 'You are not following anyone'}</div>
            }
            {
                !loading && userList.length > 0 &&
                <Suspense fallback={<div>Loading...</div>}>
                    <UserList
                        userData={userList}
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
