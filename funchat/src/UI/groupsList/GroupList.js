import React, { Fragment } from 'react';
import GroupItem from './GroupItem';

const GroupList = (props) => {

    const { history, userGroupList } = props;

    return (
        <Fragment>
            {
                userGroupList.length > 0 &&
                userGroupList.map((groupInfo, index) => (
                    <Fragment key={index}>
                        <div className="home_right_user_group_item">
                            <GroupItem
                                history={history}
                                groupInfo={groupInfo}
                            />
                            {
                                index < (groupInfo.length - 1) &&
                                <hr className="home_right_user_group_hr"></hr>
                            }
                        </div>
                    </Fragment>
                ))
            }
        </Fragment>
    )

};


export default GroupList;
