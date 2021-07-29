import React, { useEffect, useState, Fragment, lazy, Suspense } from 'react';
import useRoomAxios from '../../hooks/useRoomAxios';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import { unstable_batchedUpdates } from 'react-dom';
import { useSelector } from 'react-redux';

const Message = lazy(() => import('../../components/middlePanel/MessageMiddle'));
const GroupUser = lazy(() => import('../../components/leftPanel/GroupUser'));
const GroupInfo = lazy(() => import('../../components/rightPanel/GroupInfo'));
const UserProfile = lazy(() => import('../../components/rightPanel/UserProfile'));

let socket;

const ChatRoom = (props) => {

    const { match: { params } } = props;
    const { groupID } = params;

    // hooks
    const { getAction, postAction } = useRoomAxios();

    // state
    const [welcomeMessage, setWelcomeMessage] = useState({});
    const [groupInfo, setGroupInfo] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [userList, setUserList] = useState([]);
    const [chatMessage, setChatMessage] = useState([]);
    const [offlineUser, setOfflineUsers] = useState(new Set());

    // redux state
    const { loggedUserInfo } = useSelector(state => state.userReducer)

    useEffect(() => {

        socket = io('localhost:5000');
        getRoomInfoById();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        getRoomUserList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [welcomeMessage])


    useEffect(() => {

        return () => {
            leaveMessage();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupInfo])


    const getRoomUserList = async () => {
        try {
            const { data, error } = await getAction(`/getGroupUser?groupID=${groupID}`);
            if (error) throw new Error('Error while getting user list');
            if (data && data.status === 'Success') {
                setOfflineUsers(new Set([...data.data.offlineUser]))
                setUserList(prevUserList => {
                    let userList = prevUserList.slice();
                    userList = data.data.userList;
                    return userList;
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    const getRoomInfoById = async () => {
        try {
            const { data, error } = await getAction(`/getByGroupId/?groupID=${groupID}&userID=${loggedUserInfo._id}`);
            if (error) throw new Error('Error while getting roomInfo');
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
        }
    }

    const leaveGroup = async ({ userId, userName }) => {
        try {
            const { data, error } = await postAction(`/leaveGroup/?userID=${userId}&groupID=${groupInfo._id}`);
            if (error) throw new Error('Error while leaving the group');
            if (data.status === 'Success') {
                socket.emit('leaveGroup', { groupName: groupInfo.groupname, userName }, (err) => {
                    if (err) throw new Error('Error while leaving the group');
                    props.history.push('/');
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const batchedUpdateState = (groupInfo) => {
        unstable_batchedUpdates(() => {
            setGroupInfo(groupInfo);
            setGroupName(groupInfo.groupname);
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

    const leaveMessage = async () => {
        if (groupInfo && loggedUserInfo) {
            try {
                const { data, error } = await postAction(`/setOfflineUser?groupID=${groupInfo._id}&userID=${loggedUserInfo._id}`);
                if (error) throw new Error('Error while setting offline users');
                if (data.status === 'Success') {
                    socket.emit('offlineGroup', { groupName, userName: loggedUserInfo.username, userID: loggedUserInfo._id }, (err) => {
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
                setWelcomeMessage(prevMessage => {
                    let welcomeMessage = JSON.parse(JSON.stringify(prevMessage));
                    welcomeMessage = message;
                    return welcomeMessage;
                });
                chatMessageStateSetter(message);
            }
            else {
                chatMessageStateSetter(message);
            }
        })
        socket.on('leaveMessage', message => {
            if (message.type === 'Welcome') {
                setWelcomeMessage(prevMessage => {
                    let welcomeMessage = JSON.parse(JSON.stringify(prevMessage));
                    welcomeMessage = message;
                    return welcomeMessage;
                });
                chatMessageStateSetter(message);
            }
            else {
                chatMessageStateSetter(message);
            }
        })
    }


    const sendMessage = (message) => {
        try {
            socket.emit('sendMessage', { groupName, userId: loggedUserInfo._id, userName: loggedUserInfo.username, message }, (err) => {
                if (err) throw new Error('Error while sending the messages');
            });
        }
        catch (err) {
            console.log(err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }



    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <div className="left_container">
                            <div className="message_left_container">
                                <div className="message_left_header_container">
                                    <div className="message_left_header_heading">Users</div>
                                </div>
                                {
                                    userList.length > 0 &&
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <GroupUser
                                            userList={userList}
                                            groupInfo={groupInfo}
                                            offlineUser={offlineUser}
                                        />
                                    </Suspense>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="message_middle_container">
                            <div className="message_middle_header_container">
                                <div className="message_middle_header_heading">{groupName}</div>
                            </div>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Message
                                    sendMessage={sendMessage}
                                    chatMessage={chatMessage}
                                />
                            </Suspense>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="right_panel">
                            <div className="user_right_profile_container">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <UserProfile
                                        groupInfo={groupInfo}
                                        showLeaveButton={true}
                                        leaveButtonAction={leaveGroup}
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
            </div>
        </Fragment>
    )

};


export default withRouter(ChatRoom);
