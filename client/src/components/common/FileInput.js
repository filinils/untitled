import React from 'react';
import PropTypes from 'prop-types';



const FileInput = ({name,label, onChange, placeholder, value, error}) => {


    return (
<div className="module-input">
        <input
        type="file"
        name={name}
        className="module-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        />
        {error && <div className="module-validation module-validation-danger">{error}</div>}
        </div>

    );

};


FileInput.propTypes = {

       name:PropTypes.string.isRequired,
       label:PropTypes.string.isRequired,
       onChange:PropTypes.func.isRequired,
       value:PropTypes.string,
       error:PropTypes.string,
       placeholder:PropTypes.string

};



export default FileInput;
