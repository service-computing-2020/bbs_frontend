export default class Response {
  data;
  msg;
  code;
  constructor(res) {
    if (res.data == undefined) {
      let response = res.error
      this.data = response.data
      this.msg = response.msg
      this.code = response.code
    } else {
      let response = res.data
      this.data = response.data
      this.msg = response.msg
      this.code = response.code
    }
    if (this.data.token != undefined && this.data.token != "") {
      localStorage.setItem('token', this.data.token);
    }

  }

  isOK () {
    if (this.code >= 200 && this.code < 400) {
      return true
    } else {
      return false;
    }
  }

  getOne () {
    return this.data[0];
  }
}