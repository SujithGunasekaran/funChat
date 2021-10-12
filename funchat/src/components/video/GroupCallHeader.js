import React, { Fragment } from 'react';
import { PeoplesIcon, ChatCoverIcon } from '../../UI/Icons';

const GroupCallHeader = (props) => {

    // props
    const { groupName, noOfUser, handleUserPanelView, handleChatPanelView } = props;

    return (
        <Fragment>
            <div className="group_call_header_container">
                <div className="group_call_header_name">{groupName} Group Call</div>
                <div className="group_call_icons_container">
                    <div className="group_call_people_icon_container">
                        <div className={`group_call_people_badge ${(noOfUser + 1) > 10 ? 'left-padding' : 'right-padding'}`}>
                            {noOfUser + 1}
                        </div>
                        <PeoplesIcon
                            cssClass="group_call_people_icon"
                            handleEvent={handleUserPanelView}
                        />
                    </div>
                    <ChatCoverIcon
                        cssClass="group_call_chat_icon"
                        handleEvent={handleChatPanelView}
                    />
                </div>
            </div>
        </Fragment>
    )

}

export default GroupCallHeader;
