loader.define(function (require, exports, module) {

    // 快速初始化
    var uiSlide = bui.slide({
        id: "#slidePic",
        height: 300,
        // swipe: false
    })

    // let eventTouch = {
    //     touchstart: "touchstart",
    //     touchmove: "touchmove",
    //     touchend: "touchend",
    //     touchcancel: "touchcancel",
    // }
    // if (bui.platform.isPC()) {
    //     eventTouch = {
    //         touchstart: "mousedown",
    //         touchmove: "mousemove",
    //         touchend: "mouseup",
    //         touchcancel: "mouseup",
    //     }
    // }
    // console.log(eventTouch)
    // var flag = false;
    // var cur = {
    //     x: 0,
    //     y: 0
    // }
    // var nx, ny, dx, dy, x, y;

    // $("#slidePic").on(eventTouch.touchstart, ".bui-slide-main > ul", function (e) {
    //     console.log(e, "start")
    //     flag = true;

    //     // var touch ;
    //     // if(e.touches){
    //     // touch = e.touches[0];
    //     // }else {
    //     // touch = e;
    //     // }
    //     // cur.x = touch.clientX;
    //     // cur.y = touch.clientY;
    //     // dx = $(this).parent()[0].offsetLeft;
    //     // dy = $(this).parent()[0].offsetTop;
    // })
    // $("#slidePic").on(eventTouch.touchmove, ".bui-slide-main > ul", function (e) {
    //     if (flag) {
    //         console.log(e, "move")

    //         // var touch ;
    //         // if(e.touches){
    //         //   touch = e.touches[0];
    //         // }else {
    //         //   touch = e;
    //         // }
    //         // nx = touch.clientX - cur.x;
    //         // ny = touch.clientY - cur.y;
    //         // x = dx+nx;
    //         // y=dy+ny;
    //         // $(this).parent().css({
    //         //     "left": x+"px",
    //         //     "top":y +"px"
    //         // })

    //         //阻止页面的滑动默认事件
    //         // document.body.addEventListener("touchmove",function(e){
    //         e.preventDefault();
    //         // },false);
    //     }
    // })
    // $("#slidePic").on(eventTouch.touchend, ".bui-slide-main > ul", function (e) {
    //     flag = false;
    //     console.log(e, "end")
    // })

    router.$("#prev").on("click", function () {
        uiSlide.prev();
    })
    router.$("#next").on("click", function () {
        uiSlide.next();
    })
    router.$("#autoplay").on("change", function () {
        var isChecked = $(this).is(":checked");
        if (isChecked) {
            uiSlide.start();
        } else {
            uiSlide.stop();
        }
    })
    router.$("#unlock").on("change", function () {
        var isChecked = $(this).is(":checked");
        if (isChecked) {
            uiSlide.unlock();
        } else {
            uiSlide.lock();
        }
    })
})