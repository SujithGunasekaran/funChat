import React, { Fragment, lazy, Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import withAuth from '../hoc/withAuth';
import { useSelector } from 'react-redux';

const MiddlePanel = lazy(() => import('../components/middlePanel/HomeMiddle'));
const UserProfile = lazy(() => import('../components/rightPanel/UserProfile'));
const HomeInfo = lazy(() => import('../components/leftPanel/HomeInfo'));
const UserGroups = lazy(() => import('../components/rightPanel/UserGroups'));
const OnlineUser = lazy(() => import('../components/leftPanel/HomeOnlineUser'));

const Home = (props) => {

    // useEffect(() => {
    //     socket = io('localhost:5000');
    //     socket.on('getOnlineUser', response => {
    //         console.log(response);
    //     })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

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
                                        userId={loggedUserInfo._id}
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
