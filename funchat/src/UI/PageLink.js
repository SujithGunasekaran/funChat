import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PageLink = (props) => {

    const { pathname, children } = props;

    return (
        <Link to={pathname}>
            {children}
        </Link>
    )

}

PageLink.propTypes = {
    pathname: PropTypes.string.isRequired
};

export default memo(PageLink);
