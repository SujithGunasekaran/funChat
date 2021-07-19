import React, { Suspense, lazy, Fragment } from 'react';

const SignupForm = lazy(() => import('../components/Forms/SignupForm'));

const SignUp = () => {

    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <SignupForm />
            </Suspense>
        </Fragment>
    )

};

export default SignUp;
