loader.define(function(require,exports,module) {

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

        // bui.prompt({
        //  content:"请输入手机号码",
        //  callback: function(ui){ 
        //      var text = $(this).text(); 
  //               console.log(ui.value())
        //      if(text == "确定" && checkMobile(ui.value())){ 
  //                   ui.close();
        //      }
        //  },
        //  onChange: function (ui) {
  //               // 校验
        //      if( checkMobile(ui.value()) ){
        //          this.value = ui.value();
        //      }else{
        //          this.value = '';
        //      }
        //  }
        // })
    
    // 检测是否是手机号码
    function checkMobile(str) {
      var re = /^1\d{10}$/
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    }
})
