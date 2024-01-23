import axios from 'axios';
//http://localhost:5000
const axiosFecht = axios.create({
    baseURL: 'https://api-cimol.vercel.app/'
});

export default axiosFecht;