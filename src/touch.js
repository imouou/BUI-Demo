bui.ready(function () {
    // 焦点图 js 初始化:
    //     let eventTouch={
    //         touchstart:"touchstart",
    //         touchmove:"touchmove",
    //         touchend:"touchend",
    //         touchcancel:"touchcancel",
    //     }
    //     if (bui.platform.isPC()) {
    //         eventTouch={
    //             touchstart:"mousedown",
    //             touchmove:"mousemove",
    //             touchend:"mouseup",
    //             touchcancel:"mouseup",
    //         }
    //     }
    //     console.log(eventTouch)
    //     var flag=false;
    //     var cur = {
    //         x:0,
    //         y:0
    //     }
    //   var nx,ny,dx,dy,x,y ;

    //     $("#target").on(eventTouch.touchstart,"", function (e) {
    //         console.log(e, "start")
    //         flag = true;

    //         // var touch ;
    //         // if(e.touches){
    //         // touch = e.touches[0];
    //         // }else {
    //         // touch = e;
    //         // }
    //         // cur.x = touch.clientX;
    //         // cur.y = touch.clientY;
    //         // dx = $(this).parent()[0].offsetLeft;
    //         // dy = $(this).parent()[0].offsetTop;
    //     })
    //     $("#target").on(eventTouch.touchmove,"", function (e) {
    //         if(flag){
    //         console.log(e, "move")

    //             // var touch ;
    //             // if(e.touches){
    //             //   touch = e.touches[0];
    //             // }else {
    //             //   touch = e;
    //             // }
    //             // nx = touch.clientX - cur.x;
    //             // ny = touch.clientY - cur.y;
    //             // x = dx+nx;
    //             // y=dy+ny;
    //             // $(this).parent().css({
    //             //     "left": x+"px",
    //             //     "top":y +"px"
    //             // })

    //             //阻止页面的滑动默认事件
    //             // document.body.addEventListener("touchmove",function(e){
    //               e.preventDefault();
    //             // },false);
    //           }
    //     })
    //     $("#target").on(eventTouch.touchend, "",function (e) {
    //         flag = false;
    //             console.log(e,"end")
    //     })

    window.uiTouch = bui.touch({
        id: "#target",
        // children: ".children",
        // stopHandle: ".other2",
        moveType: "transform",
        // direction: "x"
    }).dragable({
        onDragstart: function (e, touch) {
            console.log(touch.offsetLeft, touch.offsetTop)
        },
        onDragmove: function (e, touch) {
            // console.log(touch.lastX, touch.lastY, touch.offsetLeft)

        },
    });
})