export default class User {
  user_id;
  username;
  email;
  password;
  is_admin;
  avatar;
  create_at;
  posts;

  constructor(data) {
    Object.assign(this, data)
  }
}