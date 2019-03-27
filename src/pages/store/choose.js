loader.define(function(require, exports, module) {


    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                items: [{
                  id: "guangzhou",
                  name: "广州",
                },{
                  id: "shenzhen",
                  name: "深圳",
                },{
                  id: "dongguan",
                  name: "东莞",
                }],
                checked: [],//缓存选中的值
                checkedObj: null,
            },
            methods: {
              open: function () {
                this.uiDialog.open();
              }
            },
            watch: {
              checked: function (val) {
                var _self = this;
                var newarr = [];
                val.forEach(function (item,i) {
                  var index = bui.array.index(item,_self.items,"id")
                  newarr.push(_self.items[index]);
                })

                this.checkedObj = newarr;
              }
            },
            computed: {},
            templates: {
              tplItem: function (data) {
                var html = "";

                data.forEach(function (item,i) {
                  html +=`<li class="bui-btn" id="${item.id}">${item.name}</li>`
                })

                return html;
              },
              tplCity: function (data) {
                var html = "";
                data.forEach(function (item,i) {
                  html +=`<li class="bui-btn bui-box bui-btn-line">
                      <div class="span1">
                          <label for="interest+${i}">${item.name}</label>
                      </div>
                      <input id="interest+${i}" type="checkbox" class="bui-choose" name="interest" value="${item.id}" text="" b-model="page.checked">
                  </li>`
                })

                return html;
              }
            },
            mounted: function () {
                // 加载后执行

                this.uiDialog = bui.dialog({
                    id: "#uiDialog"
                });

            }
        })

})
