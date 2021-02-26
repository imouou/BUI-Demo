loader.define(function(require, exports, module) {
console.log(12344)
    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            list: ["我是列表1", "我是列表2", { "name": "我是列表" }]
        },
        templates: {
            tplList: function(data, dd) {
                // console.log(dd)
                var html = "";
                if (data.length) {
                    data.forEach(function(item, i) {
                        var itemstr = typeof item === "object" ? JSON.stringify(item) : item;
                        html += `<li class="bui-btn" b-class="page.active.$index" b-click='page.getClick($index)'>
                        ${itemstr}</li>`;
                    })
                } else {
                    html = `<li class="bui-btn">暂无数据</li>`;
                }

                return html;
            }
        }
    })


})