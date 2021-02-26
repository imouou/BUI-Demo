// 给多页调用
loader.define("pages/mindex", function() {

    var params = bui.history.getParams();

    console.log(params)

    // loader.load({
    //     id: "#list",
    //     url: "pages/components/list/index.html",
    //     param: {
    //         type: "news"
    //     }
    // })

    return params
})