loader.define(function(require,exports,module) {

    //下拉菜单在底部相对父层宽度
    var uiDoropdown = bui.dropdown({
        id: "#uiDoropdown",
        showArrow: true,
        targetHandle: ".bui-tips",
        //设置relative为false,二级菜单继承父层宽度
        relative: false,
        change: false,
        position: "right"
    })

    

})
