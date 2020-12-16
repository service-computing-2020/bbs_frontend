# bbs_frontend

## 运行方法

### 方法1：根据源码来编译运行
前提：您的本地安装了npm和yarn

- 下载依赖：
```
yarn install
```

- 编译项目
```
npm run build
```

- 运行项目
```
npm run start
```

### 方法2：使用 docker
前提：您的机器上有docker环境

- build 镜像，大约要花费 10 分钟左右
```
docker build -t bbs_frontend .
```

- 运行，这里提供了用前台模式运行容器的方式，您可以根据需求调整命令中的参数

```
docker run -it -p 3000:3000 bbs_frontend
```


