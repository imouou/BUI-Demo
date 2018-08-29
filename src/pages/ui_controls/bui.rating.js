loader.define(function(require,exports,module) {

    var uiRating = bui.rating({
            id: "#rating",
            value: 3
        });

        // uiRating.on("change",function (val) {
        //  console.log(val)
        // })

        var uiRating2 = bui.rating({
            id: "#rating2",
            half: true,
            value: 3.7
        });

        var uiRating3 = bui.rating({
            id: "#rating3"
        });

        // 展示星星的
        uiRating3.show(3.4);

        // uiRating.option("half",true)
        //禁止评分
        // uiRating.disabled();
        // 取评分值
        // uiRating.value();
})
