import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Skeleton, Switch, Card, Avatar, message } from 'antd';
import { SelectOutlined, StarOutlined } from '@ant-design/icons';
import Forum from '../models/forum'
import HttpService from '../services/http';
import Response from '../services/response';
import { useRouter } from 'next/router';
const { Meta } = Card;
import { Spin, Space } from 'antd';

export default function ForumCard (props) {
  const [loading, setLoading] = useState(false)
  const [forum, setForum] = useState(new Forum(props.forum))
  const [isStar, setIsStar] = useState(forum.is_star)
  const [isError, setIsError] = useState(false)
  const [starNum, setStarNum] = useState(forum.subscribe_num)
  const [src, setSrc] = useState({ source: '' })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const subscribeStyle = {
    'position': 'absolute',
    'font-size': '5px',
    'color': 'gray',
    'top': '10px',
    'right': '10px'
  }

  useEffect(() => {
    const retrieveCover = async () => {
      if (isLoading) {
        HttpService.get(`/forums/${forum.forum_id}/cover`, { responseType: 'arraybuffer' }).then(response => {
          const base64 = btoa(new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
          );
          setSrc({ source: 'data:;base64,' + base64 });
          setIsLoading(false);
        }).catch((e) => {
          console.log(e)
        })
      }
    }
    retrieveCover()
  }, [isLoading])
  const navigateToPost = () => {
    router.push(`/forums/${forum.forum_id}`)
  }

  const subscribeOnForum = async () => {

    let postfix = "role"
    const url = `/forums/${forum.forum_id}/${postfix}`
    let res = await HttpService.post(url).then((res) => {
      message.success("订阅成功")
    }).catch((e) => {
      message.warning("您已经订阅过啦")
      return;
    });
  }

  if (isLoading) {
    return (<Spin size={"large"} />)
  } else {

    return (
      <Card
        style={{ width: 300, marginTop: 16 }}
        actions={[
          <SelectOutlined key="进入" onClick={navigateToPost} />,
          <StarOutlined key="订阅" onClick={subscribeOnForum} />,
        ]}
      >
        <Skeleton loading={loading} avatar active>
          <Meta
            avatar={
              <Avatar src={src.source} />
            }

            title={forum.forum_name}
            description={forum.description}
          />
          <div style={subscribeStyle}>
            {forum.create_at.slice(0, 10)} <br />
            订阅人数: {starNum} <br />
            帖子数量: {forum.post_num}
          </div>
        </Skeleton>
      </Card>
    )
  }

}