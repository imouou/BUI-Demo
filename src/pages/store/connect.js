loader.define(function(require, exports, module) {

    // 可以在路由init以后,作为整个应用的联动数据处理
    window.bs = bui.store({
        el: ".scope2",
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            attrs: {
                "test": "123",
                "test2": "345"
            },
            arr: ["item1", "item2"]
        },
        methods: {},
        // log: true,
        watch: {},
        computed: {},
        templates: {
            tplA: function(data) {
                var html = "";
                data.forEach(function(item, index) {
                    html += `<li class="bui-btn">${item}</li>`;
                })
                return html;
            }
        },
        mounted: function() {

        }
    })


    window.bs2 = bui.store({
        el: ".scope1",
        scope: "page1", // 用于区分公共数据及当前数据的唯一值
        data: {
            attrs: {
                test: "111"
            },
            props: {
                test: "111"
            },
            test: "111",
            arr: [],
            arr2: []
        },
        methods: {},
        watch: {
            "attrs.test": function(val) {
                console.log("conect触发watch", val)
            },
            "attrs.test2": function(val) {
                console.log("conect触发watch2", val)
            },
            "attrs": function(val) {
                console.log("conect触发整个对象的变更", val)
            }
        },
        computed: {
            testValue: function() {
                return this.arr;
            }
        },
        templates: {
            tplA: function(data) {
                var html = "";
                data.forEach(function(item, index) {
                    html += `<li class="bui-btn">${item}</li>`;
                })
                return html;
            }
        },
        mounted: function() {

        }
    })


    // 关联1: 关联相同字段
    // bs.connect(bs2);

    // 关联2: 关联到不同字段
    // bs.connect(bs2, "attrs", "props");


    // 关联3: 关联到根路径
    // bs.connect(bs2, "attrs", "");
})