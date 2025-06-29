# Node-RED 企业微信群聊机器人节点

这是一个用于 Node-RED 的企业微信群聊机器人节点，可以通过 WebHook 向企业微信群发送消息。

## 功能特点

- 支持多种消息类型：
  - 文本消息：支持发送普通文本，可以@群成员
  - Markdown 消息：支持发送 Markdown 格式的消息
  - Markdown V2 消息：支持发送 Markdown V2 格式的消息，提供更丰富的格式选项
- 动态消息类型覆盖：可通过 `msg.msgType` 动态改变消息类型
- 灵活的提醒配置：支持静态配置和动态输入两种方式
- 完善的错误处理：即使发送失败也会继续消息流
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
   - 选择消息类型
   - 配置其他可选参数
3. 连接输入节点，发送消息到企业微信群

## 配置说明

### 节点配置
- **WebHook URL**: 企业微信群机器人的 WebHook 地址
- **消息类型**: 选择默认的消息类型（text、markdown、markdown_v2）
- **提醒功能**（仅文本消息类型可用）:
  - 提醒成员列表：输入要@的成员userid，多个用逗号分隔
  - 提醒成员手机号：输入要@的成员手机号，多个用逗号分隔

### 输入消息格式

#### 必需参数
- **msg.payload**: 要发送的消息内容

#### 可选参数
- **msg.msgType**: 动态覆盖配置的消息类型（支持：text、markdown、markdown_v2）
- **msg.mentioned_list**: 动态提醒的用户ID列表（仅文本消息类型有效）
- **msg.mentioned_mobile_list**: 动态提醒的手机号列表（仅文本消息类型有效）

### 输出消息格式

#### 成功时
输出原始消息，保持 msg 对象不变

#### 失败时
```javascript
msg.payload = {
    error: true,
    message: "错误信息",
    originalPayload: "原始消息内容"
}
```


## 注意事项

- 提醒功能（@群成员）仅在文本消息类型下可用
- Markdown 和 Markdown V2 类型不支持提醒功能
- 可以通过 `msg.msgType` 动态覆盖配置的消息类型
- 如果提醒列表留空，将使用前一个节点的 `msg.mentioned_list` 和 `msg.mentioned_mobile_list`
- 即使发送失败，节点也会继续输出消息流，错误信息会包含在 payload 中
- 消息内容必须通过 `msg.payload` 传入

## 许可证

MIT License

## 作者

c78

## 问题反馈

如果您在使用过程中遇到任何问题，请通过 [GitHub Issues](https://github.com/ChenJBBB/node-red-wecom-group-chat-bot/issues) 提交问题。
