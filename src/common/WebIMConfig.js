const config = {
    /*
     * Application AppKey
     */
    appkey: 'easemob-demo#easeim',
    /*
     * Application Host
     */
    Host: 'easemob.com',
    /*
     * Whether to use HTTPS
     * @parameter {Boolean} true or false
     *
    https: true,

    /*
    * 公有云配置默认为 true，
    * 私有云配置请设置 isHttpDNS = false , 详细文档：http://docs-im.easemob.com/im/web/other/privatedeploy
    */
    isHttpDNS: true,
    /*
     * isMultiLoginSessions
     * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
     * false: A visitor can sign in to only one webpage and receive messages at the webpage.
     */
    isMultiLoginSessions: true,
    /**
     * isSandBox=true:  socketURL: 'im-api.sandbox.easemob.com',  apiURL: '//a1.sdb.easemob.com',
     * isSandBox=false: socketURL: 'im-api.easemob.com',          apiURL: '//a1.easemob.com',
     * @parameter {Boolean} true or false
     */
    isSandBox: false,
    /**
     * Whether to console.log
     * @parameter {Boolean} true or false
     */
    isDebug: false,
    /**
     * will auto connect the websocket server autoReconnectNumMax times in background when client is offline.
     * won't auto connect if autoReconnectNumMax=0.
     */
    autoReconnectNumMax: 5,
    /*
     * Upload pictures or file to your own server and send message with url
     * @parameter {Boolean} true or false
     * true: Using the API provided by SDK to upload file to huanxin server
     * false: Using your method to upload file to your own server
     */
    useOwnUploadFun: false,
    /**
     *  cn: chinese
     *  us: english
     */
    i18n: 'cn',
    /*
     * Set to auto sign-in
     */
    isAutoLogin: false,
    /**
     * Size of message cache for person to person
     */
    p2pMessageCacheSize: 500,
    /**
     * When a message arrived, the receiver send an ack message to the
     * sender, in order to tell the sender the message has delivered.
     * See call back function onReceivedMessage
     */
    delivery: false,
    /**
     * Size of message cache for group chating like group, chatroom etc. For use in this demo
     */
    groupMessageCacheSize: 200,
    /**
     * 5 actual logging methods, ordered and available:
     * 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'
     */
    loglevel: 'ERROR',
    /**
     * enable localstorage for history messages. For use in this demo
     */
    enableLocalStorage: true,

    deviceId: ''
}

export default config

