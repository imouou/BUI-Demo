loader.define(function(require,exports,module) {

    //按钮在tab外层,需要传id
    var tab = bui.tab({
        id:"#tabDynamic",
        menu:"#tabDynamicNav",
        // 1: 声明是动态加载的tab
        autoload: true,
    })
    
    // 2: 监听加载后的事件
    tab.on("to",function (index) {
        console.log(index)
    }).to(0)

})
