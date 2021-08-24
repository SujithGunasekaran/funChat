import React, { Fragment, useRef, useEffect } from 'react';


const UserVideos = (props) => {

    // props
    const { info } = props;

    // ref
    const ref = useRef();

    useEffect(() => {
        info.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Fragment>
            <div className="group_call_video_body">
                <video className="group_call_video_item" playsInline autoPlay ref={ref} />
                <div className="group_call_video_footer">
                    <div className="group_call_user_info_container">
                        <img src={info.userInfo.profile} className="profile" loading="lazy" alt={info.userInfo.username} />
                        <div className="name">{info.userInfo.username}</div>
                        <div className="group_call_user_option_container">

                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}


export default UserVideos;
