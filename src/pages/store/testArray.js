loader.define(function(require, exports, module) {


    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            users: [{
                id: "123",
                name: "",
            }]
        },
        methods: {},
        templates: {},
        mounted: function () {
            
        }
    })

})