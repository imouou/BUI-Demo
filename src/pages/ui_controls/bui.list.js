loader.define(function(require,exports,module) {
    var uiList = bui.list({
            id: "#scrollList",
            url: siteDir+"userlist.json",
            pageSize:9,
            template: template,
            data: {},
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
            html +=`<li class="bui-btn bui-box">
                <div class="bui-thumbnail bui-sub" data-sub="新品"><img src="images/list-img1.png" alt=""></div>
                <div class="span1">
                    <h3 class="item-title">幸福西饼生日蛋糕</h3>
                    <p class="item-text">天河区岑村</p>
                    <p class="item-text">3公里</p>
                </div>
                <span class="price"><i>￥</i>50</span>
            </li>`
        });

        return html;
    }

})
