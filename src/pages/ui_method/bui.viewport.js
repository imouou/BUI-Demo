loader.define(function (require, exports, module) {


    // GET请求
    $("#get").click(function () {
        bui.confirm("clientWidth:" + document.documentElement.clientWidth + ";<br>clientHeight:" + document.documentElement.clientHeight + "<br>devicePixelRatio:" + window.devicePixelRatio)
    });

})