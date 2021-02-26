loader.define(function (require, exports, module) {
    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            "list": [{
                "id": "i1",
                "title": "我是列表1",
                "check": false,
                "children": [{
                    "id": "i1-1",
                    "check": false,
                    "subtitle": "我是列表1-1"
                }, {
                    "id": "i1-2",
                    "check": false,
                    "subtitle": "我是列表1-2"
                }]
            }, {
                "id": "i2",
                "title": "我是列表2",
                "check": false,
                "children": [{
                    "id": "i2-1",
                    "check": true,
                    "subtitle": "我是列表2-1"
                }, {
                    "id": "i2-2",
                    "check": false,
                    "subtitle": "我是列表2-2"
                }]
            }]
        },
        methods: {
            removeItem: function ($parentIndex, $id, $dom) {

                // bui.array.remove($id, this.$data.list[$parentIndex]["children"], "id");

                // $dom.remove();
            }
        },
        templates: {
            tplList: function (data, dd) {
                console.log(data)
                var html = "";
                if (data.length) {
                    data.forEach(function (item, i) {
                        html += `<li class="bui-btn bui-btn-parent"><div class="bui-box"><div class="span1">${item.title}</div><input type="checkbox" name="parentitem${i}" b-model="page.list.$index.check" b-target=".bui-btn-parent"/></div>`;
                        html += `<ul class="bui-list">`;
                        item.children.forEach(function (el, index) {
                            // html += `<li class="bui-btn bui-btn-sub"><div class="bui-box"><div class="span1">${el.subtitle}</div><input type="checkbox" name="${item.id}-subitem" b-click="page.removeItem(${i},${el.id},$this)" b-target=".bui-btn-sub"/></li>`;
                            html += `<li class="bui-btn bui-btn-sub"><div class="bui-box"><div class="bui-btn" b-click="page.removeItem(${i},${el.id},$this)" b-target=".bui-btn-sub">删除</div><div class="span1">${el.subtitle}</div><input type="checkbox" name="${item.id}-subitem" b-model="page.list.${i}.children.$index.check" b-target=".bui-btn-sub"/></li>`;
                        })
                        html += `</ul>`;
                        html += `</li>`;
                    })
                }

                return html;
            }
        },
        mounted: function () {
            this.$data.list.forEach((item, index) => {
                // 监听每一层的选择,
                this.watch(`list.${index}.check`, (val) => {

                    this.$data.list[index].children.forEach((child, childIndex) => {
                        // 监听每个子集改变的时候, 修改父级的状态
                        this.watch(`list.${index}.children.${childIndex}.check`, (val) => {
                            if (val) {
                                this.set(`list.${index}.active`, val);
                            }
                        })

                        // 全选子集
                        this.set(`list.${index}.children.${childIndex}.check`, val);
                    })
                })
            })
        }
    })


})