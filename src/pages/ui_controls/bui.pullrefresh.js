loader.define(function(require,exports,module) {

    // pullRefresh 初始化
    var uiPullRefresh;
        uiPullRefresh = bui.pullrefresh({
            id: "#pullrefresh",
            height:300,
            onRefresh : getData
        });

        // uiPullRefresh.refresh();
        // 监听刷新事件
        // uiPullRefresh.on("refresh",function (argument) {
        //     console.log("12")
        // })
        
        // uiPullRefresh.option("lastUpdated",false)
//刷新数据
    function getData () {
        var _self = this;

        bui.ajax({
            url: siteDir+"userlist.json",
            data: {
                pageindex:1,
                pagesize:4
            }
        }).done(function(res) {
            var html = template(res.data);

            $("#pullrefreshList").html(html);

            //还原刷新前状态
            _self.reverse();

        }).fail(function (res) {

            //请求失败变成点击刷新
            uiPullRefresh.fail();
            
        })
    }

    //生成模板
    function template (data) {
        var html = "";

        $(data).each(function(index, el) {

            html += '<li class="bui-btn"><i class="icon-facefill"></i>'+el.name+'</li>';
        });

        return html;
    }
})
