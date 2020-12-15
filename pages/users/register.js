import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/Login.module.css'
import 'antd/dist/antd.css';
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Select, Checkbox, Alert } from 'antd';
import { useRouter } from 'next/router';
import HttpService from '../../services/http'
import Response from '../../services/response'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};



export default function login () {

  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false)
  const [status, setStatus] = useState("")
  const [message, setMessage] = useState("")
  const onFinish = async (values) => {
    console.log('Success:', values);
    const body = {
      username: values.username,
      password: values.password,
      email: values.email
    }
    const ret = await HttpService.post('users', body)
    const res = new Response(ret)
    if (res.isOK()) {
      setStatus("success")
      setMessage("注册成功，即将跳转到登录页面")
      setShowMessage(true)
      router.push('/users/login')
    } else {
      setMessage(`注册失败，${res.msg}`)
      setShowMessage(true)
      setStatus("error")
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.loginBox}>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '用户名不能为空!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            {
              required: true,
              message: '邮箱不能为空!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            注册
        </Button>
        </Form.Item>
      </Form>
      {showMessage && <Alert message={message} type={status} showIcon />}
    </div>
  );
}