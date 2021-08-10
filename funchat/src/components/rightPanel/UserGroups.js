import React, { Fragment, useEffect, useState, lazy, Suspense } from 'react';
import useRoomAxios from '../../hooks/useRoomAxios';
import CircularLoading from '../../UI/loading/CircularLoading';
import { useSelector } from 'react-redux';

const GroupList = lazy(() => import('../../UI/groupsList/GroupList'));

const UserGroups = (props) => {

    // props
    const { history } = props;

    // states
    const [userGroupList, setUserGroupList] = useState([]);

    // hooks
    const { getAction, loading } = useRoomAxios();

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    useEffect(() => {
        if (loggedUserInfo._id) {
            getUserGroupList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getUserGroupList = async () => {
        try {
            const { data, error } = await getAction(`/userGroups?userID=${loggedUserInfo._id}`);
            if (error) throw new Error('Error while getting user group list');
            if (data.status === 'Success') {
                setUserGroupList(prevList => {
                    let userGroupList = prevList.slice();
                    userGroupList = data.data.userGroupList;
                    return userGroupList;
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
                userGroupList.length > 0 &&
                <Suspense fallback={<div></div>}>
                    <GroupList
                        userGroupList={userGroupList}
                        history={history}
                    />
                </Suspense>
            }
            {
                !loading && userGroupList.length === 0 &&
                <div className="empty_message">You have not joined in any groups</div>
            }
        </Fragment>
    )

};

export default UserGroups;
