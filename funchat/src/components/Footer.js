import React, { Fragment } from 'react';
import { GithubIcon } from '../UI/Icons';
import '../css/footer.css';

const Footer = () => {

    return (
        <Fragment>
            <div className="footer_container">
                <GithubIcon cssClass="footer_icon" />
            </div>
        </Fragment>
    )

};

export default Footer;
