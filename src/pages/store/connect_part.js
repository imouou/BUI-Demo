loader.define(function (require, exports, module) {


    window.bs = bui.store({
        el: `#${module.id}`,
        scope: "page1", // 用于区分公共数据及当前数据的唯一值
        data: {
            arr: [],
            message: "123",
            other: []
        },
        // log: true,
        templates: {
            tplA: function (data) {
                var html = "";
                data.forEach(function (item, index) {
                    html += `<li class="bui-btn">${item}</li>`;
                })
                return html;
            },
            tplB: function (data) {
                return data.map(function (item, index) {
                    return `<div class="test"><div id="searchbar" class="bui-searchbar bui-box">
                    <div class="span1">
                        <div class="bui-input">
                            <i class="icon-search"></i>
                            <input type="text" value="" placeholder="请输入关键字" b-model="page1.other.$index.keyword" b-target=".test"/>
                            
                        </div>
                    </div>
                </div>正在输入:<span class="result" b-text="page1.other.$index.keyword" b-target=".test"></span></div>
                `
                }).join('')
            }
        },
        mounted: function () {
            // this.arr.push("111")
            this.other.$replace([{
                keyword: "test"
            }, {
                keyword: "testeee"
            }])
            // this.other.push(1234)
        }
    })


    // 关联1: 关联相同字段
    // bs.connect(bs2);

    // 关联2: 关联到不同字段
    // bs.connect(bs2, "attrs", "props");


    // 关联3: 关联到根路径
    // bs.connect(bs2, "attrs", "");

    return bs;
})