import React from 'react';
import PropTypes from 'prop-types';



const SelectInput = ({name,label, onChange, defaultOption, value, error,options}) => {


    return (
<div className="component-select">
        <select
        type="text"
        name={name}
        className="module-input"
        value={value}
        onChange={onChange}
        accessKey={label}
        >
        {options.filter((option)=>{
        return option.value === defaultOption.id;

        }).map((option)=>{
            return <option key={option.value}  value={option.value}>{option.text}</option>;
        })}
        {options.map((option)=>{
            return <option key={option.value} value={option.value}>{option.text}</option>;
        })}
        </select>
        {error && <div className="module-validation module-validation-danger">{error}</div>}
        </div>

    );

};


SelectInput.propTypes = {

       name:PropTypes.string.isRequired,
       label:PropTypes.string.isRequired,
       onChange:PropTypes.func.isRequired,
       value:PropTypes.string,
       error:PropTypes.string,
       defaultOption:PropTypes.object,
       options:PropTypes.array,
       dayId:PropTypes.string



};

export default SelectInput;
