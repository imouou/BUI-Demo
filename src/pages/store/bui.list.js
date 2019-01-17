loader.define(function(require, exports, module) {

    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                lists: []
            },
            templates: {
                tplList: function (data) {
                    var html = "";
                    data.forEach(function (item,i) {
                        html += `<li class="bui-btn"><i class="icon-facefill"></i>${item.name}</li>`;
                    })
                    return html;
                }
            },
            mounted: function (argument) {
                var _self = this;

                this.list = bui.list({
                    id: "#listStore",
                    url: "json/userlist.json",
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