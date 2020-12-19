export default class User {
  user_id;
  username;
  email;
  password;
  is_admin;
  avatar;
  create_at;
  posts;
  participate_list;   // 该用户参加的所有私有论坛
  star_list;          // 该用户关注的所有公共论坛
  star_list;

  constructor(data) {
    Object.assign(this, data)
  }

  setUserDetail (data) {
    Object.assign(this, data)
  }
}
