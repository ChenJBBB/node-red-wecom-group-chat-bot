module.exports = function (RED) {
    // 引入必要的依赖
    const axios = require('axios');

    function WeComBot(config) {
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


        // 节点输入消息处理
        node.on('input', function (msg) {
            // 打印输入消息
            // 格式化成标准日期时间字符串
            let currentDate = new Date();
            // 获取年、月、日
            let year = currentDate.getFullYear();
            let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 注意月份从0开始，需要加1，并补零
            let day = String(currentDate.getDate()).padStart(2, '0');

            // 获取时、分、秒、毫秒
            let hours = String(currentDate.getHours()).padStart(2, '0');
            let minutes = String(currentDate.getMinutes()).padStart(2, '0');
            let seconds = String(currentDate.getSeconds()).padStart(2, '0');
            let milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
            let formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
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
                // 设置提醒列表
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
            } else if (node.msgType === 'markdown') {
                message.markdown = {
                    content: msg.payload
                };
            } else if (node.msgType === 'markdown_v2') {
                message.markdown_v2 = {
                    content: msg.payload
                };
            }

            // 打印最终发送的消息
            console.log('准备发送的消息:', message);

            // 发送消息到企业微信
            axios.post(node.webhook, message)
                .then(response => {
                    console.log('消息发送成功:', response.data);
                    // 更新节点状态
                    node.status({ fill: "green", shape: "dot", text: formattedDateTime });
                    // 发送消息到下一个节点
                    node.send(msg);
                })
                .catch(error => {
                    console.error('消息发送失败:', error);
                    // 更新节点状态
                    node.status({ fill: "red", shape: "ring", text: formattedDateTime });
                    // 发送错误到下一个节点
                    node.error('消息发送失败: ' + error.message, msg);
                });
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