loader.define(function (require, exports, module) {

    //动态创建, 如果模板已经渲染, 修改参数 render:false, 初始化加上id, 则针对某一个控件操作.
    var uiNumber = bui.number({
        id: "#product01",
        type: "number",
        step: 0.1,
        min: 0.0,
        value: 0.1,
    })

})