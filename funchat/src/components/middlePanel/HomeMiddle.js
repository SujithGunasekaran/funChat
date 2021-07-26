import React, { Fragment, useState, lazy, Suspense, useEffect } from 'react';
import { CancelIcon } from '../../UI/Icons';
import useRoomAxios from '../../hooks/useRoomAxios';
import CircularLoading from '../../UI/loading/CircularLoading';

const CreateGroupForm = lazy(() => import('../../UI/model/CreateGroup'));
const GroupList = lazy(() => import('../../UI/card/Group/GroupList'));

const HomeMiddle = (props) => {

    // state
    const [showFormModel, setShowFormModel] = useState(false);
    const [groupList, setGroupList] = useState([]);

    // hooks
    const { getAction, loading } = useRoomAxios();

    useEffect(() => {
        getPublicRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getPublicRooms = async () => {
        try {
            const { data, error } = await getAction(`/getByGroupType?groupType=public`);
            if (error) throw new Error('Error while getting room list');
            if (data.status === 'Success') {
                setGroupList(data.data.groupList)
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    const showLoading = () => (
        <CircularLoading
            text="Loading..."
        />
    )


    return (
        <Fragment>
            <div className="home_middle_header">
                <div className="home_middle_header_title">Groups</div>
                <button className="home_middle_header_room_btn" onClick={() => setShowFormModel(true)}>Create Group</button>
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
                                            <div className="form_model_header_title">Create Group</div>
                                            <CancelIcon cssClass={'form_model_header_cancel_icon'} handleEvent={() => setShowFormModel(false)} />
                                        </div>
                                        <CreateGroupForm />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Suspense>
            }
            <div className="home_middle_room_container">
                {
                    loading &&
                    showLoading()
                }
                {
                    groupList.length > 0 &&
                    <GroupList
                        history={props.history}
                        groupList={groupList}
                    />
                }
            </div>
        </Fragment>
    )

};

export default HomeMiddle;
