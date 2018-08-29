loader.define(function(require,exports,module) {
    var uiList = bui.list({
            id: "#scrollList",
            url: siteDir+"userlist.json",
            pageSize:9,
            height:300,
            template: template,
            data: {
                args: { id: 123}
            },
            //如果分页的字段名不一样,通过field重新定义
            field: {
                page: "page",
                size: "pageSize",
                data: "data"
            },
            onRefresh: function (scroll) {
                //刷新的时候执行
                // alert(12)
            },
            onLoad: function (scroll) {
                
                // console.log( this.option("page") );
                // 可以在请求下一页的时候修改data参数
                // this.option("data",{
                //     "lastId":"123",
                // });

            },
            callback: function (e) {
                // 解决点击冒泡问题,指定点击是某个样式才触发
                // if( $(e.target).hasClass("bui-btn") ){
                    // 点击整行的时候执行
                    console.log(this)
                // }
            }
        });

        
    //生成模板
    function template (data) {
        var html = "";
        $.each(data,function(index, el) {

            html += "<li class='bui-btn' href='pages/ui_controls/bui.list.html?id=123'><i class='icon-facefill'></i>"+el.name+"</li>";
        });

        return html;
    }

})
