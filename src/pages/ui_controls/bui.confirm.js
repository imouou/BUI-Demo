loader.define(function(require,exports,module) {

    $('#btnTop').on("click",function  (argument) {
        bui.confirm("消息确认框",function (argument) {
            //this 是指点击的按钮
            var text = $(this).text();

            if( text == "确定"){
                console.log("你点击了"+$(this).text())
            }
        });
        
    })


    $('#success').on("click",function  (argument) {
        bui.confirm({
            "title": "",
            "content":'<div class="bui-box-center"><h3><i class="icon-success success"></i></h3><p>提交成功</p></div>',
            "buttons":[{name:"确定",className:"primary-reverse"}]
        });
    })

    $('#fail').on("click",function  (argument) {
        bui.confirm({
            "title": "",
            "content":'<div class="bui-box-center"><h3><i class="icon-errorfill warning"></i>温馨提醒</h3><p>提交成功</p></div>',
            // "buttons":["取消","确定"]
            "buttons":[{name:"取消",className:""},{name:"确定",className:"primary-reverse"}]
        });
    })

})
