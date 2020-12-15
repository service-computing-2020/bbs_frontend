import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import {
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';

import Response from '../../services/response';
import User from '../../models/user';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import styles from '../../styles/Forum.module.css'
import { getAvatarURL } from '../../services/file';
import HttpService from '../../services/http';
import { useRouter } from 'next/router';
import Posts from '../../components/posts'
import Forum from '../../models/forum';
import Holes from '../../components/holes';


export default function singleForum (props) {
  const [collapsed, setCollapsed] = useState(false)
  const [avatarSize, setAvatarSize] = useState(64)
  const [userInfoStyle, setUserInfoStyle] = useState({ height: '200px', position: 'relative' })
  const [posts, setPosts] = useState([]);
  const [forum, setForum] = useState(new Forum())
  const [isLoading, setIsLoading] = useState(true)
  const [src, setSrc] = useState({ source: '' })
  const [isHolesLoading, setIsHolesLoading] = useState(true)
  const [isPostsLoading, SetIsPostsLoading] = useState(true)
  const [isForumLoading, SetIsForumLoading] = useState(true)
  const [isPostShow, setIsPostShow] = useState(true)
  const [isHoleShow, setIsHoleShow] = useState(false)
  const [holes, setHoles] = useState([])


  const router = useRouter()
  useEffect(() => {
    const retrieveHoles = async () => {
      const { forum_id } = router.query
      if (forum_id != undefined && isHolesLoading) {
        HttpService.get(`/forums/${forum_id}/holes`).then((val) => {
          console.log(val)
          const response = new Response(val)
          console.log(response.data)
          if (response.data == null) {
            setHoles([])
          } else {
            setHoles(response.data)
          }
          setIsHolesLoading(false)
        }).catch((e) => {
          console.log(e)
        })
      }
    }

    const retrievePosts = async () => {
      const { forum_id } = router.query
      if (forum_id != undefined && isPostsLoading) {
        HttpService.get(`/forums/${forum_id}/posts`).then((val) => {
          const response = new Response(val)
          setPosts(response.data)
          SetIsPostsLoading(false)
        }).catch((e) => {
          console.log(e)
        })
      }
    }

    const retrieveForum = async () => {
      const { forum_id } = router.query
      if (forum_id != undefined && isForumLoading) {
        HttpService.get(`/forums/${forum_id}`).then((val) => {
          const response = new Response(val)
          setForum(response.data)
          SetIsForumLoading(false)
        }).catch((e) => {
          console.log(e)
        })
      }
    }

    const retrieveCover = async () => {
      const { forum_id } = router.query
      if (forum_id != undefined && isLoading) {
        HttpService.get(`/forums/${forum_id}/cover`, { responseType: 'arraybuffer' }).then(response => {
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
    retrievePosts()
    retrieveHoles()
    retrieveForum()
    retrieveCover()
  }, [router, isLoading, isForumLoading, isPostsLoading, isHolesLoading])

  const onCollapse = () => {
    setCollapsed(!collapsed)
    if (avatarSize == 64) {
      setAvatarSize(32);
      setUserInfoStyle({ height: '80px', position: 'relative' })
    } else {
      setAvatarSize(64);
      setUserInfoStyle({ height: '200px', position: 'relative' })
    }
  }

  if (isLoading || isPostsLoading || isForumLoading || isHolesLoading) {
    return (
      <p>is loading</p>
    )
  }

  const switchBrowser = (id) => {
    setIsHoleShow(false)
    setIsPostShow(false)
    if (id == '1') {
      setIsPostShow(true)
    } else if (id == '2') {
      setIsHoleShow(true)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className={styles.logo}>

        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={(item) => { switchBrowser(item.key) }}>
          <div style={userInfoStyle}>
            <Avatar className={styles.avatar} size={avatarSize} src={src.source} />
            {!collapsed && <div className={styles.username}>{forum.forum_name}</div>}
            {!collapsed && <div className={styles.email}>{forum.description}</div>}
            {!collapsed && <div className={styles.create_at}>{forum.create_at}</div>}
          </div>
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            广场
            </Menu.Item>
          <Menu.Item key="2" icon={<PieChartOutlined />}>
            树洞
            </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          {isPostShow && <Posts posts={posts} />}
          {isHoleShow && <Holes holes={holes} />}
        </Content>
      </Layout>
    </Layout>
  );
}