import React, { Fragment, useRef, useEffect, useState } from 'react';
import { MicIcon, MutedMicIcon } from '../../UI/Icons';

const UserVideoItem = (props) => {

    // props
    const { info } = props;

    // state
    const [userVideoType, setUserVideoType] = useState('play');

    // ref
    const ref = useRef();

    useEffect(() => {
        info.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (info.userInfo.video !== userVideoType) {
            setUserVideoType(info.userInfo.video);
            const userVideoElement = document.querySelector('#user-video');
            if (userVideoElement && info.userInfo.video === 'play') {
                userVideoElement.play();
            }
            else if (userVideoElement && info.userInfo.video === 'stop') {
                userVideoElement.pause();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info])

    return (
        <Fragment>
            <div className="group_call_video_body">
                <video id="user-video" className="group_call_video_item" muted={info.userInfo.audioType === 'mute' ? true : false} playsInline autoPlay ref={ref} />
                <div className="group_call_video_footer">
                    <div className="group_call_user_info_container">
                        <img src={info.userInfo.profile} className="profile" loading="lazy" alt={info.userInfo.username} />
                        <div className="name">{info.userInfo.username}</div>
                        <div className="group_call_user_option_container">
                            {
                                info.userInfo && info.userInfo.audioType === 'mute' ?
                                    <MutedMicIcon cssClass="group_call_user_option_mic" /> :
                                    <MicIcon cssClass="group_call_user_option_mic" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

}

export default UserVideoItem;
