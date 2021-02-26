loader.define(function(require, exports, module, global) {

    var params = bui.history.getParams(module.id);
    var keys = Object.keys(params);
    var classNames = ["bui-btn"];
    params.classname ? bui.array.merge(classNames, params.classname.split(" ")) : classNames;

    // 初始化数据行为存储
    var bs = bui.store({
        el: `#${module.id}`,
        scope: "btn",
        data: {
            text: params.text || "按钮",
            icon: params.icon,
            attrs: {
                class: classNames.join(" ")
            }
        },
        methods: {
            click: function(e) {
                loader.trigger(`click:${module.id}`, e);
            }
        }
    })
})