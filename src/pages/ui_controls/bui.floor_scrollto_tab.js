/**
 * 首页模块
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function (require, exports, module) {

    var pageview = {};

    // 模块初始化定义
    pageview.init = function () {

        // html:
        // <div id="uiTab" class="bui-tab"></div>
        var uiTab = bui.tab({
            id: "#uiTabCity",
            // position: "bottom",
            menu: "#navCity",
            scroll: false,
            data: [{
                id: "uiTabCity0",
                // icon: "icon-home",
                title: "国内城市",
                // everytime: true,
                name: "pages/ui_controls/bui.floor_scrollto_part",
                param: {
                    type: "cn"
                }
            }, {
                id: "uiTabCity1",
                // icon: "icon-menu",
                // everytime: true,
                title: "国际城市",
                name: "pages/ui_controls/bui.floor_scrollto_part",
                param: {
                    type: "en"
                },
            }]
        })

        var uiPage = null
        var uiSearchbar = bui.searchbar({
            id: "#searchbar",
            onInput: function (ui, keyword) {
                //实时搜索
                // console.log(++n)
                // list1为id
                var search = this;
                if (keyword) {

                    var index = uiTab.index();
                    // list1为id
                    var cityDistance = bui.history.getComponent("uiTabCity" + index);

                    var result = cityDistance.filter(keyword) || [];

                    if (uiPage) {
                        uiPage.reload({
                            param: {
                                data: result
                            }
                        });
                        uiPage.open();
                        return;
                    }
                    uiPage = bui.page({
                        url: "pages/ui_controls/bui.search_result.html",
                        close: true,
                        style: {
                            top: "1rem"
                        },
                        effect: "showIn",
                        param: {
                            data: result
                        },
                        closed: function () {
                            search.reset();
                        }
                    });
                } else {
                    uiPage && uiPage.close();
                }

            },
            onRemove: function (ui, keyword) {
                //删除关键词需要做什么其它处理
                // console.log(keyword);
                uiPage && uiPage.close();
            },
            callback: function (ui, keyword) {
                // list1为id
                // var index = uiTab.index();
                // // list1为id
                // var cityDistance = bui.history.getComponent("uiTabCity" + index);

                // uiTab.to({
                //     index: index,
                //     param: { keyword: keyword }
                // })


                // 重新编译
                // loader.delay({
                //     id: "#uiTabCity0",
                //     everytime: true,
                //     param: {keyword:keyword}
                // })
            }

        });
    }

    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})