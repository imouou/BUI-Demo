loader.define(function(require,exports,module) {

    //静态自定义对话框
    var dialog = bui.dialog({
            id: "#actionsheet",
            position:"bottom",
            effect:"fadeInUp",
            onMask: function (argument) {
                dialog.close();
            }
        });
    
    router.$('#btnOpen').on("click",function (argument) {
        dialog.open();
    })
})
