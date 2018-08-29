loader.define(function(require,exports,module) {

    // 快速初始化
    var uiSlide = bui.slide({
        id:"#slide",
        height:200,
        // 如果焦点图的高度要保持跟设计稿一致,需要设置zoom:true
        zoom: true
        // autoplay: true
    })

    $("#prev").on("click",function () {
        uiSlide.prev();
    })
    $("#next").on("click",function () {
        uiSlide.next();
    })
    $("#start").on("click",function () {
        uiSlide.start();
    })
    $("#stop").on("click",function () {
        uiSlide.stop();
    })
    $("#lock").on("click",function () {
        uiSlide.lock();
    })
    $("#unlock").on("click",function () {
        uiSlide.unlock();
    })
    $("#to").on("click",function () {
        uiSlide.to(1);
    })
    // 全屏,需要重新渲染结构,所以通过option方法修改参数
    $("#fullscreen").on("click",function () {
        uiSlide.option("fullscreen",true);
    })

    // 退出全屏
    $("#slide").on("click",function () {

        if( uiSlide.option("fullscreen") ){

            uiSlide.option("fullscreen",false);
        }
    })
})
