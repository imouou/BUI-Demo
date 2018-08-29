/**
 * 底部导航TAB模板
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require,exports,module) {

    var pageview = {};
    
    // 模块初始化定义
    pageview.init = function () {
        navTab();
    }

    // 底部导航
    function navTab() {
        
        //menu在tab外层,menu需要传id
        var tab = bui.slide({
            id:"#tabDynamic",
            menu:"#tabDynamicNav",
            children:".bui-tab-main ul",
            scroll: true,
            animate: false,
            // 1: 声明是动态加载的tab
            autoload: true,
        })

        tab.lock();

        // 2: 监听加载后的事件
        tab.on("to",function (res) {
            var index = $(this).index();

            switch(index){
                case 0:
                loader.require(["pages/main/home"])
                break;
                case 1:
                loader.require(["pages/ui/index"])
                break;
                case 2:
                loader.require(["pages/ui_method/index"])
                break;
                case 3:
                loader.require(["pages/ui_event/index"])
                break;
            }

        }).to(0)

        // 检测版本更新
        bui.checkVersion({
            id: "#checkUpdate",
            url: siteDir + "bui_version_bingotouch.json",
            currentVersionCode: "20180118",
            currentVersion: "1.4.1"
        });


    }

    // 初始化
    pageview.init();
    
    // 输出模块
    return pageview;
    
})