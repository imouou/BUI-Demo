loader.define(function(require, exports, module) {

    //折叠菜单示例
    var uiAccordion = bui.accordion({
        id: "#accordion"
    })

    console.log(uiAccordion)
    uiAccordion.showFirst();
})