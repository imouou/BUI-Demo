loader.define(function(require,exports,module) {

    //动态绑定
    var uiSelectCustom = bui.select({
            id:"#selectCustom",
            popup: false,
            type:"checkbox",
            data: [{
                "name":"广东",
                "value":"11",
            },{"name":"广西",
                "value":"22"
            },{
                "name":"上海",
                "value":"33"
            },{"name":"北京",
                "value":"44"
            },{
                "name":"深圳",
                "value":"55"
            },{"name":"南京",
                "value":"66"
            }],
            onChange: function (module,index) {
                // console.log($(this).val())
            }
        });

    $("#selectAll").on("click",function (argument) {
        uiSelectCustom.selectAll();
    })

    $("#selectNone").on("click",function (argument) {
        uiSelectCustom.selectNone();
    })

    $("#unselect").on("click",function (argument) {
        uiSelectCustom.unselect();
    })

    $("#queding").on("click",function (argument) {

        console.log(uiSelectCustom.text() );
    })

    //静态态绑定
    var uiSelectCustom2 = bui.select({
            id:"#selectCustom2",
            popup: false,
            type:"checkbox",
            onChange: function (module,index) {
                // console.log($(this).val())
            }
        });

    $("#selectAll2").on("click",function (argument) {
        uiSelectCustom2.selectAll();
    })

    $("#selectNone2").on("click",function (argument) {
        uiSelectCustom2.selectNone();
    })

    $("#unselect2").on("click",function (argument) {
        uiSelectCustom2.unselect();
    })

    $("#queding2").on("click",function (argument) {

        console.log(uiSelectCustom2.text() );
    })
})
