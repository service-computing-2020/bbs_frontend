import Axios from 'axios'

const HttpService = Axios.create({
  baseURL: 'http://localhost:5000/api'
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

// export default class HttpService {
//   static instance = Axios.create({
//     baseURL: 'http://localhost:5000/api'
//   })

//   static get (url, param) {
//     return this.instance.get(url, {
//       params: param
//     }).catch((e) => {
//       return e;
//     })

//   }

//   static post (url, body) {
//     return this.instance.post(url, body).catch((e) => {
//       return e
//     })
//   }

//   static put (url, body) {
//     return this.instance.put(url, body).catch((e) => {
//       return e;
//     })
//   }
// }