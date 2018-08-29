
loader.define(function(require,exports,module) {
    var uiScroll;

    uiScroll = bui.scroll({
            id: "#scroll",
            children: ".bui-list",//循环遍历的数据的父层,如果不对,会出现无限滚动的情况
            page:1,
            pageSize:5,
            // autoNext: false,
            onRefresh: refresh,
            onLoad: getData,

            callback: function (argument) {
                
            },
            height:300
        });

    //刷新数据
    function refresh () {

        var page = 1;
        var pagesize = 5;

        getData(page,pagesize,"html");
    }
    //滚动加载下一页
    function getData (page,pagesize,command) {
        
        //跟刷新共用一套数据
        var command = command || "append";

        bui.ajax({
            url: siteDir + "userlist.json",
            data: {
                pageindex:page,
                pagesize:pagesize
            }
        }).done(function(res) {

            //生成html
            var html = template( res.data );
                
            $("#scrollList")[command](html);
            $("#scrollList")[0].scrollHeight = $("#scrollList").height();

            // 更新分页信息,如果高度不足会自动请求下一页
            uiScroll.updateCache(page,res.data);

            // 刷新的时候返回位置
            uiScroll.reverse();

        }).fail(function (res) {

            // 可以点击重新加载
            uiScroll.fail(page,pagesize,res);
        })
    }

    //生成模板
    function template (data) {

        var html = "";

        $.each(data,function(index, el) {

            html += '<li class="bui-btn"><i class="icon-facefill"></i>'+el.name+'</li>';
        });
        return html;
    }
})
