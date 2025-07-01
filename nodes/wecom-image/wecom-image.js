const WeComAPI = require('../../lib/wecom-api');
const { formatTimestamp, handleError } = require('../wecom-common/utils');
const crypto = require('crypto');

module.exports = function (RED) {
    function WeComImageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // 获取配置节点
        node.server = RED.nodes.getNode(config.server);
        if (!node.server) {
            node.error("未配置机器人WebHook");
            return;
        }

        // 获取配置参数
        node.inputType = config.inputType || 'base64'; // 输入类型：base64 或 buffer
        node.autoMD5 = config.autoMD5 !== false; // 默认开启自动计算MD5

        // 初始化API客户端
        const api = new WeComAPI(node.server.webhook);

        // 计算MD5值的函数
        function calculateMD5(data) {
            try {
                let buffer;
                if (Buffer.isBuffer(data)) {
                    buffer = data;
                } else if (typeof data === 'string') {
                    buffer = Buffer.from(data, 'base64');
                } else {
                    throw new Error('不支持的数据类型');
                }
                const md5Hash = crypto.createHash('md5');
                md5Hash.update(buffer);
                return md5Hash.digest('hex');
            } catch (error) {
                throw new Error('计算MD5失败: ' + error.message);
            }
        }

        // 将Buffer转换为base64
        function bufferToBase64(buffer) {
            try {
                return buffer.toString('base64');
            } catch (error) {
                throw new Error('Buffer转base64失败: ' + error.message);
            }
        }

        // 验证图片数据
        function validateImageData(payload, inputType) {
            if (!payload) {
                throw new Error('消息内容不能为空');
            }

            if (inputType === 'buffer') {
                // Buffer模式：只接受Buffer对象
                if (Buffer.isBuffer(payload)) {
                    const base64 = bufferToBase64(payload);
                    return {
                        base64: base64,
                        md5: node.autoMD5 ? calculateMD5(payload) : undefined
                    };
                } else {
                    throw new Error('Buffer模式下，payload必须是Buffer对象');
                }
            } else {
                // base64模式：只接受字符串
                if (typeof payload === 'string') {
                    return {
                        base64: payload,
                        md5: node.autoMD5 ? calculateMD5(payload) : undefined
                    };
                } else {
                    throw new Error('Base64模式下，payload必须是字符串');
                }
            }
        }

        // 节点输入消息处理
        node.on('input', async function (msg) {
            try {
                const timestamp = formatTimestamp();

                // 验证并处理图片数据
                const imageData = validateImageData(msg.payload, node.inputType);

                // 创建图片消息
                const message = api.createImageMessage(
                    imageData.base64,
                    imageData.md5
                );

                // 发送消息
                const response = await api.sendMessage(message);

                // 更新节点状态
                node.status({ fill: "green", shape: "dot", text: timestamp });

                // 将响应信息添加到消息中
                msg.response = response;
                msg.imageData = {
                    base64: imageData.base64.substring(0, 50) + '...', // 只显示前50个字符
                    md5: imageData.md5,
                    inputType: node.inputType
                };

                // 发送消息到下一个节点
                node.send(msg);
            } catch (error) {
                const timestamp = formatTimestamp();
                // 将错误信息放入 payload 中
                msg.payload = {
                    error: true,
                    message: error.message,
                    originalPayload: msg.payload,
                    inputType: node.inputType
                };
                node.error(error.message, msg);
                node.status({ fill: "red", shape: "ring", text: timestamp });
                // 即使出错也继续发送消息
                node.send(msg);
            }
        });
    }

    RED.nodes.registerType("wecom-image", WeComImageNode);
}; 