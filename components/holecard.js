import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Skeleton, Switch, Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';




export default function HoleCard (props) {

  return (
    <Card style={{ width: 600 }} loading={loading}>
      <Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title="Card title"
        description="This is the description"
      />
    </Card>
  )
}