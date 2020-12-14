import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Skeleton, Switch, Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, SelectOutlined, StarOutlined } from '@ant-design/icons';
const { Meta } = Card;

export default function ForumCard (props) {
  const [loading, setLoading] = useState(false)
  return (
    <Card
      style={{ width: 300, marginTop: 16 }}
      actions={[
        <SelectOutlined key="进入" />,
        <StarOutlined key="订阅" />,
      ]}
    >
      <Skeleton loading={loading} avatar active>
        <Meta
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title="Card title"
          description="This is the description"
        />
      </Skeleton>
    </Card>
  )
}