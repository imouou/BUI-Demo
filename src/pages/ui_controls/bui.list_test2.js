loader.define(function (require, exports, module) {

    let user = null;


    var uiList = bui.list({
        id: "#scrollList",
        url: "https://app.timesgroup.cn:8088/uam/odata/getEsServiceList",
        pageSize: 10, // 当pageSize 小于返回的数据大小的时候,则认为是最后一页,接口返回的数据最好能返回空数组,而不是null
        data: {
            "$format": "json",
            "terminalType": 2
        },
        headers: {
            Authorization: "Bearer bG9jYWw6NmRlMGRjYzEtMWM4Yi00YmQ2LThjOTEtZmQ4ZjFlZWU3MDFl"
        },
        // handleMove:"head",
        //如果分页的字段名不一样,通过field重新定义
        field: {
            page: "page",
            size: "pageSize",
            data: "r"
        },
        transformResponse: function (res) {
            return JSON.parse(res.d.getEsServiceList);
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
        onLoad: function (e, res) {
            // bui.alert(res.d.getEsServiceList)
            // 刷新以后执行
            console.log("loaded")
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