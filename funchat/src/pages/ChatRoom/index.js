import React, { useEffect, useState, Fragment, lazy, Suspense } from 'react';
import useRoomAxios from '../../hooks/useRoomAxios';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import { unstable_batchedUpdates } from 'react-dom';

const Message = lazy(() => import('../../components/middlePanel/MessageMiddle'));
const RoomUser = lazy(() => import('../../components/rightPanel/RoomUser'));

let socket;

const ChatRoom = (props) => {

    const { match: { params } } = props;
    const { roomID } = params;

    // hooks
    const { getAction, loading } = useRoomAxios();

    // state
    const [welcomeMessage, setWelcomeMessage] = useState({});
    const [roomName, setRoomName] = useState('');
    const [userList, setUserList] = useState([]);

    useEffect(() => {

        getRoomInfoById();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getRoomUserList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [welcomeMessage])


    const getRoomUserList = async () => {
        try {
            const { data, error } = await getAction(`/getRoomUser?roomID=${roomID}`);
            if (error) throw new Error('Error while getting user list');
            if (data && data.status === 'Success') {
                setUserList(prevUserList => {
                    let userList = prevUserList.slice();
                    userList = data.data.userList.users;
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
            const { data, error } = await getAction(`getByRoomId/?roomID=${roomID}`);
            if (error) throw new Error('Error while getting roomInfo');
            if (data.status === 'Success' && data.data.roomInfo) {
                const { roomInfo } = data.data;
                socket = io('localhost:5000');
                socket.emit('join', { username: roomInfo.users[roomInfo.currentUserIndex].username, roomname: roomInfo.roomname }, (err) => {
                    if (err) throw new Error('Error while connecting room');
                    getStartMessage(roomInfo);
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const batchedUpdateState = (roomInfo) => {
        unstable_batchedUpdates(() => {
            setRoomName(roomInfo.roomname);
            setUserList([
                ...userList,
                ...roomInfo.users
            ])
        })
    }

    const getStartMessage = (roomInfo) => {
        batchedUpdateState(roomInfo);
        socket.on('message', message => {
            setWelcomeMessage(prevWelcomeMessage => {
                let welcomeMessage = JSON.parse(JSON.stringify(prevWelcomeMessage));
                welcomeMessage = { ...message };
                return welcomeMessage;
            });
        })
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <div className="message_right_container">
                            <div className="message_right_header_container">
                                <div className="message_right_header_heading">Users</div>
                            </div>
                            {
                                userList.length > 0 &&
                                <Suspense fallback={<div>Loading...</div>}>
                                    <RoomUser
                                        userList={userList}
                                    />
                                </Suspense>
                            }
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="message_middle_container">
                            <div className="message_middle_header_container">
                                <div className="message_middle_header_heading">{roomName}</div>
                            </div>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Message
                                    welcomeMessage={welcomeMessage}
                                />
                            </Suspense>
                        </div>
                    </div>
                    <div className="col-md-3">
                        Left Panel
                    </div>
                </div>
            </div>
        </Fragment>
    )

};


export default withRouter(ChatRoom);
