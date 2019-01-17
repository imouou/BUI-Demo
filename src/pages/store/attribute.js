
loader.define(function(require, exports, module) {


    // 可以在路由init以后,作为整个应用的联动数据处理
    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                title: "自动绑定标题",
                attrs: {
                    "title": "这是动态标题",
                    "data-title": "自定义标题",
                }
            },
            needStatic: true,
            methods: {},
            watch: {},
            computed: {},
            templates: {},
            mounted: function () {
                // 加载后执行
                // 通过控制属性的修改,则可以修改属性标题
                // this.attrs.title = "修改的标题";
            }
        })
    

   

})