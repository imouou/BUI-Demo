// 默认已经定义了main模块
loader.define(function() {

    var pageview = {};
    // 主要内容
    pageview.init = function() {
        // 找到当前页的对象
        var scrollListVue = router.$(".bui-list")[0];
        var scrollVue = router.$(".bui-scroll");

        // 绑定list的数据
        var listApp = new Vue({
          el: router.currentPage(),
          data: {
            datas: []
          },
          methods: {
            test : function(){
                console.log("test")
            }
          }
        });

        var uiList = bui.list({
            id: scrollVue,
            url: siteDir+"userlist.json",
            page:1,
            pageSize:5,
            //如果分页的字段名不一样,通过field重新定义
            field: {
                page: "page",
                size: "pageSize",
                data: "data"
            },
            onRefresh: function (scroll,datas) {
                //刷新的时候执行
                listApp.datas = datas.data;
                
            },
            onLoad: function (scroll,datas) {
                // console.log( this.option("page") );
                listApp.datas = listApp.datas.concat(datas.data);
            },
            callback: function (e) {
                // 点击整行的时候执行
                
            }
        });
        
    }

    // 动态加载依赖vuejs, 如果全局用到,把脚本依赖放在 index.html 
    loader.import(["js/plugins/vue.min.js"],function(){
        // 初始化
        pageview.init();

    });

    return pageview;
})