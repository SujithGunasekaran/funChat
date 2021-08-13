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
    const [callAccepted, setCallAccepted] = useState(false);
    const [call, setCall] = useState({});

    // ref
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    // props
    const { match: { params } } = props;
    const { groupName, type } = params;

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    // useEffect
    useEffect(() => {
        socket = io('localhost:5000');
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setStream(stream);
                myVideo.current.srcObject = stream;
            })
        if (type === 'caller') {
            callUser();
        }
        else {
            answerCall();
            socket.on('calling', ({ signalData, groupName, callID, username }) => {
                setCall({ isReceivingCall: true, from: groupName, name: username, signal: signalData });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const answerCall = () => {

        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: groupName });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        // peer.signal(call.signal);

        connectionRef.current = peer;
    };


    const callUser = () => {

        let callID = uuidv4();
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            try {
                socket.emit('groupCall', { signalData: data, groupName: groupName, callID, username: loggedUserInfo.username }, (err) => {
                    if (err) throw new Error('Error while calling');
                });
            }
            catch (err) {
                console.log(err);
            }
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callAccepted', (signal) => {
            console.log("inside call accepted");
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;

    }

    // console.log(stream);

    return (
        <Fragment>
            Group Call
        </Fragment>
    )

};


export default withRouter(GroupCall);
