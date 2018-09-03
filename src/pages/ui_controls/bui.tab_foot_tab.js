loader.define(function(require,exports,module) {

    //按钮在tab外层,需要传id
    var tab = bui.tab({
        id:"#tabFoot",
        menu:"#tabFootNav",
    })

    var uiSlideTab = bui.tab({
        id:"#uiSlideTabChild",
    })

    // 滚动到顶部
    $(".btn-scrolltop").on("click",function(e){
        document.querySelector("#scrollMain").scrollTop = 0;
    })
})
