loader.define(function(require,exports,module) {

    router.$("#btnOpenPrompt").on("click",function (argument) {
       var uiPrompt = bui.prompt("请输入您的名字",function(ui){
               var text = $(this).text();
               if( text == "取消"){
                   ui.close();
               }else{
                   if( ui.value() ){
                       // 获取输入的值
                       bui.hint("您好,"+ui.value());
                       ui.close();
                   }else{
                       bui.hint("名字不能为空");
                   }
               }
           })
    })
    

})
