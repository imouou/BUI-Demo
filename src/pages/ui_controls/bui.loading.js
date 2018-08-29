loader.define(function(require,exports,module) {

    //引用控件 bui.loading() 不加appendTo参数时,loading添加在整个页面
    // 默认效果1: 
        // var uiLoading = bui.loading({
        //     appendTo:"#loading",
                // display: "inline",
                // width: 20,
                // height: 20,
                // opacity: 1,
        //     callback: function (argument) {
        //         console.log("clickloading")
        //     }
        // });
    // 默认效果2: 
        var uiLoading = bui.loading({
            appendTo:"#loading",
            callback: function (argument) {
                console.log("clickloading")
            }
        });

        //开始
        $('#start').on("click",function (argument) {
            uiLoading.start();
        })
        //暂停
        $('#pause').on("click",function (argument) {
            uiLoading.pause();
        })
        //添加
        $('#add').on("click",function (argument) {
            uiLoading.start();
        })
        //移除
        $('#remove').on("click",function (argument) {
            uiLoading.stop();
        })
        //显示
        $('#show').on("click",function (argument) {
            uiLoading.show();
        })
        //隐藏
        $('#hide').on("click",function (argument) {
            uiLoading.hide();
        })
        //修改文本
        $('#text').on("click",function (argument) {
            uiLoading.text("修改文本");
        })
        //显示圈圈
        $('#showRing').on("click",function (argument) {
            uiLoading.showRing();
        })
        //隐藏圈圈
        $('#hideRing').on("click",function (argument) {
            uiLoading.hideRing();
        })
        
})
