loader.define(function(require,exports,module) {

    // 快速初始化
    var uiSlide = bui.slide({
        id:"#slide",
        height:380,
        autopage: true,
        // autoplay: true
    })

    $("#prev").on("click",function () {
        uiSlide.prev();
    })
    $("#next").on("click",function () {
        uiSlide.next();
    })
    $("#autoplay").on("change",function () {
        var isChecked = $(this).is(":checked");
        if( isChecked ){
            uiSlide.start();
        }else{
            uiSlide.stop();
        }
    })
    $("#unlock").on("change",function () {
        var isChecked = $(this).is(":checked");
        if( isChecked ){
            uiSlide.unlock();
        }else{
            uiSlide.lock();
        }
    })
    $("#to").on("click",function () {
        uiSlide.to(1);
    })
})
