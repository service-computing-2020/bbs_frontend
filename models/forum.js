export default class Forum {
  forum_id;
  cover;
  create_at;
  description;
  forum_name;
  is_public;
  is_star;
  post_num;
  admin_list;

  constructor(data) {
    Object.assign(this, data)
  }
}
