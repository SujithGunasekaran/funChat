import React, { lazy, Suspense, Fragment } from 'react';

const LoginForm = lazy(() => import('../components/Forms/LoginForm'));

const Login = () => {

    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </Fragment>
    )

};

export default Login;
