loader.define(function(require, exports, module) {

    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                lists: []
            },
            templates: {
                tplList: function (data) {
                    var html = "";
                    data.map(function(el, index) {
                        // 演示传参,标准JSON才能转换
                        var param = {"id":index,"title":el.name};
                        var paramStr = JSON.stringify(param);

                        html += `<li class="bui-btn bui-box" href="pages/ui/article.html" param='${paramStr}'>
                            <div class="bui-thumbnail" ><img src="${el.image}" alt=""></div>
                            <div class="span1">
                                <h3 class="item-title">${el.name}</h3>
                                <p class="item-text">${el.address}</p>
                                <p class="item-text">${el.distance}公里</p>
                            </div>
                            <span class="price"><i>￥</i>${el.price}</span>
                        </li>`
                    });
                    return html;
                }
            },
            mounted: function (argument) {
                var _self = this;

                this.list = bui.list({
                    id: "#listStore",
                    url: "http://www.easybui.com/demo/json/shop.json",
                    page:1,
                    pageSize:9,
                    height:0,
                    //如果分页的字段名不一样,通过field重新定义
                    field: {
                        page: "page",
                        size: "pageSize",
                        data: "data"
                    },
                    onRefresh: function (scroll,datas) {
                        // 清空数据
                        bui.array.empty(_self.lists);
                        // 合并新的数据
                        bui.array.merge(_self.lists,datas.data);
                    },
                    onLoad: function (scroll,datas) {
                        
                        bui.array.merge(_self.lists,datas.data)
                    }
                });
            }
        })

})