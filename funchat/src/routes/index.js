import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Logout = lazy(() => import('../pages/Logout'));
const ChatRoom = lazy(() => import('../pages/ChatRoom'));
const UserProfile = lazy(() => import('../pages/userProfile'));
const GroupCall = lazy(() => import('../pages/GroupCall'));

const Routes = () => {

    return (
        <BrowserRouter>
            <Header />
            <div className="app_body">
                <Switch>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Route path='/' exact component={Login} />
                        <Route path='/home' exact component={Home} />
                        <Route path='/logout' exact component={Logout} />
                        <Route path='/group/:groupID' exact component={ChatRoom} />
                        <Route path='/user/:userID' exact component={UserProfile} />
                        <Route path="/group/:groupID/call" exact component={GroupCall} />
                    </Suspense>
                </Switch>
            </div>
            <Footer />
        </BrowserRouter>
    )

};

export default Routes;
