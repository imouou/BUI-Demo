// console.log(document.currentScript.src)
define(function (p2,p3,module) {
    
    // console.log(this)
    // console.log(p2)
    // console.log(p3)
    // loader.require(["pages/page2/page2","pages/page3/page3"],function (p3,p3d) {
    //     console.log(p3)
    //     console.log(p3d)
    // })
    // console.trace()
    console.log("main was load")

    // loader.load("pages/page2/page2")
    var uiSidebar = bui.sidebar({
            id: "#sidebarWrap", //菜单的ID(必须)
            width:400,
            trigger: "#menu"
        });

    $("#gopage2").on("click",function () {
        bui.load({
            url: "pages/page2/page2.html",
            param: {
                "eid": 123
            },
            // replace: true
            // effect: "zoomin"
        })
    })
    $("#gopage3").on("click",function () {
        bui.load({
            url: "../demo/index.html#pages/about/index",
            reload:true,
            param: {
                "eid": 123
            }
        })
    })

    $("#loadpage").on("click",function (argument) {
        router.loadPart({
            id: "#pages-2",
            url: "pages/page2/page2.html",
            param: {
                "eid": 123
            }
        })
    })


    // module.exports = uiSidebar;
    // 考虑子路由
    // var mainRouter = bui.router();
    // mainRouter.map({
    //     moduleName: "main",
    // })
    // // 第3步: 初始化路由
    // mainRouter.init({
    //     id: "#main-router"
    // })
    
    return uiSidebar;
})