import React, { Fragment } from 'react';


const HomeInfo = () => {

    return (
        <Fragment>
            <div className="home_left_heading">
                <span className="highlight">FunChat</span> Create Private or Public groups and have fun with friends.
            </div>
            <div className="home_left_description">Join Private Group</div>
            <form>
                <input
                    className="home_left_room_input"
                    placeholder="Group Name or Group ID"
                />
                <button className="home_left_room_join_btn">Join</button>
            </form>
        </Fragment>
    )

};

export default HomeInfo;
