import React, { Fragment, useEffect, useState } from 'react';
import useOnlineUserAxios from '../../hooks/useOnlineUserAxios';
import CircularLoading from '../../UI/loading/CircularLoading';


const HomeOnlineUser = () => {

    // stats
    const [userList, setUserList] = useState([]);

    // hooks
    const { getAction, loading } = useOnlineUserAxios();

    // useEffect
    useEffect(() => {

        const getOnlineUser = async () => {
            try {
                const { data, error } = await getAction('/');
                if (error) throw new Error('Error while getting online user');
                if (data && data.status === 'Success') {
                    setUserList(prevList => {
                        let userList = JSON.parse(JSON.stringify(prevList));
                        userList = data.data.userList;
                        return userList;
                    })
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        getOnlineUser()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <Fragment>
            <div className="home_left_panel_online_container">
                <div className="home_left_panel_online_heading">Online Peoples</div>
                {
                    loading && <CircularLoading />
                }
                <div className="home_left_panel_online_list_container">
                    {
                        userList.length > 0 &&
                        userList.map((userInfo, index) => (
                            <Fragment key={index}>
                                <div className="home_left_panel_info_container">
                                    <img src={userInfo.profile} className="home_left_panel_info_profile" alt={userInfo.username} loading="lazy" />
                                    <div className="home_left_panel_info_name">{userInfo.username}</div>
                                </div>
                            </Fragment>
                        ))
                    }
                </div>
            </div>
        </Fragment>
    )

}


export default HomeOnlineUser
