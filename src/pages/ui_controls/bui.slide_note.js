loader.define(function(require,exports,module) {

    // 通知, 自定义模板
    var uiSlide = bui.slide({
        id:"#slideNote",
        height:100,
        autoplay: true,
        loop: true,
        data: [{
          title: "2017年11月1日 河南分省党支部第18期党课",
          url: "pages/ui/article.html"
        },{
          title: "2017年11月1日 河南分省党支部第19期党课",
          url: "pages/ui/article.html"
        },{
          title: "2017年11月1日 河南分省党支部第20期党课",
          url: "pages/ui/article.html"
        }],
        template: function (data) {
          // 自定义模板时,需要自己渲染完整结构
          var html = "";
          html +=`<div class="bui-slide-main"><ul>`
          data.forEach(function (item,i) {
            html +=`<li href="${item.url}">
                <div class="notice-item">
                    <div class="span1">${item.title||""}</div>
                </div>
            </li>`
          })
          html +=`</ul></div>`

          return html;
        },
        direction: "y"
    })

    // 异步请求后, 利用 uiSlide.option "data" 的值
})
