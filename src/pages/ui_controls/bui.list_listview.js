loader.define(function(require,exports,module) {

    /*
        单页点击跳转的还是当前页面, 
        所以会涉及到控件的区域问题,
        不能使用id, 
        通过获取当前页面的滚动控件
    */ 
    var currentPage = router.currentPage();
    var currentList = $(".bui-scroll",currentPage);
    var currentListview = $(".bui-listview",currentPage);

    var uiList = bui.list({
            id: currentList,
            url: siteDir+"userlist.json",
            children:".bui-listview",
            handle:"li",
            page:1,
            pageSize:9,
            template: template,
            //如果分页的字段名不一样,通过field重新定义
            field: {
                page: "page",
                size: "pageSize",
                data: "data"
            },
            onRefresh: function (scroll) {
                //初始化listview
                // uiListviewInit();
                console.log( this.option("page") );
                
            },
            onLoad: function (scroll) {
                console.log( this.option("page") );
                //初始化listview
            },
            callback: function (argument) {
                console.log("点击整行")
            }
        });

        //加载初始化列表侧滑控件
        var uiListview = bui.listview({
            id: currentListview,
            //data: [{ "text": "修改", "classname":"primary"}],
            callback: function (e,menu) {
                console.log("listview callback")

                //关闭菜单
                menu.close();
            }
        });

    //生成模板
    function template (data) {
        var html = "";
        $.each(data,function(index, el) {
            // status=1 手动拼接侧滑菜单,这样可以避免再次dom操作
            // 设置高度可以少遍历一次
            html +='<li status="1" style="height:46px;">';
            // html +='<li>';
            html +='    <div class="bui-btn bui-box" href="pages/ui_controls/bui.list_listview.html?id=11">';
            html +='        <div class="span1">'+el.name+'</div>';
            html +='        <i class="icon-listright"></i>';
            html +='    </div>';
            html +='    <div class="bui-listview-menu swipeleft">';
            html +='        <div class="bui-btn primary">修改</div>';
            html +='        <div class="bui-btn danger">删除</div>';
            html +='    </div>';
            html +='</li>';

        });

        return html;
    }
})
