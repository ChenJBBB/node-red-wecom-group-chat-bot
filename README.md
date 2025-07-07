# Node-RED 企业微信群聊机器人节点

本项目为 Node-RED 提供企业微信群聊机器人相关节点，支持多种消息类型的发送。

## 节点功能简介

- **wecom-text**：发送文本、Markdown、Markdown V2 消息到企业微信群。
- **wecom-image**：发送图片消息到企业微信群，支持 Base64 和 Buffer 输入。
- **wecom-file**：上传并发送文件或语音（AMR）消息到企业微信群。

> 各节点的详细用法、输入输出格式、注意事项等请参见节点的帮助面板（节点 HTML 文件内已详细说明）。

## 企业微信机器人配置文档

请参考企业微信官方文档进行机器人配置和消息格式说明：

- [企业微信群机器人官方文档](https://developer.work.weixin.qq.com/document/path/91770#%E8%AF%AD%E9%9F%B3%E7%B1%BB%E5%9E%8B)

## 安装方式
通过 Node-RED 的“管理面板”->“安装”页面，搜索 `@c78/node-red-contrib-wecom-group-chat-bot` 并点击安装即可。

或者在 Node-RED 用户目录下，使用命令行安装：
```bash
npm install @c78/node-red-contrib-wecom-group-chat-bot
```

---

如有问题请通过 [GitHub Issues](https://github.com/ChenJBBB/node-red-wecom-group-chat-bot/issues) 反馈。
