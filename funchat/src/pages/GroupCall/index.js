import React, { Fragment, useEffect, useState, useRef } from 'react';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

let socket;

const GroupCall = (props) => {

    // state
    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState({});

    // props
    const { match: { params } } = props;
    const { groupName, callID } = params;

    // ref
    const myVideo = useRef();

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);


    // useEffect
    useEffect(() => {

        socket = io('localhost:5000');
        getVideo();
        try {
            socket.emit('joinGroupCall', { callID, username: loggedUserInfo.username }, (err) => {
                if (err) throw new Error('Error while joining roomm');
            });
        }
        catch (err) {
            console.log(err);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getVideo = () => {

        const peer = new Peer({ initiator: false, trickle: false, stream });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setStream(stream);
                const myVideo = document.createElement('video')
                addVideoStream(myVideo, stream);
                peer.on('call', call => {
                    call.answer(stream)
                    call.on('stream', userVideoStream => {
                        const myVideo = document.createElement('video')
                        addVideoStream(myVideo, userVideoStream)
                    })
                })
                socket.on('userConnected', ({ userName }) => {
                    connectToNewUser(userName, stream)
                })

            })
    }


    const addVideoStream = (video, stream) => {
        const videoGrid = document.getElementById('video-grid');
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        videoGrid.append(video)
    }


    const connectToNewUser = (userName, stream) => {

        const peer = new Peer({ initiator: false, trickle: false, stream });

        const call = peer.call(userName, stream);

        call.on('stream', userVideoStream => {
            addVideoStream(userVideoStream)
        })

        setPeers(prevValue => {
            let peers = JSON.parse(JSON.stringify(prevValue));
            peers[userName] = "hello";
            return peers;
        })
    }


    return (
        <Fragment>
            Group Call
            {/* <div style={styles.video_grid} id="video-grid"></div> */}
        </Fragment>
    )

};


// const styles = {
//     video_grid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, 300px)',
//         gridAutoRows: '300px'
//     },
//     video: {
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover'
//     }
// }


export default withRouter(GroupCall);
