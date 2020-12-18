import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Breadcrumb, Avatar, Spin, Tooltip, Button, Drawer, Form, Row, Col, Input, Select, DatePicker, Modal, Upload } from 'antd';
import {
  PieChartOutlined,
  UserOutlined,
  SearchOutlined,
  UploadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { message, Space } from 'antd';
import AsyncMention from '../../components/mention'
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
import { useForm } from 'antd/lib/form/Form';
import Axios from 'axios';

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const addMemberStyle = {
  position: "absolute",
  left: "20%",
}

const bar = {
  position: 'relative',
  top: '5%',
  width: '60%',
  left: "20%",
  color: 'white',
  display: 'flex'
}

export default function singleForum (props) {
  const [collapsed, setCollapsed] = useState(false)
  const [avatarSize, setAvatarSize] = useState(64)
  const [userInfoStyle, setUserInfoStyle] = useState({ height: '200px', position: 'relative' })
  const [posts, setPosts] = useState([]);
  const [userDetail, setUserDetail] = useState(new User())
  const [forum, setForum] = useState(new Forum())
  const [isLoading, setIsLoading] = useState(true)
  const [src, setSrc] = useState({ source: '' })
  const [isHolesLoading, setIsHolesLoading] = useState(true)
  const [isPostsLoading, SetIsPostsLoading] = useState(true)
  const [isForumLoading, SetIsForumLoading] = useState(true)
  const [isPostShow, setIsPostShow] = useState(true)
  const [isHoleShow, setIsHoleShow] = useState(false)
  const [holes, setHoles] = useState([])
  const [mode, setMode] = useState('公开帖子')
  const [visible, setVisible] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState(
    [])


  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1)
      n -= 1 // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime })
  }



  const handleCancel = () => { setPreviewVisible(false); }

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  };

  const handleChange = ({ fileList }) => { setFileList(fileList) };
  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {

    setVisible(false)
  };


  const onFinish = async (value) => {
    console.log(value)
    console.log(fileList)

    if (mode == '公开帖子') {
      let form = new FormData();
      form.append("title", value.title)
      form.append("content", value.content)

      for (let i = 0; i < fileList.length; i++) {
        const file = dataURLtoFile(fileList[i].thumbUrl, fileList[i].name)
        console.log(file)
        form.append("files[]", file, file.name)
      }
      const response = await Axios({
        method: 'post',
        url: `http://localhost:5000/api/forums/${forum.forum_id}/posts`,
        data: form,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response != undefined) {
        message.success("发布公开帖子成功")
      } else {
        message.error("发布公开帖子失败")
      }

    } else {
      // 发布树洞
      let form = new FormData();
      form.append("title", value.title)
      form.append("content", value.content)
      let response = await HttpService.post(`/forums/${forum.forum_id}/holes`, form).catch((e) => { message.error('发布树洞失败') })
      if (response != undefined) {
        message.success('发布树洞成功')
      }
    }
  }



  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  let buttonStyle = {
    position: 'fixed',
    right: '50px',
    bottom: "50px"
  }

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
          if (response.data.posts == null) {
            setPosts([])
            setUserDetail(response.data.user)
          } else {
            let posts = response.data.posts
            let user = response.data.user
            let likeList = user.like_list
            posts.map((val, i) => {
              if (likeList.includes(val.post_id)) {
                val.is_like = true
              }
            })
            setPosts(posts)
            setUserDetail(user)
          }
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
          console.log("forum; ")
          console.log(response)
          setForum(response.data.forums[0])
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
          setIsLoading(false)
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
      <Spin size={'large'} />
    )
  }

  const switchBrowser = (id) => {
    setIsHoleShow(false)
    setIsPostShow(false)
    if (id == '1') {
      setMode('公开帖子')
      setIsPostShow(true)
    } else if (id == '2') {
      setIsHoleShow(true)
      setMode('树洞')
    }
  }

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div>
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={(item) => { switchBrowser(item.key) }}>
            <div style={userInfoStyle}>
              <Avatar className={styles.avatar} size={avatarSize} src={src.source} />
              {!collapsed && <div className={styles.username}>{forum.forum_name}</div>}
              {!collapsed && <div className={styles.email}>{forum.description}</div>}
              {!collapsed && <div className={styles.create_at}>{forum.create_at}</div>}
            </div>
            <Upload
              name='cover'
              action={`http://localhost:5000/api/forums/${forum.forum_id}/cover`}
              headers={
                {
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                }
              }
              onChange={
                (info) => {
                  if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                  }
                  if (info.file.status === 'done') {
                    message.success(`${info.file.name} 封面上传成功`);
                  } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 封面上传失败.`);
                  }
                }
              }
            >
              {!collapsed && <Button icon={<UploadOutlined />}>上传论坛封面</Button>}
            </Upload>
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              广场
            </Menu.Item>
            <Menu.Item key="2" icon={<PieChartOutlined />}>
              树洞
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <div style={bar}>
              <div>输入您想添加的成员</div>
              <div style={addMemberStyle}>
                <AsyncMention data={forum} />
              </div>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            {isPostShow && <Posts posts={posts} />}
            {isHoleShow && <Holes holes={holes} />}
            <div style={buttonStyle}>
              <Tooltip title={`发布${mode}`}>
                <Button type="primary" shape="circle" size={'large'} onClick={showDrawer} icon={<PlusOutlined />} />
              </Tooltip>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Drawer
        title={`发布${mode}`}
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
              rules={[{ required: true, message: '请输入帖子的标题' }]}

            >
              <Input placeholder="输入帖子的标题" />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item
              name="content"
              label="content"
              rules={[
                {
                  required: true,
                  message: '请输入帖子的内容',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="输入帖子的内容" />
            </Form.Item>
          </Row>
          {
            (mode == '公开帖子')
            &&
            <div>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          }
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}