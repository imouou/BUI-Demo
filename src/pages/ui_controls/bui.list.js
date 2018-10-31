loader.define(function(require,exports,module) {
    var uiList = bui.list({
            id: "#scrollList",
            url: siteDir+"shop.json",
            pageSize:5,
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
                // }
            },
            template: function (data) {
                var html = "";
                data.map(function(el, index) {

                    // 处理角标状态
                    var sub = '' , subClass = '' ;
                    switch(el.status){
                        case 1:
                        sub = '新品';
                        subClass = 'bui-sub';
                        break;
                        case 2:
                        sub = '热门';
                        subClass = 'bui-sub danger';
                        break;
                        default: 
                        sub = '';
                        subClass = '';
                        break;
                    }

                    html +=`<li class="bui-btn bui-box">
                        <div class="bui-thumbnail ${subClass}" data-sub="${sub}"><img src="${el.image}" alt=""></div>
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
        });
    
    

})
