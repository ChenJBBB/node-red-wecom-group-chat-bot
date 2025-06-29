const WeComAPI = require('../../lib/wecom-api');
const { validateMessageContent, handleError } = require('../wecom-common/utils');

module.exports = function(RED) {
    function WeComImageNode(config) {
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

        // 节点输入消息处理
        node.on('input', async function(msg) {
            try {
                // 验证消息内容
                validateMessageContent(msg.payload, 'image');

                // 创建消息
                const message = api.createImageMessage(
                    msg.payload.base64,
                    msg.payload.md5
                );

                // 发送消息
                const response = await api.sendMessage(message);
                
                // 更新节点状态
                node.status({ fill: "green", shape: "dot", text: new Date().toISOString() });
                
                // 发送消息到下一个节点
                node.send(msg);
            } catch (error) {
                handleError(error, node, msg);
            }
        });
    }

    RED.nodes.registerType("wecom-image", WeComImageNode);
}; 