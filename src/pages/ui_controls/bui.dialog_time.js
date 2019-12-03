loader.define(function(require, exports, module) {

    // 倒计时
    var timer = bui.timer({
        target: ".timedown",
        onEnd: function(e) {
            $(e.target).text("同意");
            $(e.target).parent().click(function() {
                uiDialog.close();
            })
        },
        times: 5
    })

    // 自定义居中弹出框
    var uiDialog = bui.dialog({
        id: "#dialogCenter",
        height: 300,
        autoClose: false,
        callback: function(e) {
            console.log(e.target)
        }
    }).on("open", function() {
        if (timer) {
            timer.start();
            timer = null;
        }
    });

    router.$('#btnOpen').on("click", function() {
        uiDialog.open();
    })

})