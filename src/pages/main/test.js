loader.define(function(require,exports,module){
    // 下拉菜单 js 初始化:
    var uiDropdown = bui.dropdown({
        id: "#uiDropdown",
        data: [{ name:"分享到微博",value:"weibo" },{ name:"分享到微信",value:"weixin" },{ name:"分享到QQ",value:"QQ" }]
    })
    
    // 数字条 js 初始化:
    var uiNumber = bui.number({
      id: '#uiNumber',
      value: 5,
      min: 1,
      max: 10,
    })
     
    

})