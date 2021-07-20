import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';


const HeadTags = (props) => {

    const { title, keyword, description } = props;

    return (
        <div>
            <Helmet >
                <title>FunChat | {title}</title>
                <meta name="description" content={description} />
                <meta name="keyword" content={keyword.join(', ')} />
            </Helmet>
        </div>

    )

};


HeadTags.propTypes = {
    title: PropTypes.string,
    keyword: PropTypes.array,
    description: PropTypes.string
};

HeadTags.defaultProps = {
    title: '',
    keyword: [],
    description: ''
}


export default memo(HeadTags);
