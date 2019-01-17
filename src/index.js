// 网站配置
var sitePath = "http://www.easybui.com",
    siteDir = sitePath + "/demo/json/";
// 设置当前应用模式
bui.isWebapp = true;

// 去除微信调试模块缓存
// window.loader = bui.loader({
//     cache: false
// })
// 路由初始化给全局变量,必须是router
window.router = bui.router();

bui.ready(function() {

    // 数据行为存储器
    var store = bui.store({
        scope: "app",
        isPublic: true, // 在模块里面默认是false, 在index.js 需要改为true
        data: {
            message2: "Hello",
            firstName: "Img"
        }
    })
    // 第3步: 初始化路由
    router.init({
        id: "#bui-router",
        progress: true,
        hash: true,
        // 挂载公共 store 可以解析公共数据的 {{app.firstName}} 之类的数据, 可以使用 router.store.firstName 读取跟修改
        store: store,
    })


    // 绑定事件
    bind();
})

/**
 * [bind 绑定页面事件]
 * @return {[type]} [description]
 */
function bind() {

    // 绑定应用的所有按钮有href跳转, 增加多个按钮监听则在hangle加逗号分开.
    bui.btn({ id: "#bui-router", handle: ".bui-btn" }).load();

    // 统一绑定应用所有的后退按钮
    $("#bui-router").on("click", ".btn-back", function(e) {
        // 支持后退多层,支持回调
        bui.back();
    })

    // demo生成源码
    router.on("complete", function(e) {

        $("#" + e.target.id).find(".bui-page > .bui-bar > .bui-bar-right").append('<a class="bui-btn preview-source">源码</a>')
    })
    $("#bui-router").on("click", ".preview-source", function(e) {
        var hash = window.location.hash,
            rule = /^#.+\?/ig,
            wenhaoIndex = hash.indexOf("?"),
            url = wenhaoIndex > -1 ? hash.substring(1, wenhaoIndex) : hash.substr(1);
        window.open('http://www.easybui.com/demo/source.html?url=' + url + '&code=html,js,result')
    })

}