loader.define(function(require,exports,module) {

        //动态创建
        var uiNumber = bui.number({
                id: '#number',
                value: 5,
                min: 1,
                // max: 10
            })

        uiNumber.on("change",function (val) {
            console.log(312321)
            // if( val > 10){
            //     bui.hint("超出最大值");
            // }
        })
        

        //静态绑定
        var uiNumber2 = bui.number({
                id: '#number2',
                value: 5,
                min: 1,
                max: 10,
                render: false
            })

        // //取值
        $('#getValue').on("click",function (argument) {

            var val = uiNumber2.value();

            bui.hint(val)
        })
        
        //设置值
        $('#setValue').on("click",function (argument) {

            var val = uiNumber2.value(9);
            bui.hint(val);
        })

        
})
