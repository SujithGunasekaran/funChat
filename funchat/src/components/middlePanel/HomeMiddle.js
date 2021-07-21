import React, { Fragment, useState, lazy, Suspense } from 'react';
import { CancelIcon } from '../../UI/Icons';

const FormModel = lazy(() => import('../../UI/model/CreateRoom'));

const HomeMiddle = () => {

    const [showFormModel, setShowFormModel] = useState(false);

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
        </Fragment>
    )

};

export default HomeMiddle;
