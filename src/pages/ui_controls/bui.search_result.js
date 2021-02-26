/**
 * 首页模块
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (require, exports, module) {

    var bs = bui.store({
        el: `#${module.id}`,
        scope: "search",
        data: {
            result: [],
        },
        methods: {},
        templates: {
            tplSearch: function (data) {
                var html = "";
                data.forEach(function (item, index) {
                    html += `<li class="bui-btn bui-box">
                            <div class="span1">${item.CityName}</div>
                        </li>`
                })
                return html;
            }
        },
        mounted: function () {
            // 数据解析后执行
            var params = bui.history.getParams(module.id);

            this.result.$replace(params.data);
        }
    })


    // 输出模块
    return bs;
})