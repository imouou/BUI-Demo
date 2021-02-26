loader.define(function (require, exports, module) {
    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            "list": [{
                "id": "i1",
                "title": "我是列表1",
                "check": false,
                "children": [{
                    "id": "i11",
                    "check": false,
                    "subtitle": "我是列表1-1"
                }, {
                    "id": "i12",
                    "check": false,
                    "subtitle": "我是列表1-2"
                }]
            }, {
                "id": "i2",
                "title": "我是列表2",
                "check": false,
                "children": [{
                    "id": "i21",
                    "check": false,
                    "subtitle": "我是列表2-1"
                }, {
                    "id": "i22",
                    "check": false,
                    "subtitle": "我是列表2-2"
                }]
            }, ]
        },
        methods: {
            removeItem: function (id, data) {

                bui.array.delete(data["children"], id, "id");

                this.list.$replace(this.$data.list);
            },
            handleChange(parent) {
                let temp = parent.children.filter(item => {
                    return item.check == true;
                });
                if (!temp.length) {
                    parent.check = false;
                }
                if (temp.length) {
                    parent.check = true;
                }

                this.list.$replace(this.$data.list)
            },
            handleParent(data, index) {
                data.children.forEach((item, i) => {
                    item.check = data.check;
                });

                // 修改指定某一条数据替换
                this.list.$replace(this.$data.list)
            }
        },
        templates: {
            tplList: function (data, dd) {
                var html = "";
                if (data.length) {
                    data.forEach(function (item, i) {
                        html += `<li class="bui-btn bui-btn-parent">
                            <div class="bui-box">
                                <input id="${item.id}input" type="checkbox" class="bui-choose" b-change="page.handleParent(page.list.${i})" b-model="page.list.${i}.check" name="parentitem${i}"/>
                                <label for="${item.id}input" class="span1">${item.title}</label>
                            </div>`;
                        html += `<ul class="bui-list">`;
                        item.children.forEach(function (el, index) {
                            html += `<li class="bui-btn bui-btn-sub">
                                <div class="bui-box-align-middle">
                                    <input id="${el.id}input" type="checkbox" class="bui-choose" b-change="page.handleChange(page.list.${i})" name="${item.id}-subitem" b-model="page.list.${i}.children.${index}.check"/>
                                    <label for="${el.id}input" class="span1">${el.subtitle}</label>
                                    <div class="bui-btn" b-click="page.removeItem('${el.id}',page.list.${i})">删除</div>
                                </div>
                            </li>`;
                        })
                        html += `</ul>`;
                        html += `</li>`;
                    })
                }

                return html;
            }
        },
        mounted: function () {

        }
    })


})