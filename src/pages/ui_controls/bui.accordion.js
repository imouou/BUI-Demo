loader.define(function(require,exports,module) {

    var pageview = {};

    //折叠菜单示例
    var uiAccordion = bui.accordion({
            id:"#accordion"
        });
    
    //监听事件
    uiAccordion.on("show",function (e) {
        console.log("show")
    })
    uiAccordion.on("hide",function () {
        console.log("hide")
    })

    //默认全部展开
    //uiAccordion.showAll();
    //默认全部折叠
    //uiAccordion.hideAll();
    //展开第一个 传数字
    // uiAccordion.show(1);
    //关闭第一个
    //uiAccordion.hide(0);
})
