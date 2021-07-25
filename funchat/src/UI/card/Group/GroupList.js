import React, { Fragment } from 'react';
import RoomItem from './GroupItem';

const GroupList = (props) => {

    const { groupList = [], history } = props;

    return (
        <Fragment>
            {
                groupList.map((groupInfo, index) => (
                    <Fragment key={index}>
                        <RoomItem
                            history={history}
                            groupInfo={groupInfo}
                        />
                    </Fragment>
                ))
            }
        </Fragment>
    )

};

export default GroupList;
