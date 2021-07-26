import React, { Fragment } from 'react';
import { CopyIcon } from '../../UI/Icons';

const GroupInfo = (props) => {

    const { groupID } = props;

    return (
        <Fragment>
            <div className="message_right_panel_group_info_heading">
                FunChat Share roomId with your friends
            </div>
            <div className="message_right_panel_group_id_container">
                <div className="message_right_panel_group_id_name">{groupID}</div>
                <CopyIcon cssClass={'icon'} />
            </div>
        </Fragment>
    )

};

export default GroupInfo;
