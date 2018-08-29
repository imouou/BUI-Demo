loader.define(function(require,exports,module) {

    var uiMask = bui.mask({
            appendTo:"#swipePage",
            callback: function (argument) {
                uiSwipe.close();
                uiMask.hide();
            }
        });
    var uiSwipe = bui.swipe({
        id: "#sidebarWrap",
        handle: ".bui-page",
        movingDistance: 200,
        direction: "xy",
    });


    var uiSwipe2 = bui.swipe({
        id: "#list",
        handle:".handle",
        movingDistance: 100,
        hasChild:true,
        direction: "x",
    })
    var uiSwipe3 = bui.swipe({
        id: "#list2",
        handle:".handle",
        movingDistance: 100,
        hasChild:true,
        width:200,
        direction: "x"
    })

    uiSwipe.on("open",function (e,touch) {
        uiMask.show();
    })
    uiSwipe.on("close",function (argument) {
        uiMask.hide();
    })

    // uiSwipe.open();
    // pc 点击遮罩没阻止冒泡
    $(".handle").on("click",function (e) {
        alert("12");
        e.stopPropagation();
    })

    // 快速初始化
    var uiSlide = bui.slide({
        id:"#slide",
        height:200,
        // 如果焦点图的高度要保持跟设计稿一致,需要设置zoom:true
        zoom: true,
        // autoplay: true
    })

})
