import axios from 'axios';

const axiosFecht = axios.create({
    baseURL: 'https://api-thesis-track.vercel.app/'
});

export default axiosFecht;