import axios from 'axios';
/*http://localhost:5000  https://api-cimol.vercel.app/*/

const axiosFecht = axios.create({
    baseURL: 'http://localhost:5000'
});

export default axiosFecht;