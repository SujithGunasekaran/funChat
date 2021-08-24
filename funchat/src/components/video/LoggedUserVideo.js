import React, { Fragment, useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { MicIcon, VideoIcon, MutedMicIcon, VideoOff } from '../../UI/Icons';


const LoggedUserVideo = forwardRef((props, ref) => {


    // state
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const [isVideoPaused, setIsVideoPaused] = useState(false);

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const handleVideo = (input) => {
        const userVideoElement = document.querySelector('#loggedUser_video');
        if (input === 'stop') {
            setIsVideoPaused(true);
            userVideoElement.pause();
        }
        else {
            setIsVideoPaused(false);
            userVideoElement.play();
        }
    }

    return (
        <Fragment>
            <div className="group_call_video_body">
                <video className="group_call_video_item" muted={isVideoMuted} ref={ref} autoPlay playsInline id="loggedUser_video" />
                <div className="group_call_video_footer">
                    <div className="group_call_user_info_container">
                        <img src={loggedUserInfo.profile} className="profile" loading="lazy" alt={loggedUserInfo.username} />
                        <div className="name">{loggedUserInfo.username}</div>
                        <div className="group_call_user_option_container">
                            {
                                isVideoMuted ?
                                    <MutedMicIcon cssClass="group_call_user_option_mic" handleEvent={() => setIsVideoMuted(false)} /> :
                                    <MicIcon cssClass="group_call_user_option_mic" handleEvent={() => setIsVideoMuted(true)} />
                            }
                            {
                                isVideoPaused ?
                                    <VideoOff cssClass="group_call_user_option_video" handleEvent={() => handleVideo('start')} /> :
                                    <VideoIcon cssClass="group_call_user_option_video" handleEvent={() => handleVideo('stop')} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

})

export default LoggedUserVideo;
