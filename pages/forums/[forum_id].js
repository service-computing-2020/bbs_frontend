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


export default function singleForum (props) {
  const [collapsed, setCollapsed] = useState(false)
  const [avatarSize, setAvatarSize] = useState(64)
  const [userInfoStyle, setUserInfoStyle] = useState({ height: '200px', position: 'relative' })
  const [userDetail, setUserDetail] = useState({});
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  const [refresh, setRefresh] = useState(false)
  const router = useRouter()
  useEffect(() => {
    console.log("execute")
    const retrieveData = async () => {
      const { forum_id } = router.query
      if (forum_id != undefined && isLoading) {
        HttpService.get(`/forums/${forum_id}/posts`).then((val) => {
          const response = new Response(val)
          setPosts(response.data)
          setIsLoading(false);
          setRefresh(true)
          console.log("finish")
        }).catch((e) => {
          console.log(e)
        })
      }
    }
    retrieveData()
  }, [router, isLoading])

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

  if (isLoading) {
    return (
      <p>is loading</p>
    )
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className={styles.logo}>

        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={(item) => { setKey(item.key) }}>
          <div style={userInfoStyle}>
            <Avatar className={styles.avatar} size={avatarSize} src={getAvatarURL(userDetail.user_id)} />
            {!collapsed && <div className={styles.username}>{userDetail.username}</div>}
            {!collapsed && <div className={styles.email}>{userDetail.email}</div>}
            {!collapsed && <div className={styles.create_at}>{userDetail.create_at}</div>}
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
          <Posts posts={posts} />
        </Content>
      </Layout>
    </Layout>
  );
}