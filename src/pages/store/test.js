loader.define(function(require, exports, module) {

    // 可以在路由init以后,作为整个应用的联动数据处理
    window.bs = bui.store({
        scope: "page", // 用于区分公共数据及当前数据的唯一值
        data: {
            a: {
                b: {
                    c: 1,
                    d: {
                        e: 2
                    }
                }
            },
            b: 2,
            h: [],
            c: 3,
            g: 4,
            d: {
                e: {
                    f: 3
                }
            },
            f: {
                g: 3
            },
            g: {
                a: 55
            }
        },
        log: true,
        methods: {
            test: function() {
                console.log("Test")
            }
        },
        watch: {
            h: function(val) {
                console.log(val)
            }
        },
        computed: {},
        templates: {},
        mounted: function() {
            // 判断或者比对,使用这种
            if (this.$data.c == 3) {
                // 设置使用这种
                this.a.b.c = 123;
            }

            this.a.b.c = 456;
            // this.h.push("tes")
            // 1级
            // this.b = 12;

            // // 2级
            // this.a.b = 12;

            // // 3级
            // this.a.b.c = 12;

            // // 1对1
            // this.a = this.b

            // // 1对2
            // this.b = this.f.g

            // // 1对3
            // this.b = this.d.e.f

            // 2对1
            // this.a.b = this.c
            // console.log(this.$data.a.b)
            //     // 2对2
            // this.a.b = this.f.g



            // 2对3
            // this.a.b = this.$data.d.e.f


            // 3对1 报错
            // this.a.b.c = this.g.a

            // 3对2
            // this.a.b.c = this.f.g

            // // 3对3
            // this.a.b.c = this.d.e.f
            //     // 4对3
            // this.a.b.d.e = this.d.e.f

            //
            // console.log(this.$data.a)
            // ### 场景4: 通过this.$data 访问对象,不经过module
            // this.a.b.c = this.$data.f.g
            // this.$data.a = this.$data.f.g

            // ### 场景5:
            // this.a.b = this.$data.f.g
            // this.a.b = this.$data.g.a

        }
    })

})