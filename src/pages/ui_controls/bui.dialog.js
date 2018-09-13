loader.define(function(require,exports,module) {
    // 自定义居中弹出框
    var uiDialog = bui.dialog({
            id: "#dialogCenter",
            height: 300,
            // mask: false,
            callback: function () {
                uiDialog.close();
            }
        });
    
    router.$('#btnOpen').on("click",function () {
        uiDialog.open();
    })

    // 右边出来对话框
    var uiDialogRight = bui.dialog({
            id:"#dialogRight",
            effect: "fadeInRight",
            position: "right",
            fullscreen: true,
            buttons: []
        });

    // 自定义确定按钮事件
    router.$("#makeSure").on("click",function () {
        uiDialogRight.close();
    });

    router.$('#btnOpenFilter').on("click",function () {
        uiDialogRight.open();
    })


})
