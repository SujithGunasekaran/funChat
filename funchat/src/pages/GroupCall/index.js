import React, { Fragment, useEffect, useState, useRef } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    video: {
        width: '550px',
        [theme.breakpoints.down('xs')]: {
            width: '300px',
        },
    },
    gridContainer: {
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    paper: {
        padding: '10px',
        border: '2px solid black',
        margin: '10px',
    },
}));


let socket;

const GroupCall = (props) => {

    // props
    const { match: { params } } = props;
    const { groupName, type, callID } = params;

    // state
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    // const [call, setCall] = useState({});
    // const [me, setMe] = useState('');

    // ref
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);
    const { receivingCallInfo } = useSelector(state => state.userVideoReducer);


    useEffect(() => {
        socket = io('localhost:5000');
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });

        try {
            socket.emit('join-call', { callID }, (err) => {
                if (err) throw new Error('errow while joining');
            })
        }
        catch (err) {
            console.log(err);
        }

        if (type === 'caller') {
            callUser();
        }

        if (type === 'listener') {
            answerCall();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const answerCall = () => {

        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: callID });
        });

        peer.on('stream', stream => {
            console.log("stream", stream);
        })

        peer.signal(receivingCallInfo.signalData);

        connectionRef.current = peer;
    };

    const callUser = () => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            try {
                socket.emit('groupCall', { groupToCall: groupName, signalData: data, fromUser: loggedUserInfo.username, callID }, (err) => {
                    if (err) throw new Error("Error while connecting");
                });
            }
            catch (err) {
                console.log(err);
            }
        });

        peer.on('stream', stream => {
            console.log("stream", stream);
        })

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const classes = useStyles();

    return (
        <Fragment>
            <Grid container className={classes.gridContainer}>
                {stream && (
                    <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                        </Grid>
                    </Paper>
                )}
                {callAccepted && !callEnded && (
                    <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>{'Name'}</Typography>
                            <video playsInline ref={userVideo} autoPlay className={classes.video} />
                        </Grid>
                    </Paper>
                )}
            </Grid>
        </Fragment>
    )

};


export default withRouter(GroupCall);
