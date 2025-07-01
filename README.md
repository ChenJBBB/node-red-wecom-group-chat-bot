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

### 图片消息节点（wecom-image）

企业微信图片消息节点用于向群聊发送图片消息，支持Base64字符串和Buffer对象两种输入方式。

#### 节点配置
- **名称**：节点名称
- **机器人配置**：选择企业微信机器人配置节点
- **输入类型**：选择图片数据的输入格式
  - Base64编码：接受base64编码的字符串
  - Buffer对象：接受Buffer对象
- **自动计算MD5**：是否自动计算图片的MD5值（推荐开启）

#### 输入格式
- **Base64编码模式**：
  - 直接传入图片的base64编码字符串
  - 示例：
    ```javascript
    msg.payload = "base64"
    ```
- **Buffer对象模式**：
  - 使用file节点读取图片文件直接传入Buffer对象


#### 输出格式
- **成功时**：
  - `msg.response`：企业微信API的响应信息
  - `msg.imageData`：图片信息摘要（包含base64前50个字符、md5值和输入类型）
- **失败时**：
  - `msg.payload.error`：true 表示发生错误
  - `msg.payload.message`：错误信息
  - `msg.payload.originalPayload`：原始消息内容
  - `msg.payload.inputType`：当前使用的输入类型

#### 图片要求
- 图片大小：不超过2MB
- 支持格式：JPG、PNG
- 编码格式：Base64编码或Buffer对象

#### 注意事项
- 根据实际输入数据格式选择合适的输入类型
- Base64模式适合处理已编码的字符串数据
- Buffer模式适合处理原始二进制数据
- 建议开启"自动计算MD5"选项，确保数据完整性
- 图片大小不能超过2MB，否则发送会失败
- 即使发送失败，节点也会继续输出消息流，错误信息会包含在payload中

#### 错误处理
- 如果数据格式不正确，会抛出相应的格式错误
- 如果图片数据为空，会抛出"消息内容不能为空"错误
- 如果Buffer转base64失败，会抛出转换错误
- 如果图片大小超过限制，企业微信API会返回相应错误

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
