const WeComAPI = require('../../lib/wecom-api');
const { formatTimestamp } = require('../wecom-common/utils');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

module.exports = function(RED) {
    function WeComFileNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // 获取配置节点
        node.server = RED.nodes.getNode(config.server);
        if (!node.server) {
            node.error("未配置机器人WebHook");
            return;
        }

        // 解析 webhook，提取 key
        const webhook = node.server.webhook;
        const keyMatch = webhook.match(/[?&]key=([\w-]+)/);
        const key = keyMatch ? keyMatch[1] : null;
        if (!key) {
            node.error("Webhook URL 中未找到 key 参数");
            return;
        }

        // 类型覆盖
        node.typeOverride = config.typeOverride || 'auto';

        node.on('input', async function(msg) {
            const timestamp = formatTimestamp();
            try {
                // 输入校验
                if (!Buffer.isBuffer(msg.payload)) {
                    throw new Error('msg.payload 必须为 Buffer（建议用 file in 节点输出）');
                }
                // 获取文件名
                let filename = msg.filename || msg.filepath;
                if (!filename) {
                    throw new Error('msg.filename 或 msg.filepath 必须存在');
                }
                filename = path.basename(filename);
                // 判断类型
                let type = 'file';
                let ext = path.extname(filename).toLowerCase();
                if (node.typeOverride === 'auto') {
                    if (ext === '.amr') {
                        type = 'voice';
                    }
                } else {
                    type = node.typeOverride;
                }
                // 校验大小
                const size = msg.payload.length;
                if (type === 'voice') {
                    if (ext !== '.amr') {
                        throw new Error('voice 类型仅支持 AMR 格式');
                    }
                    if (size > 2 * 1024 * 1024) {
                        throw new Error('voice 类型文件不能超过 2MB');
                    }
                } else {
                    if (size > 20 * 1024 * 1024) {
                        throw new Error('file 类型文件不能超过 20MB');
                    }
                }
                // 构建 multipart/form-data
                const form = new FormData();
                form.append('media', msg.payload, {
                    filename: filename,
                    contentType: 'application/octet-stream',
                    knownLength: size
                });
                // 拼接上传URL
                const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key=${key}&type=${type}`;
                // 发送请求
                const opts = form.getHeaders();
                opts['Content-Length'] = form.getLengthSync();
                const req = https.request(url, {
                    method: 'POST',
                    headers: opts
                }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', async () => {
                        try {
                            const result = JSON.parse(data);
                            if (result.errcode !== 0) {
                                throw new Error(`上传失败: ${result.errmsg} (errcode=${result.errcode})`);
                            }
                            // 上传成功，准备发送消息
                            msg.media_id = result.media_id;
                            msg.type = result.type;
                            msg.created_at = result.created_at;
                            msg.upload_response = result;

                            // 构造消息体
                            let messageBody;
                            if (type === 'voice') {
                                messageBody = {
                                    msgtype: 'voice',
                                    voice: { media_id: result.media_id }
                                };
                            } else {
                                messageBody = {
                                    msgtype: 'file',
                                    file: { media_id: result.media_id }
                                };
                            }
                            // 发送消息
                            const sendUrl = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`;
                            const axios = require('axios');
                            try {
                                const sendResp = await axios.post(sendUrl, messageBody);
                                const sendData = sendResp.data;
                                if (sendData.errcode !== 0) {
                                    throw new Error(`发送失败: ${sendData.errmsg} (errcode=${sendData.errcode})`);
                                }
                                msg.send_response = sendData;
                                node.status({ fill: "green", shape: "dot", text: timestamp });
                                node.send(msg);
                            } catch (sendErr) {
                                msg.payload = {
                                    error: true,
                                    message: sendErr.message,
                                    originalPayload: msg.payload
                                };
                                node.error(sendErr.message, msg);
                                node.status({ fill: "red", shape: "ring", text: timestamp });
                                node.send(msg);
                            }
                        } catch (e) {
                            msg.payload = {
                                error: true,
                                message: e.message,
                                originalPayload: msg.payload
                            };
                            node.error(e.message, msg);
                            node.status({ fill: "red", shape: "ring", text: timestamp });
                            node.send(msg);
                        }
                    });
                });
                req.on('error', (e) => {
                    msg.payload = {
                        error: true,
                        message: e.message,
                        originalPayload: msg.payload
                    };
                    node.error(e.message, msg);
                    node.status({ fill: "red", shape: "ring", text: timestamp });
                    node.send(msg);
                });
                form.pipe(req);
            } catch (error) {
                msg.payload = {
                    error: true,
                    message: error.message,
                    originalPayload: msg.payload
                };
                node.error(error.message, msg);
                node.status({ fill: "red", shape: "ring", text: timestamp });
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("wecom-file", WeComFileNode);
};
