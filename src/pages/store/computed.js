loader.define(function(require, exports, module) {


    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                firstName: "",
                lastName: "",
                a: 2,
            },
            methods: {
                changeA: function (e) {
                    this.a++;
                }
            },
            watch: {},
            computed: {
                disabled: function () {
                  // 先缓存相关联的依赖值
                  var firstName = this.firstName,
                      lastName = this.lastName;
                  if( firstName !== "" && lastName !== "" ){
                    return false;
                  }else{
                    return true;
                  }
                },
                aDouble: function () {
                  return this.a * 2
                },
                // 1. 这种方式,只要firstName,lastName 改变,会触发fullName 的改变, 但fullName改变不会触发对应的改变
                fullName: function() {
                    var val = this.firstName + ' '+ this.lastName;
                    return val;
                }
                // 2. 双向联动 fullName 改变,会触发各自改变 firstName,lastName,
                // fullName: {
                //     // getter
                //     get: function () {
                //       return this.firstName + ' ' + this.lastName
                //     },
                //     // setter
                //     set: function (newValue) {
                //       var names = newValue.split(' ')
                //       this.firstName = names[0]
                //       this.lastName = names[names.length - 1]
                //     }
                // }
            },
            templates: {},
            mounted: function () {
                // 加载后执行
            }
        })

})
