loader.define(function(require,exports,module) {

    //按钮在tab外层,需要传id
    var tab = bui.tab({
        id:"#tabDynamic",
        // 1: 声明是动态加载的tab
        autoload: true,
    })
    
    // 2: 监听加载后的事件, load 只加载一次
    tab.on("to",function (res) {
        console.log($(this).index(),"to")
        bui.init();
    }).to(0)

})
