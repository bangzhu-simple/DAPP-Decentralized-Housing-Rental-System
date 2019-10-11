# DAPP分散式房屋租赁系统

## 一 、开发环境 概述

### 1.1  基础 技术栈

项目为混合式区块链应用，区块链选用以太坊，开发期采用 Ganache-cli；分布式存储选用 IPFS，保存房屋图片与描述信息；链下数据库采用 MongoDB，开发框架为 Truffle。
开发所选用的主要技术栈版本如下：



- mongodb: 2.6.10+
- nodejs：8.9.4
- truffle：4.1.14
- ganache-cli：6.0.3
- ipfs：0.4.13
- metamask：6.5.3



### 1.2  项目 NPM  依赖

在打包的项目代码中已经包含如下 NPM 包，不需要再单独安装：

- mongoose：5.0.11
- webpack：2.7.0
- vue：2.6.10
- vuex：3.1.1
- vue-router：3.0.6
- bootstrap：4.0.0
- babel-core：6.26.0
- ….



## 二 、源代码使用

### 2.1  代码目录组织

```javascript
derental
	|- app 前端代码目录
		|- ui 前端 Vue 组件目录
		|- img 前端图片资源目录
	|- contracts 合约代码目录
		|- Marketplace.sol 租房平台合约
		|- Migrations.sol Truffle 迁移管理合约
	|- doc 说明文档目录
		|- README.md 本文档
	|- lib 后端库代码
		|- api.js 后端 api 路由
		|- ChainEventListener.js 链上事件监听
    	|- DbStore.js 数据库接口
    	|- models.js 数据模型定义
    	|- ui.js 后端 ui 路由
    |- migrations 合约迁移脚本目录
    |- node_modules 项目 NPM 目录
    |- views 后端视图目录
    	|- app.html 前端宿主 HTML 文件
    |- .babelrc babel 编译器配置文件
    |- .env 前端环境变量配置文件
    |- fund-metamask.js 用于充值 metamask 账号的工具脚本
    |- server.js 后端应用入口脚本
    |- truffle.js truffle 配置文件
    |- webpack.config.js webpack 配置文件
```



### 2.2  启动基础环境

在启动应用之前，首先确保已经启动以太坊节点、IPFS 服务和数据库服务：

- ganache-cli
- sudo service mongod start
- ipfs daemon



### 2.3 部署合约

执行如下命令生成合约构件并部署合约到 ganache 节点：

```javascript
~/derental$ truffle compile
~/derental$ truffle migrate --reset
```

### 

### 2.4 Metamask  设置

首先设置 Metamask 连接到你的 ganache-cli 节点。在 metamask 中创建三个账号，分别用来表示：房东、租户、仲裁方。然后对应修改 fund-metamask.js 脚本中的地址：

```javascript
async function main(){
await fund('0xa8C7be497B650075AdA831E9a73a9F7C50D3e3bd',3) // 房东地址
await fund('0x100c5f1a205E98f740aF1DA0e9fE84Cce90b3Cb4',4) // 租户地址
await fund('0xD2Ccf105587c8BBE30E375484321f12690483233',5) // 仲裁方地址
}
```

保存修改后，执行该脚本向 metamask 账户充值：

```javascript
~/derental$ node fund-metamask.js
```

在 metamask 中查看充值结果，验证充值成功。



### 2.5  前端环境变量配置文件

前端 app 的执行依赖于配置文件.env 中的内容：

```javascript
IPFS_API_HOST=192.168.1.105
IPFS_API_PORT=5001
IPFS_GATEWAY_URL=http://192.168.1.105:8080
ARBITRATOR=0xD2Ccf105587c8BBE30E375484321f12690483233
CITIES=北京,上海,天津,广州,深圳,杭州,宁波
CITY=上海
```

各配置项说明如下：

- IFPS_API_HOST：设置 IPFS 的 API 访问主机
- IPFS_API_PORT：设置 IPFS 的 API 访问端口
- IPFS_GATEWAY_URL：设置 IPFS 的网关 URL
- ARBITRATOR：设置发生争议时的默认仲裁地址
- CITIES：设置城市列表，英文逗号间隔
- CITY：设置默认城市



