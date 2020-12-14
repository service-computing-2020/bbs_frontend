import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import ForumCard from './forumcard'
const divStyle = {
  display: 'flex',
  alignItems: 'center'
}
export default function Forums (props) {
  const [forums, setForums] = useState(props.forums)
  return (
    forums.map((forum, i) => {
      // 一行放四个
      console.log(forum)
      if (i % 4 == 0) {
        let num = forums.length - i
        if (num == 1) {
          return <ForumCard forum={forum} />
        } else if (num == 2) {
          return <div style={divStyle}><ForumCard forum={forums[i]} /><ForumCard forum={forums[i + 1]} /></div>
        } else if (num == 3) {
          return <div style={divStyle}><ForumCard forum={forums[i]} /><ForumCard forum={forums[i + 1]} /><ForumCard forum={forums[i + 2]} /></div>
        } else if (num >= 4) {
          return <div style={divStyle}><ForumCard forum={forums[i]} /><ForumCard forum={forums[i + 1]} /><ForumCard forum={forums[i + 2]} /><ForumCard forum={forums[i + 3]} /></div>
        }
      }
    })
  )
}