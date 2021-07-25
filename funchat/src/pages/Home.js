import React, { Fragment, lazy, Suspense } from 'react';
import { withRouter } from 'react-router-dom';

const MiddlePanel = lazy(() => import('../components/middlePanel/HomeMiddle'));
const UserProfile = lazy(() => import('../components/rightPanel/UserProfile'));
const HomeInfo = lazy(() => import('../components/leftPanel/HomeInfo'));

const Home = (props) => {

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <div className="home_left_container">
                            <Suspense fallback={<div>Loading...</div>}>
                                <HomeInfo />
                            </Suspense>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <Suspense fallback={<div>Loading...</div>}>
                            <MiddlePanel
                                history={props.history}
                            />
                        </Suspense>
                    </div>
                    <div className="col-md-3">
                        <div className="user_right_profile_container">
                            <Suspense fallback={<div>Loading...</div>}>
                                <UserProfile />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};

export default withRouter(Home);
