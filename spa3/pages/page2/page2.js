define(function (require,exports,module) {
    // console.trace();
    // require("main",function () {
    //     console.log(123)
    // })
    // var getParams = bui.getPageParams();
    //     getParams.done(function(result){
    //         console.log(result);
    //     })
    // console.log(p3d,2)

    var uiSlideTab = bui.slide({
        id:"#uiSlideTab",
        menu:".bui-nav",
        children:".bui-tab-main ul",
        scroll: true
    })

    uiSlideTab.on("to",function (argument) {
        loader.require(["pages/page3/page3","pages/page3-depend"],function (p3,p31) {
            console.log(p3,123)
            console.log(p31,123)
        })
    })

    var currentPage = router.currentPage();

      $(currentPage).on("click",".btn-test",function (e) {
        console.log(this);
      })

    // $(".btn-test").on("click",function (argument) {
    //     alert("13246677")
    // })

    // var _history = router.getHistory();

    // var last = _history.length - 1;

    // console.log(_history[last]["id"])
    // console.log($(".bui-router-main").attr("data-main"))
    // require("main",function (page2) {
    //     console.log(page2)
    // })
    // module.exports = {
    //     test: "page2"
    // };

    module.exports = {
        test: "page2"
    }
})
