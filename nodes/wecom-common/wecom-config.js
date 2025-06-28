module.exports = function(RED) {
    function WeComConfig(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        // 获取配置参数
        node.name = config.name;
        node.webhook = config.webhook;
    }
    
    RED.nodes.registerType("wecom-config", WeComConfig);
}; 