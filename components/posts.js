import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import PostCard from './postcard'

export default function Posts (props) {
  const [posts, setPosts] = useState(props.posts)

  return (
    posts.map((val, i) => {
      console.log(val)
      return <div><PostCard post={val} /></div>
    })
  )
}
