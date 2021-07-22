import axios from 'axios';


export const userAxios = axios.create({
    baseURL: 'http://localhost:5000/api/v1/user',
    withCredentials: true
});

export const roomAxios = axios.create({
    baseURL: 'http://localhost:5000/api/v1/room',
    withCredentials: true
})
