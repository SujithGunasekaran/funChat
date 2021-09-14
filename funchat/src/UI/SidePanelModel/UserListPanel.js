import React, { Fragment } from 'react';
import { CancelIcon } from '../Icons';

const UserListPanel = (props) => {

    // props
    const { peers } = props;


    return (
        <Fragment>
            <div className="group_call_user_list_header">
                <div className="group_call_user_list_header_name">UserList</div>
                <CancelIcon
                    cssClass="group_call_user_list_header_close_icon"
                />
            </div>
            <div className="group_call_user_list_body">
                {
                    peers.length > 0 &&
                    peers.map((info, index) => (
                        <Fragment key={index}>
                            <div className="group_call_user_list_item">
                                <img src={info.userInfo.profile} alt={info.userInfo.username} />
                                <div>{info.userInfo.username}</div>
                            </div>
                        </Fragment>
                    ))
                }
            </div>
        </Fragment>
    )

}

export default UserListPanel;
