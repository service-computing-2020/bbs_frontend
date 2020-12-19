import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Mentions, Button, message } from 'antd';
import debounce from 'lodash/debounce';
import HttpService from '../services/http';

const { Option } = Mentions;
const mentionStyle = {
  display: 'flex',
  alignItems: 'center'

}
export default class AsyncMention extends React.Component {
  constructor() {
    super();

    this.loadGithubUsers = debounce(this.loadGithubUsers, 800);
  }

  state = {
    search: '',
    loading: false,
    users: [],
  };

  onSearch = search => {
    this.setState({ search, loading: !!search, users: [] });
    console.log('Search:', search);
    this.loadGithubUsers(search);
  };

  addUsers = async () => {
    console.log(11111)
    const { users } = this.state
    let body = {
      users: []
    }
    users.map((val, i) => {
      body.users.push(val.user_id)
    })
    const {
      forum_id
    } = this.props.data
    await HttpService.put(`/forums/${forum_id}/role`, body).then((res) => {
      message.success("添加论坛成员成功")
    }).catch((e) => {
      message.error("添加论坛成员失败")
    })
  }

  loadGithubUsers (key) {
    if (!key) {
      this.setState({
        users: [],
      });
      return;
    }

    HttpService.get(`/users?username=${key}`).then((res) => {
      const { search } = this.state;
      if (search !== key) return;
      this.setState({
        users: res.data.data,
        loading: false
      })
    })
  }

  render () {
    const { users, loading } = this.state;

    return (
      <div style={mentionStyle}>
        <Mentions style={{ width: '100%' }} loading={loading} onSearch={this.onSearch} placeholder="e.g. @bob @henry">
          {users.map(({ username }) => (
            <Option key={username} value={username} className="antd-demo-dynamic-option">
              <span>{username}</span>
            </Option>
          ))}
        </Mentions>

        <Button type='primary' onClick={this.addUsers}>确认添加</Button>
      </div>

    );
  }
}
