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
            }]
        },
        // log: true,
        methods: {
            removeItem: function (data, id, field) {

                bui.array.delete(data, id, "id");
                // 修改替换children
                this.set(field, data)
            },
            handleChange(parent, field) {
                let temp = parent.children.filter(item => {
                    return item.check == true;
                });
                if (!temp.length) {
                    parent.check = false;
                }
                if (temp.length) {
                    parent.check = true;
                }

                // 修改父级选项
                this.set(field, parent.check);
            },
            handleParent(data, field) {

                data.children.forEach((item, i) => {
                    item.check = data.check;
                });

                // 修改指定某一条数据替换
                this.set(field, data.children);

            }
        },
        templates: {
            tplList: function (data, dd) {
                var html = "";
                if (data.length) {
                    data.forEach(function (item, i) {
                        html += `<li class="bui-btn bui-btn-parent">
                            <div class="bui-box">
                                <input id="${item.id}input" type="checkbox" class="bui-choose" b-change="page.handleParent(page.list.$index,'list.$index.children')" b-model="page.list.$index.check" b-target=".bui-btn-parent" name="parentitem${i}"/>
                                <label for="${item.id}input" class="span1">${item.title}</label>
                            </div>`;
                        html += `<ul class="bui-list" b-template="page.tplChild(page.list.$index.children,$index)" b-target=".bui-btn-parent" >`;

                        html += `</ul>`;
                        html += `</li>`;
                    })
                }

                return html;
            },
            tplChild: function (data, parentIndex) {
                var html = "";
                data.forEach(function (el, index) {
                    html += `<li class="bui-btn bui-btn-sub">
                        <div class="bui-box-align-middle">
                            <input id="${el.id}input" type="checkbox" class="bui-choose" b-change="page.handleChange(page.list.${parentIndex},'list.${parentIndex}.check')" name="subitem" b-model="page.list.${parentIndex}.children.$index.check" b-target=".bui-btn-sub" />
                            <label for="${el.id}input" class="span1">${el.subtitle}</label>
                            <div class="bui-btn" b-click="page.removeItem(page.list.${parentIndex}.children,'${el.id}',list.${parentIndex}.children)" b-target=".bui-btn-sub">删除</div>
                        </div>
                    </li>`;
                })
                return html;
            }
        },
        mounted: function () {

        }
    })
})