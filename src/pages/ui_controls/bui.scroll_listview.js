loader.define(function(require,exports,module) {

    var uiScroll = bui.scroll({
            id: "#scrollListview",
            children: ".bui-listview li",
            page:1,
            pageSize:5,
            onRefresh: refresh,
            onLoad: getData,
            height:300
        })
        
        //刷新数据
        function refresh () {

            page = 1;
            pagesize = 5;

            getData(page,pagesize,"html");
        }
        //滚动加载下一页
        function getData (start,pagesize,command) {
            
            command = command || "append";

            bui.ajax({
                url: "http://www.easybui.com/demo/json/userlist.json",
                data: {
                    pageindex:start,
                    pagesize:pagesize
                }
            }).done(function(res) {
                
                //生成html
                var html = "";
                    $.each(res.data,function(index, el) {

                        html += '<li><div class="bui-btn"><i class="icon-facefill"></i>'+el.name+'</div></li>';
                    });

                $("#scrollList")[command](html);

                //更新分页信息,如果高度不足会自动请求下一页
                uiScroll.updateCache(start,res.data);
                uiScroll.reverse();

                //初始化列表控件
                var listView = bui.listview({
                        id: "#scrollList",
                        data: [{ "text": "修改", "classname":"primary"}],
                        direction:"right",  //默认就是右边,所以可以不用传
                        callback: function (e,menu) {
                            
                            //关闭菜单
                            menu.close();
                        }
                    });

            }).fail(function (res) {

                // 可以点击重新加载
                uiScroll.fail(start,pagesize,res);
            })
        }
})
