import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Card, Avatar, Image, Drawer, Button } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import CommentList from '../components/commentList'
import Post from '../models/post'
import User from '../models/user'
import { Input } from 'antd';
import { Spin, Space } from 'antd';
import HttpService from '../services/http';
const { TextArea } = Input;


const { Meta } = Card;

let imageStyle = {
  "margin-top": "40px"
}
let cardStyle = {
  width: "700px",
  height: "300px"
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
  const [srcs, SetSrcs] = useState([])
  const [isLoading, SetIsLoading] = useState(true)
  const [finished, setFinished] = useState(0)

  useEffect(() => {
    const retrieveCover = async () => {
      const forum_id = post.forum_id
      if (post.files.length == 0) {
        SetIsLoading(false)
      }
      if (forum_id != undefined && isLoading) {

        for (let i = 0; i < post.files.length; i++) {
          HttpService.get(`/forums/${forum_id}/posts/${post.post_id}/files/${post.files[i].filename}`).then((response) => {
            const base64 = btoa(new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
            );
            let images = []
            srcs.map((val, i) => { images.push(val) })
            images.push({ source: 'data:;base64,' + base64 })
            setSrc(images);
            setFinished(finished + 1)
            if (i == post.files.length - 1) {
              // while (finished < post.files.length) {

              // }
              SetIsLoading(false);
            }
          }).catch((e) => { console.log(e) })
        }

      }
    }
    retrieveCover()
  }, [isLoading])
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

  if (isLoading) {
    return <Spin size="large" />
  }
  else {
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
              {
                srcs.map((val, i) => {
                  return <Image
                    width={100}
                    src={val.source}
                  />
                })
              }
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

}