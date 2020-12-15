import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Skeleton, Switch, Card, Avatar } from 'antd';
import { SelectOutlined, StarOutlined } from '@ant-design/icons';
import Forum from '../models/forum'
import HttpService from '../services/http';
import Response from '../services/response';
import { useRouter } from 'next/router';
const { Meta } = Card;

export default function ForumCard (props) {
  const [loading, setLoading] = useState(false)
  const [forum, setForum] = useState(new Forum(props.forum))
  const [isStar, setIsStar] = useState(forum.is_star)
  const [isError, setIsError] = useState(false)
  const [starNum, setStarNum] = useState(forum.star_num)
  const router = useRouter()

  const navigateToPost = () => {
    router.push(`/forums/${forum.forum_id}`)
  }

  const subscribeOnForum = async () => {

    let postfix = "subscribe"
    if (props.isStar) {
      postfix = "unsubscribe"
    }
    const url = `/forums/${forum.forum_id}/${postfix}`
    let res = await HttpService.post(url).catch((e) => {
      console.log("is error")
      setIsError(true)
      return;
    });
    let response = new Response(res)
    if (response.isOK()) {
      console.log("is star")
      setIsStar(!isStar);
    }
  }


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
            <Avatar src={forum.cover} />
          }

          title={forum.forum_name}
          description={forum.description}
        />
        <div>
          {isStar && <StarOutlined />}
          订阅人数: {starNum} <br />
        </div>
      </Skeleton>
    </Card>
  )
}