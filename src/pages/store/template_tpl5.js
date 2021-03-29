loader.define(function (require, exports, module) {
    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            num:10,
            "list": [{
                "id": "i1",
                "title": "我是列表1",
                "check": false,
                "value": 1,
            }, {
                "id": "i2",
                "title": "我是列表2",
                "check": false,
                "value": 2,
            }]
        },
        methods: {
        },
        templates: {
            tplList: function (data, dd) {
                console.log(data)
                var html = "";
                if (data.length) {
                    data.forEach(function (item, i) {
                        html+= `<li class="bui-btn bui-btn-parent"><input type="text" b-model="page.list.$index.value" b-target=".bui-btn-parent"/></li>`;
                    })
                }

                return html;
            }
        },
        mounted: function () {

            // 数字条 js 初始化:
            var uiNumber = bui.number({
                id: "#uiNumber",
                onChange: function () {
                    // console.log(this.value())
                    bs.set("list.0.value",this.value())
                    bs.set("list.1.value",this.value())
                }
            })
           
        }
    })


})