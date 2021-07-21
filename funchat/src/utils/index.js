
/**
 * prettyUserName get username as parameter and returned as camel case format 
 * eg. name g => return Name G
 * @param {username} userName 
 * @returns 
*/

export const prettyUserName = (userName) => {

    let prettyName = '';

    if (!userName) return prettyName;

    prettyName = userName.split(' ').map(username => `${username[0].toUpperCase()}${username.slice(1).toLowerCase()}`).join(' ');
    return prettyName;

}

/**
 * will return isFormValid or not ( Boolean )
 * It accepts 3 parameter fieldNames ( array of name ), formValue ( Object ), setState ( useState function )
 * If any of the given name in array not present in formValue object form is not valid retutn false and setError in callback setState
 * @param {fieldNames} fieldNames 
 * @param {formvalues} formValues 
 * @param {useState} setState 
 * @returns 
 */


export const validateForm = (fieldNames, formValues, setState) => {

    let isFormValid = true;

    fieldNames.forEach(names => {
        if (!formValues[names]) {
            isFormValid = false;
            setState(prevState => {
                return [
                    ...prevState,
                    names
                ]
            })
        }
    })

    return isFormValid;

}