### 2.6  前端应用 构建

配置文件修改后，执行下面命令构建前端应用：

```javascript
~/derental$ npm run build
```



### 2.7  启动应用

执行如下命令启动 derental 应用：

```javascript
~/derental$ npm run start
```

在浏览器中打开应用 URL： http://localhost:9000 ，当 MetaMask 请求授权时，点击connect。
当正常授权 metamask 后，在页面右上角可以看到当前账号和当前接入的网络。



## 三 、软件使用方法

### 3.1  上架房屋

在 metamask 中切换到房东账号进行此操作
在网页中点击 房东后台进入房东页面，再点击 上架新的房屋， 输入房屋信息：

![343](https://github.com/wulimom/DAPP-Decentralized-Housing-Rental-System/blob/master/picture/1.png)

表单字段说明如下：

- 发布保证金：出租者可以提交一定的保证金用来增强租房者的信任。单位：元
- 所在城市：房屋所在城市
- 标题：房屋的主要特点
- 简介：房屋的描述文本，如位置、设施、房间数量、卫生间数量、停车情况等。
- 出租价格：房屋的出租价格，单位：元/晚
- 上传图片：点击 上传图片后，在弹出的文件选择框中，按住 ctrl 键可以 选中多个文件上传。

信息填写完成后，点击 确认上架按钮提交房屋上架交易。Metamask 会弹框 请求确认。点击确认后，metamask 会在屏幕的右下方提醒交易是否成功。



### 3.2  房源列表

在网页中点击 首页，查看房源信息：

![2](https://github.com/wulimom/DAPP-Decentralized-Housing-Rental-System/blob/master/picture/2.png)

点击左侧的城市列表，可以过滤不同城市的房源。房屋列表上方的两个输入框 分别对应房屋的最低价格和最高价格，输入后点击 过滤房源按钮，即可筛选 出所选城市中所选价位的房源。

房源列表中，每个房源显示其首图、价格、城市及房东保证金，点击即可查看 该房屋的详情。



### 3.3  房屋预定

在 metamask 中切换到租户账号进行此操作。
房屋详情展示房屋的所有图片，并提供租户预定功能：

![3](https://github.com/wulimom/DAPP-Decentralized-Housing-Rental-System/blob/master/picture/3.png)

图片上的左右箭头用于切换不同的房屋图片。图片下方则是上架房屋时填写 的描述信息。

右侧栏上方提供房屋预定功能。用户选择入住日期和退房日期，点击 马上预定 即可提交预定交易，Metamask 弹出确认框，用户确认后该交易即发送到网络：

![4](https://github.com/wulimom/DAPP-Decentralized-Housing-Rental-System/blob/master/picture/4.png)

预定表单下方为房屋状态日历，当房屋在某个日期段已被占用时，在日历中会 突出显示，以提醒用户该日期区间不可预定。



### 3.4  房东确认订单

在 metamask 中切换到房东账号进行此操作
租户提交的预定，需要房东进行确认，才能生效。
切换至房东账号后进入房东后台，点击 我的订单，可以查看所有的订单信息：

![5](https://github.com/wulimom/DAPP-Decentralized-Housing-Rental-System/blob/master/picture/5.png)

对于新的预定，房东可以选择拒绝或接收。点击 接受按钮后，Metamask 会 要求确认交易，确认后该订单即转为已接受状态。

### 3.5  租户支付

在 metamask 中切换到租户账号进行此操作。
已接受的订单，租户需要在 24 小时内完成支付，否则在此时间后，房东可以发起 完成订单的交易从而获取租金。
切换到租户账号，进入租户后台，点击我的订单，可以查看租户的所有订单：

![6](https://github.com/wulimom/DAPP-Decentralized-Housing-Rental-System/blob/master/picture/6.png)

点击 支付 订单按钮，即可通过 metamask 提交支付交易。此订单即进入支付完成状态。

如果这时再次查看房屋详情，就会看到该时间段内房屋状态已被占用：

![7](https://github.com/wulimom/DAPP-Decentralized-Housing-Rental-System/blob/master/picture/7.png)

在此情况下，房东和租户的信用积分都会增加相应的天数。
