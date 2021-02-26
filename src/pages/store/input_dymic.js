loader.define(function (require, exports, module) {

    var bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            message: "Hello bui.js",
            num: 80,
            abc: []
        },
        // log: true,
        methods: {
            reverseMessage: function (e) {
                var a = this.message.split(' ').reverse().join(' ')
                this.message = a;
            }
        },
        watch: {
            message: function (val) {
                console.log(val)
            }
        },
        computed: {},
        templates: {
            tplA: function (data) {
                return data.map(() => {
                    return `<div id="searchbar" class="bui-searchbar bui-box">
                            <div class="span1">
                                <div class="bui-input">
                                    <i class="icon-search"></i>
                                    <input type="text" value="" placeholder="请输入关键字" b-model="page.message" />
                                </div>
                            </div>
                        </div>
                        <div class="section-title">正在输入:
                            <span class="result" b-text="page.message"></span>
                            <div class="bui-btn" b-click="page.reverseMessage">反序输入值</div>
                        </div>`
                }).join('')

            }
        },
        mounted: function () {
            // 加载后执行
            this.abc.$replace([1])
        }
    })

})