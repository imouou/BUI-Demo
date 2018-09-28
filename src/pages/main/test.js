loader.define(function(require,exports,module){
    
    // 数字条 js 初始化:
    var uiNumber = bui.number({
      id: '#uiNumber',
      value: 5,
      min: 1,
      max: 10,
    })
    // 评分星星 js 初始化:
    var uiRating = bui.rating({
        id: "#uiRating",
        value: 3
    });  
                    

var uiFileSelect = bui.fileselect();
        
// 选择图片文件
$("#select").on("click",function (argument) {

    uiFileSelect.add({
        "onSuccess": function (val,data) {
            // .text(val);
            // 插入本地图片
            this.toBase64({
                onSuccess: function (url) {
                $("#output").append('<img src="'+url+'" alt="" />')
                }
            });
        }
    })

})



})