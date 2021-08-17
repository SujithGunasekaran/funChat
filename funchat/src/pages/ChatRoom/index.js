import React, { useEffect, useState, Fragment, lazy, Suspense } from 'react';
import useRoomAxios from '../../hooks/useRoomAxios';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import { unstable_batchedUpdates } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import withAuth from '../../hoc/withAuth';
import { CancelIcon, CallCancelIcon } from '../../UI/Icons';

const Message = lazy(() => import('../../components/middlePanel/MessageMiddle'));
const GroupUser = lazy(() => import('../../components/leftPanel/GroupUser'));
const GroupInfo = lazy(() => import('../../components/rightPanel/GroupInfo'));
const UserProfile = lazy(() => import('../../components/rightPanel/UserProfile'));
const InfoMessage = lazy(() => import('../../UI/message/InfoMessage'));

let socket;

const ChatRoom = (props) => {

    const { match: { params } } = props;
    const { groupID } = params;

    // hooks
    const { getAction, postAction, deleteAction } = useRoomAxios();

    // state
    const [welcomeMessage, setWelcomeMessage] = useState({});
    const [groupInfo, setGroupInfo] = useState(null);
    const [chatMessage, setChatMessage] = useState([]);
    const [infoMessage, setInfoMessage] = useState(null);

    // redux state
    const { loggedUserInfo } = useSelector(state => state.userReducer);
    const { receivingCallInfo } = useSelector(state => state.userVideoReducer);

    // redux-dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        socket = io('localhost:5000');
        getRoomInfoById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return () => {
            handleLeaveGroup();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupInfo])


    const getRoomInfoById = async () => {
        try {
            const { data, error } = await getAction(`/getByGroupId/?groupID=${groupID}&userID=${loggedUserInfo._id}`);
            if (error && error.type !== 'Authentication') {
                throw new Error('Error while getting roomInfo');
            }
            if (error && error.type === 'Authentication') {
                props.history.push('/');
                return;
            }
            if (data.status === 'Success' && data.data.groupInfo) {
                const { groupInfo } = data.data;
                socket.emit('join', { username: groupInfo.joinedUserName, groupname: groupInfo.groupname }, (err) => {
                    if (err) throw new Error('Error while connecting room');
                    getStartMessage(groupInfo);
                });
            }
        }
        catch (err) {
            console.log(err);
            props.history.push('/home');
        }
    }

    const batchedUpdateState = (groupInfo) => {
        unstable_batchedUpdates(() => {
            setGroupInfo(groupInfo);
        })
    }

    const chatMessageStateSetter = (message) => {
        setChatMessage(prevChatMessage => {
            let chatMessage = prevChatMessage.slice();
            chatMessage = [
                ...chatMessage,
                message
            ];
            return chatMessage;
        })
    }

    const handleLeaveGroup = async () => {
        if (groupInfo && loggedUserInfo) {
            try {
                const { data, error } = await postAction(`/setOfflineUser?groupID=${groupInfo._id}&userID=${loggedUserInfo._id}`);
                if (error && error.type !== 'Authentication') throw new Error('Error while setting offline users');
                if (error && error.type === 'Authentication') {
                    props.history.push('/');
                    return;
                }
                if (data.status === 'Success') {
                    socket.emit('offlineGroup', { groupName: groupInfo.groupname, userName: loggedUserInfo.username, userID: loggedUserInfo._id }, (err) => {
                        if (err) console.log(err);
                    })
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    const getStartMessage = (groupInfo) => {
        batchedUpdateState(groupInfo);
        socket.on('chatMessage', message => {
            if (message.type === 'Welcome') {
                unstable_batchedUpdates(() => {
                    setWelcomeMessage(prevMessage => {
                        let welcomeMessage = JSON.parse(JSON.stringify(prevMessage));
                        welcomeMessage = message;
                        return welcomeMessage;
                    });
                    setChatMessage(prevChatMessage => {
                        let chatMessage = prevChatMessage.slice();
                        chatMessage = [
                            ...chatMessage,
                            message
                        ];
                        return chatMessage;
                    })
                })
            }
            else {
                chatMessageStateSetter(message);
            }
        })
        socket.on('leaveMessage', message => {
            if (message.type === 'Welcome') {
                unstable_batchedUpdates(() => {
                    setWelcomeMessage(prevMessage => {
                        let welcomeMessage = JSON.parse(JSON.stringify(prevMessage));
                        welcomeMessage = message;
                        return welcomeMessage;
                    });
                    setChatMessage(prevChatMessage => {
                        let chatMessage = prevChatMessage.slice();
                        chatMessage = [
                            ...chatMessage,
                            message
                        ];
                        return chatMessage;
                    })
                })
            }
            else {
                chatMessageStateSetter(message);
            }
        })
        socket.on('deleteMessage', message => {
            setInfoMessage(`${message.message} You will be redirecting to home page`);
            setTimeout(() => {
                setInfoMessage('');
                props.history.push('/home');
            }, 3000)
        })

        socket.on('calling', response => {
            if (response) {
                dispatch({
                    type: 'SET_RECEIVING_CALL_INFO',
                    info: response
                });
            }
        })
    }


    const deleteGroup = async () => {
        try {
            const { data, error } = await deleteAction(`/deleteGroup?groupID=${groupInfo._id}&userID=${loggedUserInfo._id}`);
            if (error) throw new Error('Error while deleting the user');
            if (data.status === 'Success') {
                setInfoMessage('Group deleted Successfully, You will be redirecting to home');
                setTimeout(() => {
                    props.history.push('/home');
                }, 2000)
                socket.emit('groupDeleted', { groupName: groupInfo.groupname, admin: loggedUserInfo.username }, (err) => {
                    console.log(err);
                    if (err) throw new Error('Failed to send message to the user');
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const joinCall = () => {
        props.history.push(`/group/${groupInfo.groupname}/call/listener/${receivingCallInfo.callID}`);
    }


    // UI

    const displayInfoMessage = () => (
        <Fragment>
            <InfoMessage
                message={infoMessage}
                handleCloseInfomessage={() => setInfoMessage(false)}
            />
        </Fragment>
    )

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <div className="message_left_container">
                            {
                                <Suspense fallback={<div>Loading...</div>}>
                                    <GroupUser
                                        groupInfo={groupInfo}
                                        groupID={groupID}
                                        welcomeMessage={welcomeMessage}
                                        history={props.history}
                                    />
                                </Suspense>
                            }
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="message_middle_container">
                            {
                                infoMessage && displayInfoMessage()
                            }
                            <Suspense fallback={<div>Loading...</div>}>
                                <Message
                                    groupInfo={groupInfo}
                                    chatMessage={chatMessage}
                                    infoMessage={infoMessage}
                                    history={props.history}
                                    handleDeleteGroup={deleteGroup}
                                />
                            </Suspense>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="right_panel">
                            <div className="user_right_profile_container">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <UserProfile
                                        showLeaveButton={true}
                                        groupInfo={groupInfo}
                                        history={props.history}
                                        socketNeeded={true}
                                    />
                                </Suspense>
                            </div>
                            <div className="message_right_panel_container">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <GroupInfo
                                        groupID={groupID}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    receivingCallInfo &&
                    <div className={`chat_room_call_container ${receivingCallInfo && 'show'}`}>
                        <div className="chat_room_call_subhead">
                            <div className="chat_room_call_user">Group call started by {receivingCallInfo.fromUser}</div>
                            <CancelIcon cssClass="chat_room_call_cancel" handleEvent={() => dispatch({ type: 'SET_RECEIVING_CALL_INFO', info: null })} />
                        </div>
                        <div className="chat_room_call_footer_container">
                            <button className="chat_room_call_join" onClick={() => joinCall()}>Join</button>
                            <button className="chat_room_call_cut" onClick={() => dispatch({ type: 'SET_RECEIVING_CALL_INFO', info: null })}>Cancel</button>
                        </div>
                    </div>
                }
            </div>
        </Fragment>
    )

};


export default withRouter(withAuth({ Component: ChatRoom, name: 'chatRoom' }));
