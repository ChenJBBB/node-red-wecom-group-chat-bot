# Node-RED 企业微信群聊机器人节点

这是一个用于 Node-RED 的企业微信群聊机器人节点，可以通过 WebHook 向企业微信群发送消息。

## 功能特点

- 支持向企业微信群发送文本消息
- 简单易用的配置界面
- 支持 Node-RED 消息流集成

## 安装方法

1. 在 Node-RED 的根目录下运行以下命令：

```bash
npm install @c78/node-red-contrib-wecom-group-chat-bot
```

2. 在Node-RED的节点管理下搜索安装

## 使用方法

1. 在 Node-RED 编辑器中，从节点面板拖拽 "WeComBot" 节点到工作区
2. 双击节点进行配置：
   - 添加企业微信群机器人的 WebHook 配置
   - 配置其他可选参数
3. 连接输入节点，发送消息到企业微信群

## 配置说明

- **WebHook URL**: 企业微信群机器人的 WebHook 地址
- **消息内容**: 支持通过 msg.payload 传入要发送的消息内容
- **提醒成员列表**：输入要@的成员userid，多个用逗号分隔，留空由前一个节点的 msg.mentioned_list 传入
- **提醒成员手机号**：输入要@的成员手机号，多个用逗号分隔，留空由前一个节点的 msg.mentioned_mobile_list 传入


## 许可证

MIT License

## 作者

c78

## 问题反馈

如果您在使用过程中遇到任何问题，请通过 [GitHub Issues](https://github.com/ChenJBBB/node-red-wecom-group-chat-bot/issues) 提交问题。
