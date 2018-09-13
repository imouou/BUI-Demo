loader.define(function(require,exports,module) {

    // 快速初始化
    var uiSlide = bui.slide({
        id:"#slide",
        height:300,
        autopage: true,
    })
    uiSlide.on("to",function (index) {
        var prevIndex = index -1;
        var nextIndex = index +1;
        $(this).removeClass("bui-cross-prev")
                .removeClass("bui-cross-next")
        $(this).prev().addClass("bui-cross-prev");
        $(this).next().addClass("bui-cross-next");
    }).to(0);

})
