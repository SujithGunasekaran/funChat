import React, { useEffect, useState } from 'react';
import useRoomAxios from '../../hooks/useRoomAxios';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';

let socket;

const ChatRoom = (props) => {

    const { match: { params } } = props;
    const { roomID } = params;

    // hooks
    const { getAction, loading } = useRoomAxios();

    // state
    const [welcomeMessage, setWelcomeMessage] = useState([]);

    useEffect(() => {
        getRoomInfoById();
    }, [])

    useEffect(() => {
        if (socket) {
            console.log("Hello")
            socket.on('message', message => {
                console.log("message", message);
                setWelcomeMessage([...welcomeMessage, message]);
            })
        }
    }, [welcomeMessage])

    const getRoomInfoById = () => {
        // try {
        // const { data, error } = await getAction(`/?roomID=${roomID}`);
        // if (error) throw new Error('Error while getting roomInfo');
        // if (data.status === 'Success') {
        //     console.log(data.data.roomInfo);
        socket = io('localhost:5000');
        socket.emit('join', { username: "Sample", roomname: "Sample" }, (err) => {
            // if (err) throw new Error('Error while connecting room');
            // getStartMessage();
            //         });
            //     }
            // }
            // catch (err) {
            //     console.log(err);
            // }
        })
    }

    // const getStartMessage = () => {
    //     console.log("Hello");
    //     socket.on('message', message => {
    //         console.log("message", message);
    //         setWelcomeMessage(prevMessage => {
    //             return [
    //                 ...prevMessage,
    //                 message
    //             ]
    //         });
    //     })
    // }

    console.log(welcomeMessage);

    return (
        <div>Chat Room</div>
    )

};


export default withRouter(ChatRoom);
