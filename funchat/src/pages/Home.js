import React, { Fragment, lazy, Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import withAuth from '../hoc/withAuth';

const MiddlePanel = lazy(() => import('../components/middlePanel/HomeMiddle'));
const UserProfile = lazy(() => import('../components/rightPanel/UserProfile'));
const HomeInfo = lazy(() => import('../components/leftPanel/HomeInfo'));
const UserGroups = lazy(() => import('../components/rightPanel/UserGroups'));
const OnlineUser = lazy(() => import('../components/leftPanel/HomeOnlineUser'));

const Home = (props) => {

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <div className="home_left_container">
                            <Suspense fallback={<div>Loading...</div>}>
                                <HomeInfo
                                    history={props.history}
                                />
                            </Suspense>
                        </div>
                        <Suspense fallback={<div>Loading...</div>}>
                            <OnlineUser />
                        </Suspense>
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
                        <div className="home_right_user_group_container">
                            <Suspense fallback={<div>Loading...</div>}>
                                <Fragment>
                                    <div className="home_right_user_group_heading">Groups Your are In</div>
                                    <UserGroups
                                        history={props.history}
                                    />
                                </Fragment>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};

export default withRouter(withAuth({ Component: Home, name: 'home' }));
