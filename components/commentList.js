import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Comment, Tooltip, List } from 'antd';
import moment from 'moment';

export default function CommentList (props) {
  const [data, setData] = useState(props.data)
  return (
    <List
      className="comment-list"
      header={`${data.length} replies`}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={item => (
        <li>
          <Comment
            author={item.username}
            avatar={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
            content={item.content}
            datetime={item.create_at}
          />
        </li>
      )}
    />
  )
}
