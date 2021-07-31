import React, { Fragment, memo, useEffect, useState } from 'react';
import useUserAxios from '../../hooks/useUserAxios';
import { CalenderIcon } from '../../UI/Icons';
import { convertFullDateToLong } from '../../utils';

const UserBanner = ({ userID }) => {

    // stats
    const [userInfo, setUserInfo] = useState(null);

    // hooks
    const { getAction } = useUserAxios();

    useEffect(() => {
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getUserInfo = async () => {
        try {
            const { data, error } = await getAction(`/userID?userID=${userID}`);
            if (error) throw new Error('Error while getting userInfo');
            if (data.status === 'Success') {
                setUserInfo(data.data.userInfo);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="user_banner_container">
                {
                    userInfo &&
                    <Fragment>
                        <img src={userInfo.profile} className="user_banner_profile" alt={userInfo?.username ?? ''} loading="lazy" />
                        <div className="user_banner_sub_container">
                            <div className="user_banner_user_name">{userInfo?.username ?? ''}</div>
                            <div className="user_banner_user_description">{userInfo?.description ?? ''}</div>
                            <hr className="user_banner_hr" />
                            <div className="user_banner_info_container">
                                <div className="user_banner_info_sub_container">
                                    <CalenderIcon cssClass="user_banner_info_icon" />
                                    <div className="user_banner_info_name">Joined on {convertFullDateToLong(userInfo.joined)}</div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                }

            </div>
        </Fragment>
    )

};

export default memo(UserBanner);
