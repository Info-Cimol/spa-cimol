import axios from 'axios';
/*http://localhost:5000  https://api-cimol-production.up.railway.app/*/

const axiosFetch = axios.create({
  baseURL: 'http://localhost:21121',
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