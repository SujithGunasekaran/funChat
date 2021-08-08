import { onlineAxios } from "../config/AxiosInstance";
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const useBrowserClose = () => {

    // socket
    let socket = io('localhost:5000');

    // redux-state
    const { loggedUserInfo, isUserLoggedIn } = useSelector(state => state.userReducer);
    window.onbeforeunload = async function (event) {
        event.preventDefault();
        event.returnValue = '';
        if (event && isUserLoggedIn) {
            try {
                socket.emit('setOnlineUser', { userName: loggedUserInfo.username }, (err) => {
                    if (err) throw new Error('Error while getting setting online user');
                })
                await onlineAxios.delete(`/?userID=${loggedUserInfo._id}`);
            }
            catch (err) {
                console.log(err);
            }
        }

    }

}

export default useBrowserClose;
