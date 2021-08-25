import React, { Fragment } from 'react';
import UserVideoItem from './UserVideoItem';

const UserVideos = (props) => {

    // props
    const { peers } = props;

    return (
        <Fragment>
            {
                peers.map((info, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="col-md-4">
                                <UserVideoItem
                                    info={info}
                                />
                            </div>
                        </Fragment>
                    );
                })
            }
        </Fragment>
    );
}


export default UserVideos;
