// 网站配置
var sitePath = "http://www.easybui.com",
    siteDir = sitePath + "/demo/json/";
// 设置当前应用模式
bui.isWebapp = true;

loader.define("index", function () {
    console.log("111")
})
bui.ready(function () {
    // 加载
    // loader.require(["pages/ui_controls/bui.listview"], function(listview) {
    //     console.log(listview)
    // })

    var params = bui.history.getParams("url");

    console.log(params)

    $("header").click(function () {

        bui.load({
            url: "pages/mindex.html",
            param: {
                id: "test"
            }
        })
    })
    console.log(bui.hasRouter)

    bui.btn({
        id: ".bui-page",
        handle: ".bui-btn"
    }).load();
})