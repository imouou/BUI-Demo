loader.define(function(require,exports,module) {

    //示例代码
    var uiSidebar = bui.sidebar({
        id: "#sidebarDoubleWrap"
    });

    $("#menu1").on("click",function () {
        uiSidebar.open({target:"swiperight"})
    })
    $("#menu2").on("click",function () {
        uiSidebar.open({target:"swipeleft"})
    })
})
