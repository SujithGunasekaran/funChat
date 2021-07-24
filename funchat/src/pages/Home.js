import React, { Fragment, lazy, Suspense } from 'react';
import { withRouter } from 'react-router-dom';

const MiddlePanel = lazy(() => import('../components/middlePanel/HomeMiddle'));


const Home = (props) => {

    // const [messages, setMessage] = useState([]);

    // useEffect(() => {
    //     socket = io('localhost:5000');
    //     let hello = "Hello";
    //     let sample = "Sample";
    //     socket.emit('join', { hello, sample }, () => {

    //     });

    //     return () => {

    //         socket.emit('disconnect');
    //         socket.off();

    //     }

    // }, [])


    // const createRoom = ({ userName, roomName, roomType }) => {
    //     socket.io('localhost:5000');
    //     socket.emit('join', { userName, roomName, roomType }, (err, status) => {
    //         if (err) console.log(err);
    //         console.log(status);
    //     })
    // }


    // const sendMessage = () => {
    //     let message = "Hello world";
    //     socket.emit('sendMessage', message, () => console.log("Success"));

    // }

    // useEffect(() => {

    //     if (socket) {
    //         console.log("Hello")
    //         socket.on('message', message => {
    //             console.log(message);
    //             setMessage([...messages, message]);
    //         })
    //     }


    // }, [messages])

    // console.log(messages);

    console.log(props);

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        Right Panel
                    </div>
                    <div className="col-md-7">
                        <Suspense fallback={<div>Loading...</div>}>
                            <MiddlePanel
                                history={props.history}
                            />
                        </Suspense>
                    </div>
                    <div className="col-md-3">
                        Left Panel
                    </div>
                </div>
            </div>
        </Fragment>
    )

};

export default withRouter(Home);
