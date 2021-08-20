import React, { useEffect, useRef, useState, Fragment } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useSelector } from 'react-redux';
import UserVideos from '../../components/video/UserVideo';
import { MicIcon, VideoIcon } from '../../UI/Icons';

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
    const { callID, groupName } = params;

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
                    setPeers(peers => [...peers, peer]);
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
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="group_call_header_container">
                            <div className="group_call_header_name">{groupName} Group Call</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="group_call_video_container">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="group_call_video_body">
                                        <video className="group_call_video_item" muted ref={userVideo} autoPlay playsInline />
                                        <div className="group_call_video_footer">
                                            <div className="group_call_user_info_container">
                                                <img src={loggedUserInfo.profile} className="profile" loading="lazy" alt={loggedUserInfo.username} />
                                                <div className="name">{loggedUserInfo.username}</div>
                                                <div className="group_call_user_option_container">
                                                    <MicIcon cssClass="grop_call_user_option_mic" />
                                                    <VideoIcon cssClass="grop_call_user_option_video" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    peers.map((peer, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <div className="col-md-4">
                                                    <UserVideos userPeers={peer} />
                                                </div>
                                            </Fragment>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default GroupCall;
