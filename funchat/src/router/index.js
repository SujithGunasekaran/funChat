import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Header = lazy(() => import('../components/Header'));
const Footer = lazy(() => import('../components/Footer'));
const Home = lazy(() => import('../pages/Home'));

const Routes = () => {

    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Header />
                <Switch>
                    <Route path='/' exact component={Home} />
                </Switch>
                <Footer />
            </Suspense>
        </BrowserRouter>
    )

};

export default Routes;
