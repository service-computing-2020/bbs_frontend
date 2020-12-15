import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/Login.module.css'
import 'antd/dist/antd.css';
import { useHistory, Route, Router } from "react-router-dom";
import { Form, Input, Button, Select, Checkbox, message, Alert } from 'antd';
import HttpService from '../../services/http'
import Response from '../../services/response'
import User from '../../models/user'
import { useRouter } from 'next/router'
import { getRouteRegex } from 'next/dist/next-server/lib/router/utils';


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
  const router = useRouter()
  let [username, setUsername] = useState("");
  let [isShow, setIsShow] = useState(false)
  let [status, setStatus] = useState("")
  let [message, setMessage] = useState("")

  useEffect(() => {
    if (username == "" && status == "") {
      setIsShow(false)
    } else {
      setIsShow(true)
    }
  }, [username, status])

  const navigateToRegister = () => {
    router.push('/users/register')
  }

  const onFinish = async (values) => {
    console.log('Success:', values);
    const body = {
      input: values.input,
      password: values.password
    }
    // 发出登录请求
    const ret = await HttpService.put('users', body)
    console.log(ret)
    const res = new Response(ret)
    console.log(res)
    if (res.isOK()) {
      // 登录成功
      setUsername(body.input)
      setStatus("success")
      console.log(res)
      localStorage.setItem('token', res.data["token"])
      setMessage(`欢迎您，${body.input}`)
      setIsShow(true)
      router.push("/forums")
    } else {
      // 登录失败
      setStatus("error")
      setMessage(`登录失败，请重试`)
      setIsShow(true)
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
          label="用户名/邮箱"
          name="input"
          rules={[
            {
              required: true,
              message: '请输入您的用户名/邮箱!',
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
            登录
        </Button>
          <Button type="link" onClick={navigateToRegister}> 还没有账号？点击注册</Button>
        </Form.Item>

      </Form>
      {isShow && <Alert message={message} type={status} showIcon />}
    </div>
  );
}
