loader.define(function(require, exports, module) {

    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                a: 123,
            },
            methods: {
                getMessage: function(a,b) {
                    // 参数的最后一个为上下文关系
                    console.log(event)
                    console.log(a)
                    console.log(b)
                    // 事件参数
                    // console.log(event)

                    // router.$(".result").html(JSON.stringify(a)+","+b)
                    
                },
                changeA: function (argument) {
                    this.a++;
                    
                },
                customEvent: function (e) {
                    
                    // 触发自定义事件,参数可以自定义
                    this.trigger("custom","自定义参数",456)
                }

            },
            watch: {
                // watch的改变
                a: function (newVal,oldVal) {
                    console.log(newVal);
                    console.log(oldVal);
                }
            },
            computed: {},
            templates: {},
            mounted: function () {
                // 自定义事件监听
                this.on("custom",function (e,b) {
                    console.log(e)
                    console.log(b)
                })

            }
        })

    

})