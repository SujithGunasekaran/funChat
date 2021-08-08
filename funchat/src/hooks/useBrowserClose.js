import { onlineAxios } from "../config/AxiosInstance";
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const useBrowserClose = () => {

    // socket
    let socket = io('localhost:5000');

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    window.onbeforeunload = async function () {
        try {
            await onlineAxios.delete(`/?userID=${loggedUserInfo._id}`);
            socket.emit('setOnlineUser', { userName: loggedUserInfo.username }, (err) => {
                if (err) throw new Error('Error while getting setting online user');
            })
        }
        catch (err) {
            console.log(err);
        }
    }

}

export default useBrowserClose;
