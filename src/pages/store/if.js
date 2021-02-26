loader.define(function(require, exports, module) {

    // 可以在路由init以后,作为整个应用的联动数据处理
    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            manage: false,
        },
        templates: {
            tplManage: function (data) {
                if (data) {
                    return `<img src="images/placeholder-app.jpg"></img>`
                } else {
                    return `<div class="bui-hint danger">您没有权限访问</div><img src="images/placeholder-page.png"></img>`
                }
            }
        },
        mounted: function() {

        }
    })

})