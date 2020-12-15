export default class Hole {
  content;
  create_at;
  forum_id;
  hole_id;
  title;
  user_id;
  like;

  constructor(data) {
    Object.assign(this, data)
  }


}