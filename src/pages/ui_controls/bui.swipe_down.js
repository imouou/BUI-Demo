loader.define(function(require,exports,module) {

    var uiSwipe = bui.swipe({
            id: "#uiSwipeDown",
            handle: ".todo",
            movingDistance: 510,
            // handle初始化位置
            initDistance: 150,
            // 滑动的目标不要跟着滑动
            targetMove: false,
            //采用缩放才能保证不同终端的高度距离正确
            zoom: true,
            direction: "y",
        });

        uiSwipe.on("open",function (argument) {
            // 禁止滚动条
            $(".todo").css({"overflow":"hidden"})

        })
        uiSwipe.on("close",function (argument) {
            // 允许滚动条
            $(".todo").css({"overflow":"auto"})
        })

        // 默认打开状态
        // uiSwipe.open({
        //     target:"swipedown",
        //     transition:"none"
        // })

        // 滑动上来的高度的计算 remToPx 1.5 来源于初始化 initDistance 的值, 如果zoom是FALSE 这里直接是150.
        var todoHeight = $(window).height() - $("header").height() - bui.unit.remToPx(1.5);

        $(".todo").height(todoHeight);

})
