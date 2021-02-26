loader.define(function (require, exports, module) {
    if (window.location.href.indexOf("%23")) {
        window.location.href = window.location.href.replace("%23", "#")

    }
    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            list: ["我是列表1", "我是列表2", {
                "name": "我是列表"
            }]
        },
        templates: {
            tplList: function (data, dd) {
                // console.log(dd)
                var html = "";
                html += `<component id="search" name="pages/components/searchbar/index"></component>`;

                return html;
            }
        },
        mounted: function () {

            // setTimeout(() => {
            // console.log(bui.history.getComponent("search"))

            //例如: <component id="list" name="xxxx"></component>
            // loader.waited(["search"], function (list) {
            //     console.log(list);
            // });
            // }, 500)
        }
    })


})