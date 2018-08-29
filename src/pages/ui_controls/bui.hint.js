loader.define(function(require,exports,module) {

    //支持HTML定义
    bui.hint({content:"<i class='icon-check'></i><br />欢迎使用BUI", position:"center" , effect:"fadeInDown"});

    $('#btnTop').on("click",function  () {
        bui.hint({ appendTo:"#main", content:"欢迎使用BUI", position:"top" , close:true, autoClose: false});
    })
    
    $('#btnBottom').on("click",function  () {
        bui.hint("欢迎使用BUI");
    })
})
