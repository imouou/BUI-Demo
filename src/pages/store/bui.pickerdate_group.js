loader.define(function (require, exports, module) {

    // 初始化数据行为存储
    window.bs = bui.store({
        el: `#${module.id}`,
        scope: "page",
        data: {
            items: [],
        },
        methods: {
            add: function (val) {
                this.items.push({
                    id: bui.guid(),
                    start: "",
                    end: ""
                })
            },
            submit: function (val) {
                console.log(this.$data.items)
            }
        },
        // log: true,
        watch: {},
        computed: {},
        templates: {
            tplTimebar: function (data) {
                return data.map(function (item, index) {
                    return `<div class="bui-box timebar">
                            <div class="span1">
                                <div class="bui-label">开始时间:</div>
                                <input id="${item.id}-start" type="text" placeholder="请选择开始时间" class="bui-input pickerdate" readonly b-model="page.items.$index.start" b-target=".timebar">
                            </div>
                            <div class="span1">
                                <div class="bui-label">结束时间:</div>
                                <input id="${item.id}-end" type="text" placeholder="请选择结束时间" class="bui-input pickerdate" readonly b-model="page.items.$index.end" b-target=".timebar">
                            </div>
                        </div>`
                }).join('')
            }
        },
        beforeMount: function () {
            // 数据解析前执行, 修改data的数据示例
            // 多个日期初始化


        },
        mounted: function () {
            // 数据解析后执行
            var uiPickerdate = bui.pickerdate({
                handleParent: "#dategroup",
                handle: ".pickerdate",
                formatValue: "yyyy-MM-dd hh:mm",
                bindValue: true,
                onChange: function (value) {
                    console.log(value)
                },
                callback: function (value) {}
            });
        }
    })

})