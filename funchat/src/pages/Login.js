import React, { Fragment } from 'react';
import { redirectURL } from '../config';
import '../css/form.css';


const Login = () => {

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        <div className="form_container">
                            <div className="form_heading">Welcome to <span className="text-highlight">FunChat</span></div>
                            <a href={`${redirectURL.google}`}>
                                <button className="form_google_btn"><img src={'/assert/icons/google.png'} loading="lazy" className="form_icon" alt="Google"></img><span className="text">Sigin with Google</span></button>
                            </a>
                            <a href={`${redirectURL.github}`}>
                                <button className="form_github_btn"><img src={'/assert/icons/github.png'} loading="lazy" className="form_icon" alt="Github"></img><span className="text">Sigin with Github</span></button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

};

export default Login;
