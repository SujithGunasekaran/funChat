import React, { Fragment, useState, useEffect, useRef } from 'react';
import { CopyIcon, CopiedIcon } from '../../UI/Icons';
import { copyToClipboard } from '../../utils';
import Tooltip from '@material-ui/core/Tooltip';


const GroupInfo = (props) => {

    // states
    const [showCopied, setShowCopied] = useState(false);

    // ref
    const timerRef = useRef();

    const { groupID } = props;

    useEffect(() => {

        if (showCopied) {
            timerRef.current = setTimeout(() => {
                setShowCopied(false);
            }, 3500)
        }

        return () => {
            clearTimeout(timerRef.current)
        }

    }, [showCopied])

    const handleCopyId = () => {
        const result = copyToClipboard(groupID);
        if (result) setShowCopied(true);
    }

    return (
        <Fragment>
            <div className="message_right_panel_group_info_heading">
                FunChat Share roomId with your friends
            </div>
            <div className="message_right_panel_group_id_container">
                <div className="message_right_panel_group_id_name" id="group-id">{groupID}</div>
                <Tooltip title={!showCopied ? 'Copy' : 'Copied'}>
                    {
                        !showCopied ?
                            <CopyIcon cssClass={'icon'} handleEvent={handleCopyId} />
                            :
                            <CopiedIcon cssClass={'icon2'} />
                    }
                </Tooltip>
            </div>
        </Fragment>
    )

};

export default GroupInfo;
