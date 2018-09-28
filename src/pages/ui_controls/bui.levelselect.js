﻿loader.define(function(require,exports,module) {


    var citySelect = null,
        citySelect2 = null;
    // 绑定数据
    loader.import("json/citys.js",function () {
        
        // 普通初始化
        citySelect = bui.levelselect({
            data: citys,
            title: "所在地区",
            trigger: ".selected-val",
            level: 3,
            field:{
                name: "n",
                data: ["c","a"],
            }
        })

        // citySelect.on("change",function (e) {
        //     console.log(e.target)
        // })
        // 设置值
        citySelect2 = bui.levelselect({
            data: citys,
            title: "所在地区",
            trigger: ".selected-vals",
            level: 3,
            field:{
                name: "n",
                data: ["c","a"],
            },
            value: ["广东","广州市","天河区"]
        })


    })

    $("#chooseCity").on("click",function () {
        citySelect.show();
    })
    $("header").on("click",function () {
        citySelect.value();
    })
    $("#chooseCity2").on("click",function () {
        citySelect2.show();
    })

})
