module.exports = function(RED) {
    function WeComConfigNode(config) {
        RED.nodes.createNode(this, config);
        
        // 保存配置
        this.name = config.name;
        this.webhook = config.webhook;
        
        // 验证webhook
        if (!this.webhook) {
            this.error("Webhook URL不能为空");
        }
    }

    // 注册配置节点类型
    RED.nodes.registerType("wecom-config", WeComConfigNode);
}; 