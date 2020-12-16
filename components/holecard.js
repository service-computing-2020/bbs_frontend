import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Skeleton, Switch, Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import Hole from '../models/hole';

const { Meta } = Card

const subscribeStyle = {
  'position': 'absolute',
  'font-size': '5px',
  'color': 'gray',
  'top': '10px',
  'right': '10px'
}

export default function HoleCard (props) {

  const [hole, setHole] = useState(new Hole(props.hole))
  return (
    <Card style={{ width: 600 }}>
      <Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title={hole.title}
        description={hole.content}
      />
      <div style={subscribeStyle}>
        {hole.create_at.slice(0, 10)} <br />
      </div>
    </Card>
  )
}