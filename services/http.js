import Axios from 'axios'
import { base_url } from './file';
const HttpService = Axios.create({
  baseURL: base_url
})

HttpService.interceptors.request.use(
  function (config) {
    const value = localStorage.getItem('token')
    config.headers = {
      'Authorization': `Bearer ${value}`,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config;
  });

export default HttpService