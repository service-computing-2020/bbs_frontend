import React, { useState, useEffect } from 'react';
import HttpService from '../../services/http'
import styles from '../../styles/Forum.module.css'
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Avatar, Button } from 'antd';
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
  const [starForums, setStarForums] = useState([])
  const [participateForums, setParticipateForums] = useState([])
  const [src, setSrc] = useState({ source: '' })

  const [key, setKey] = useState('1')

  useEffect(() => {
    const retrieveData = async () => {

      if (isLoading) {
        let res = await HttpService.get("/forums")
        let response = new Response(res)
        console.log(response)
        const ud = response.data.user_detail
        const fs = response.data.forums
        setUserDetail(new User(ud))
        let stars = []
        let participate = []
        if (ud.star_list != null) {
          for (let i = 0; i < fs.length; i++) {
            if (ud.star_list.indexOf(fs[i].forum_id) != -1) {
              fs[i].is_star = true
              stars.push(fs[i]);
            }
          }
        }
        if (ud.participate_list != null) {
          for (let i = 0; i < fs.length; i++) {
            if (ud.participate_list.indexOf(fs[i].forum_id) != -1) {
              fs[i].is_star = true;
              participate.push(fs[i])
            }
          }
        }

        setForums(fs)
        setParticipateForums(participate)
        setStarForums(stars)

        await HttpService.get(getAvatarURL(ud.user_id), { responseType: 'arraybuffer' }).then(response => {
          const base64 = btoa(new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
          );
          setSrc({ source: 'data:;base64,' + base64 });
          setIsLoading(false);
        })
      }
    }
    retrieveData()
  }, [isLoading, key])

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

  const switchForums = (id) => {
    if (id == '1') {
      console.log(forums)
      return (<Forums forums={forums} />)
    } else if (id == '2') {
      console.log(starForums)
      return (<Forums forums={starForums} />)
    } else if (id == '3') {
      console.log(participateForums)
      return (<Forums forums={participateForums} />)
    }
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className={styles.logo}>

        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={(item) => { setKey(item.key) }}>
          <div style={userInfoStyle}>
            <Avatar className={styles.avatar} size={avatarSize} src={src.source} />
            {!collapsed && <div className={styles.username}>{userDetail.username}</div>}
            {!collapsed && <div className={styles.email}>{userDetail.email}</div>}
            {!collapsed && <div className={styles.create_at}>{userDetail.create_at}</div>}
            <Button type="primary">修改头像</Button>
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
          {switchForums(key)}
        </Content>
      </Layout>
    </Layout>
  );
}