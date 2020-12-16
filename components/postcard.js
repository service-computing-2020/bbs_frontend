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
let divStyle = {
  "margin-top": "60px"

}

export default function PostCard (props) {
  const [user, setUser] = useState(new User(props.user))
  const [post, setPost] = useState(new Post(props.post))
  const [visible, setVisible] = useState(false);
  const [srcs, SetSrcs] = useState([])
  const [hasImage, setHasImage] = useState(true)
  const [cardStyle, setCardStyle] = useState({
    width: "700px",
    height: "300px"
  })
  const [isLoading, SetIsLoading] = useState(true)
  const [finished, setFinished] = useState(0)

  useEffect(() => {
    const retrieveCover = async () => {
      const forum_id = post.forum_id
      if (post.files.length == 0) {
        setCardStyle(
          {
            width: "700px",
            height: "100px"
          }
        )
        setHasImage(false)
        SetIsLoading(false)
      }
      if (forum_id != undefined && isLoading) {

        for (let i = 0; i < post.files.length; i++) {
          await HttpService.get(`/forums/${forum_id}/posts/${post.post_id}/files/${post.files[i].filename}`, { responseType: 'arraybuffer' }).then((response) => {
            const base64 = btoa(new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
            );
            SetSrcs(srcs => [...srcs, { source: 'data:;base64,' + base64 }]);
            setFinished(finished + 1)
            if (i == post.files.length - 1) {
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
        <div style={divStyle}>
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
            {
              hasImage &&
              <div style={imageStyle}>
                <Image.PreviewGroup>
                  {
                    srcs.map((val, i) => {
                      console.log(val)
                      return <Image
                        width={100}
                        src={val.source}
                      />
                    })
                  }
                </Image.PreviewGroup>
              </div>
            }

          </Card>
        </div>
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