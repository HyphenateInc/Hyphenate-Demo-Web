import websdk from 'agora-chat-sdk'
import AgoraRTC from "agora-rtc-sdk-ng"
import config from './WebIMConfig'
const WebIM = window.WebIM || {};
WebIM.config = config;
const options = {
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    isDebug: WebIM.config.isDebug,
    https: WebIM.config.https,
    isAutoLogin: false,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    delivery: WebIM.config.delivery,
    appKey: WebIM.config.appkey,
    useOwnUploadFun: WebIM.config.useOwnUploadFun,
    deviceId: WebIM.config.deviceId,
    isHttpDNS: WebIM.config.isHttpDNS,
}

// 内部沙箱测试环境
if (WebIM.config.isSandBox) {
    options.url = (window.location.protocol === "https:" ? "https:" : "http:") + '//im-api-v2-hsb.easemob.com/ws';
    options.apiUrl = (window.location.protocol === "https:" ? "https:" : "http:") + '//a1-hsb.easemob.com';
    options.isHttpDNS = false;
    WebIM.config.restServer = (window.location.protocol === "https:" ? "https:" : "http:") + '//a1-hsb.easemob.com';
}

WebIM.conn = new websdk.connection(options)
WebIM.AgoraRTC = AgoraRTC;
export default WebIM

