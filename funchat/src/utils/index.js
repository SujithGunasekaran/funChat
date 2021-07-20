
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

