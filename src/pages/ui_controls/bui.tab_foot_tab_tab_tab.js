loader.define(function (require, exports, module) {

    var uiTab = bui.tab({
        id: "#tabMiddle",
        data: [{
            id: "tabMiddle0-0",
            title: "消息类",
            name: "pages/components/list/index",
            param: {
                type: "news"
            }
        }, {
            id: "tabMiddle0-1",
            title: "指标类",
            name: "pages/components/list/index",
            param: {
                type: "order"
            },
        }, {
            id: "tabMiddle0-2",
            title: "任务类",
            name: "pages/components/list/index",
            param: {
                type: "message"
            },
        }]
    })


})