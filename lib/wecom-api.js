const axios = require('axios');

class WeComAPI {
    constructor(webhook) {
        this.webhook = webhook;
    }

    async sendMessage(message) {
        try {
            const response = await axios.post(this.webhook, message);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // 文本消息
    createTextMessage(content, mentionedList = [], mentionedMobileList = []) {
        return {
            msgtype: 'text',
            text: {
                content,
                mentioned_list: mentionedList,
                mentioned_mobile_list: mentionedMobileList
            }
        };
    }

    // Markdown消息
    createMarkdownMessage(content) {
        return {
            msgtype: 'markdown',
            markdown: {
                content
            }
        };
    }

    // Markdown V2消息
    createMarkdownV2Message(content) {
        return {
            msgtype: 'markdown_v2',
            markdown_v2: {
                content
            }
        };
    }

    // 图片消息
    createImageMessage(base64, md5) {
        return {
            msgtype: 'image',
            image: {
                base64,
                md5
            }
        };
    }

    // 图文消息
    createNewsMessage(articles) {
        return {
            msgtype: 'news',
            news: {
                articles
            }
        };
    }
}

module.exports = WeComAPI; 