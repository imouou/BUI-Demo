loader.define(function(require, exports, module) {

    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                message: "Hello bui.js",
                num: 80,
            },
            methods: {
                reverseMessage: function (e) {
                    var a = this.message.split(' ').reverse().join(' ')
                    this.message = a;
                }
            },
            watch: {},
            computed: {},
            templates: {},
            mounted: function () {
                // 加载后执行
            }
        })

})