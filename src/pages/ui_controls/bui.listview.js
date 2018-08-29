loader.define(function(require,exports,module) {

    var uiListview = bui.listview({
            id: "#listview",
            data: [{ "text": "修改", "classname":"primary"},{ "text": "删除", "classname":"danger"}],
            position:"right",   //默认就是右边,所以可以不用传
            callback: function (e,ui) {
                // this 为滑动出来的操作按钮
                var text = $(this).text();
                    if( text == '删除' ){
                        $(this).parents("li").fadeOut(300,function () {
                            $(this).remove();
                        });
                    }
                    ui.close();
            }
        });
})
