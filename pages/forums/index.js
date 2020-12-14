import React, { useState, useEffect } from 'react';
import HttpService from '../../services/http'
import styles from '../../styles/Forum.module.css'
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import Forums from '../../components/forums'
import {
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Response from '../../services/response';
import User from '../../models/user';
import { getAvatarURL } from '../../services/file';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function forums () {
  const [collapsed, setCollapsed] = useState(false)
  const [avatarSize, setAvatarSize] = useState(64)
  const [userInfoStyle, setUserInfoStyle] = useState({ height: '200px', position: 'relative' })
  const [forums, setForums] = useState([])
  const [userDetail, setUserDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true)
  const [displayForums, setDisplayForums] = useState([])
  const [isSwitching, setIsSwitching] = useState(false)

  useEffect(() => {
    const retrieveData = async () => {
      if (isSwitching) {
        setIsSwitching(false)
        return;
      }
      if (isLoading) {
        let res = await HttpService.get("/forums")
        let response = new Response(res)
        console.log(response)
        const ud = response.data.user_detail
        const fs = response.data.forums
        setUserDetail(new User(ud))
        setForums(fs)
        setDisplayForums(fs)
        setIsLoading(false);
      }
    }
    retrieveData()
  }, [isLoading, isSwitching])

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

  const onSwitch = (id) => {
    if (id == '1') {
      // 全部forum
      setDisplayForums(forums)
    } else if (id == '2') {
      // 用户订阅的所有公共论坛
      let public_forums = []
      if (userDetail.star_list != null) {
        forums.map((val, i) => {
          if (userDetail.star_list.indexOf(val.forum_id) != -1) {
            public_forums.push(val)
          }
        })
      }

      setDisplayForums(public_forums)
    } else if (id == '3') {
      // 用户订阅的所有私有论坛
      let private_forums = []
      if (userDetail.participate_list != null) {
        forums.map((val, i) => {
          if (userDetail.participate_list.indexOf(val.forum_id) != -1) {
            private_forums.push(val)
          }
        })
      }

      setDisplayForums(private_forums)
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
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={(item) => { onSwitch(item.key); setIsSwitching(true) }}>
          <div style={userInfoStyle}>
            <Avatar className={styles.avatar} size={avatarSize} src={getAvatarURL(userDetail.user_id)} />
            {!collapsed && <div className={styles.username}>{userDetail.username}</div>}
            {!collapsed && <div className={styles.email}>{userDetail.email}</div>}
            {!collapsed && <div className={styles.create_at}>{userDetail.create_at}</div>}
          </div>
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            浏览
            </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="我的订阅">
            <Menu.Item key="2">公共</Menu.Item>
            <Menu.Item key="3">私有</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Forums forums={displayForums} />
        </Content>
      </Layout>
    </Layout>
  );
}