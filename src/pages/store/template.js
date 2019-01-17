loader.define(function(require, exports, module) {

    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                test: "我是测试文本",
                list: ["我是列表1","我是列表2"],
                citysCheck: [],
                citys: [],
                // citysCheck: ["广州","深圳"],
                // citys: ["广州","深圳","上海","北京"],
                obj: {
                    title: "我的对象的标题",
                    content: "<p>我是内容,支持html</p><p>我是内容,支持html</p>"
                },
                objList: {
                    title: "我是标题",
                    data: ["我是复杂数据列表1"]
                }
            },
            templates: {
                tplList: function (data) {
                    var html = "";
                    data.forEach(function (item,i) {
                        html += `<li class="bui-btn">${item}</li>`;
                    })
                    return html;
                },
                tplListCheck: function (data) {
                    var _self = this;
                    var html = "";
                    data.forEach(function (item,i) {
                        var hasCheck = bui.array.compare(item,_self.citysCheck);
                        var checked = hasCheck ? "checked" : "";

                        html += `<li class="bui-btn"><label><input type="checkbox" name="city" value="${item}" b-model="page.citysCheck" ${checked}>${item}</label></li>`;
                    })
                    return html;
                },
                artTplList: function (data,e) {
                    
                    var html = template("tpl-list",{ listData: data});

                    return html;
                },
                tplObject: function (data,e) {
                    // console.log(data)
                    var html = "";
                    for( var key in data ){
                        // 如果对象需要动态改变, 则使用 b-text="page.obj.${key}" 这样改变会一起联动
                        html += `<div class="bui-btn" >${data[key]}</div>`;
                    }
                    return html;
                },
                tplObjectList: function (data,e) {
                    var html = "";
                    data.forEach(function (item,i) {
                        html += `<li class="bui-btn">${item}</li>`;
                    })
                    return html;
                }
            },
            mounted: function () {
                // 模拟数据动态改变
                setTimeout(()=>{
                    // this.oneTick("citys",function () {
                    //     this.compile("#test")
                    // })
                    this.citysCheck.push("广州","深圳")
                    this.citys.push("广州","深圳","上海","北京");

                    // bui.array.merge(this.citysCheck,["广州","深圳"])
                    // bui.array.merge(this.citys,["广州","深圳","上海","北京"])

                },1000)
            }
        })

})