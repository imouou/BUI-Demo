loader.define(function(require,exports,module) {

    // 验证码示例
    var $btnSend = $("#btnSend");
    var timer = bui.timer({
            onEnd: function () {
                $btnSend.removeClass("disabled").text("重新获取验证码");
            },
            onProcess: function (times) {
                var valWithZero = times < 10 ? "0"+times : times;
                $btnSend.text(valWithZero+"后重新获取");
            },
            times: 10
        });

    $btnSend.on("click",function (argument) {
        var hasDisabled = $(this).hasClass("disabled");
        if( !hasDisabled ){
            $(this).addClass("disabled")
            bui.hint("验证码发送成功")
            timer.restart();
            
        }
    })
    //动态绑定
    var uiSelect = bui.select({
            trigger:"#select",
            title:"请选择区域",
            type:"checkbox",
            data : [{
                "name":"广东",
                "value":"11"
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
            }]

        });

    // 兴趣多选列表
    var selectList2 = bui.select({
            id:"#selectList2",
            type:"checkbox",
            popup: false
        });
        selectList2.on("change",function () {
            var val = selectList2.text();

            $("#selectList2-value").text(val)
        })

    // 性别单选列表
    var selectList3 = bui.select({
            id:"#selectList3",
            type:"radio",
            popup: false
        });
        selectList3.on("change",function () {

            var val = selectList3.text();
            console.log(val)

            $("#selectList3-value").text(val)
        })

    // 性别单选列表-样式2
    var selectList4 = bui.select({
            id:"#selectList4",
            type:"radio",
            popup: false
        });
        selectList4.on("change",function () {

            var val = selectList4.text();
            console.log(val)

            $("#selectList4-value").text(val)
        })

    // 违章提醒如果不初始化,无法点击整行
    var uiSelect2 = bui.select({
            id:"#selectLine",
            type:"checkbox",
            popup: false
        });

     $('.bui-input').on('click', function () {
            var target = this;
            // 使用定时器是为了让输入框上滑时更加自然
            setTimeout(function(){
              target.scrollIntoView(true);
            },100);
          });
})
