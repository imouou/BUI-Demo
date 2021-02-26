loader.define(function(require, exports, module, global) {

    var pageview = {};

    loader.on("click:submit", function() {
        console.log("点击了提交按钮")
    })
    loader.on("click:reset", function() {
        console.log("点击了重置按钮")
    })
    return pageview;
})