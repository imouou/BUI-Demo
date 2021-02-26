// 控件初始化都需要在define里面
loader.define(function (require, exports, module) {

    var pageview = {};
    pageview.init = function (argument) {

        var uiAccordion = bui.accordion({
            id: "#controls",
            single: true
        });

        uiAccordion.showFirst();
    }

    pageview.init();

    return pageview;

})