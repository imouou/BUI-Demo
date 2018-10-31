loader.define(function(require,exports,module) {
    bui.accordion().showFirst();

    // 检测版本更新
    bui.checkVersion({
        id: "#checkVersion",
        url: siteDir+"versionUpdate.json",
        currentVersion: "1.3.6",
        currentVersionCode: "20180113"
    });
    
})
