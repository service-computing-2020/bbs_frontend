import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/Forum.module.css'
import 'antd/dist/antd.css';
import ForumCard from '../../components/card'
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function forums () {
  const [collapsed, setCollapsed] = useState(false)
  const [avatarSize, setAvatarSize] = useState(64)
  const [userInfoStyle, setUserInfoStyle] = useState({ height: '200px', position: 'relative' })

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
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className={styles.logo}>

        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <div style={userInfoStyle}>
            <Avatar className={styles.avatar} size={avatarSize} icon={<UserOutlined />} />
            {!collapsed && <div className={styles.username}>username</div>}
            {!collapsed && <div className={styles.email}>email</div>}
            {!collapsed && <div className={styles.create_at}>createAt</div>}
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
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            Bill is a cat.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}