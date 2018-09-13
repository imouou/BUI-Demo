loader.define(function(require,exports,module) {

        var uiMask = bui.mask({
            appendTo:".message",
            callback: function (argument) {
                uiSwipe.close();
                uiMask.hide();
            }
        });
        var uiSwipe = bui.swipe({
            id: "#uiSwipeDown",
            handle: ".message",
            height: 530,
            zoom: true,
            direction: "y",
        });

        uiSwipe.on("open",function (e,touch) {
            uiMask.show();
        })
        uiSwipe.on("close",function (argument) {
            uiMask.hide();
        })

})
