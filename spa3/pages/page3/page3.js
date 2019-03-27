
define(["pages/page2/page2"],function (p3,re,module) {
    var _self = this;
    // console.log(this)
    console.log(p3)
    // console.trace();

    // 一个页面只需要初始化一次
    console.log("page3 src was done");
    try{

        $("#bui-router").off("click",'.refresh').on("click",'.refresh',function () {
            bui.refresh();
        })
        $("#bui-router").off("click",'.test').on("click",".test",function () {
            alert("123")
        })
        $("#bui-router").off("click",'.replace').on("click",".replace",function () {
            router.replace({
                url: "pages/page2/page2.html"
            })
        })

        $("#bui-router").off("click",'#page3Back').on("click","#page3Back",function () {
            bui.back({index:-2,callback:openSidebar});



        })

    }catch(e){
        // bui.showLog(e)
    }
    // 调用首页的方法
    function openSidebar(obj) {
        // 拿到后退元素的对象
        // console.log(obj)
        // 获取首页模块,后退的时候执行
        require(["main"],function (main) {
            main.open();
        })
        // router.refresh();
    }

    module.exports= {
        "test":"page3"
    }

})
