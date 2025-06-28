// 格式化时间戳
function formatTimestamp() {
    const date = new Date();
    // 动态获取系统时区，如果获取失败则使用 Asia/Shanghai 作为默认值
    let timeZone;
    try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
        timeZone = 'Asia/Shanghai';
    }
    
    return date.toLocaleString('zh-CN', {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

// 验证消息内容
function validateMessageContent(content, type) {
    if (!content) {
        throw new Error('消息内容不能为空');
    }

    switch (type) {
        case 'text':
            if (typeof content !== 'string') {
                throw new Error('文本消息内容必须是字符串');
            }
            break;
        case 'markdown':
            if (typeof content !== 'string') {
                throw new Error('Markdown消息内容必须是字符串');
            }
            break;
        case 'image':
            if (!content.base64 || !content.md5) {
                throw new Error('图片消息必须包含base64和md5');
            }
            break;
        case 'news':
            if (!Array.isArray(content.articles)) {
                throw new Error('图文消息必须包含articles数组');
            }
            break;
        default:
            throw new Error('不支持的消息类型');
    }
}

// 处理错误信息
function handleError(error, node, msg) {
    const timestamp = formatTimestamp();
    node.error(error.message, msg);
    node.status({ fill: "red", shape: "ring", text: timestamp });
}

module.exports = {
    formatTimestamp,
    validateMessageContent,
    handleError
}; 