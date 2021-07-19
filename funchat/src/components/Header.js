import React, { Fragment } from 'react';
import { ChatIcon } from '../UI/Icons';
import PageLink from '../UI/PageLink';
import '../css/header.css';


const Header = () => {

    return (
        <Fragment>
            <div className="header_container">
                <div className="header_intro_container">
                    <ChatIcon cssClass="header_logo_icon" />
                    <PageLink pathname={'/'}>
                        <div className="header_logo_name">FunChat</div>
                    </PageLink>
                </div>
                <div className="header_right_container">
                    <PageLink pathname={'/signup'}>
                        <div className="header_signup_name">Signup</div>
                    </PageLink>
                    <PageLink pathname={'/login'}>
                        <div className="header_login_name">Login</div>
                    </PageLink>
                </div>
            </div>
        </Fragment>
    )

};

export default Header;
