loader.define(function (require, exports, module) {

    let user = null;


    var uiList = bui.list({
        id: "#scrollList",
        url: "http://easybui.com/demo/json/shop.json",
        pageSize: 5, // 当pageSize 小于返回的数据大小的时候,则认为是最后一页,接口返回的数据最好能返回空数组,而不是null
        data: {
            test: 111
        },
        // handleMove:"head",
        //如果分页的字段名不一样,通过field重新定义
        field: {
            page: "page",
            size: "pageSize",
            data: "data"
        },
        callback: function (e) {
            // e.target 为你当前点击的元素
            // e.currentTarget 为你当前点击的handle 整行
        },
        template: function (data) {
            var html = "";
            data.forEach(function (el, index) {

                // 处理角标状态
                var sub = '',
                    subClass = '';
                switch (el.status) {
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

                html += `<li class="bui-btn bui-box" href="pages/ui/article.html?id=${index}&title=${el.name}">
                    <div class="bui-thumbnail ${subClass}" data-sub="${sub}" ><img src="${el.image}" alt=""></div>
                    <div class="span1">
                        <h3 class="item-title">${el.name}</h3>
                        <p class="item-text">${el.address}</p>
                        <p class="item-text">${el.distance}公里</p>
                    </div>
                    <span class="price"><i>￥</i>${el.price}</span>
                </li>`
            });

            return html;
        },
        onBeforeRefresh: function () {
            console.log("brefore refresh")
        },
        onBeforeLoad: function () {
            console.log("brefore load")
            // 如果要监听最后一页触发, 需要在这里, 有可能第一页就已经是最后一页了,在外面监听不到
            // this.off("lastpage").on("lastpage", function () {
            //     console.log("last")
            // })
        },
        onRefresh: function () {
            // 刷新以后执行
            console.log("refreshed")
        },
        onLoad: function (data, result) {
            // result 为接口每次请求后返回的数据
            console.log("loaded", data, result)
        },
        onFail: function () {
            console.log("fail")
        }
    })


    router.$("header").click(function () {

        // 清空
        uiList.empty();
        // 修改数据
        uiList.init({
            page: 1,
            "data": {
                test: "111"
            }
        })
    })

    return uiList;
})