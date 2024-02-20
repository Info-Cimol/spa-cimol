import axios from 'axios';
/*http://localhost:5000  https://jellyfish-app-ezt3l.ondigitalocean.app/*/
const axiosFetch = axios.create({
  baseURL: 'http://localhost:5000',
});

axiosFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosFetch;