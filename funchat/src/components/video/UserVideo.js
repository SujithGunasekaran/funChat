import React, { Fragment, useRef, useEffect } from 'react';


const UserVideos = (props) => {

    // props
    const { userPeers } = props;

    // ref
    const ref = useRef();

    useEffect(() => {
        userPeers.on("stream", stream => {
            ref.current.srcObject = stream;
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <video className="group_call_video_item" playsInline autoPlay ref={ref} />
        </Fragment>
    );
}


export default UserVideos;
