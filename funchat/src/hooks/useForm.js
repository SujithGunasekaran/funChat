import { useState } from 'react';


const useForm = () => {

    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

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


    return { formData, formError, errorMessage, handleFormData, setFormError, resetForm, setErrorMessage }

};

export default useForm;
