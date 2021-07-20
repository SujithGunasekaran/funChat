import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));

const Routes = () => {

    return (
        <BrowserRouter>
            <Header />
            <div className="app_body">
                <Switch>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Route path='/' exact component={Home} />
                        <Route path='/login' exact component={Login} />
                    </Suspense>
                </Switch>
            </div>
            <Footer />
        </BrowserRouter>
    )

};

export default Routes;
