import axios from 'axios';
/*http://localhost:5000  https://api-cimol-f6y9c.ondigitalocean.app/*/

const axiosFetch = axios.create({
  baseURL: 'https://api-cimol-f6y9c.ondigitalocean.app/',
});

axiosFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosFetch;