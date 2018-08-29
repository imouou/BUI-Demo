loader.define(function(require,exports,module) {

    var uiMask = bui.mask({
      appendTo: router.$(".main"),
      zIndex: 1
    });
    var tabSide = null;
    //下拉菜单在底部相对父层宽度
    var uiDoropdown = bui.dropdown({
        id: "#uiDoropdown",
        showArrow: false,
        autoClose: false,
        stopPropagation: true,
        //设置relative为false,二级菜单继承父层宽度
        relative: false,
        callback: function (e) {
            $(".bui-list li").removeClass("active");
            $(this).addClass("active");
        }
    })

    uiDoropdown.on("show",function (argument) {
        uiMask.show();
        if( tabSide ){
            return;
        }
        // zepto 对隐藏元素拿不到宽高, 需要在显示的时候处理
        var tabWidth = $(window).width() - $("#tabSideNav").width();

        //按钮在tab外层,需要传id
        tabSide = bui.slide({
          id:"#tabSide",
          menu:"#tabSideNav",
          children:".bui-tab-main > ul",
          width: tabWidth,
          scroll: true,
          animate: false,
          height: 200
        })  
    })
    uiDoropdown.on("hide",function (argument) {
        uiMask.hide();  
    })


})
