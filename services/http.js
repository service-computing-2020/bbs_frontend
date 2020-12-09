import Axios from 'axios'

export default class HttpService {
  static instance = Axios.create({
    baseURL: 'http://localhost:5000/api'

  })
  constructor() {

  }
  static get (url, param) {
    return this.instance.get(url, {
      params: param
    }).catch((e) => {
      return e;
    })

  }

  static post (url, body) {
    return this.instance.post(url, body)
  }

  static put (url, body) {
    return this.instance.put(url, body)
  }
}