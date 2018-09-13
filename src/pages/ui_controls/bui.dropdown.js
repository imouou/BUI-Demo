loader.define(function(require,exports,module) {

    //区域菜单
    var uiDoropdown = bui.dropdown({
        id: "#uiDoropdownArea",
        //设置relative为false,二级菜单继承父层宽度
        relative: false,
        callback: function (e) {
            console.log( uiDoropdown.value() )
        }
    })

    //分类菜单
    var uiDoropdown2 = bui.dropdown({
        id: "#uiDoropdownClass",
        //设置relative为false,二级菜单继承父层宽度
        relative: false,
        callback: function (e) {
            console.log( uiDoropdown2.value() )
        }
    })

    

})
