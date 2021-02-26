loader.define(function (require, exports, module) {
    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            dataList: [{
                    name: 'java软件工程师1',
                    isSelect: false,
                    id: bui.guid(),
                    children: [{
                            name: '智联招聘_陈旭芳_Java开发工程师.pdf',
                            isSelect: false,
                            id: bui.guid(),
                            ifFirst: false,
                            position: '智联招聘_陈旭芳_Java开发工程师',
                        },
                        {
                            name: '智联招聘_陈旭芳_Java开发工程师.pdf',
                            isSelect: false,
                            id: bui.guid(),
                            ifFirst: true,
                            needs: '智联招聘_陈旭芳_需求开发工程师',
                            position: '',
                        }
                    ]
                },
                {
                    name: 'java软件工程师2',
                    isSelect: false,
                    id: bui.guid(),
                    children: [{
                            name: '智联招聘_陈旭芳_Java开发工程师.pdf',
                            isSelect: false,
                            id: bui.guid(),
                            ifFirst: false,
                            position: '智联招聘_陈旭芳_Java开发工程师',
                        },
                        {
                            name: '智联招聘_陈旭芳_Java开发工程师.pdf',
                            isSelect: false,
                            id: bui.guid(),
                            ifFirst: true,
                            needs: '智联招聘_陈旭芳_需求开发工程师',
                            position: '',
                        }
                    ]
                }
            ],
            parentSelect: [],
            childrenSelect: ['11', '22', '12', '21']
        },
        watch: {
            "dataList.0.isSelect": function (val) {
                console.log(val)
            }
        },
        log: true,
        templates: {
            tplList: function (data, dd) {
                // console.log(dd)
                var html = "";
                if (data.length) {
                    data.forEach((item, i) => {
                        console.log(item.isSelect)
                        html += `<li class="bui-btn clearactive">
                        <input type="checkbox" b-model="page.dataList.${i}.isSelect" ${item.isSelect ? "checked" : ""} class="bui-choose"/>
                        ${item.name}`
                        // 传父级字段给模板, 不能以page.xxx
                        html += `${item.children&&item.children.length && this.tplChild(item.children,"dataList."+i)}
                        </li>`;
                    })
                }

                return html;
            },
            tplChild: function (data, parentField) {
                var html = `<ul class="bui-list">`;
                if (data.length) {
                    data.forEach(function (item, i) {
                        html += `<li class="bui-btn bui-box clearactive">
                            <input type="checkbox" ${item.isSelect ? "checked" : ""} name="${parentField}" class="bui-choose"/>
                            <div class="span1">${item.name}</div>
                        </li>`;
                    })
                    html += `</ul>`
                }

                return html;
            }
        },
        mounted: function () {
            this.$data.dataList.forEach((item, index) => {
                // 监听每一层的选择,
                this.watch(`dataList.${index}.isSelect`, (val) => {

                    // this.set(`list.${index}.active`, val);

                    this.dataList[index].isSelect = val;

                    // 全选
                    this.$data.dataList[index].children.forEach((child, childIndex) => {

                        child.isSelect = val;

                        // 全选子集
                        // this.set(`list.${index}.children.${childIndex}.checked`, val);
                        // 监听每个子集改变的时候, 修改父级的状态
                        // this.watch(`list.${index}.children.${childIndex}.checked`, (val) => {
                        //     if (val) {
                        //         this.set(`list.${index}.active`, val);
                        //     }
                        // })
                    })

                    // this.dataList.splice(index, 1, this.$data.dataList[index]);

                    //.$set(index, this.$data.dataList[index]);
                })
            })
        }
    })


})