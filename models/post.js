export default class Post {
  post_id;
  forum_id;
  user_id;
  title;
  content;
  create_at;
  like;
  files;
  username;
  is_like
  constructor(data) {
    Object.assign(this, data)
    if (this.files == null) {
      this.files = []
    }
  }
}
