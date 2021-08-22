import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { MicIcon, VideoIcon, MutedMicIcon, VideoOff } from '../../UI/Icons';


const LoggedUserVideo = (props) => {

    // props
    const { userVideo } = props;

    // state
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const [isVideoPaused, setIsVideoPaused] = useState(false);

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    return (
        <Fragment>
            <div className="group_call_video_body">
                {
                    isVideoPaused ?
                        <img className="group_call_video_profile" src={loggedUserInfo.profile} loading="lazy" alt={loggedUserInfo.username} /> :
                        <video className="group_call_video_item" muted={isVideoMuted} ref={userVideo} autoPlay playsInline />
                }
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
                                    <VideoOff cssClass="group_call_user_option_video" handleEvent={() => setIsVideoPaused(false)} /> :
                                    <VideoIcon cssClass="group_call_user_option_video" handleEvent={() => setIsVideoPaused(true)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

}

export default LoggedUserVideo;
