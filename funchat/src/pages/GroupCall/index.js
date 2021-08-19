import React, { useEffect, useRef, useState, Fragment } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useSelector } from 'react-redux';
import UserVideos from '../../components/video/UserVideo';


let socket = io('localhost:5000');

const GroupCall = (props) => {

    // states
    const [peers, setPeers] = useState([]);
    const [users, setUsers] = useState([]);

    // ref
    const userVideo = useRef();
    const peersRef = useRef([]);

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const { match: { params } } = props;
    const { callID } = params;

    // useEffect
    useEffect(() => {
        getVideo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const getVideo = () => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                userVideo.current.srcObject = stream;
                updateUserList();
                socket.emit('joinRoom', { callID, userInfo: { ...loggedUserInfo, socketID: socket.id } });

                socket.on("joinedUserInfo", userInfo => {
                    updateJoinedUserInfo(userInfo, stream);
                });

                socket.on('userList', users => {
                    setUsers(users);
                });

                socket.on("userJoined", ({ signal, callerID }) => {
                    const peer = addPeer(signal, callerID, stream);
                    peersRef.current.push({
                        peerID: callerID,
                        peer,
                    })
                    setPeers(users => [...users, peer]);
                });

                socket.on("receivingReturnedSignal", ({ signal, id }) => {
                    const item = peersRef.current.find(peer => peer.peerID === id);
                    item.peer.signal(signal);
                });
            })

    }

    const updateJoinedUserInfo = (userInfo, stream) => {
        const peers = [];
        let userData = [
            ...users,
            userInfo
        ]
        userData.forEach(user => {
            const peer = createPeer(user.socketID, socket.id, stream);
            peersRef.current.push({
                peerID: user.socketID,
                peer,
            })
            peers.push(peer);
        });
        setUsers(prevUsers => {
            let users = JSON.parse(JSON.stringify(prevUsers));
            users = [
                ...users,
                userInfo
            ];
            socket.emit('updateUserList', { users, callID });
            return users;
        });
        setPeers(peers);
    }

    const updateUserList = () => {
        setUsers(prevUsers => {
            let users = JSON.parse(JSON.stringify(prevUsers));
            const userData = {
                ...loggedUserInfo,
                socketID: socket.id
            }
            users = [
                userData
            ];
            return users;
        })
    }

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        peer.on("signal", signal => {
            socket.emit("sendingSignal", { userToSignal, callerID, signal })
        })
        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        peer.on("signal", signal => {
            socket.emit("returningSignal", { signal, callerID })
        })
        peer.signal(incomingSignal);
        return peer;
    }

    return (
        <div style={styles.container}>
            <video style={{ width: '40%', height: '50%' }} muted ref={userVideo} autoPlay playsInline />
            {
                peers.map((peer, index) => {
                    return (
                        <Fragment key={index}>
                            <UserVideos userPeers={peer} />
                        </Fragment>
                    );
                })
            }
        </div>
    );
};


const styles = {
    container: {
        padding: '20px',
        display: 'flex',
        height: '100vh',
        width: '90%',
        margin: 'auto',
        flexWrap: 'wrap',
    }
}

export default GroupCall;
