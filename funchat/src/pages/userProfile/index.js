import React, { Fragment, lazy, Suspense, useState, useCallback } from 'react';
import withAuth from '../../hoc/withAuth';
import { withRouter } from 'react-router-dom';

const UserBanner = lazy(() => import('../../components/userProfile/UserBanner'));
const UserPanel = lazy(() => import('../../components/userProfile/UserPanel'));
const UserFollowFollowing = lazy(() => import('../../components/userProfile/UserFollowFollowing'));
const UserGroups = lazy(() => import('../../components/rightPanel/UserGroups'));

const UserProfile = (props) => {

    const { match: { params } } = props;
    const { userID } = params;

    // state
    const [userSelectedPage, setUserSelectedPage] = useState('follower');

    const handlePageChange = useCallback((page) => {
        setUserSelectedPage(page);
    }, [])



    const userPage = () => {
        switch (userSelectedPage) {
            case 'follower':
                return (
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserFollowFollowing
                            type='follower'
                            visitorId={userID}
                        />
                    </Suspense>
                )
            case 'following':
                return (
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserFollowFollowing
                            type='following'
                            visitorId={userID}
                        />
                    </Suspense>

                )
            case 'group':
                return (
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserGroups
                            userId={userID}
                        />
                    </Suspense>

                )
            default: return null;
        }
    }


    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-10 mx-auto">
                        <Suspense fallback={<div>Loading...</div>}>
                            <UserBanner
                                userID={userID}
                                visitorPageType={userSelectedPage}
                            />
                        </Suspense>
                        <div className="row">
                            <div className="col-md-3">
                                <UserPanel
                                    userID={userID}
                                    selectPage={handlePageChange}
                                    userSelectedPage={userSelectedPage}
                                />
                            </div>
                            <div className="col-md-9">
                                {userPage()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};

export default withRouter(withAuth({ Component: UserProfile, name: 'userProfile' }));
