import React, { useEffect, useRef, useState, Fragment, lazy, Suspense } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useSelector } from 'react-redux';
import UserVideos from '../../components/video/UserVideo';

const LoggedUserVideo = lazy(() => import('../../components/video/LoggedUserVideo'));

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
                socket.emit('joinRoom', { callID, userInfo: { ...loggedUserInfo, socketID: socket.id, audioType: 'mute', video: 'play' } });

                socket.on("joinedUserInfo", userInfo => {
                    updateJoinedUserInfo(userInfo, stream);
                });

                socket.on('userList', users => {
                    setUsers(users);
                });

                socket.on('receivingAudioType', ({ audioType, userID }) => {
                    setPeers(prevPeers => {
                        let peers = prevPeers.slice();
                        let peerIndex = peers.findIndex(({ userInfo }) => userInfo._id === userID);
                        if (peerIndex > -1) {
                            peers[peerIndex] = {
                                ...peers[peerIndex],
                                userInfo: {
                                    ...peers[peerIndex].userInfo,
                                    audioType
                                }
                            }
                        }
                        return peers;
                    })
                });

                socket.on('receivingVideoType', ({ videoType, userID }) => {
                    setPeers(prevPeers => {
                        let peers = prevPeers.slice();
                        let peerIndex = peers.findIndex(({ userInfo }) => userInfo._id === userID);
                        if (peerIndex > -1) {
                            peers[peerIndex] = {
                                ...peers[peerIndex],
                                userInfo: {
                                    ...peers[peerIndex].userInfo,
                                    video: videoType
                                }
                            }
                        }
                    })
                })

                socket.on("userJoined", ({ signal, callerID, userInfo }) => {
                    const peer = addPeer(signal, callerID, stream);
                    peersRef.current.push({
                        peerID: callerID,
                        peer,
                    })
                    setPeers(peers => [...peers, { userInfo, peer }]);
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
        ];
        userData.forEach(user => {
            const peer = createPeer(user.socketID, socket.id, stream);
            peersRef.current.push({
                peerID: user.socketID,
                peer,
            })
            // peers.push(peer);
            peers.push({
                userInfo,
                peer
            })
        });
        setUsers(prevUsers => {
            let users = prevUsers.slice();
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
                socketID: socket.id,
                audioType: 'unMute',
                video: 'play',
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
            socket.emit("sendingSignal", { userToSignal, callerID, signal, userInfo: { ...loggedUserInfo, socketID: socket.id, audioType: 'mute', video: 'play' } })
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
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <LoggedUserVideo
                                            ref={userVideo}
                                            callID={callID}
                                        />
                                    </Suspense>
                                </div>
                                <UserVideos
                                    peers={peers}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default GroupCall;
