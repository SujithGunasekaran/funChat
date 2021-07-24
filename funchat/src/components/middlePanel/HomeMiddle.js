import React, { Fragment, useState, lazy, Suspense, useEffect } from 'react';
import { CancelIcon } from '../../UI/Icons';
import useRoomAxios from '../../hooks/useRoomAxios';

const FormModel = lazy(() => import('../../UI/model/CreateRoom'));
const RoomList = lazy(() => import('../../UI/card/Room/RoomList'));

const HomeMiddle = (props) => {

    // state
    const [showFormModel, setShowFormModel] = useState(false);
    const [roomList, setRoomList] = useState([]);

    // hooks
    const { getAction } = useRoomAxios();

    useEffect(() => {
        getPublicRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getPublicRooms = async () => {
        try {
            const { data, error } = await getAction(`/getByRoomType?roomType=public`);
            if (error) throw new Error('Error while getting room list');
            if (data.status === 'Success') {
                setRoomList(data.data.roomList)
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="home_middle_header">
                <div className="home_middle_header_title">Rooms</div>
                <button className="home_middle_header_room_btn" onClick={() => setShowFormModel(true)}>Create Room</button>
            </div>
            {
                showFormModel &&
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="overlay">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-5 mx-auto">
                                    <div className="form_model_container">
                                        <div className="form_model_header">
                                            <div className="form_model_header_title">Create Room</div>
                                            <CancelIcon cssClass={'form_model_header_cancel_icon'} handleEvent={() => setShowFormModel(false)} />
                                        </div>
                                        <FormModel />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Suspense>
            }
            <div className="home_middle_room_container">
                {
                    roomList.length > 0 &&
                    <RoomList
                        history={props.history}
                        roomList={roomList}
                    />
                }
            </div>
        </Fragment>
    )

};

export default HomeMiddle;
