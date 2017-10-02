import React from 'react'; 
import PropTypes from 'prop-types';
import TextInput from '../../common/TextInput';
import TextArea from '../../common/TextArea';


const PlanForm = ({plan, onSave, onChange, loading, errors}) => {
    return (
        <form>
            <h1>Manage plan</h1>
            <TextInput
                name="title"
                label="Title"
                value={plan.title}
                onChange={onChange}
                placeholder="Title"
                error={errors.title}
                />
                <TextArea
                name="description"
                label="Description"
                value={plan.description}
                placeholder="Description"
                onChange={onChange}
                error={errors.title}
                />

                <input
                    type="submit"
                    value="Save"
                    onClick={onSave}/>

        </form>
    );

};


PlanForm.propTypes = {

       plan:PropTypes.object.isRequired,
       onSave:PropTypes.func.isRequired,
       onChange:PropTypes.func.isRequired,
       loading:PropTypes.bool,
       errors:PropTypes.object

};



export default PlanForm;
