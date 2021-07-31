import React, { Fragment, memo } from 'react';
import { PeoplesIcon } from '../../UI/Icons';

const UserPanel = ({ userSelectedPage, selectPage }) => {

    return (
        <Fragment>
            <div className="user_panel_container">
                <div className={`user_panel_list ${userSelectedPage === 'follower' ? 'active' : ''}`} onClick={() => selectPage('follower')}>
                    <PeoplesIcon cssClass="user_panel_list_item_icon" />
                    <div className="user_panel_list_item_name">0 Follower</div>
                </div>
                <div className={`user_panel_list ${userSelectedPage === 'following' ? 'active' : ''}`} onClick={() => selectPage('following')}>
                    <PeoplesIcon cssClass="user_panel_list_item_icon" />
                    <div className="user_panel_list_item_name">0 Following</div>
                </div>
                <div className={`user_panel_list ${userSelectedPage === 'group' ? 'active' : ''}`} onClick={() => selectPage('group')}>
                    <PeoplesIcon cssClass="user_panel_list_item_icon" />
                    <div className="user_panel_list_item_name">0 Groups</div>
                </div>
            </div>
        </Fragment>
    )

};


export default memo(UserPanel);
