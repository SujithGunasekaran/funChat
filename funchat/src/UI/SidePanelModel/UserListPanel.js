import React, { Fragment } from 'react';
import { CancelIcon } from '../Icons';
import { useSelector } from 'react-redux';

const UserListPanel = (props) => {

    // props
    const { peers, handleView } = props;

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);


    return (
        <Fragment>
            <div className="group_call_user_list_header">
                <div className="group_call_user_list_header_name">UserList</div>
                <CancelIcon
                    cssClass="group_call_user_list_header_close_icon"
                    handleEvent={handleView}
                    input={false}
                />
            </div>
            <div className="group_call_user_list_body">
                <div className="group_call_user_list_item">
                    <img className="image" src={loggedUserInfo.profile} alt={loggedUserInfo.username} />
                    <div className="username">{loggedUserInfo.username}</div>
                </div>
                {
                    peers.length > 0 &&
                    peers.map((info, index) => (
                        <Fragment key={index}>
                            <div className="group_call_user_list_item">
                                <img className="image" src={info.userInfo.profile} alt={info.userInfo.username} />
                                <div className="username">{info.userInfo.username}</div>
                            </div>
                        </Fragment>
                    ))
                }
            </div>
        </Fragment>
    )

}

export default UserListPanel;
