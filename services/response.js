export default class Response {
  data;
  msg;
  code;
  constructor(res) {
    if (res.data == undefined) {
      this.code = res.status
    } else {
      let response = res.data
      this.data = response.data
      this.msg = response.msg
      this.code = response.code
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