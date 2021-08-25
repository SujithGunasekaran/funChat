import React, { Fragment, useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { MicIcon, VideoIcon, MutedMicIcon, VideoOff } from '../../UI/Icons';
import io from 'socket.io-client';

let socket = io('localhost:5000');

const LoggedUserVideo = forwardRef((props, ref) => {


    // state
    const [audioType, setAudioType] = useState(true);
    const [isVideoPaused, setIsVideoPaused] = useState(false);

    // props  
    const { callID } = props;

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

    const handleAudio = (input) => {
        socket.emit('updateAudio', { callID, userID: loggedUserInfo._id, audioType: input });
        if (input === 'unMute') {
            setAudioType(false);
        }
        else {
            setAudioType(true);
        }
    }

    return (
        <Fragment>
            <div className="group_call_video_body">
                <video className="group_call_video_item" muted={audioType} ref={ref} autoPlay playsInline id="loggedUser_video" />
                <div className="group_call_video_footer">
                    <div className="group_call_user_info_container">
                        <img src={loggedUserInfo.profile} className="profile" loading="lazy" alt={loggedUserInfo.username} />
                        <div className="name">{loggedUserInfo.username}</div>
                        <div className="group_call_user_option_container">
                            {
                                audioType ?
                                    <MutedMicIcon cssClass="group_call_user_option_mic" handleEvent={() => handleAudio('unMute')} /> :
                                    <MicIcon cssClass="group_call_user_option_mic" handleEvent={() => handleAudio('mute')} />
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
