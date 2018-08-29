loader.define(function(require,exports,module) {

    //页面接收参数的示例
    $("#getPageParams").on("click",function (argument) {
         bui.getPageParams(function (res) {
            var param = res;

            bui.alert(param);
         });
    })
    /**
     * 事件示例
     */
    
    //提交
    bui.btn("#submit").submit(function (loading) {
        //alert("数据正在提交")
        //关闭进度条,放在ajax的成功回调里面
        //loading.stop();

    })
})
