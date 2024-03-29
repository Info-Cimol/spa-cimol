import axios from 'axios';
/*http://localhost:21121  https://api-cimol-production.up.railway.app/*/

const axiosFetch = axios.create({
  baseURL: 'https://api-cimol-production.up.railway.app/',
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