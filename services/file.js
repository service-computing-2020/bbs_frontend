const base_url = "http://localhost:5000/api"

export function getAvatarURL (user_id) {
  return `${base_url}/users/${user_id}/avatar`
}

export function getCover (forum_id) {
  return `${base_url}/forums/${forum_id}/cover`
}