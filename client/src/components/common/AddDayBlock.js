import React from 'react';
import PropTypes from 'prop-types';



const AddDayBlock = ({onAdd, label, error}) => {


    return (
        <div className="component-dayblock"
        onClick={onAdd}
        >

        <i className="fa fa-plus-square-o fa-5x" aria-hidden="true"></i>
        </div>

    );

};


AddDayBlock.propTypes = {

    onAdd:PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    placeholder: PropTypes.string

};



export default AddDayBlock;
