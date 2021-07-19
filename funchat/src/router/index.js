import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Header = lazy(() => import('../components/Header'));
const Footer = lazy(() => import('../components/Footer'));
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));

const Routes = () => {

    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Header />
                <div className="app_body">
                    <Switch>
                        <Route path='/' exact component={Home} />
                        <Route path='/login' exact component={Login} />
                        <Route path='/signup' exact component={Signup} />
                    </Switch>
                </div>
                <Footer />
            </Suspense>
        </BrowserRouter>
    )

};

export default Routes;
