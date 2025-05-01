module.exports = function (RED) {
    // 1. 引入必要的依赖
    // 例如：const axios = require('axios');
    // 例如：const WebSocket = require('ws');

    function WeComBot(config) {
        // 2. 创建节点实例
        RED.nodes.createNode(this, config);
        var node = this;

        // 获取配置节点
        node.server = RED.nodes.getNode(config.server);
        if (!node.server) {
            node.error("未配置机器人WebHook");
            return;
        }

        // 获取配置参数
        node.webhook = node.server.webhook;
        node.msgType = config.msgType;
        node.mentionedList = config.mentionedList ? config.mentionedList.split(',').map(item => item.trim()) : [];
        node.mentionedMobileList = config.mentionedMobileList ? config.mentionedMobileList.split(',').map(item => item.trim()) : [];

        // 打印配置参数
        console.log('WeComBot配置参数:');
        console.log('WebHook:', node.webhook);
        console.log('消息类型:', node.msgType);
        console.log('提醒成员列表:', node.mentionedList);
        console.log('提醒成员手机号:', node.mentionedMobileList);

        // 4. 节点状态管理
        // 设置初始状态
        // node.status({fill:"grey",shape:"dot",text:"initialized"});

        // 5. 输入消息处理
        node.on('input', function (msg) {
            // 打印输入消息
            console.log('收到输入消息:', msg);

            // 构建消息体
            let message = {
                msgtype: node.msgType
            };

            // 设置消息内容
            if (node.msgType === 'text') {
                message.text = {
                    content: msg.payload
                };
            } else if (node.msgType === 'markdown') {
                message.markdown = {
                    content: msg.payload
                };
            }

            // 设置提醒列表
            if (node.msgType === 'text') {
                // 如果配置中有提醒列表，使用配置的列表
                if (node.mentionedList.length > 0 || node.mentionedMobileList.length > 0) {
                    message.text.mentioned_list = node.mentionedList;
                    message.text.mentioned_mobile_list = node.mentionedMobileList;
                }
                // 否则使用消息中的提醒列表
                else if (msg.mentioned_list || msg.mentioned_mobile_list) {
                    message.text.mentioned_list = msg.mentioned_list || [];
                    message.text.mentioned_mobile_list = msg.mentioned_mobile_list || [];
                }
            }

            // 打印最终发送的消息
            console.log('准备发送的消息:', message);

            // TODO: 实现发送消息的逻辑
            // 这里需要添加发送HTTP请求的代码

            // 发送消息到下一个节点
            node.send(msg);
        });

        // 6. 节点关闭处理
        node.on('close', function (done) {
            // 清理资源
            // 关闭连接
            // 停止定时器
            done();
        });

        // 7. 错误处理
        node.on('error', function (err) {
            // 处理节点运行时的错误
            // 更新节点状态
            // 记录错误日志
        });

        // 8. 自定义方法
        // 可以在这里定义节点内部使用的方法
        // 例如：node.connect = function() {...}
        // 例如：node.sendMessage = function() {...}
    }

    function WeComBotConfig(config) {
        // 2. 创建节点实例
        RED.nodes.createNode(this, config);
        var node = this;

        // 获取配置参数
        node.name = config.name;
        node.webhook = config.webhook;

        // 打印配置参数
        console.log('WeComBot Server 配置参数:');
        console.log('name:', node.name);
        console.log('WebHook:', node.webhook);
    }

    // 9. 注册节点
    RED.nodes.registerType("WeComBot", WeComBot);
    RED.nodes.registerType("WeComBot-config", WeComBotConfig);

    // 10. 可选：注册节点配置
    // 用于在Node-RED编辑器中显示节点的配置界面
    RED.httpAdmin.get("/WeComBot/:id", function (req, res) {
        // 处理配置请求
    });
}