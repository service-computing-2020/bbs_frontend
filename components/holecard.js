import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Skeleton, Switch, Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import Hole from '../models/hole';

const { Meta } = Card


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
    </Card>
  )
}