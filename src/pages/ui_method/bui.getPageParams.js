loader.define(function(require,exports,module) {
    
    // 获取页面参数 1.3.1 版本推荐
    var getParams = bui.getPageParams();
        getParams.done(function (result) {
            // result 是一个对象
            $("#btn").on("click",function () {
                bui.alert(result)
            })
        })
})
