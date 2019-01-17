loader.define(function(require, exports, module) {

    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                loadingStatus: false,
                slides: []
            },
            watch: {
                slides: function (newVal,oldVal) {
                    // 1. 监听slides数据变更的时候,并且在dom更新以后执行控件初始化
                    this.oneTick("slides",function (e) {
                        // 修改状态
                        this.loadingStatus = false;
                        // 轮播图需要重新计算
                        this.uiSlide.init();
                    })
                },
                loadingStatus: function (val) {
                    if( val === true ){
                        this.loading.show();
                    }else{
                        this.loading.hide();
                    }
                }
            },
            templates: {
                tplSlide: function (data) {
                    var html = "";
                    data.forEach(function (item,i) {
                        // 模拟的请求,没有真实的图片数据源
                        if( i > 3) { return; }
                        // 这里的图片数据只是随便模拟的,本地只有4张图片
                        html += `<li>
                                    <img src="images/banner0${i+1}.png" alt="占位图">
                                </li>`;
                    })
                    return html;
                }
            },
            mounted: function () {
                // 公共进度条
                this.loading = bui.loading();
                // 初始化
                this.uiSlide = bui.slide({
                   id:"#slide",
                   height:380,
                   autopage: true,
                   autoinit: false
                 })

                // 2. 监听到slides修改以后,执行init, 并且下次修改都会触发
                // this.one("slides",function(val){
                //     console.log("333")
                //     this.uiSlide.init();
                // })
                // 
                // 3. slides数据更新并触发dom渲染以后,才会执行
                // this.oneTick("slides",function (e) {
                //     console.log("555")
                //     this.uiSlide.init();
                // })
                // 4. 每次dom更新以后执行控件初始化,可以是其它字段导致dom更新
                // this.nextTick(function (e) {
                //     console.log("444")
                //     // e.keyname
                //     this.uiSlide.init();
                // })
                
                // 显示进度条
                 this.loadingStatus = true;
                // 模拟请求成功以后数据更新
                 bui.ajax({
                     url: "http://www.easybui.com/demo/json/userlist.json",
                     data: {},//接口请求的参数
                     // 可选参数
                     method: "GET"
                 }).then(function(result){
                    // 合并并触发视图更新
                     bui.array.merge(bs.slides,result.data)
                     
                 });
            }
        })

        
})