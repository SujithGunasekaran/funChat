import React, { Fragment } from 'react';
import RoomItem from './RoomItem';

const RoomList = (props) => {

    const { roomList = [], history } = props;

    return (
        <Fragment>
            {
                roomList.map((roomInfo, index) => (
                    <Fragment key={index}>
                        <RoomItem
                            history={history}
                            roomInfo={roomInfo}
                        />
                    </Fragment>
                ))
            }
        </Fragment>
    )

};

export default RoomList;
