import React, { Fragment, useEffect, useState } from 'react';
import useRoomAxios from '../../hooks/useRoomAxios';
import { PeoplesIcon } from '../../UI/Icons';
import PropTypes from 'prop-types';
import CircularLoading from '../../UI/loading/CircularLoading';

const UserGroups = ({ userId }) => {

    // states
    const [userGroupList, setUserGroupList] = useState([]);

    // hooks
    const { getAction, loading } = useRoomAxios();

    useEffect(() => {
        if (userId) {
            getUserGroupList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    const getUserGroupList = async () => {
        try {
            const { data, error } = await getAction(`/userGroups?userID=${userId}`);
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
                            <hr className="home_right_user_group_hr"></hr>
                        }
                    </Fragment>
                ))
            }
        </Fragment>
    )

};

UserGroups.propTypes = {
    userId: PropTypes.string.isRequired
}

export default UserGroups;
