/**
 * 导航TAB模板
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (require, exports, module) {

    // bui.page({ url: "index.html#pages/components/list/index.html", iframe: true })
    var pageview = {};
    // 存储tab实例
    var distance = [];
    // 模块初始化定义
    pageview.init = function () {

        // html:
        // <div id="uiTabHead" class="bui-tab"></div>
        var uiTabHead = bui.tab({
            id: "#tabDynamic",
            position: "top",
            data: [{
                id: "uiTabHead0",
                title: "控件",
                name: "pages/main/controls",
                param: {}
            }, {
                id: "uiTabHead1",
                title: "表单",
                name: "pages/main/form",
                param: {}
            }, {
                id: "uiTabHead2",
                title: "数据驱动",
                name: "pages/main/store",
                param: {}
            }, {
                id: "uiTabHead3",
                title: "方法",
                name: "pages/main/method",
                param: {}
            }]
        })


        if (bui.platform.isPC()) {
            uiTabHead.lock();
        }

    }

    // 初始化
    pageview.init();

    // 输出模块
    return pageview;

})