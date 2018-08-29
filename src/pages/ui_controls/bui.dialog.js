loader.define(function(require,exports,module) {
    
    var uiDialog = bui.dialog({
            id: "#dialog3",
            height: 200,
            // mask: false,
            callback: function () {
                uiDialog.close();
            }
        });
    // // uiDialog.on("open",function () {
    //  console.log(this)
    // })
    // uiDialog.on("close",function () {
    //  console.log()
    // })
    // uiDialog.option("fullscreen",true);
    $('#btnOpen').on("click",function () {
        uiDialog.open();
    })
})
