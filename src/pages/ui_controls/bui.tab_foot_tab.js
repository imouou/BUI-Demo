loader.define(function (require, exports, module) {

    // html:
    // <div id="uiTab" class="bui-tab"></div>
    var uiTab = bui.tab({
        id: "#tabFoot",
        position: "bottom",
        iconPosition: "top",
        data: [{
            id: "uiTab0",
            icon: "icon-home",
            title: "首页",
            name: "pages/ui_controls/bui.tab_foot_tab_tab",
            param: {
                type: "news"
            }
        }, {
            id: "uiTab1",
            icon: "icon-menu",
            title: "订单",
            name: "pages/components/list/index",
            param: {
                type: "order"
            },
        }, {
            id: "uiTab2",
            icon: "icon-menu",
            title: "消息",
            name: "pages/components/list/index",
            param: {
                type: "message"
            },
        }, {
            id: "uiTab3",
            icon: "icon-menu",
            title: "我的",
            name: "pages/components/list/index",
            param: {
                type: "my"
            },
        }]
    })


})