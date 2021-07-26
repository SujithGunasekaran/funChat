import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const CircularLoading = (props) => {

    const { text } = props;

    return (
        <div className="circular_loading">
            <CircularProgress className="color" />
            <div className="text">{text}</div>
        </div>
    )

}

CircularLoading.propTypes = {
    text: PropTypes.string
}

CircularLoading.defaultProps = {
    text: ''
}


export default CircularLoading
