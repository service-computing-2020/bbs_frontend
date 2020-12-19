import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Card, Avatar, Image, Drawer, Button, Form, message } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, LikeOutlined, LikeTwoTone } from '@ant-design/icons';
import CommentList from '../components/commentList'
import Post from '../models/post'
import User from '../models/user'
import { Input } from 'antd';
import { Spin, Space } from 'antd';
import HttpService from '../services/http';
const { TextArea } = Input;


const { Meta } = Card;

const subscribeStyle = {
  'position': 'absolute',
  'font-size': '5px',
  'color': 'gray',
  'top': '10px',
  'right': '10px'
}

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

let commentStyle = {
  position: "fixed",
  bottom: "5px"
}


export default function PostCard (props) {
  const [post, setPost] = useState(new Post(props.post))
  const [visible, setVisible] = useState(false);
  const [srcs, SetSrcs] = useState([])
  const [hasImage, setHasImage] = useState(true)
  const [cardStyle, setCardStyle] = useState({
    width: "700px",
    height: "300px"
  })
  const [isLoading, SetIsLoading] = useState(true)
  const [isAvatarLoading, setIsAvatarLoading] = useState(true)
  const [isCommentLoading, setIsCommentLoading] = useState(true)
  const [finished, setFinished] = useState(0)
  const [input, setInput] = useState('')
  const [avatarSrc, setAvatarSrc] = useState({ source: '' })
  const [comments, setComments] = useState([])
  const [isLike, setIsLike] = useState(post.is_like)
  const [isLoadingLike, setIsLoadingLike] = useState(true)

  const onFinish = async (val) => {
    console.log(val)
    let form = new FormData()
    form.append("content", val.comment)
    let response = await HttpService.post(`/forums/${post.forum_id}/posts/${post.post_id}/comments`, form).catch((e) => {
      console.log(e)
    })
    if (response != undefined) {
      message.success("评论成功");
    } else {
      message.error("评论失败")
    }
  }
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
          console.log("load file")
          await HttpService.get(`/forums/${forum_id}/posts/${post.post_id}/files/${post.files[i].filename}`, { responseType: 'arraybuffer' }).then((response) => {
            const base64 = btoa(new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
            );
            SetSrcs(srcs => [...srcs, { source: 'data:;base64,' + base64 }]);
            setFinished(finished + 1)
            if (i == post.files.length - 1) {
            }
          }).catch((e) => { console.log(e); SetIsLoading(false) })
        }
        // while (finished >= post.files.length - 1) {
        // }
        SetIsLoading(false);
      }
    }

    const retrieveAvatar = async () => {
      const user_id = post.user_id
      if (user_id != undefined && isAvatarLoading) {
        await HttpService.get(`/users/${user_id}/avatar`, { responseType: 'arraybuffer' }).then((response) => {
          const base64 = btoa(new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
          );
          setAvatarSrc({ source: 'data:;base64,' + base64 })
          setIsAvatarLoading(false)
        }).catch((e) => {
          message.error("获取头像失败")
          setIsAvatarLoading(false)
        })
      }
    }

    const retrieveComment = async () => {
      const forum_id = post.forum_id;
      const post_id = post.post_id;
      if (forum_id != undefined && post_id != undefined && isCommentLoading) {
        HttpService.get(`/forums/${forum_id}/posts/${post_id}/comments`).then((response) => {
          setComments(response.data.data)
          setIsCommentLoading(false)
        }).catch((e) => {
          message.error("获取评论失败")
        })
      }
    }
    retrieveCover()
    retrieveAvatar()
    retrieveComment()
  }, [isLoading, isAvatarLoading, isCommentLoading])
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const showComment = () => {
    showDrawer();
  }

  const like = async () => {
    const url = `/forums/${post.forum_id}/posts/${post.post_id}/likes`
    let res = await HttpService.post(url).then((res) => {
      message.success("点赞成功")
    }).catch((e) => {
      message.warning("您已经点赞过啦")
      return;
    });
  }


  if (isLoading || isAvatarLoading || isCommentLoading) {
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
              isLike ? <LikeTwoTone key="点赞" onClick={like} /> : <LikeOutlined key="点赞" onClick={like} />,
            ]}
          >
            <Meta
              avatar={<Avatar src={avatarSrc.source} />}
              title={`${post.username}      ${post.title}`}
              description={post.content}
            />
            <div style={subscribeStyle}>
              {post.create_at.slice(0, 10)} <br />
            点赞数量: {post.like} <br />
            </div>
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
          <CommentList data={comments} />

          <div style={commentStyle}>
            <Form name="input" onFinish={(val) => onFinish(val)}>
              <Form.Item name="comment" label="comment">
                <Input.TextArea placeholder="输入您的评论" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交评论
        </Button>
              </Form.Item>
            </Form>
          </div>
        </Drawer>
      </>
    )
  }

}
