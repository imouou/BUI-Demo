loader.define(function(require, exports, module) {


    var bs = bui.store({
      scope: "page", // 用于区分公共数据及当前数据的唯一值
      data: {
        // 示例1的数据源
        firstName: 'Hello',
        lastName: 'BUI',
        fullName: 'Hello BUI',

        // 示例2的数据源
        a: 2,
        b: 1,
      },
      methods: {
        // 示例2的方法
        changeA: function (e) {
          this.a++;
        },
      },
      watch: {
        // 示例1的方法
        firstName: function (val) {
          this.fullName = val + ' ' + this.lastName
        },
        lastName: function (val) {
          this.fullName = this.firstName + ' ' + val
        },
        // 示例2的方法
        a: function () {
            this.b = this.a * 2;
        }
      }
  })

})