loader.define(function(require,exports,module) {

        //动态创建, 多组number 通过选择器, 避免跟其它页面冲突, 如果是在tab里面, 样式需要是唯一的
        var uiNumber = bui.number({
          id: router.$(".bui-number")
        })


        // 单个获取
        $('#getValue').on("click",function (argument) {

            var val = uiNumber.value();
            console.log(val)
        })

        //批量设置值
        $('#setValue').on("click",function (argument) {

            var val = uiNumber.value(9);
        })


        // 多个取值
        $('#getValues').on("click",function (argument) {

            var val = uiNumber.values();

            console.log(val)
        })

        // 多个设置值
        $('#setValues').on("click",function (argument) {

            uiNumber.values([{
                id:"product01",
                value: 7
            },{
                id:"product02",
                value: 4
            }])
        })


})
