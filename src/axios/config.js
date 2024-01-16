import axios from 'axios';
//http://localhost:5000
const axiosFecht = axios.create({
    baseURL: 'http://localhost:5000'
});

export default axiosFecht;