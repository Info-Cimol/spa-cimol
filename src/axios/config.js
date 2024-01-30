import axios from 'axios';
/*http://localhost:5000  https://api-cimol.vercel.app/*/

const axiosFecht = axios.create({
    baseURL: 'https://api-cimol.vercel.app'
});

export default axiosFecht;