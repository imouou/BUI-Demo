/**
 * 首页模块
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (require, exports, module) {

    var pageview = {};
    var params = bui.history.getParams(module.id);

    console.log(params.type)
    var cityCache = [];
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "city",
        data: {
            cityData: []
        },
        methods: {
            mergeCity: function (datas) {
                // 扁平化数组
                var data = [];
                if (datas && datas.length) {
                    datas.map(function (item, index) {
                        // 不需要热门城市
                        if (index > 0) {
                            item.Cities.forEach(function (city) {
                                data.push(city)
                            })
                        }
                    })
                }
                return data;
            },
            floorInit: function () {
                var $id = bui.$("#" + module.id);
                // 是否已经展示了,展示不做处理
                var isShow = false;
                var $floor = $id.find(".bui-floor-item"),
                    $floorHead = $id.find(".bui-floor-head"),
                    $floorMenu = $id.find(".addressbook-bar li");

                // 初始化楼层控件
                var uiFloor = bui.floor({
                    id: `#${module.id} .bui-floor`,
                    menu: `#${module.id} .addressbook-bar`,
                    handle: "li",
                    floorItem: ".bui-floor-item", // 默认,可不填
                    area: 0.1 // 接近到顶部才触发
                });

                // 自定义固定头部
                uiFloor.on("scrollto", bui.unit.debounce(function (e) {
                    // console.log(e.target.scrollTop)
                    // console.log(e.index)
                    var text = $floor.eq(e.index).text();
                    if (e.target.scrollTop > 20) {
                        $floorHead.text(text);
                        if (!isShow) {
                            $floorHead.addClass("active");
                            isShow = true;
                        }
                    } else {
                        $floorHead.text(text);
                        $floorHead.removeClass("active");
                        $floorMenu.removeClass("active");
                        isShow = false;
                    }
                }, 10))
            },
            getCity: function () {
                var that = this;
                bui.ajax({
                    url: `json/city${params.type||"cn"}.json`,
                    data: {}, //接口请求的参数
                    // 可选参数
                    method: "GET"
                }).then(function (result) {

                    // 扁平化城市,便于搜索
                    cityCache = that.mergeCity(result.data);
                    // 替换城市数据
                    that.cityData.$replace(result.data);

                    // 初始化楼层索引
                    that.floorInit();
                }, function (result, status) {
                    // 失败 console.log(status)
                });
            },
            filter: function (keyword) {

                return cityCache.filter(function (item, index) {
                    var rule = new RegExp(keyword, "ig")
                    return (rule.test(item.Tags) && item)
                })
            }
        },
        mounted: function () {
            // 获取城市渲染
            this.getCity();

        },
        templates: {
            tplCity: function (data) {

                var html = ``;

                data && data.forEach(function (item, index) {

                    html += `<dt class="bui-btn bui-box bui-floor-item">
                                <div class="span1">${item && item.Letter}</div>
                            </dt>
                            <dd>
                                <ul class="bui-list">`;
                    item && item.Cities.forEach(function (city, i) {
                        html += `<li class="bui-btn bui-box">
                                    <div class="span1">${city.CityName}</div>
                                </li>`
                    })
                    html += `</ul>
                            </dd>`
                })

                return html;
            },
            tplCityLetter: function (data) {

                var html = ``;

                data && data.forEach(function (item, index) {

                    html += `<li>${item && item.Letter.substr(0,1)}</li>`
                })

                return html;
            }
        }
    })

    // 输出模块
    return bs;
})