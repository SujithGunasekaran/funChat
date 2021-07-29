import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useRoomAxios from '../../hooks/useRoomAxios';
import { PeoplesIcon } from '../../UI/Icons';

const UserGroups = () => {

    // states
    const [userGroupList, setUserGroupList] = useState([]);

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    // hooks
    const { getAction } = useRoomAxios();

    useEffect(() => {
        if (loggedUserInfo && loggedUserInfo._id) {
            getUserGroupList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedUserInfo])

    const getUserGroupList = async () => {
        try {
            const { data, error } = await getAction(`/userGroups?userID=${loggedUserInfo._id}`);
            if (error) throw new Error('Error while getting user group list');
            if (data.status === 'Success') {
                setUserGroupList([
                    ...userGroupList,
                    ...data.data.userGroupList
                ])
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="home_right_user_group_heading">Groups Your are In</div>
            {
                userGroupList.length > 0 &&
                userGroupList.map((groupInfo, index) => (
                    <Fragment key={index}>
                        <div className="home_right_user_group_item">
                            <div className="home-right_user_group_header">
                                <div className="home_right_user_group_name">{groupInfo.groupname}</div>
                                <div className="home_right_user_group_count">
                                    <PeoplesIcon cssClass={'icon'} />
                                    <span className="count">
                                        {groupInfo.users.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {
                            index < (groupInfo.length - 1) &&
                            <hr className=""></hr>
                        }
                    </Fragment>
                ))

            }

        </Fragment>
    )

};

export default UserGroups;
