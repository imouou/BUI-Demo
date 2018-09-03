loader.define(function(require,exports,module) {

    var $output = $("#output");

    var uiUpload = bui.upload();
    
    // 选择图片文件
    $("#btnSelect").on("click",function () {

        uiUpload.add({
            // "from": "camera",
            "onSuccess": function (val,data) {
                // $output.text(val);
                console.log(val);
                // 展示本地图片
                this.toBase64({
                    onSuccess: function (url) {
                    $("#output").append('<img src="'+url+'" alt="" style="width:100%;"/>')
                   
                    }
                });

                // 也可以直接调用start上传图片
            }
        })

    })
    // 选择图片文件
    $("#btnSelectCamera").on("click",function () {

        uiUpload.add({
            "from": "camera",
            "onSuccess": function (val,data) {
                // $output.text(val);
                console.log(val);
                // 展示本地图片
                this.toBase64({
                    onSuccess: function (url) {
                    $("#output").append('<img src="'+url+'" alt="" style="width:100%;"/>')
                   
                    }
                });

                // 也可以直接调用start上传图片
            }
        })

    })
    // 选择图片文件
    $("#getSelect").on("click",function (argument) {

        bui.alert( uiUpload.data() );

    })

    // 删除选择的文件
    $("#removeSelect").on("click",function (argument) {

        uiUpload.remove("resize.jpg");

    })
    // 删除选择的文件
    $("#removeAllSelect").on("click",function (argument) {

        uiUpload.clear();

    })

    // 上传图片
    $("#upload").on("click",function (argument) {
        uiUpload.start({
            url:"http://eid.bingosoft.net:83/share/apis/upload/image",
            // url: "https://www.swla.com.cn/demo/upload.asp",
            // url:"http://10.201.78.23:81/dataservice.ashx?CommandName=Atd$ImgUpLoad",
            onSuccess:function (data) {
                console.log(data)
                //显示上传以后的图片
                // $output.append('<img src="http://eid.bingosoft.net:83'+data.detail[0].path+'" alt="" style="width:100%;"/>')
            },
            onFail:function (data) {
                bui.alert(data)
            }
        })

    })
    // 停止上传
    $("#stopUpload").on("click",function (argument) {

        uiUpload.stop();

    })

})
