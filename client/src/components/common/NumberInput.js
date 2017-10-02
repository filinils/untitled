import React from 'react';
import PropTypes from 'prop-types';



const NumberInput = ({name,label, onChange, placeholder, value, error}) => {


    return (
<div className="module-input">
        <input
        type="text"
        name={name}
        className="module-input-number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        />
        {error && <div className="module-validation module-validation-danger">{error}</div>}
        </div>

    );

};


NumberInput.propTypes = {

       name:PropTypes.string.isRequired,
       label:PropTypes.string.isRequired,
       onChange:PropTypes.func.isRequired,
       value:PropTypes.number,
       error:PropTypes.string,
       placeholder:PropTypes.string

};



export default NumberInput;
