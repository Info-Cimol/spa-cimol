import axios from 'axios';

const axiosFecht = axios.create({
    baseURL: 'http://localhost:5000'
});

export default axiosFecht;