loader.define(function(require,exports,module) {

    //静态自定义对话框
    var dialog = bui.dialog({
            id: "#actionsheet",
            position:"bottom",
            onMask: function (argument) {
                dialog.close();
            }
        });
    
    $('#btnOpen').on("click",function (argument) {
        dialog.open();
    })
})
