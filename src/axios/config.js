import axios from 'axios';

const axiosFecht = axios.create({
    baseURL: 'https://api-merenda.vercel.app'
});

export default axiosFecht;