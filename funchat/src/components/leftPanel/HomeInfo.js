import React, { Fragment } from 'react';
import useForm from '../../hooks/useForm';
import useRoomAxios from '../../hooks/useRoomAxios';
import ErrorMessage from '../../UI/message/ErrorMessage';
import { validateForm } from '../../utils';
import { useSelector } from 'react-redux';

const HomeInfo = (props) => {

    const { history } = props;

    // hooks
    const { formData, handleFormData, errorMessage, setErrorMessage } = useForm();
    const { postAction } = useRoomAxios();

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const joinPrivateGroup = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm(['group'], formData, setErrorMessage);
        if (isFormValid) {
            try {
                const { data, error } = await postAction(`/joinGroup?groupID=${formData.group}&groupType=private&userID=${loggedUserInfo._id}`);
                if (error) throw new Error('Error while joining room');
                if (data.status === 'Success' && data.data.groupID) {
                    history.push(`/group/${data.data.groupID}`);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }


    const showErrorMessage = () => (
        <ErrorMessage
            message={errorMessage}
            handleCloseErrorMessage={() => setErrorMessage(null)}
        />
    )


    return (
        <Fragment>
            {
                errorMessage && showErrorMessage()
            }
            <div className="home_left_heading">
                <span className="highlight">FunChat</span> Create Private or Public groups and have fun with friends.
            </div>
            <div className="home_left_description">Join Private Group</div>
            <form onSubmit={(e) => joinPrivateGroup(e)}>
                <input
                    className="home_left_room_input"
                    placeholder="Group Name or Group ID"
                    name="group"
                    value={formData?.group ?? ''}
                    onChange={handleFormData}
                />
                <button type="submit" className="home_left_room_join_btn">Join</button>
            </form>
        </Fragment>
    )

};

export default HomeInfo;
