import React, { useState, useEffect } from 'react';
import HttpService from '../../services/http'
import styles from '../../styles/Forum.module.css'
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, message, Avatar, Button, Upload, Tooltip, Drawer, Form, Row, Col, Input, Checkbox } from 'antd';
import Forums from '../../components/forums'
import {
  PieChartOutlined,
  UserOutlined,
  UploadOutlined,
  PlusOutlined
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
  const [allForumsShow, setAllForumsShow] = useState(true)
  const [starForumsShow, setStarForumsShow] = useState(false)
  const [participateForumsShow, setParticipateForumsShow] = useState(false)
  const [visible, setVisible] = useState(false)

  let buttonStyle = {
    position: 'fixed',
    right: '50px',
    bottom: "50px"
  }
  const onClose = () => {

    setVisible(false)
  };
  const onFinish = async (value) => {
    let body = {
      forum_name: value.title,
      is_public: value.is_public,
      description: value.description
    }
    console.log(body)

    let response = await HttpService.post(`/forums`, body).catch((e) => { console.log(e) })
    if (response != undefined) {
      message.success("创建论坛成功")
    } else {
      message.error("创建论坛失败")
    }
  }

  const showDrawer = () => {
    setVisible(true)
  };


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
  }, [isLoading])

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



  const props = {
    name: 'avatar',
    action: `http://localhost:5000/api/users/${userDetail.user_id}/avatar`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    onChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const switchForums = (id) => {
    setAllForumsShow(false)
    setParticipateForumsShow(false)
    setStarForumsShow(false)
    if (id == '1') {
      setAllForumsShow(true)
    } else if (id == '2') {
      setStarForumsShow(true)
    } else if (id == '3') {
      setParticipateForumsShow(true)
    }
  }
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className={styles.logo}>

          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={(item) => { switchForums(item.key) }}>
            <div style={userInfoStyle}>
              <Avatar className={styles.avatar} size={avatarSize} src={src.source} />
              {!collapsed && <div className={styles.username}>{userDetail.username}</div>}
              {!collapsed && <div className={styles.email}>{userDetail.email}</div>}
              {!collapsed && <div className={styles.create_at}>{userDetail.create_at}</div>}

            </div>
            <Upload {...props}>
              {!collapsed && <Button icon={<UploadOutlined />}>上传头像</Button>}
            </Upload>
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
            {allForumsShow && <Forums forums={forums} />}
            {starForumsShow && <Forums forums={starForums} />}
            {participateForumsShow && <Forums forums={participateForums} />}
            <div style={buttonStyle}>
              <Tooltip title={`创建论坛`}>
                <Button type="primary" shape="circle" size={'large'} onClick={showDrawer} icon={<PlusOutlined />} />
              </Tooltip>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Drawer
        title={`创建论坛`}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <Form layout="vertical" hideRequiredMark name="form" onFinish={(value) => onFinish(value)}>
          <Row gutter={16}>
            <Form.Item
              name="title"
              label="title"
              rules={[{ required: true, message: '请输入论坛的标题' }]}
            >
              <Input placeholder="输入论坛的标题" />
            </Form.Item>
          </Row>
          <Form.Item name="is_public" valuePropName="checked">
            <Checkbox>是否公开</Checkbox>
          </Form.Item>
          <Row gutter={16}>
            <Form.Item
              name="content"
              label="content"
              rules={[
                {
                  required: true,
                  message: '请输入论坛的简介',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="输入论坛的简介" />
            </Form.Item>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}