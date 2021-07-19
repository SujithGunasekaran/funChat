import React, { Fragment } from 'react';
import HeadTags from '../UI/HeadTag';

const Home = () => {

    return (
        <Fragment>
            <HeadTags
                title="Home"
                keyword={['React.js, Javascript, Chat Application, FunChat']}
                description="Welcome to FunChat."
            />
        </Fragment>
    )

};

export default Home;
