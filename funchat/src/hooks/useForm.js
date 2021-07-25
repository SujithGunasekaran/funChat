import { useState } from 'react';


const useForm = () => {

    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState([]);


    const handleFormData = (e) => {
        setFormData(prevData => {
            let formData = JSON.parse(JSON.stringify(prevData));
            formData = {
                ...formData,
                [e.target.name]: e.target.value
            }
            return formData;
        })
        if (formError.length > 0) setFormError([]);
    };

    const resetForm = () => {
        setFormData({});
    }


    return { formData, formError, handleFormData, setFormError, resetForm }

};

export default useForm;
