loader.define(function (require, exports, module) {

    // 可以在路由init以后,作为整个应用的联动数据处理
    var bs = bui.store({
        el: ".scope2",
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            attrs: {
                "test": "123",
                "test2": "345"
            },
            arr: [{
                keyword: "test"
            }]
        },
        methods: {},
        // log: true,
        watch: {},
        computed: {},
        templates: {
            tplA: function (data) {
                var html = "";
                data.forEach(function (item, index) {
                    html += `<li class="bui-btn">${item.keyword}</li>`;
                })
                return html;
            }
        },
        mounted: function () {

            //例如: <component id="list" name="xxxx"></component>
            loader.waited(["part"], function (part) {
                bs.connect(part, "arr")
                bs.connect(part, "arr", "other")
                // bs.connect(part, "arr", "other")
            });
        }
    })


    // 关联1: 关联相同字段
    // bs.connect(bs2);

    // 关联2: 关联到不同字段
    // bs.connect(bs2, "attrs", "props");


    // 关联3: 关联到根路径
    // bs.connect(bs2, "attrs", "");
})