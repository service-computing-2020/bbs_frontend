import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Card, Avatar, Image, Drawer, Button } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import CommentList from '../components/commentList'
import Post from '../models/post'
import User from '../models/user'
import { Input } from 'antd';
const { TextArea } = Input;


const { Meta } = Card;

let imageStyle = {
  "margin-top": "40px"
}
let cardStyle = {
  width: "700px",
  height: "100px"
}
let inputStyle = {
  position: "absolute",
  bottom: "10%",
  left: "5%",
  width: "90%"
}

let buttonStyle = {
  position: "absolute",
  bottom: "2%",
  right: "10%"
}

export default function PostCard (props) {
  const [user, setUser] = useState(new User(props.user))
  const [post, setPost] = useState(new Post(props.post))
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const showComment = () => {
    showDrawer();
  }

  const comment = () => {

  }
  return (
    <>
      <Card
        style={cardStyle}
        actions={[
          <EditOutlined key="评论" onClick={showComment} />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={post.title}
          description={post.content}
        />
        <div style={imageStyle}>
          <Image.PreviewGroup>
            <Image
              width={100}
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
            <Image
              width={100}
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
          </Image.PreviewGroup>
        </div>
      </Card>
      <Drawer
        title="全部评论"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <CommentList data={[]} />
        <TextArea style={inputStyle} rows={4} />
        <Button style={buttonStyle} type="primary" onClick={comment}>提交评论</Button>
      </Drawer>
    </>
  )
}