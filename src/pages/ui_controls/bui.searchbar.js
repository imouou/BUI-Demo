loader.define(function(require,exports,module) {

    var uiList;
    
    // var n = 0;
    //搜索条的初始化
    var uiSearchbar = bui.searchbar({
        id:"#searchbar",
        onInput: function(ui,keyword) {
            //实时搜索
            // console.log(++n)
        },
        onRemove: function(ui,keyword) {
            //删除关键词需要做什么其它处理
            // console.log(keyword);
        },
        callback: function (ui,keyword) {
            
            if( uiList ){
                
                //点击搜索清空数据
                $("#scrollSearch .bui-list").html('');
                // 重新初始化数据
                uiList.init({
                    page: 1,
                    data: {
                        "keyword":keyword
                    },
                    onRefresh: onRefresh,
                    onLoad: onLoad
                });
                
            }else{
                // 列表初始化
                uiList = bui.list({
                    id: "#scrollSearch",
                    url: siteDir + "userlist.json",
                    field: {
                        data:"data"
                    },
                    data: {
                        "keyword":keyword
                    },
                    page:1,
                    pageSize:9,
                    onRefresh: onRefresh,
                    onLoad: onLoad,
                    template: template,
                    callback: function(argument) {
                        console.log($(this).text())
                    }
                });

                // 监听刷新事件,把最后一条数据清空
                uiList.on("refreshbefore",function () {

                    uiList.option("data",{
                            "lastid":""
                        });
                })

            }

            // 下拉刷新
            function onRefresh() {
                // 修改请求的时候关键词的改变
                uiList.option("data",{
                    "keyword":keyword
                });
            }
            // 上拉加载
            function onLoad(argument) {
                // 修改请求的时候关键词的改变
                uiList.option("data",{
                    "keyword":keyword
                });
            }
            
        }

    });
        
// 列表生成模板
    function template (data) {
        var html = "";

        $.each(data,function(index, el) {

            html += '<li class="bui-btn"><i class="icon-facefill"></i>'+el.name+'</li>';
        });

        return html;
    }
})
