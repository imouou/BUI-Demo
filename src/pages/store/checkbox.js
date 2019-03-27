loader.define(function(require, exports, module) {


    var bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            show: true,
            citys: ["广州", "深圳"],
            sex: "女",
        },
        methods: {},
        watch: {},
        computed: {},
        templates: {},
        mounted: function() {
            // 加载后执行
        }
    })

})