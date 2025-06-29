const WeComAPI = require('../../lib/wecom-api');
const { formatTimestamp, handleError } = require('../wecom-common/utils');

module.exports = function(RED) {
    function WeComTextNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // 获取配置节点
        node.server = RED.nodes.getNode(config.server);
        if (!node.server) {
            node.error("未配置机器人WebHook");
            return;
        }

        // 初始化API客户端
        const api = new WeComAPI(node.server.webhook);

        // 获取配置参数
        node.msgType = config.msgType || 'text';
        node.mentionedList = config.mentionedList ? config.mentionedList.split(',').map(item => item.trim()) : [];
        node.mentionedMobileList = config.mentionedMobileList ? config.mentionedMobileList.split(',').map(item => item.trim()) : [];

        // 节点输入消息处理
        node.on('input', async function(msg) {
            try {
                const timestamp = formatTimestamp();
                let message;
                const payload = msg.payload;
                const msgType = msg.msgType || node.msgType; // 获取消息类型
                // 构建不同类型的消息体
                if (msgType === 'text') {
                    message = api.createTextMessage(
                        payload,
                        node.mentionedList,
                        node.mentionedMobileList
                    );
                } else if (msgType === 'markdown') {
                    message = api.createMarkdownMessage(payload);
                } else if (msgType === 'markdown_v2') {
                    message = api.createMarkdownV2Message(payload);
                } else {
                    throw new Error('不支持的消息类型: ' + msgType);
                }
                // 发送消息
                await api.sendMessage(message);
                node.status({ fill: "green", shape: "dot", text: timestamp });
                node.send(msg);
            } catch (error) {
                const timestamp = formatTimestamp();
                // 将错误信息放入 payload 中
                msg.payload = {
                    error: true,
                    message: error.message,
                    originalPayload: msg.payload
                };
                node.error(error.message, msg);
                node.status({ fill: "red", shape: "ring", text: timestamp });
                // 即使出错也继续发送消息
                node.send(msg);
            }
        });
    }
    
    // 注册节点
    RED.nodes.registerType("wecom-text", WeComTextNode);
}; 