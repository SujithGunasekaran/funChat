import React, { Fragment, lazy, Suspense, useState, useCallback } from 'react';
import withAuth from '../../hoc/withAuth';
import { withRouter } from 'react-router-dom';

const UserBanner = lazy(() => import('../../components/userProfile/UserBanner'));
const UserPanel = lazy(() => import('../../components/userProfile/UserPanel'));
const UserList = lazy(() => import('../../components/userProfile/UserList'));


const UserProfile = (props) => {

    const { match: { params } } = props;
    const { userID } = params;

    // state
    const [userSelectedPage, setUserSelectedPage] = useState('follower');

    const handlePageChange = useCallback((page) => {
        setUserSelectedPage(page);
    }, [])

    console.log(userSelectedPage);

    const userPage = () => {
        switch (userSelectedPage) {
            case 'follower':
                return <UserList />
            case 'following':
                return <UserList />
            case 'group':
                return <div>Group Page</div>
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
                            />
                        </Suspense>
                        <div className="row">
                            <div className="col-md-3">
                                <UserPanel
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
