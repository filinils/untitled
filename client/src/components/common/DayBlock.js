import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from './SelectInput';


const DayBlock = ({name, label, onChange, placeholder, value, error, options, defaultOption}) => {


    return (
        <div className="component-dayblock">
        <SelectInput
        name={name}
        value={name}
        label={label}
        onChange={onChange}
        defaultOption={defaultOption}
        options={options}

        />
        </div>

    );

};


DayBlock.propTypes = {

    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    options:PropTypes.array,
    defaultOption:PropTypes.object


};



export default DayBlock;
