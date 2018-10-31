/* @preserve 
 * @name: BUI v1.5.0  
 * @detail: BUI 是一个免费的UI交互框架, 用于快速定制开发WebApp,微信,混合移动应用(Bingotouch,Link,Dcloud,Apicloud,Appcan等).
 * @site: http://www.easybui.com/ 
 * Copyright © 2016-2018 BUI. All Rights Reserved. 
 */
(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
   typeof define === 'function' && define.amd ? define(factory) :
   (factory());
}(this, (function () { 'use strict';

/*!
 *  BUI 简介 
 *  
 *  v1.5.0  date: 2018-10-23
 *  
 *  BUI 是一个开放式的UI交互框架, 有着丰富的组件, 可以自由定制交互,快速开发WebApp,微信,还可以通过第三方平台开发混合移动应用.
 *
 *  BUI 专注移动快速开发
 *  -----------------------------------------------------------
 *  BUI Team
 *  部门: 政企体验创新部
 *  产品经理: 区柏荣
 *  代码设计: 王伟深 杨俊标
 *  产品设计师: 邝德如 范菊 唐竹晗
 *  -----------------------------------------------------------
 *  BUI 反馈邮箱: wangwsh_bingosoft.net
 *
 *  Copyright (c) 2016-2018
 */

//依赖库
window.libs = window.Zepto || window.jQuery || {}; //如果使用jQuery,需要在这里修改,但同时一些jquery不支持的事件也会不能使用,例如longTap,touchstart
window.bui = {};
window.router = {};

//UI库
(function (ui) {

    //平台切换, true为web平台,false为原生平台; 
    // false 的时候可以调用原生也可以调用web的方法; 
    // true 的时候,只能调用web方法
    ui.debug = true;
    // 是否是单页路由
    ui.hasRouter = false;

    // 新版使用 isWebapp 作为平台切换的属性, 这里不做定义是为了在bui.init 便于判断,兼容旧版的bui.debug.
    ui.isWebapp;

    /*
     * [ 返回 当前bui的平台, 默认是 webapp | bingotouch | dcloud | apicloud ]
     * @type {String} 
     * @final 
     * @return {String} []
     */
    ui.currentPlatform = ""; // webapp | bingotouch | dcloud | apicloud 

    //是否开启报错日志;
    ui.log = true;

    //是否开启调用栈跟踪
    ui.trace = false;

    // 原生能力的对象
    ui.native = {};

    /* bui基本属性配置 
    --------------------------------*/
    /**
     * [控件的全局配置]
     * @namespace bui
     * @class config
     * @static
     * @example
     *
        // 这样可以全局更改dialog默认不需要遮罩
        bui.config.dialog = {
            mask: false
        }; 
        
     * 
     */
    ui.config = {};
    // ui名称
    ui.config.namespace = "bui";

    // ui前缀
    ui.config.classNamePrefix = ui.config.namespace + "-";

    // 版本号
    ui.config.version = "1.4.7";
    ui.config.versionCode = 20180905;
    ui.version = ui.config.version;
    ui.versionCode = ui.config.versionCode;

    /* 常用控件全局属性配置 
    --------------------------------*/
    //全局配置

    // viewport全局配置
    ui.config.viewport = { zoom: true, create: true };
    // 是否自动计算main高度
    ui.config.init = { auto: true };

    // 原生方法全局配置
    ui.config.ready = {};
    ui.config.ajax = {};
    ui.config.back = {};
    ui.config.load = {};
    ui.config.getPageParams = {};
    ui.config.refresh = {};
    ui.config.run = {};
    ui.config.checkVersion = {};

    // UI全局配置
    //弹出框全局配置
    ui.config.dialog = {};
    //确认框全局配置
    ui.config.confirm = {};
    //提醒框全局配置
    ui.config.alert = {};
    //消失提醒框
    ui.config.hint = {};
    // 输入框
    ui.config.prompt = {};
    ui.config.loading = {};
    ui.config.mask = {};
    ui.config.list = {};
    ui.config.listview = {};
    ui.config.scroll = {};
    ui.config.pullrefresh = {};
    ui.config.select = {};
    ui.config.sidebar = {};
    ui.config.slide = {};
    ui.config.actionsheet = {};
    ui.config.dropdown = {};
    ui.config.accordion = {};
    ui.config.stepbar = {};
    ui.config.rating = {};
    ui.config.number = {};
    ui.config.file = {};
    ui.config.fileselect = {};
    ui.config.upload = {};
    ui.config.download = {};
    ui.config.swipe = {};
    ui.config.router = {};
    ui.config.loader = {};

    return ui;
})(window.bui);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/**
 * <h5>核心</h5>
 * {{#crossLink "bui.ready"}}{{/crossLink}}: 控件的初始化都要在这个回调里面 <br>
 * {{#crossLink "bui.viewport"}}{{/crossLink}}: 页面的rem自适应,在bui.ready已经初始化 <br> 
 * {{#crossLink "bui.init"}}{{/crossLink}}: 页面初始化高度 <br> 
 * {{#crossLink "bui.router"}}{{/crossLink}}: 单页路由 <br> 
 * {{#crossLink "bui.loader"}}{{/crossLink}}: 模块化加载器 <br> 
 * @module  Core
 */

(function (ui, $) {

  /*
   * [prefix ui前缀生成器]
   * @param  {[type]} classname [description]
   * @return {[type]}     [description]
   */
  ui.prefix = function (className) {
    return ui.config.classNamePrefix + className;
  };

  // 日志跟踪
  ui.showLog = function (e, where) {
    where = where || "";
    var message = "";
    if ((typeof e === "undefined" ? "undefined" : _typeof(e)) == "object" && "message" in e && "name" in e) {
      message = e.message + ':' + e.name + '&&stack:' + e.stack;
    } else if (typeof e == "string") {
      message = e;
    }
    ui.log && console.error(where + " " + message);
    ui.trace && console.trace && console.trace();
  };

  /**
   * 生成唯一id
   * @namespace  bui
   * @class  guid
   * @constructor 
   * @return {string} [唯一id]
   * @example
   *       var guid = bui.guid();
   * 
   */
  ui.guid = function (argument) {
    function S4() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return "bui-" + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  };
  /*----------------------
    控件引用及依赖管理器
  ----------------------*/

  /*
   *  滑动方向判断 控件相关
   *  @namespace bui
   *  @class swipeDirection
   *  @constructor 
   *  @param {number} x1 [ x轴按下的位置 ]
   *  @param {number} x2 [ x轴按下移动的位置 ]
   *  @param {number} y1 [ y轴按下的位置 ]
   *  @param {number} y2 [ y轴按下移动的位置 ]
   *  @example
      
      var direction = bui.swipeDirection(x1,x2,x3,x4);
  */
  ui.swipeDirection = function (x1, x2, y1, y2) {
    var xDif = x2 - x1,
        yDif = y2 - y1,
        xAbs = Math.abs(xDif),
        yAbs = Math.abs(yDif),
        distance = 9,
        //移动的距离
    angle = 3;

    if (xAbs < distance && yAbs < distance) {
      return false;
    }
    if (xAbs / yAbs > angle) {
      //左右
      return xDif > 0 ? 'swiperight' : 'swipeleft';
    } else {
      // 上下
      return yDif > 0 ? 'swipedown' : 'swipeup';
    }
  };
  /*
   * [用于控件的ID处理,避免单页的ID冲突, 如果传一个对象,则返回一个jquery对象,如果一个字符串或者ID,则会查找当前页下的元素]
   * @param  {[type]} str [ #id || id ]
   * @return {[type]}     [ jquery对象 用于控件的id选择器,做兼容处理]
   *
   * 示例:  var $id = bui.obj("#id");
   */
  ui.obj = function (id, parentId) {
    var $id = null;
    parentId = parentId || null;
    // 如果有单页,查找的对象是基于当前页,如果id是obj 则返回jq对象
    var currentPage = ui.hasRouter ? router.currentPage() || "body" : "body";
    currentPage = parentId || currentPage;
    var $page = $(currentPage);
    var ruleNumber = /^(\d)/; // 数字开头
    var ruleWord = /^[a-zA-z]/; // 字母开头
    var ruleAttr = /^\[.+\]$/; // 属性开头
    var ruleId = /^#\d/; // #数字开头
    var ruleClass = /^\.\d/; // .数字开头
    var isString = typeof id === "string";
    var htmlTag = /^(html|head|body|header|main|footer|ul|li|section|dt|dd|div|span|img|article|i|strong|input|textarea|select|h1|h2|h3|h4|h5|h6|p)$/ig;

    if ((typeof id === "undefined" ? "undefined" : _typeof(id)) === "object") {
      $id = $page.find(id);
      return $id;
    } else if (isString && ruleNumber.test(id)) {
      // 数字开头
      $id = $page.find("[id='" + id + "']");
      return $id;
    } else if (isString && ruleWord.test(id)) {
      // 字母开头,id 或者html标签,属性开头, 针对 guid 单独选择id 选择器
      var nid = htmlTag.test(id) || ruleAttr.test(id) ? id : "#" + id;

      $id = $page.find(nid);
      return $id;
    } else {

      // #数字开头
      if (ruleId.test(id)) {
        $id = $page.find("[id='" + id.substr(1) + "']");
      } else if (ruleClass.test(id)) {
        // .数字开头
        $id = $page.find("[class='" + id.substr(1) + "']");
      } else if (id) {
        // 层级,属性选择器等
        $id = $page.find(id);
      }
      return $id;
    }

    return $id;
  };

  // 对id 的选择处理, 从document开始查找
  ui.objId = function (id) {

    return ui.obj(id, "html");
  };

  // 控件自身的选择器
  ui.selector = function (id) {
    if (typeof id === "undefined") {
      return this;
    } else {
      return $(id, this);
    }
  };

  //控件的内部依赖
  ui.widget = function (name) {

    return name && name in this ? this[name] : this;
  };

  //控件的参数设置及获取,供控件调用
  ui.option = function (key, value) {

    if (ui.typeof(key) !== "object" && typeof value === "undefined") {
      // 读取
      if (typeof key === "string") {
        return this.config[key];
      } else {
        return this.config;
      }
    } else {
      // 修改
      if (key == "id") {
        ui.showLog("不允许修改控件的ID参数");
        return this;
      }

      if (key && ui.typeof(key) === "object") {
        var opt = $.extend(this.config, key);
        // 再初始化
        return this.init(opt);
      } else if (this.config.hasOwnProperty(key)) {

        var obj = {};
        obj[key] = value;

        var opt = $.extend(this.config, obj);

        // 再初始化
        return this.init(opt);
      }
    }

    return this;
  };

  return ui;
})(window.bui || {}, window.libs);

/**
 * <h3>全局事件: </h3> 
 * <p>依次加载顺序, 所有事件均在 dom 加载以后处理.</p>
 * <p>pagebefore(dom准备完毕,但bui还未初始化) -  pageinit(dom准备完毕,bui初始化完成) - pageready(dom+原生能力都已经准备完毕) - onload(图片及资源都加载完毕以后触发)</p>
 * @module Event
 */

(function (ui, $) {

  /**
   * <div class="oui-fluid">
   *   <div class="span8">
   *     <h2>事件发射器</h2>
   *     <h3>方法说明:</h3>
   *     {{#crossLink "bui.emitter/on"}}{{/crossLink}}: 监听事件 <br>
   *     {{#crossLink "bui.emitter/off"}}{{/crossLink}}: 取消事件监听 <br>
   *     {{#crossLink "bui.emitter/trigger"}}{{/crossLink}}: 触发自定义事件 <br>
   *     {{#crossLink "bui.emitter/one"}}{{/crossLink}}: 监听一次事件 <br>
   *   </div>
   * </div>
   *  @namespace bui
   *  @class emitter
   *  @constructor  
   *  @example
     
   *   js: 
   
          // 初始化
          var emitter = bui.emitter();
    
          // 自定义search事件监听
          emitter.on("search",function(val){
            search(val);
          });
          
          $("#id").click(function (e) {
            var val = $("input").val();
            emitter.trigger("search",val);
          })
          
          // 搜索
          function search(val) {
            bui.ajax({
              url: "",
              data: {
                keyword: val
              }
            }).then(function () {
              // 拿到数据返回渲染
            })
          }
   *
   */
  ui.emitter = function () {
    function Emitter() {
      this.handle = Object.create(null);
    }

    /**
     *  监听自定义事件 
     *  @method on
     *  @param {string} [type] [ 自定义事件名称  ]
     *  @param {function} [callback] [ 触发的回调 ]
     *  @example 
        
        // 自定义search事件监听
        emitter.on("search",function(val){
          search(val);
        });
            
     */
    Emitter.prototype.on = function (type, widget, callback) {

      if (typeof widget === "function") {
        callback = widget;
        widget = this;
      } else {
        callback = callback;
        widget = widget || this;
      }

      widget.handle = widget.handle || {};

      var types = type && type.indexOf(",") > -1 ? type.split(",") : [type];

      types.forEach(function (item, i) {
        if (typeof widget.handle[item] === "undefined") {
          widget.handle[item] = [];
        }
        widget.handle[item].push(callback);
      });

      return widget;
    };
    /**
     *  取消事件 
     *  @method off
     *  @param {string} [type] [ 自定义事件名称  ]
     *  @param {function} [callback] [ 触发的回调 ]
     *  @example 
        
        // 取消所有search事件
        emitter.off("search");
            
     */
    Emitter.prototype.off = function (type, widget, callback) {
      if (typeof widget === "function") {
        callback = widget;
        widget = this;
      } else if (typeof callback === "function") {
        callback = callback;
        widget = widget || this;
      } else {
        widget = this;
      }

      if (type === "undefined") {
        // 删除绑定的所有事件
        widget.handle = {};
      } else if (typeof type === "string" && typeof callback === "function") {
        // 删除绑定的指定方法
        ui.array.remove(callback, widget.handle[type]);
      } else if (typeof type === "string") {
        // 删除绑定的某个事件
        widget.handle = {};
        widget.handle[type] = [];
      }
      return widget;
    };

    /**
     *  只监听在第一次的时候触发
     *  @method one
     *  @param {string} [type] [ 自定义事件名称  ]
     *  @param {function} [callback] [ 触发的回调 ]
     *  @example 
        
        // 监听一次
        emitter.one("search",function(val){
          search(val);
        });
            
     */
    Emitter.prototype.one = function (type, callback) {

      // 执行一次以后就取消
      function once() {
        callback && callback.apply(this, arguments);
        this.off(type, once);
      }

      this.on(type, once);
      return this;
    };

    /**
     *  触发事件
     *  @method trigger
     *  @param {string} [type] [ 自定义事件名称  ]
     *  @param {string|object|number} [arguments] [ 需要传给自定义事件的参数,可以有多个 ]
     *  @example 
        
        $("#id").click(function (e) {
          emitter.trigger("search",e);
        })
            
     */
    Emitter.prototype.trigger = function (type) {

      try {

        if (this.handle[arguments[0]] instanceof Array) {
          var handles = this.handle[arguments[0]];
          var args = [].slice.apply(arguments);
          args.shift();
          for (var i = 0, len = handles.length; i < len; i++) {
            // this.self 通过点击触发的是对应的按钮本身,通过调用方法则是module本身
            handles[i] && handles[i].apply(this.self || this, args);
          }
        }
      } catch (e) {}

      return this;
    };
    /**
     *  通知所有变更
     *  @method notify
     *  @since 1.5.0
     *  @example 
        
        $("#id").click(function (e) {
          emitter.notify();
        })
            
     */
    Emitter.prototype.notify = function () {
      try {
        for (var keyName in this.handle) {
          if (this.handle[keyName] instanceof Array) {
            var handles = this.handle[keyName];
            for (var i = 0, len = handles.length; i < len; i++) {
              // this.self 通过点击触发的是对应的按钮本身,通过调用方法则是module本身
              handles[i] && handles[i].apply(this.self || this);
            }
          }
        }
      } catch (e) {}

      return this;
    };
    return function (argument) {
      return new Emitter();
    };
  }();

  // 公共全局事件
  var event = bui.emitter();

  /*
   *  bui的事件监听
   *  @method on
   *  @since 1.3.0
   *  @param {string} [type] [ 事件类型: "pagebefore"(dom准备完毕,但bui还未初始化) | "pageinit"(dom准备完毕,bui初始化完成) | "pageready"(dom+原生能力都已经准备完毕) | "onload"(图片及资源都加载完毕以后触发) ]
   *  @param {object} [widget] [ 绑定的事件, this 为当前点击的菜单 ]
   *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
   *  @example 
      
      bui.on("pageready",function (argument) {
          console.log("pageready")
      })
          
   */
  // 绑定监听 参数: type,widget(初始化的实例),callback
  ui.on = event.on;

  /*
   *  bui的取消事件 
   *  @method off
   *  @since 1.3.0
   *  @param {string} [type] [ 事件类型: "pagebefore"(dom准备完毕,但bui还未初始化) | "pageinit"(dom准备完毕,bui初始化完成) | "pageready"(dom+原生能力都已经准备完毕) | "onload"(图片及资源都加载完毕以后触发) ]
   *  @param {object} [widget] [ 绑定的事件, this 为当前点击的菜单 ]
   *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
   *  @example 
      
      bui.off("pagebefore")
          
   */
  // 取消绑定监听 参数: type,widget(初始化的实例),callback
  ui.off = event.off;

  // 触发监听事件 参数: type,...
  ui.trigger = event.trigger;

  // 触发监听事件 参数: type,...
  ui.one = event.one;

  return ui;
})(window.bui || {}, window.libs);

/**
 * 核心 
 * @module Core
 */

(function (ui, $) {
  "use strict";

  /**
   * <h2>数据存储订阅器</h2>
   * <p>在数据更改的时候,会触发数据更改事件. 公共数据在 index.js 只要初始化一次, 类似vuejs的用法,但又不完全一致. </p>
   * <h3>方法说明:</h3>
   * {{#crossLink "bui.store/get"}}{{/crossLink}}: 获取所有数据或者某个字段数据<br>
   * {{#crossLink "bui.store/set"}}{{/crossLink}}: 保存某个字段数据,并触发相关事件<br>
   * {{#crossLink "bui.store/del"}}{{/crossLink}}: 删除某个字段,并触发相关事件<br>
   * {{#crossLink "bui.store/on"}}{{/crossLink}}: 绑定事件,事件名为数据的字段名<br>
   * {{#crossLink "bui.store/off"}}{{/crossLink}}: 取消绑定事件,事件名及回调需要跟on保持一致<br>
   * {{#crossLink "bui.store/trigger"}}{{/crossLink}}: 手动触发事件变更<br>
   * @namespace  bui
   * @class  store
   * @since 1.5.0
   * @param {object} [option] 
   * @param {string} [option.scope] [数据的范围唯一标识]
   * @param {boolean} [option.isPublic] [是否作为公共数据, 默认: false ( 在模块里面使用) | true (在index.js 路由初始化以后使用)]
   * @param {object} [option.data] [动态监听的对象,当变更会自动触发相关联的选择器,需要提前定义]
   * @param {object} [option.computed] [需要动态计算改变的相关联的时候,例如 fullName ,依赖于 data.firstName,data.lastName]
   * @param {object} [option.watch] [监听的数据字段,在数据改变的时候,做对应的其它事情]
   * @param {object} [option.method] [定义的方法,便于拿取相关数据]
   * @constructor 
   * @example
   
      var store = bui.store({
        scope: "app",
        data: {
          page: 1
        }
      });
      
      // 这样就会设置内容为1
      <div b-text="app:page"></div>
  
      你还可以监听该对象改变的时候,做些其它事情
      // 监听 page 改变的时候触发
      store.on("page",function(2){
    
      })
      
      // 设置以后就会触发
      store.page = 2;
    
    方法2: 
      
      // 监听 page 下 name 改变的时候触发
      store.on("page.name",function(2){
    
      })
      
      // 修改 page 数据
      store.set("page.name",1321);
  
      // page.name = 1321;
   *
   */

  ui.store = function (option) {

    var _config = {
      scope: "",
      data: null,
      computed: null,
      method: null,
      watch: null,
      isPublic: false,
      log: false
      // 事件订阅触发器
    };var emitter = ui.emitter(),
        _store = option && ui.typeof(option) === "object" ? option.data : option || {},

    // 事件的标识符
    gid = option && option.scope || ui.guid(),

    // 代理计算对象
    _computed = option.computed || _config.computed,
        _method = option.method || _config.method,

    // 监听的简写
    _watch = option.watch || _config.watch,
        _isPublic = option.isPublic || _config.isPublic,
        useSet = false; // 是否通过设置方法触发
    // 在读取的时候拦截,记录触发的target, set 才不会重复增加
    emitter.target = null;

    var $dom = ui.hasRouter ? router.$ : $;

    var keyNames = [],

    // 缓存键值
    cacheStore = $.extend(true, {}, _store);
    var cache = {};
    // 事件监听的绑定缓存
    var cacheListen = [];

    var param = {};
    param.log = _config.log;

    var commandAttrs = ["b-text", "b-html", "b-value", "b-show", "b-checked", "b-bind", "b-model"];
    // 缓存扁平化的键值
    var cacheKeyname = {};

    var module = {
      on: on,
      off: off,
      one: one,
      trigger: trigger,
      $data: _store,
      $method: _method,
      $watch: _watch,
      $computed: _computed,
      get: get$$1,
      set: set$$1,
      del: del,
      observer: observer,
      compile: compile
      // remove: remove,
      // save: save


      // 初始化
    };init();

    function init() {

      // 监听对象的变更
      observer(_store);
      // 代理方法
      _method && proxyMethod();
      // 代理计算的属性
      _computed && proxyComputed();
      // 处理监听的键值对
      _watch && proxyWatch();
      // 把data
      proxyData();

      // 单页使用模块加载
      if (_isPublic && ui.hasRouter) {

        // 模块加载以后,解析模板
        router.on("complete", function (e) {

          compile();
        });
      } else {
        compile();
      }
    }

    // 把data 文件代理到实例上
    function proxyData() {
      var _loop = function _loop(key) {
        Object.defineProperty(module, key, {
          configurable: true,
          get: function get$$1() {
            return _store[key]; // 如this.a = {b: 1}
          },
          set: function set$$1(newVal) {
            _store[key] = newVal;
          }
        });
      };

      // 数据代理到this
      for (var key in cacheStore) {
        _loop(key);
      }
    }

    // 绑定自定义的监听, 相当于 module.on 
    function proxyWatch() {
      Object.keys(_watch).forEach(function (item, i) {

        on(item, _watch[item].bind(module));
      });
    }

    // 处理计算属性
    function proxyComputed() {
      // 遍历传进来的值定义到module上,便于用实例 store.a 这样来访问对象
      Object.keys(_computed).forEach(function (key) {
        Object.defineProperty(module, key, {
          get: typeof _computed[key] === 'function' ? _computed[key] : _computed[key].get,
          set: _computed[key] && ui.typeof(_computed[key]) === 'object' ? _computed[key].set || function () {} : function () {}
        });
      });
    }

    // 定义的公共方法
    function proxyMethod() {
      // 遍历传进来的值定义到module上,便于用实例 store.a 这样来访问对象
      Object.keys(_method).forEach(function (key) {
        Object.defineProperty(module, key, {
          get: typeof _method[key] === 'function' ? _method[key] : _method[key].get,
          set: _method[key] && ui.typeof(_method[key]) === 'object' ? _method[key].set || function () {} : function () {}
        });
      });
    }

    // 解析模板里面的数据选择器
    function compile() {

      // 绑定命令处理
      commandAttrs.forEach(function (command, i) {
        var comandDoms = $dom("[" + command + "*=\"" + gid + "\"]");

        if (comandDoms.length) {
          comandDoms.each(function (i, item) {

            var _self = this;
            var uid = getAttrs.call(this, "" + command);
            var keyname = uid[0]["keyname"];
            var value = null;

            // 缓存的键值
            if (keyname in cacheKeyname) {
              value = cacheKeyname[keyname];
            } else {
              // 获取值
              value = ui.unit.getKeyValue(keyname, module);
              cacheKeyname[keyname] = value;
            }

            // 针对关联的处理
            var linked = getAttrs.call(this, "b-linked");

            if (linked.length) {
              // 根据关联字段改变触发对应选择器
              linked.forEach(function (link, n) {
                on(link.keyname, function (e) {
                  // 手动触发该选择器
                  trigger(keyname, { value: ui.unit.getKeyValue(keyname, module), action: "set", keyname: keyname, data: module });
                });
              });
            }

            switch (command) {
              case "b-text":
                // 监听每个键值需要处理的事件
                on(keyname, setText.bind(_self));
                break;
              case "b-html":
                // 监听每个键值需要处理的事件
                on(keyname, setHtml.bind(_self));
                break;
              case "b-value":
                // 监听每个键值需要处理的事件
                on(keyname, setValue.bind(_self));
                break;
              case "b-model":
                // 监听每个键值需要处理的事件
                on(keyname, setValue.bind(_self));
                break;
              case "b-show":
                // 监听每个键值需要处理的事件
                on(keyname, setDisplay.bind(_self));
                break;
              case "b-checked":
                // 监听每个键值需要处理的事件
                on(keyname, setChecked.bind(_self));
                break;
            }

            // 手动触发初始值
            trigger(keyname, { value: value, action: "set", keyname: keyname, data: cacheStore });

            // 清空键值,防止读取的时候,直接累计
            keyNames = [];
          });
        }
      });

      // 属性处理,支持对象
      var $attrs = $dom("[b-bind*=\"" + gid + "\"]");

      if ($attrs.length) {
        $attrs.each(function (i, item) {
          var _self = this;
          var uid = getAttrs.call(this, 'b-bind');
          var keyname = uid[0]["keyname"];
          var value = null;

          // 缓存的键值
          if (keyname in cacheKeyname) {
            value = cacheKeyname[keyname];
          } else {
            // 获取值
            value = ui.unit.getKeyValue(keyname, module);
            cacheKeyname[keyname] = value;
          }

          // 监听每个键值需要处理的事件
          on(keyname, setAttr.bind(_self));
          // 手动触发初始值
          trigger(keyname, { value: value, action: "set", keyname: keyname, data: cacheStore });

          // 清空键值,防止读取的时候,直接累计
          keyNames = [];
        });
      }

      // 双向绑定的处理
      var $model = $dom("[b-model*=\"" + gid + "\"]");

      if ($model.length) {
        // 优化缓冲处理
        $model.on("input", bui.unit.debounce(function (e) {
          var val = e.target.value;
          var _self = this;
          var uid = getAttrs.call(this, 'b-model');
          var keyname = uid[0]["keyname"];

          set$$1(keyname, val);
          // 清空键值,防止读取的时候,直接累计
          keyNames = [];
        }, 200));
      }
      // 双向绑定的处理
      var $checked = $dom("[b-checked*=\"" + gid + "\"]");

      if ($checked.length) {
        // 优化缓冲处理
        $checked.on("change", function (e) {
          var val = this.checked;
          var uid = getAttrs.call(this, 'b-checked');
          var keyname = uid[0]["keyname"];

          set$$1(keyname, val);
          // 清空键值,防止读取的时候,直接累计
          keyNames = [];
        });
      }
      // 针对样式单独处理,支持对象
      var $class = $dom("[b-class*=\"" + gid + "\"]");

      if ($class.length) {
        $class.each(function (i, item) {
          var _self = this;
          var uid = getAttrs.call(this, 'b-class');
          var keyname = uid[0]["keyname"];
          var value = null;

          // 缓存的键值
          if (keyname in cacheKeyname) {
            value = cacheKeyname[keyname];
          } else {
            // 获取值
            value = ui.unit.getKeyValue(keyname, module);
            cacheKeyname[keyname] = value;
          }

          // 监听每个键值需要处理的事件
          on(keyname, setClass.bind(_self));
          // 手动触发初始值
          trigger(keyname, { value: value, action: "set", keyname: keyname, data: cacheStore });

          // 清空键值,防止读取的时候,直接累计
          keyNames = [];
        });
      }
    }

    // 针对不同命令的不同处理
    function setText(e) {
      this.textContent = e.value;
    }
    function setHtml(e) {
      this.innerHtml = e.value;
    }
    function setValue(e) {
      this.value = e.value;
    }
    function setDisplay(e) {
      this.style.display = e.value ? "block" : "none";
    }
    function setChecked(e) {
      this.checked = !!e.value;
    }
    // 针对属性处理
    function setAttr(e) {
      var _this = this;

      var _self = this;
      // 设置对应的属性
      if (_typeof(e.value) === "object") {
        var _loop2 = function _loop2(key) {
          // 监听到每个属性的改变
          on(e.keyname + "." + key, function (e) {
            _self.setAttribute(key, e.value);
          });
          _this.setAttribute(key, e.value[key]);
        };

        // 监听每个键值需要处理的事件
        for (var key in e.value) {
          _loop2(key);
        }
      } else {
        this.setAttribute(e.keyname, e.value);
      }
    }
    // 针对样式属性处理
    function setClass(e) {
      var _this2 = this;

      var _self = this;
      // 样式的处理可以是对象,可以是数组
      if (_typeof(e.value) === "object") {
        var _loop3 = function _loop3(key) {
          var val = e.value[key];
          // 监听到每个属性的改变
          on(e.keyname + "." + key, function (e) {

            addClass.call(_self, key, e.value);
          });

          // 如果值是布尔值,增加样式名在键值
          addClass.call(_this2, key, val);
        };

        // 监听每个键值需要处理的事件
        for (var key in e.value) {
          _loop3(key);
        }
      } else {
        addClass.call(this, e.keyname, e.value);
      }
    }

    function addClass(keyname, value) {
      // 如果值是布尔值,增加样式名在键值
      if (typeof value === "boolean") {
        value && this.classList.add(keyname);
        !value && this.classList.remove(keyname);
      } else if (typeof value === "string") {
        if (value && !this.classList.contains(value)) {
          this.classList.add(value);
        }
      }
    }

    // 处理属性值, 返回,会有多个属性存在不同数据源的情况 [{scope:gid,keyname:""}]
    function getAttrs(name) {
      var attrs = [];
      var attr = this.getAttribute(name) || "";
      var keynames = attr.indexOf("&") > -1 ? attr.split("&") : attr && [attr] || [];

      keynames.forEach(function (item, i) {
        var keyobj = {};
        if (item.indexOf(":") > -1) {
          var keys = item.split(":");
          keyobj["scope"] = keys[0];
          keyobj["keyname"] = keys[1];
        } else {
          keyobj["scope"] = gid;
          keyobj["keyname"] = item;
        }
        attrs.push(keyobj);
      });

      return attrs;
    }
    // 监听对象的定义
    function observer(obj) {

      return proxyObj(obj);

      function proxyObj(obj) {

        Object.keys(obj).forEach(function (key) {
          // 缓存键值
          var value = obj[key];

          if (value instanceof Array) {

            observerArr(value, key);
            // 数组通过value监听
          } else {

            // 对象的属性通过defaineProperty监听
            Object.defineProperty(obj, key, {
              enumerable: true,
              configurable: true,
              get: function get$$1(e) {
                param.log && console.log("getting " + key);

                // 读取整个字段的时候缓存键值
                if (emitter.target === this) {
                  keyNames = [];
                }
                // 层级的读取this会指向该层级
                emitter.target = this;
                // 设置访问的时候扁平化键值
                keyNames.push(key);

                return value;
              },
              set: function set$$1(newValue) {

                if (newValue === value) {
                  keyNames = [];
                  useSet = false;
                  return;
                }
                // 读取整个字段的时候缓存键值
                if (emitter.target === this) {
                  keyNames = [];
                }
                emitter.target = this;
                // 设置访问的时候扁平化键值
                keyNames.push(key);

                var keyNamesStr = keyNames.join(".");

                // 如果通过set的方式,直接设置值
                param.log && console.log("setting " + keyNamesStr);

                // 设置新值
                value = newValue;

                // 保持同步数据,这个数据不进行实时变更
                ui.unit.setKeyValue(keyNamesStr, value, cacheStore);

                // 触发针对数据的监听事件
                trigger(keyNamesStr, { action: "set", value: value, keyname: keyNamesStr, data: cacheStore });

                keyNames = [];
                useSet = false;

                // 针对值是对象的继续使用递归处理
                if (value instanceof Array) {
                  observer(value);
                } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                  observer(newValue);
                }

                return true;
              }
            });
          }

          // 初始化的时候,把键值里的对象都进行递归拦截
          if (value && ui.typeof(value) === "object") {

            return observer(value);
          }
        });
      }

      // 针对数组的监听处理
      function observerArr(arr, key) {

        var arrayMethod = Object.create(Array.prototype);
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
          Object.defineProperty(arrayMethod, method, {
            enumerable: true,
            configurable: true,
            value: function value() {
              keyNames.push(key);
              param.log && console.log(keyNames.join(".") + " action " + method + " ");

              var args = [].concat(Array.prototype.slice.call(arguments));
              Array.prototype[method].apply(this, args);
              // 拦截数组的事件
              trigger(keyNames.join("."), { action: method, value: args, keyname: key, data: cacheStore });

              // 清空keyname
              keyNames = [];
            }
          });
        });

        arr.__proto__ = arrayMethod;

        return arr;
      }
    }

    /**
     * 获取数据
     *  @method get
     *  @param {string} [name] [ 取哪个键值的数据,不传则取全部 ]
     *  @chainable
     *  @example
     *  
       var page = store.get("page");
     * 
     */
    function get$$1(name) {
      if (typeof name === "undefined") {
        cacheStore = cacheStore;
        return cacheStore;
      } else if (typeof name === "string") {
        // 清空键值,防止读取的时候,直接累计
        var val = ui.unit.getKeyValue(name, cacheStore);
        keyNames = [];
        return val;
      }
      return cacheStore;
    }

    /**
     * 保存数据,并会触发 通过 store.on 监听的事件.
     *  @method set
     *  @param {string} [name] [ 存储数据在哪个键值,对象则存储多个 ]
     *  @param {string|object|array} [value] [ 存值 ]
     *  @chainable
     *  @example
     *
       方法1: 
       var page = store.set("page",1);
       // { page: 1}
         方法2: 指定字段层级
       var page = store.set("page.name",1);
       // { page: { name: 1 }}
        
     * 
     */
    function set$$1(name, value) {
      var isString = typeof name === "string";
      var keys = [];
      var newValue = null;
      if (isString && typeof value !== "undefined") {
        param.log && console.log("set " + name + " ");
        // 如果存在则不处理
        if (value === cache[name]) {
          return;
        }

        // 如果键值是一个对象,里面的键值也要触发
        if (value && ui.typeof(value) === "object") {

          newValue = $.extend(true, {}, value);

          // 事件的键名
          keys.push(name);
          Object.keys(value).forEach(function (item, i) {
            keys.push(item);
            trigger(keys.join("."), { value: value[item], action: "set", keyname: keys.join("."), data: cacheStore });
          });
        } else {
          newValue = value;
        }

        // 同步两个数据值,避免每次都要读取
        ui.unit.setKeyValue(name, newValue, cacheStore);
        ui.unit.setKeyValue(name, value, _store);
        // _store = cacheStore;

        // 缓存设置过的值
        cache[name] = newValue;

        // 触发自身键值的事件
        trigger(name, { value: newValue, action: "set", keyname: name, data: cacheStore });

        // 如果是数组或者对象,再进行遍历
        if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {

          observer(value);
        }

        // 通过设置方法设置
        useSet = true;
        keyNames = [];
      } else if (name && ui.typeof(name) === "object") {
        // 缓存映射
        cacheStore = $.extend(true, {}, cacheStore, name);
        // 触发订阅数据更改的事件
        eachTrigger(name);
      }
      return cacheStore;
    }

    /*
     * 保存数据,不会触发 store.on 监听的事件.
     *  @method save
     *  @param {string|object} [name] [ 存储数据在哪个键值,对象则存储多个 ]
     *  @param {string|object|array} [value] [ 存值 ]
     *  @chainable
     *  @example
     *
       方法1: 
       var page = store.save("page",1);
       // { page: 1}
         方法2: 指定字段层级
       var page = store.save("page.name",1);
       // { page: { name: 1 }}
        
       
     * 
     */
    function remove(name, callback) {
      if (typeof name === "string") {
        // 简单删除5层数据
        ui.unit.delKey(name, cacheStore);

        callback && callback.call(module, name);
      }
      return cacheStore;
    }
    /**
     * 删除数据.并触发事件
     *  @method del
     *  @param {string} [name] [ 存储数据在哪个键值,对象则存储多个 ]
     *  @chainable
     *  @example
     *
       方法1: 
       var page = store.del("page");
       // { page: 1}
         方法2: 指定字段层级
       var page = store.del("page.name");
       
       
     * 
     */
    function del(name, callback) {

      remove(name, function (n) {
        trigger(name);
      });
      return cacheStore;
    }

    // 触发
    function eachTrigger(option, par) {
      // 触发订阅数据更改的事件
      for (var key in option) {
        var type = typeof par === "undefined" ? key : par + key,
            val = option[key];

        trigger(type, { value: val, action: "set", keyname: type, data: cacheStore });
        if (val && ui.typeof(val) === "object") {
          eachTrigger(val, key + ".");
        }
      }
    }

    /**
     * 监听数据的修改, on事件监听必须在 set 数据修改之前.
     *  @method on
     *  @param {string} [name] [ 数据的字段为事件名 ]
     *  @param {function} [callback] [ 数据修改以后的回调 ]
     *  @chainable
     *  @example
     *
       // 监听 page 改变的时候触发
        store.on("page",function(val){
          console.log(val)  // 2
        })
          // 监听 page 下 name 改变的时候触发
        store.on("page.name",function(val){
          console.log(val)  // 3
        })
          // 修改 page 数据
        store.set("page",2);
          // 修改 page.name 数据
        store.set("page.name",3);
      
     * 
     */
    function on(type, callback) {
      var eventType = gid + "-" + type;
      emitter.on.call(module, eventType, callback);
      return this;
    }
    /**
     * 监听数据的修改, 只触发一次, one事件监听必须在 set 数据修改之前.
     *  @method one
     *  @param {string} [name] [ 数据的字段为事件名 ]
     *  @param {function} [callback] [ 数据修改以后的回调 ]
     *  @chainable
     *  @example
     *
       // 监听 page 改变的时候触发
        store.one("page",function(val){
          console.log(val)  // 2
        })
          // 监听 page 下 name 改变的时候触发
        store.one("page.name",function(val){
          console.log(val)  // 3
        })
          // 修改 page 数据
        store.set("page",2);
        
        // 修改 page.name 数据
        store.set("page.name",3);
      
     * 
     */
    function one(type, callback) {
      var eventType = gid + "-" + type;
      emitter.one.call(module, eventType, callback);
      return this;
    }

    /**
     * 取消监听某个数据
     *  @method off
     *  @param {string} [name] [ 数据的字段为事件名 ]
     *  @param {function} [callback] [ 回调名,需跟原本绑定的为同一个方法才能取消 ]
     *  @chainable
     *  @example
     *
       
       var log = function(val){
          console.log(val)  // 2
        }
        // 监听 page 改变的时候触发
        store.on("page",log)
          // 取消
        store.off("page",log)
          // 修改 page 数据
        store.set("page",2);
      
     * 
     */
    function off(type, callback) {
      var eventType = gid + "-" + type;
      emitter.off.call(module, eventType, callback);
      return this;
    }

    /**
     * 手动触发
     *  @method trigger
     *  @param {string} [name] [ 数据的字段为事件名 ]
     *  @chainable
     *  @example
     *
       // 触发 2 为传过去的参数
       store.trigger("page","2")
      
     * 
     */
    function trigger(type) {

      var eventType = gid + "-" + type;
      arguments[0] = eventType;

      emitter.trigger.apply(module, arguments);

      emitter.target = null;
      return this;
    }

    return module;
  };

  return ui;
})(window.bui || {}, window.libs);

/**
 * 核心 
 * @module Core
 */

(function (ui, $) {

    /**
     * 默认引入BUI.js就会初始化整个视图缩放. 
     * 用于修改页面缩放比例,默认字体大小100px,手机端的字体大小大概在76px;
     * 整个缩放是基于540视图处理.
     * @namespace bui
     * @class  viewport
     * @constructor 
     * @param  {number} size [默认页面的字体大小比例是100, bui会动态去计算该以多大展示]
     * @param  {number} base [设计稿大小基数540, bui会动态去计算该以多大展示]
     * @example
     *
         bui.ready(function(){
             //强制页面缩小一半的比例显示
             window.viewport = bui.viewport(50);
         })
     *    
     */

    function view(csize, base) {

        ui.trigger.call(ui, "viewportbefore");

        var size,
            metaEl = document.querySelector("meta[name=viewport]"),
            viewport = "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no",
            ratio = window.devicePixelRatio,
            winWid = document.documentElement.clientWidth,
            winHei = document.documentElement.clientHeight,
            winWidth = parseInt(winWid) * parseInt(ratio),
            winHeight = parseInt(winHei) * parseInt(ratio);

        //是否需要动态创建viewport
        if (metaEl) {

            ui.config.viewport.create && (metaEl.content = viewport);
        } else {
            var element = document.createElement('meta');
            element.name = "viewport";
            element.content = viewport;
            var head = document.head;
            ui.config.viewport.create && head.appendChild(element);
            element = null;
        }

        // 已经做过适配的设备宽度 基于540  ,534,854为华为pad w09
        var device = [240, 320, 360, 375, 384, 412, 414, 435, 480, 512, 540, 768, 1024, 1536, 2048, 2732, 534, 854, 750];
        var deviceSize = [32, 42.67, 48, 50, 51.2, 54.93, 55.2, 58, 64, 68.27, 60, 60, 60, 60, 60, 60, 60, 60, 60];
        var index = ui.array.index(document.documentElement.clientWidth, device);

        // 没传参数时,并且分辨率已经存在时,不做处理,可以更快
        if (index > -1 && typeof csize === "undefined") {
            // 是否已经全局适配,通过样式设置
            size = deviceSize[index];
        } else {
            // 初始化
            init(csize);
        }

        function init(option) {
            //计算缩放的比例
            var baseSize = 100,
                // 字体基数 
            baseWidth = base || 750,
                // 设计量的尺寸
            domHtml = document.head.parentNode;

            var fontSize = option ? option : (winWid / baseWidth * baseSize).toFixed(2);

            // 通过js动态设置 
            size = fontSize;
            ui.config.viewport.zoom && (domHtml.style.fontSize = size + 'px');

            ui.trigger.call(ui, "viewportinit");

            return this;
        }

        /**
         * 获取视口的宽度
         * @method width
         * @example
         *
            bui.ready(function(){
                var width = window.viewport.width();
            })
         *
         */
        function getWidth(argument) {
            return winWid;
        }

        /**
         * 获取视口的高度
         * @method height
         * @example
         *
            bui.ready(function(){
                var height = window.viewport.height();
            })
         *
         */
        function getHeight(argument) {
            return winHei;
        }
        /**
         * 获取的屏幕宽度分辨率
         * @method screenWidth
         * @example
         *
            bui.ready(function(){
                var width = window.viewport.screenWidth();
            })
         *
         */
        function getScreenWidth(argument) {
            return winWidth;
        }
        /**
         * 获取的屏幕高度分辨率
         * @method screenHeight
         * @example
         *
            bui.ready(function(){
                var height = window.viewport.screenHeight();
            })
         *
         */
        function getScreenHeight(argument) {
            return winHeight;
        }
        /**
         * 获取高清屏的dpi
         * @method ratio
         * @example
         *
            bui.ready(function(){
                var ratio = window.viewport.ratio();
            })
         *
         */
        function getRatio(argument) {
            return ratio;
        }

        return {
            width: getWidth,
            height: getHeight,
            fontSize: size,
            screenWidth: getScreenWidth,
            screenHeight: getScreenHeight,
            ratio: getRatio,
            init: init
        };
    }

    ui.viewport = view;

    return ui;
})(window.bui || {}, window.libs);

/**
 * 核心 
 * @module Core
 */

(function (ui, $) {
  "use strict";

  /**
   * <h2>模块加载器</h2>
   * <p>模块加载器, 默认已经初始化给 window.loader, 无需再次初始化. </p>
   * <p>可以直接调用 loader.define, loader.require 或者 loader.map 等方法</p>
   * <p>主要配合 router 的单页模块加载. </p><h3>预览地址: <a href="../../index.html#pages/ui_loader/index.html" target="_blank">demo</a></h3>
   * <h3>方法说明:</h3>
   * {{#crossLink "bui.loader/define"}}{{/crossLink}}: 模块定义<br>
   * {{#crossLink "bui.loader/require"}}{{/crossLink}}: 加载模块 <br>
   * {{#crossLink "bui.loader/map"}}{{/crossLink}}: 模块声明,基本路径配置 <br>
   * {{#crossLink "bui.loader/import"}}{{/crossLink}}: 加载动态脚本资源及CSS资源 <br>
   * {{#crossLink "bui.loader/checkLoad"}}{{/crossLink}}: 检查是否所有模块都已经实例化 <br>
   * @namespace  bui
   * @class  loader
   * @since 1.4.0
   * @param {object} [option] 
   * @param {boolean} option.cache [默认: true, 浏览器缓存脚本 | false, 不缓存 ]
   * @param {boolean} option.scriptSuffix [默认: ".js", 一般无需更改 ]
   * @constructor 
   * @example
   
      // 默认已经初始化,无需再次初始化
      window.loader = bui.loader();
   *
   */

  ui.loader = function (option) {
    var config = {
      cache: true, // 是否需要缓存
      async: false, // 动态创建的脚本本身就是异步加载,但创建多个脚本则是同步加载
      trace: false,
      scriptSuffix: ".js"
    };

    var param = $.extend({}, config, ui.config.loader, option);

    var pageKeys = [],
        // 页面的键值
    moduleNameIndex = 0,

    // 优先加载的依赖
    _waitModule = [],

    // 脚本文件依赖缓存
    _loadedScriptCache = [],
        // ["page.js","page2.js"]
    _styleCache = [],
        // ["page1.css"]
    // 注册的id以及加载的页面之间的关系
    _map = {
      baseUrl: "",
      modules: {}
    },
        _modulesMap = {};

    var module = {
      init: init,
      define: define,
      require: require,
      destroy: destroy,
      map: map,
      import: load,
      checkLoad: checkAllLoaded,
      checkDefine: checkAllDefined

      // 
    };function init(opt) {
      opt = opt || {};

      param = $.extend({}, param, opt);

      return this;
    }

    /**
     *  <p>设置或者获取模块之间的依赖关系</p>
     *  <p>如果define了一个自定义名称的模块,则需要在首页用map方法,声明该模块的script或callback属性</p>
     *  @method map
     *  @param {object} [option] 
     *  @param {string} [option.baseUrl] [默认:"" 脚本资源的公共路径 ] 
     *  @param {object} [option.modules] [默认:{} 模块的配置存放在modules对象中 ] 
     *  @param {object} [option.modules.main] [默认:{} router路由默认定义了一个main模块 ] 
     *  @param {string} option.modules.main.moduleName [默认:"main" 当前模块的名称等于父级名 ] 
     *  @param {string} option.modules.main.template [默认:"" 模板名称,用于路由的模板加载 ] 
     *  @param {string} option.modules.main.script [默认:"" 当前模块的加载脚本 ] 
     *  @param {array}  [option.modules.main.style] [默认:[] 加载模块的样式资源,也可以使用load方法单独加载]
     *  @param {array}  [option.modules.main.depend] [默认:[] 模块的依赖名,如果define时没有声明名称,则依赖名为该脚本的路径去掉.js ] 
     *  @example
        
        例子1: 获取所有模块的配置信息
        var map = loader.map();
          例子2: 声明单个模块;
          loader.map({
            moduleName: "main",
            template: "pages/main/main.html",
            script: "pages/main/main.js"
        })
          例子3: 定义多个模块,并修改路径
        loader.map({
          baseUrl: "",
          modules: {
            // 自定义模块名
            "main": {
              moduleName: "main",
              template: "pages/main/main.html",
              script: "pages/main/main.js"
            }
          }
        })
     * 
     */
    function map(option) {
      if (typeof option === "undefined") {
        return _map;
      } else if ((typeof option === "undefined" ? "undefined" : _typeof(option)) === "object" && ("modules" in option || "baseUrl" in option)) {
        // 缓存映射
        _map = $.extend(true, {}, _map, option);
        _modulesMap = _map["modules"];
      } else if ((typeof option === "undefined" ? "undefined" : _typeof(option)) === "object" && "moduleName" in option) {

        var mod = extendModule(option);

        _modulesMap[option["moduleName"]] = mod || {};

        // console.log(_modulesMap)
        // 缓存映射
        _map = $.extend(true, {}, _map, { "modules": _modulesMap });
        _modulesMap = _map["modules"];
      }

      return _map;
    }

    /*
     * [getModule 获取模块信息]
     * @param  {[string]} moduleName [通过模块名称,获取模块信息]
     * @return {[object]}            [description]
     */
    function extendModule(opt) {
      var _config = {
        "id": "",
        "moduleName": "",
        "template": "",
        "data": null,
        "depend": [],
        "script": "",
        "style": [],
        "isDefined": false,
        "isLoaded": false,
        "beforeCreate": null,
        "created": null,
        "beforeLoad": null,
        "loaded": null,
        "beforeDestroy": null,
        "destroyed": null,
        // "callback": null,
        "exports": {},
        "dependExports": []
      };
      var prevDefine = {};
      if (opt.moduleName in _modulesMap) {
        prevDefine = _modulesMap[opt.moduleName];
      }
      var newMod = $.extend(true, {}, _config, prevDefine, opt);

      return newMod;
    }

    /**
     * <p>销毁一个模块</p>
     *  @method destroy
     *  @param {object} [option] 
     *  @param {string} [option.name] [模块的自定义名称,可以省略,自定义模块名以后,需要用map声明该模块的script属性,或者callback方法 ]
     *  @param {array} [option.depend] [模块的依赖模块,可以省略, 模块名不含.js ]
     *  @param {function} option.callback [注册回调,如果有return值, 可以抛出给其它模块调用 ]
     *  @return {object}  [ 返回值用于公共使用 ]
     *  @example
        
          例子1: 注册首页的回调 pages/main/main.js
        提示: pages/main/main.js 文件, 定义了一个匿名模块,匿名模块的模块名取.js前面的路径名,确保唯一
        
        // 最简单的匿名定义 loader.define 
        loader.define(function(require,exports,module){
              // require : 相当于 loader.require, 获取依赖的模块
            // module : 拿到当前模块信息
            
            // 可以通过 return 把希望给其它页面调用的方法抛出来
            return {
                }
        })
      */
    function destroy(name) {
      param.trace && console.log("destroy", name);
      var modItem = typeof name === "string" ? _modulesMap[name] : null;
      if (modItem) {
        // 销毁前
        modItem["beforeDestroy"] && modItem["beforeDestroy"].call(modItem);

        var src = $("script[name=\"" + name + "\"]").attr("src");

        // 删除脚本缓存
        _loadedScriptCache = ui.array.remove(src, _loadedScriptCache);

        // 删除脚本
        $("script[name=\"" + name + "\"]").remove();

        // 删除模块
        delete _map["modules"][name];
        _modulesMap = _map["modules"];

        // 销毁后
        modItem["destroyed"] && modItem["destroyed"].call(modItem);
      }
    }
    /**
     * <p>define是bui.loader实例的一个方法,用于定义模块</p>
     * <p>一个js对应一个 define ,可以定义一个匿名的模块,或者自定义依赖的模块,用法跟requirejs类似,</p>
     * <p>自定义模块名以后,需要用map声明该模块的script属性,或者callback方法</p>
     *  @method define
     *  @param {object} [option] 
     *  @param {string} [option.name] [模块的自定义名称,可以省略,自定义模块名以后,需要用map声明该模块的script属性,或者callback方法 ]
     *  @param {array} [option.depend] [模块的依赖模块,可以省略, 模块名不含.js ]
     *  @param {function} option.callback [注册回调,如果有return值, 可以抛出给其它模块调用 ]
     *  @return {object}  [ 返回值用于公共使用 ]
     *  @example
        
          例子1: 注册首页的回调 pages/main/main.js
        提示: pages/main/main.js 文件, 定义了一个匿名模块,匿名模块的模块名取.js前面的路径名,确保唯一
        
        // 最简单的匿名定义 loader.define 
        loader.define(function(require,exports,module){
              // require : 相当于 loader.require, 获取依赖的模块
            // module : 拿到当前模块信息
            
            // 可以通过 return 把希望给其它页面调用的方法抛出来
            return {
                }
        })
          例子2: 直接定义返回的对象, 模块名同样是路径名
        loader.define({
          test: "console"
        })
          例子3: 定义模块的依赖,如果模块未定义固定名称,则路径.html前面是默认的模块名称
        // require,exports,module 在依赖后面顺序下来,不是必须
        // 当前模块依赖于page2
        loader.define(["pages/page2/page2"],function(page2,require,exports,module){
            // 拿到依赖的模块,取名为page2
            console.log(page2)
            // 可以通过 return 把希望给其它页面调用的方法抛出来
            return {
                }
        })
        
        例子4: 定义一个自定义名称的模块
        // 当前模块名为 page2 , 则别的模块要依赖page2的时候,使用自定义的名称
        loader.define("page2",function(){
            // 可以通过 return 把希望给其它页面调用的方法抛出来
            return {
                }
        })
          // 需要在index.html 路由初始化前,先声明该模块的脚本,或者回调
        loader.map({
            moduleName: "page2",
            template: "pages/page2/page2.html",
            script: "pages/page2/page2.js"
        })
       * 
     */

    function define(page, depend, callback) {
      var _config = {
        "moduleName": "",
        "template": "",
        "data": null,
        "depend": [],
        "beforeCreate": null,
        "created": null,
        "beforeLoad": null,
        "loaded": null,
        "beforeDestroy": null,
        "destroyed": null
      };
      var option = {};
      var moduleName = "";
      try {
        // 获取js文件信息
        var currentFile = catchFile();
        var name = currentFile.name;
      } catch (e) {}

      var depends = [],
          styles = [];

      // 获取脚本属性上的模块名
      if (typeof page === "undefined") {
        ui.showLog("define第1个参数不能为空");
        return this;
      }

      if (typeof page === "function") {
        callback = page;
        moduleName = name; //currentModuleName[moduleNameIndex];;
        depend = [];
      } else if (ui.typeof(page) === "object") {
        // 定义一个参数对象
        // var returnArg = page;
        moduleName = name;
        depend = page.depend || [];
        callback = page.loaded;
        option = $.extend(true, {}, _config, page);
      } else if (ui.typeof(page) === "array") {
        callback = depend;
        depend = page;
        moduleName = name; //currentModuleName[moduleNameIndex];
      } else if (typeof depend === "function") {
        moduleName = page;
        callback = depend;
        depend = [];
      } else {
        moduleName = page;
        depend = depend;
        callback = callback;
      }
      var currentSrc = moduleName in _modulesMap ? _modulesMap[moduleName]["script"] || currentFile.src : currentFile.src;

      param.trace && console.log("define", moduleName);

      if (depend.length) {
        // 先把依赖都遍历出来, 用于检测模块是否正确加载
        for (var i = 0; i < depend.length; i++) {
          var item = depend[i];

          if (item.indexOf(".css") > -1) {
            if (item.indexOf("css!") > -1) {
              styles.push(item.substr(4));
            } else {
              styles.push(item);
            }
            continue;
          }
          depends.push(item);
          // 初始化依赖的默认模块信息, 跟 checkAllDefined() 对应.
          if (!(item in _modulesMap)) {
            // 声明依赖的空对象
            map({
              "moduleName": item
            });
          }
        }
      }

      // 合并模块的定义
      if (typeof moduleName === "string" && typeof callback === "function") {

        var callbacks = function callbacks() {

          // 添加依赖,三个为必备模块信息,有依赖则延后
          var needMod = [require, _modulesMap[name]["exports"], _modulesMap[name]];
          var dependMod = [];
          if (depends.length) {
            depends.forEach(function (item, i) {

              dependMod.push(_modulesMap[item]["exports"]);
            });
          }
          var newDependMod = dependMod.concat(needMod);
          // 保持跟requirejs 输出一致
          return callback && callback.apply(this, newDependMod);
        };

        option = page && ui.typeof(page) === "object" ? $.extend(true, {}, _config, page) : $.extend(true, {}, _config);

        option.moduleName = moduleName;
        option.depend = depends;
        option.style = styles;
        option.script = currentSrc;
        option.loaded = callbacks;
        // 扩展到_map里面
        map(option);
      } else {
        ui.showLog("define " + moduleName + "模块的参数格式不对");
      }

      return this;
    }

    /*
     * 获取匿名模块的文件名 
     */
    // 第一次打开页面的根路径
    var pathLocation;
    function catchFile() {
      var href = window.location.href,
          hrefs = [],
          currentScript = document.currentScript,
          currentSrc,
          fileName;
      if (href.indexOf("#") > -1) {
        hrefs = href.split("#");
      } else {
        hrefs.push(href);
      }

      pathLocation = hrefs[0].replace("/index.html", "") + "/";

      // 高版本系统支持 currentScript 属性
      if (currentScript) {
        currentSrc = currentScript.src.replace(pathLocation, "");
        fileName = currentScript.getAttribute("name") || currentSrc.substr("0", currentSrc.indexOf(param.scriptSuffix));

        return {
          name: fileName,
          src: currentSrc
        };
      }
      // 部分低端系统不支持 currentScript 属性,利用抛出错误获得脚本路径
      try {
        a();
      } catch (e) {

        // stack 最后一个地址就是路径
        // http: || file:
        var stack = e.stack || e.sourceURL || e.stacktrace || '',
            lastLine = stack.split(/[@ ]/g).pop(),
            fileSrc = lastLine.replace(/(:\d+)?:\d+$/i, ""),
            fileSrc = fileSrc.replace(new RegExp(pathLocation, 'g'), "");

        currentScript = $('script[src="' + fileSrc + '"]')[0];

        if (currentScript) {
          fileName = currentScript.getAttribute("name");
        } else {
          fileName = fileSrc.replace(param.scriptSuffix, "");
        }

        return {
          name: fileName, // pages/
          src: fileSrc
        };
      }
    }

    /**
     * <p>获取依赖的实例,异步,在同一次依赖加载里面,如果该实例已经重复初始化,不会重复执行.</p>
     *  @method require
     *  @param {object} [option] 
     *  @param {array|string} option.depend [模块的依赖模块,可以是数组或者模块名 ]
     *  @param {function} option.callback [加载模块成功以后,执行回调 ]
     *  @return {object}  [ loader ]
     *  @example
        
        例子1: 加载单个模块
        
        loader.require("main",function (main) {
          console.log(main)
        })
          例子2: 加载多个模块
        loader.require(["main","page2"],function (main,page2) {
          console.log(main)
          console.log(page2)
        })
       * 
     */
    function require(moduleName, moduleCallback) {
      param.trace && console.log("require", moduleName);
      var res = {},
          results = [],
          _self = this;

      if (moduleName && typeof moduleName === "string") {
        moduleName = [moduleName];
      }

      if (moduleCallback && typeof moduleCallback !== "function") {
        ui.showLog("require第2个参数格式为function", "bui.loader.require");
        // def.reject({"code":moduleCallback+"格式为数组"});
        return res;
      }
      try {
        // 依次创建依赖:异步
        createDepends(moduleName, function () {

          // 执行define定义
          // 创建完依赖以后 checkAllDefined 在最后一次执行
          if (checkAllDefined(_waitModule)) {
            var deps = [];
            moduleName.forEach(function (item, i) {
              // console.log(checkAllLoaded(),1)
              // 依次执行依赖
              execute(item);
              // 把最后的依赖导出给回调使用
              deps.push(_modulesMap[item] && _modulesMap[item]["exports"]);
              if (i === moduleName.length - 1) {
                moduleCallback && moduleCallback.apply(module, deps || []);
              }
            });
          }
        });
      } catch (e) {
        ui.showLog(e, "bui.loader.require");
      }

      return this;
    }

    // 批量创建依赖脚本,异步
    function createDepends(data, callback) {
      data = data || [];
      _modulesMap = _map["modules"];

      data.forEach(function (item, i) {
        // 缓存的模块, 不能用做进行时的处理
        var modItem = _modulesMap[item];

        // 创建样式,通过map定义的样式这里就可以处理
        if (_modulesMap[item] && _modulesMap[item]["style"] && _modulesMap[item] && _modulesMap[item]["style"].length) {
          createCssAll(_modulesMap[item]["style"]);
        }

        // 等待的模块不要重复
        if (!ui.array.compare(item, _waitModule)) {
          // 等待的模块
          _waitModule.unshift(item);
        }

        // 如果已经加载,则无需创建
        if (modItem && modItem["isLoaded"]) {
          // 最后一个执行
          if (i == data.length - 1) {
            callback && callback.apply(modItem);
            // 清空等待的模块
            _waitModule = [];
          }
        } else {
          // 如果有回调,但没有script,也无需创建
          if (modItem && modItem["loaded"] && !modItem["script"]) {
            // 创建脚本后才有生命周期-- 创建样式及模板前
            _modulesMap[item]["beforeCreate"] && _modulesMap[item]["beforeCreate"].call(_modulesMap[item]);
            // 创建脚本后才有生命周期--创建样式及模板后
            _modulesMap[item]["created"] && _modulesMap[item]["created"].call(_modulesMap[item]);
            // 如果有依赖,继续创建依赖的脚本
            checkDepends(item, i);
          } else {

            // 创建脚本
            createScript(item, function () {
              var modSrcItem = _modulesMap[item];
              // 创建脚本后才有生命周期-- 创建样式及模板前
              modSrcItem["beforeCreate"] && modSrcItem["beforeCreate"].call(_modulesMap[item]);
              // 通过require 依赖里面加载的样式需要在这里处理
              if (modSrcItem && modSrcItem["style"] && modSrcItem["style"].length) {
                createCssAll(modSrcItem["style"]);
              }
              // 创建脚本后才有生命周期--创建样式及模板后
              modSrcItem["created"] && modSrcItem["created"].call(_modulesMap[item]);
              // 执行define以后,如果有依赖,继续创建依赖的脚本
              checkDepends(item, i);
            }, function () {
              // 最后一个执行
              if (i == data.length - 1) {
                callback && callback.apply(null);
                // 清空等待的模块
                _waitModule = [];
              }
            });
          }
        }
      });

      // 检查是否有依赖,如果有继续执行
      function checkDepends(item, i) {
        var mod = _modulesMap[item];
        // 创建脚本后才有生命周期--创建依赖前
        mod["beforeLoad"] && mod["beforeLoad"].call(mod, mod["depend"]);
        if (mod && mod["depend"] && mod["depend"].length) {
          createDepends(mod["depend"], callback);
        }
        mod && (mod["isDefined"] = true);
        // 最后一个执行
        if (i == data.length - 1) {
          callback && callback.apply(mod);
        }
      }
      return _waitModule;
    }

    // 执行模块实例化,同步
    function execute(module) {
      _modulesMap = _map["modules"];

      var _module = typeof module === "string" ? _modulesMap[module] || {} : module,
          depend = _module["depend"] || [],

      // 输出的单个实例
      exportModule = null,

      // 输出的依赖实例
      exportDep = [];

      // 清空之前的依赖
      _module["dependExports"] = [];

      try {

        if (depend.length) {
          for (var i = 0; i < depend.length; i++) {
            var item = depend[i];
            // 获取依赖的模块名
            var depItem = _modulesMap[item];

            if (depItem["isLoaded"]) {
              // 继续实例化依赖的模块,并抛出给自身的export属性
              exportDep[i] = depItem["exports"];
            } else {
              // 继续实例化依赖的模块,并抛出给自身的export属性
              exportDep[i] = execute(depItem) || depItem["exports"];
            }

            // 导出对象
            depItem["exports"] = exportDep[i];
            _module["dependExports"].push(exportDep[i]);
            // 确认当前模块已经加载完毕
            depItem["isLoaded"] = true;
          }
        }

        if (_module["isLoaded"]) {
          exportModule = _module["exports"];
        } else {
          // 支持return,也支持module.exports
          exportModule = _module["loaded"] && _module["loaded"].apply(_module, exportDep);
        }
        // 已经执行过一次
        _module["exports"] = exportModule || _modulesMap[_module["moduleName"]] && _modulesMap[_module["moduleName"]]["exports"];
        _module["isLoaded"] = true;

        param.trace && console.log("execute", _module["moduleName"]);
      } catch (e) {
        ui.showLog(e, "bui.loader.execute");
      }

      return exportModule;
    }

    /*
     * <p>检测模块是否已经动态创建完成,动态创建完成以后才会执行define方法</p>
     *  @method checkDefine
     *  @param {object} [option] 
     *  @param {array} [option.modules] [ 模块的依赖, 如果不传,则检测所有加载的模块, 对应模块的isDefined属性 ]
     *  @return {boolean}  [ 全部创建完成以后会返回 true ]
     *  @example
        
        例子1: 检测所有模块是否都创建完毕
        
        var bool = loader.checkDefine();
        console.log(bool)
       * 
     */
    function checkAllDefined(depend) {
      var status = true,
          depends = depend || [];
      _modulesMap = _map["modules"];
      if (depends.length) {
        depends.forEach(function (item, i) {
          if (_modulesMap[item] && _modulesMap[item]["isDefined"] === false) {
            status = false;
          }
        });
      } else {
        for (var key in _modulesMap) {
          if (_modulesMap[key] && _modulesMap[key]["isDefined"] === false) {
            status = false;
          }
        }
      }

      return status;
    }

    /**
     * <p>检测模块的加载状态,加载完成,该模块会有一个export对象,就是callback的回调</p>
     *  @method checkLoad
     *  @param {object} [option] 
     *  @param {array} [option.modules] [ 模块名称, 如果不传,则检测所有加载的模块 ]
     *  @return {boolean}  [ 全部创建完成以后会返回 true ]
     *  @example
        
        例子1: 检测所有模块是否都加载完毕
        
        var bool = loader.checkLoad(["main"]);
        console.log(bool)
       * 
     */
    function checkAllLoaded(depend) {

      var status = true,
          depends = [];
      _modulesMap = _map["modules"];

      if (typeof depend === "string") {
        var isSplit = depend.indexOf(",") > -1 ? true : false;

        if (isSplit) {
          depends = depend.split(",");
        } else {
          depends.push(depend);
        }
      } else if (depend && ui.typeof(depend) === "array") {
        depends = depend || [];
      }

      if (depends.length) {
        depends.forEach(function (item, i) {
          if (!(item in _modulesMap)) {
            status = false;
          }
          if (_modulesMap[item] && _modulesMap[item]["isLoaded"] === false) {
            status = false;
          }
        });
      } else {
        for (var key in _modulesMap) {
          if (_modulesMap[key] && _modulesMap[key]["isLoaded"] === false) {
            status = false;
          }
        }
      }

      return status;
    }

    /**
     * <p>动态加载脚本资源,或者css资源</p>
     *  @method import
     *  @param {object} [option] 
     *  @param {string|array} [option.src] [ 脚本或者样式路径,可以是数组 ]
     *  @param {function} [option.successCallback] [ 加载成功以后执行,如果是数组,只在最后一个执行 ]
     *  @return {boolean}  [ 全部创建完成以后会返回 true ]
     *  @example
        
        例子1: 动态加载单个样式
        
        loader.import("main.css",function(src){
          // 创建成功以后执行回调
        });
          例子2: 动态加载单个脚本
        
        loader.import("main.js",function(src){
          // 创建成功以后执行回调
        });
          例子3: 动态加载多个脚本
        
        loader.import(["js/plugins/baiduTemplate.js","js/plugins/map.js"],function(src){
          // 创建成功以后执行回调
        });
       * 
     */
    function load(src, successCallback, failCallback) {

      if (typeof src === "string") {
        if (src.indexOf(".css") > -1) {
          createCss(item);
          successCallback && successCallback(src);
        } else {
          createScript(src, successCallback, failCallback);
        }
      } else if (src && ui.typeof(src) === "array") {
        src.forEach(function (item, i) {
          if (item.indexOf(".css") > -1) {
            createCss(item);

            if (i == src.length - 1) {
              successCallback && successCallback(src);
            }
          } else {

            if (i == src.length - 1) {
              createScript(item, successCallback, failCallback);
            } else {
              createScript(item);
            }
          }
        });
      }

      return this;
    }
    // 加载对应的脚本
    function createScript(src, successCallback, failCallback) {
      var _self = this,
          moduleItemName;

      _modulesMap = _map["modules"];

      if (typeof src === "undefined" || src == "") {
        failCallback && failCallback.call(_self, src);
        return this;
      }

      // 如果是模块名,则获取 script字段, 否则采用模块名+.js 获得路径
      if (src in _modulesMap) {
        moduleItemName = src;
        src = _modulesMap[src]["script"] || moduleItemName + param.scriptSuffix;
      } else {
        var pointIndex = src.indexOf(param.scriptSuffix);
        if (pointIndex > -1) {
          src = src;
          moduleItemName = src.substr(0, pointIndex);
        } else {
          moduleItemName = src;
          src = src + param.scriptSuffix;
        }
      }

      // 加载对应的脚本
      var script = document.createElement("script") || {};
      var hasCache = param.cache ? "" : '?t=' + new Date().getTime();
      var httpScript = src.indexOf("http://") > -1 || src.indexOf("https://") > -1;
      script.type = "text/javascript";
      script.async = param.async;

      // 这里可以做成缓存优化, 区分是远程src 还是相同路径下的src
      script.src = httpScript ? src + hasCache : _map["baseUrl"] + src + hasCache;

      // 动态设置对应的模块名称
      script.setAttribute("name", moduleItemName);

      script.onload = function () {

        param.trace && console.log("create", src);

        // 增加到已经加载的文件缓存
        // Success!
        successCallback && successCallback(src);
      };
      // 文件加载出错
      script.onerror = function (res) {
        param.trace && console.log("createError", src);
        failCallback && failCallback(src);
      };

      var index = ui.array.index(src, _loadedScriptCache);
      // 手动创建
      var isCreate = $('script[name="' + moduleItemName + '"]').length || $('script[src="' + src + '"]').length;

      // 是否是创建文件
      if (index > -1 || isCreate) {
        // Success!
        successCallback && successCallback(src);
      } else if (index < 0) {
        document.body && document.body.appendChild(script);
        _loadedScriptCache.push(src);
      }
      script = null;

      return this;
    }
    // 创建所有样式
    function createCssAll(styles) {
      var i,
          len = styles.length;

      if (ui.typeof(styles) === "array") {

        for (i = 0; i < len; i++) {
          var item = styles[i];
          createCss(item);
        }
      } else {
        createCss(styles);
      }
    }
    // 加载对应的样式
    function createCss(href) {

      if (typeof href !== "string") {
        ui.showLog(href + "的格式不正确");
        return;
      }
      var index = ui.array.index(href, _styleCache);

      // 避免重复加载样式,导致页面样式混乱
      if (index < 0) {

        // 加载对应的脚本
        var linkcss = document.createElement("link") || {};
        linkcss.href = href + (param.cache ? "" : '?t=' + new Date().getTime());
        linkcss.setAttribute('rel', 'stylesheet');
        linkcss.setAttribute('type', 'text/css');

        document.head && document.head.appendChild(linkcss);
        linkcss = null;
        _styleCache.push(href);
      }
    }

    return module;
  };
  return ui;
})(window.bui || {}, window.libs);

/**
 * 核心 
 * @module Core
 */


(function (ui, $) {
  "use strict";

  /**
   * 
   * <div class="oui-fluid">
   *   <div class="span8">
   *     <h2>BUI 单页路由器</h2>
   *     <p><a href="http://www.easybui.com/docs/index.html?id=buirouter" target="_parent" style="color:red;">单页路由入门文档</a></p>
   *     <p>开启单页路由以后, 同样可以使用 bui.back (页面后退) , bui.load (页面跳转) , bui.getPageParams (获取对应的参数), 保持跟多页的开发方式一致有利于后面单页满足不了需求的时候进行切换.</p>
   *     <p>路由依赖于 {{#crossLink "bui.loader"}}{{/crossLink}}, 具体查看模块的API. </p>
   *     <p>路由默认已经初始化了一个main模块, 通过loader.map 可以修改首页的路径,一般无需修改</p>
   *     <h3>预览地址: <a href="../../index.html#pages/router/index.html" target="_blank">demo</a></h3>
   *     <p>功能点:</p>
   *     <p>1. 页面跳转,支持模块跳转或者html跳转,支持动画 {{#crossLink "bui.router/load"}}{{/crossLink}}</p>
   *     <p>2. 指定后退几层,并且可以执行回调 {{#crossLink "bui.router/back"}}{{/crossLink}}</p>
   *     <p>3. 页面刷新,后退刷新 {{#crossLink "bui.router/refresh"}}{{/crossLink}}</p>
   *     <p>4. 页面替换 {{#crossLink "bui.router/replace"}}{{/crossLink}}</p>
   *     <p>5. 局部加载 {{#crossLink "bui.router/loadPart"}}{{/crossLink}}</p>
   *     <p>6. 页面传参,配合load,获取参数 {{#crossLink "bui.router/getPageParams"}}{{/crossLink}}</p>
   *     <p>7. 局部传参,配合loadPart,获取参数 {{#crossLink "bui.router/getPartParams"}}{{/crossLink}}</p>
   *     <p>8. 检测当前页面是否已经加载一次 {{#crossLink "bui.router/isLoad"}}{{/crossLink}}</p>
   *     <p>9. 返回当前页面Dom对象 {{#crossLink "bui.router/currentPage"}}{{/crossLink}}</p>
   *     <p>10. 返回当前模块对象 {{#crossLink "bui.router/currentModule"}}{{/crossLink}}</p>
   *     <p>11. 预加载模板 {{#crossLink "bui.router/preload"}}{{/crossLink}}</p>
   *     <p>12. 修改切换效果</p>
   *   </div>
   *   <div class="span4"><a href="../../index.html#pages/router/index.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-router_low.gif" alt="BUI单页路由"/></a></div>
   * </div>
   * @namespace  bui
   * @class  router
   * @since 1.4.0
   * @param {object} [option] 
   * @param {string} option.id [路由初始化的id]
   * @param {boolean} [option.progress] [默认: false 关闭 | true 开启, 页面跳转是否开启进度条]
   * @param {string} [option.effect] [默认: push | slide | cover | zoom | fadein | fadeinslide | none ]
   * @param {object} [option.indexModule] [ 1.4.3新增, 首页地址配置, 默认: { moduleName: "main",template: "pages/main/main.html", script: "pages/main/main.js" } ]
   * @param {number} [option.height] [1.4.7新增 默认: 0 ]
   * @param {boolean} [option.cache] [默认: true ,缓存模板,下次再进入不会继续请求,速度会快一些 ]
   * @param {boolean} [option.reloadCache] [1.4.1新增 默认: false , 刷新是否加载之前的路由页面, 不加载 false | 加载 true, 为true时有缓存不利于调试,建议部署的时候再开启 ]
   * @param {boolean} [option.syncHistory] [默认: true ,同步浏览器历史记录,这样可以兼容手机的后退按键,为false则页面地址不会,例如:appcan平台,使用打包以后没有历史记录,所以需要设置false ]
   * @param {boolean} [option.firstAnimate] [1.4.2默认: false 等数据加载结束再切换,本地打包速度较快 | true 先执行页面切换,再执行页面加载,这样切换速度较快,但页面会先空白,webapp受网络影响,建议开启,并且开启进度条 ]
   * @constructor 
   * @example
   *
   * html: 
   
    <div id="bui-router"></div>
     * js: 
   
    // 把路由实例化给 window.router
    window.router = bui.router();
      bui.ready(function(){
      // 路由初始化
      router.init({
          id: "#bui-router"
      })
    })
     */

  ui.router = function (option) {
    var config = {
      id: "",
      progress: false,
      syncHistory: true,
      autoInit: true,
      firstAnimate: false,
      indexModule: {
        moduleName: "main",
        template: "pages/main/main.html",
        script: "pages/main/main.js"
      },
      cache: true, // 是否需要模板缓存
      reloadCache: false, // 是否需要刷新缓存
      reload: false,
      useScroll: ".bui-scroll-x",
      height: 0,
      async: true, // 是否需要刷新缓存
      effect: "push", // push | slide | cover | zoom | zoomslide | fadein | fadeinslide | none
      hashPrefix: "#",
      scriptSuffix: ".js",
      pageSuffix: ".html"
    };

    var param = $.extend({}, config, ui.config.router, option);

    var $prevPage = null,
        $nowPage = null,
        $router,
        _self = this,
        $routerMain = null,

    // 交互控件
    uiTogglePrev = null,
        uiToggleNow = null,

    // 事件是否初始化
    hasEventInit = false,

    // 依赖的控件
    uiLoading,
        uiMask,
        winWidth,
        winHeight,

    // 第1次加载,默认第一次加载不使用动画
    firstLoad = true,

    // 后退的开关
    backControl = true,
        isRefresh = false,
        isLoaded = false,

    // 是否通过修改初始化
    isOption = false,

    // 动画效果
    effects = {
      "none": {
        inRight: "showIn",
        inLeft: "showIn"
      },
      "fadein": {
        inRight: "fadeIn",
        inLeft: "fadeIn"
      },
      "fadeinslide": {
        inRight: "fadeInRight",
        inLeft: "fadeInLeft"
      },
      "slide": {
        inRight: "slideInRight",
        inLeft: "slideInLeft"
      },
      "push": {
        inRight: "pushInRight",
        inLeft: "pushInLeft"
      },
      "zoom": {
        inRight: "zoomIn",
        inLeft: "zoomIn"
      },
      "cover": {
        inRight: "coverInRight",
        inLeft: "coverInLeft"
      },
      "zoomslide": {
        inRight: "zoomSlideInRight",
        inLeft: "zoomSlideInLeft"
      },
      "fadeinslideback": {
        inRight: "fadeInLeft",
        inLeft: "fadeInRight"
      },
      "slideback": {
        inRight: "slideInLeft",
        inLeft: "slideInRight"
      },
      "pushback": {
        inRight: "pushInLeft",
        inLeft: "pushInRight"
      },
      "coverback": {
        inRight: "coverInLeft",
        inLeft: "coverInRight"
      },
      "zoomslideback": {
        inRight: "zoomSlideInLeft",
        inLeft: "zoomSlideInRight"
      }
    },

    // 存储define注册的return 对象
    _instanceCache = {},
        // { index: object }
    currentModuleName = [],
        // 当前模块名称
    // 历史记录 id: 唯一id, pid: 页面id ,url: 页面地址, src: 页面依赖的js, param: 页面传递的参数
    _history = [],
        // [{id: gid, pid: pageid, url: url, src: scripts, param: queryParam }]
    // 路由的历史纪录
    historyModule = {},

    //缓存的页面,如果没有设置缓存,则没有这个对象
    _cachePages = {},


    // 历史日志,所有模块的操作
    _log = {},

    // 用户物理刷新需要动画处理,其它不用管这个状态
    needAnimate = false,

    // 当前的模块,由路由历史记录决定
    _currentHistory = {},

    // 缓存模块
    cacheModule = {},

    // 日志模块
    logModule = {};

    var _map = loader.map(param.indexModule);

    var _modulesMap = _map["modules"];
    var uiSessionStorage = ui.storage({
      local: false
    });

    var hasRouter = false;
    /**
     * 路由的历史记录对象 
     *  @method history
     *  @since 1.4.2 
     *  @static 
     *  @return {object} [option] 
     *          {object.get} [获取历史记录]
     *          {object.getLast} [获取最后一个历史记录]
     *  @example
        
        var _history = router.history.get();
        
     * 
     */
    historyModule.get = function () {
      return _history;
    };

    // 增加历史记录
    historyModule.add = function (opt) {
      opt = opt || {};

      var url = window.location.origin + window.location.pathname + "#" + opt.pid;
      var newurl = ui.setUrlParams(url, opt.param);

      _history.push(opt);

      // 第一次无需替换window的历史记录
      if (firstLoad) {
        return;
      }
      param.syncHistory && "pushState" in window.history && window.history.pushState(opt, null, newurl);

      return _history;
    };

    // 在当前历史前面增加
    historyModule.prepend = function (opt) {
      opt = opt || {};

      var url = window.location.origin + window.location.pathname + "#" + opt.pid;
      var newurl = ui.setUrlParams(url, opt.param);

      _history.unshift(opt);

      return _history;
    };

    // 替换历史记录
    historyModule.replace = function (opt) {
      opt = opt || {};

      // 有替换时,最后一个历史记录的index
      var index = _history.length - 1;
      var url = window.location.origin + window.location.pathname + "#" + opt.pid;
      var newurl = ui.setUrlParams(url, opt.param);

      // 如果存在则替换索引,否则添加记录
      if (index > -1) {
        _history.splice(index, 1, opt);
        param.syncHistory && "replaceState" in window.history && window.history.replaceState(opt, null, newurl);
      }

      return _history;
    };

    // 获取最后一条记录的某个字段 
    historyModule.getLast = function (field) {
      var last = _history.length - 1;
      var lastHistory = _history[last] || {};

      if (field) {
        return lastHistory[field];
      } else {
        return lastHistory;
      }
    };

    // 删除指定的index包含之后的历史记录
    historyModule.removeNext = function (index) {
      var len = _history.length - index;
      _history.splice(index, len);
      var lastHistory = historyModule.getLast();
      var url = window.location.origin + window.location.pathname + "#" + lastHistory.pid;
      var newurl = ui.setUrlParams(url, lastHistory.param);

      param.syncHistory && "replaceState" in window.history && window.history.replaceState(lastHistory["param"], null, newurl);
    };
    // 删除最后一条历史记录
    historyModule.removeLast = function () {
      var len = _history.length - 1;
      historyModule.removeNext(len);
    };

    // 缓存模块的操作
    // 新增缓存
    cacheModule.add = function (key, value) {
      _cachePages[key] = value || {};

      return _cachePages[key];
    };
    cacheModule.del = function (key) {
      delete _cachePages[key];
    };
    // 获取缓存
    cacheModule.get = function (key, field) {

      if (field) {
        var mod = _cachePages[key] || {};
        return mod[field];
      } else {
        return _cachePages[key];
      }
    };

    // 保存缓存, 用于页面刷新时
    cacheModule.save = function () {
      // 如果页面大于1个,才进行存储
      if (_history.length > 1) {
        var html = $router.html();
        uiSessionStorage.set("cacheHtml", html);
        uiSessionStorage.set("cacheHistory", _history);
        uiSessionStorage.set("hasCache", "true");
      }
    };

    // 加载缓存, 用于页面刷新时
    cacheModule.load = function () {
      // console.log("loading")
      var cacheHtml = uiSessionStorage.get("cacheHtml", 0);
      var historyCache = uiSessionStorage.get("cacheHistory", 0);
      var historyCaches = [];

      if (historyCache.length > 1) {

        // 渲染html, 并切换当前操作的对象
        $router.html(cacheHtml);
        $routerMain = $router.children(".bui-router-main");

        // 把历史记录转成对象,并赋给路由的历史记录
        try {
          historyCache.forEach(function (item, i) {
            var data = typeof item === "string" ? JSON.parse(item) : item;

            historyCaches.push(data);
          });

          // 执行最后一个模块
          var last = historyCaches[historyCaches.length - 1];
          _currentHistory = last;
          // 加载最后模块的脚本
          loader.require(last["pid"], function (depend) {
            // 存储页面的回调实例
            _instanceCache[last["pid"]] = depend || null;
          });

          // 后退的时候再执行上一个模块,减少缓存加载的时候一次性全部应用
          on("back", function (mod) {
            // 加载最后模块的脚本
            loader.require(mod.target["pid"], function (depend) {
              // 存储页面的回调实例
              _instanceCache[mod.target["pid"]] = depend || null;
            });
          });
        } catch (e) {
          ui.showLog(e);
        }

        // 赋值新的历史记录
        _history = historyCaches;

        // 绑定后才能后退
        // 切换加载效果
        switchNowPage();
        // 隐藏上一页
        switchPrevPage();

        // 不是第一次加载,后退以后再进入才有动画
        firstLoad = false;
        // 通过物理刷新以后, 下次加载模块,还是需要动画
        needAnimate = true;
        // 加载成功后清除掉
        cacheModule.clear();
      }
    };
    // 加载缓存, 用于页面刷新时
    cacheModule.clear = function () {

      uiSessionStorage.remove("cacheHistory");
      uiSessionStorage.remove("cacheHtml");
      uiSessionStorage.remove("hasCache");
    };

    // 新增日志
    logModule.add = function (key, value) {
      _log[key] = value || {};

      return _log[key];
    };
    // 获取日志
    logModule.get = function (key, field) {

      if (field) {
        var mod = _log[key] || {};
        return mod[field];
      } else {
        return _log[key];
      }
    };

    /**
     * 路由初始化,用于实例化以后的配置参数修改,参数同上
     *  @method init
     *  @param {object} [option] 
     *  @chainable
     *  @example
     *  
       // 路由初始化, 默认会加载main模块
        router.init({
            id: "#bui-router"
        })
     * 
     */

    function init(opt) {

      opt = $.extend(true, {}, param, ui.config.router, opt);

      param = module.config = opt;

      // 是单页模式
      ui.hasRouter = true;

      // 路由已经初始化
      hasRouter = true;
      // 如果不等于这个模板则进行修改
      if (opt.indexModule.template !== "pages/main/main.html" || opt.indexModule.script !== "pages/main/main.js") {
        // 修改首页地址
        _map = loader.map(opt.indexModule);
      }

      // 通过修改的初始化的最后一个历史记录的效果需要一起修改
      if (isOption && "effect" in opt) {
        _history.forEach(function (item, i) {
          item["effect"] = opt.effect;
        });
      }
      if (!opt.id) {
        ui.showLog("id 不能为空", "bui.router.init");
        return false;
      }
      $router = ui.objId(opt.id);

      // 防止2次点击
      uiMask = bui.mask({
        appendTo: $router,
        opacity: 0,
        autoClose: false
      });
      // 页面加载的进度条
      uiLoading = ui.loading({
        display: "block",
        width: 30,
        height: 30,
        opacity: 0
      });

      // 页面宽高
      winWidth = window.viewport.width() || document.documentElement.clientWidth;
      winHeight = opt.height || window.viewport.height() || document.documentElement.clientHeight;

      $routerMain = $router.children(".bui-router-main");
      // 是否动态创建
      if (!$routerMain.length) {
        // 生成路由的初始化模板
        var routerTpl = templateInit(opt);
        $router.html(routerTpl);

        $routerMain = $router.children(".bui-router-main");
      } else {
        // 设置宽高
        $routerMain.css({
          width: winWidth,
          height: winHeight
        });
      }

      // 绑定事件
      if (!hasEventInit) {
        bind(opt);
      }

      trigger.call(this, "init", { target: $router[0] });

      return this;
    }

    // 路由准备以后加载
    function readyLoad() {
      var hasCache = uiSessionStorage.get("hasCache", 0);

      // 如果是刷新并且有保存则加载缓存
      if (Boolean(hasCache) && param.reloadCache) {
        cacheModule.load();
      } else {
        loadUrl();
      }
    }
    // 绑定加载事件
    function bind(opt) {

      //页面加载

      // bui-ready 里面会比 load 慢,所以需要在pageready 里面监听处理
      if (!ui.isWebapp) {
        // 原生需要在pageready里面执行
        ui.on("pageready", function () {
          readyLoad();
        });
      } else {

        window.addEventListener("load", function () {
          readyLoad();
        }, false);
      }

      //针对手势滑动的处理
      // var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
      //     hasTouch = 'ontouchstart' in window && !isTouchPad, 
      //     direction = "",
      //     lastY = 0,
      //     lastX = 0,
      //     isTouchstart = false,//解决PC一直触发mousemove事件
      //     isTouchmove = false,
      //     hasScroll = false,
      //     touch = {
      //         x1:0,
      //         x2:0,
      //         y1:0,
      //         y2:0,
      //         direction:""
      //     };
      // $router.on("touchstart",function (e) {
      //   var targetTouches = e.originalEvent && e.originalEvent.targetTouches || e.targetTouches;
      //   var point = hasTouch ? targetTouches[0] : e;
      //       touch.x1 = point.pageX;
      //       touch.y1 = point.pageY;   
      //     hasScroll = $(e.target).closest(param.useScroll).length;
      // })
      // $router.on("touchmove",function (e) {
      //   var targetTouches = e.originalEvent && e.originalEvent.targetTouches || e.targetTouches;
      //   var point = hasTouch ? targetTouches[0] : e;
      //       touch.x2 = point.pageX;
      //       touch.y2 = point.pageY;   
      //       //当屏幕有多个touch或者页面被缩放过，就不执行move操作
      //       if(targetTouches.length > 1 || e.scale && e.scale !== 1){ 
      //           return;
      //       }

      //       // 防止滚动条等于0的时候也会触发uc
      //       hasScroll = $(e.target).closest(param.useScroll).length;
      //       // 阻止uc的滑动后退, 如果没有滚动条才能阻止,有滚动条默认已经会阻止了
      //       if( (touch.x2 - touch.x1) > 0 && !hasScroll ){
      //           e.preventDefault();
      //       }
      //       //第一次下拉的方向
      //       if( !touch.direction){
      //           //方向
      //           touch.direction = ui.swipeDirection(touch.x1,touch.x2,touch.y1,touch.y2);
      //       }

      //       //阻止默认事件,除了滚动条,解决红米不触发end问题
      //       if( touch.direction === "swiperight" && !hasScroll ){
      //          e.preventDefault();
      //       }
      // })
      // $router.on("touchend",function (e) {
      //     touch.x2 = 0;
      //     touch.x1 = 0;
      //     hasScroll = false;
      // })

      // 允许刷新的时候有路由缓存
      // if( param.reloadCache ){
      // 保存历史记录
      window.addEventListener("beforeunload", function (event) {

        // 保存历史记录();
        param.reloadCache && cacheModule.save();
        // 监听地址栏离开
        trigger.call(_self, "beforeunload", { target: _history[_history.length - 1] });
        // 这句会弹出提醒
        // event.returnValue = "离开将不会保存历史记录";
      });
      // }

      // 兼容手机的后退按钮,只做后退,不做前进处理
      if (param.syncHistory && "pushState" in window.history) {
        window.addEventListener("popstate", function (e) {
          // 获取网址参数
          var params = getParam(),
              pid = params.pid == "" ? param.indexModule.moduleName : params.pid,
              index = getBackNearIndex(pid),
              historyIndex = ui.array.index(pid, _history, "pid");

          if (historyIndex > -1) {

            back({
              index: index,
              param: params.param
            });

            // 监听地址栏修改
            trigger.call(_self, "popstate", { type: "back", prevTarget: _history[index - 1], target: _history[index] });
          } else {
            load({
              url: pid,
              param: params.param
            });
            // 监听地址栏修改
            trigger.call(_self, "popstate", { type: "load", prevTarget: _history[_history.length - 2], target: _history[_history.length - 1] });
          }
        });
      }

      // 只在第一次加载的时候会触发
      // window.onpageshow=function(e){
      //     var a=e||window.event;
      //     if(a.persisted){
      //         window.location.refresh();
      //     }
      // }


      return this;
    }

    // 加载默认页面, 默认返回路由首页
    function loadUrl(opt) {

      try {
        var params = getParam();

        if (params.pid) {
          // http 地址则认为是iframe模块
          if (params.pid.indexOf("http://") > -1 || params.pid.indexOf("https://") > -1) {
            // 页面跳转
            load({
              url: params.pid,
              param: params.param,
              iframe: true
            });

            return;
          }
          // 页面跳转
          load({
            url: params.pid,
            param: params.param
          });
        } else {
          // 加载默认页面
          load({
            url: param.indexModule.moduleName,
            param: params.param || {}
          });
        }
      } catch (e) {
        ui.showLog(e, "bui.router.loadUrl");
      }
    }

    // 获取跳转页面及传参
    function getParam(bool) {
      var url = window.location.hash || window.location.search,
          bool = bool == false ? false : true,
          searchIndex = url && url.indexOf("?"),
          pathName = searchIndex > -1 ? url && url.substr(1, searchIndex - 1) : window.location.hash.substr(1),
          pointIndex = pathName && pathName.indexOf(".html"),
          pid = pointIndex > -1 ? pathName.substr(0, pointIndex) : pathName,
          purl = pointIndex > -1 ? pathName : pathName + ".html",
          theRequest = {};

      // 如果有传参
      if (searchIndex > -1) {
        var str = url && url.substr(searchIndex + 1);
        var strs = str && str.split("&");
        for (var i = 0; i < strs.length; i++) {
          var val = bool ? decodeURIComponent(strs[i].split("=")[1]) : strs[i].split("=")[1];

          theRequest[strs[i].split("=")[0]] = val;
        }
      }
      return {
        pid: pid,
        url: purl,
        param: theRequest
      };
    }

    /**
     * [预加载页面及资源,webapp预加载有助于网络较慢时,或者网络不通时,点击无法跳转响应等问题. ]
     * @method preload
     * @since  1.4.2
     * @param  {object|array} option [description]
     * @param  {string} option.url [缓存的模板地址,会自动缓存模板对应的脚本文件]
     * @param  {string|array} [option.style] [非必须,缓存样式文件]
     * @param  {string|array} [option.script] [非必须,缓存脚本文件,跟模板同名以外的脚本]
     * @return {object}        [ 返回一个 Deferred 对象 ]
     * @example
        
        // 预加载一个页面
        router.preload({ url: "pages/page2/page2.html " });
          // 预加载多个页面
        router.preload([{
            url: "pages/about/index.html"
          },{
            url: "pages/router/index.html"
        }]).then(function () {
            // 全部加载以后执行
        })
        
        
     *   
     */
    function preload(option) {

      var def = $.Deferred();
      // 请求一个
      var requestOne = function requestOne(opt, callback) {
        // 请求地址
        requestUrl(opt.url, function (res) {
          var gid = ui.guid(),
              urlObj = resolveUrl(opt.url),
              pageid = urlObj.pid,
              resp = templatePage({ id: gid, content: res, pid: pageid });
          var depends = [];

          // 缓存模板
          cacheModule.add(pageid, { id: gid, pid: pageid, template: res });
          // 缓存脚本
          depends.push(pageid);

          // 加载样式
          if (opt.style && ui.typeof(opt.style) === "array") {
            opt.style.forEach(function (item, i) {
              depends.push(item);
            });
          } else if (opt.style && ui.typeof(opt.style) === "string") {
            depends.push(opt.style);
          }
          // 加载js
          if (opt.script && ui.typeof(opt.script) === "array") {
            opt.script.forEach(function (item, i) {
              depends.push(item);
            });
          } else if (opt.script && ui.typeof(opt.script) === "string") {
            depends.push(opt.script);
          }
          // 缓存资源,不管成功失败都执行
          loader.import(depends, function () {
            trigger.call(module, "preloadafter", { prevTarget: null, target: null });
            callback && callback(option);
          }, function () {
            trigger.call(module, "preloadafter", { prevTarget: null, target: null });
            callback && callback(option);
          });
        }, function (res) {
          ui.showLog(opt.url + "请求失败");

          def.reject(opt.url);
        });

        return def.promise();
      };
      if (option && ui.typeof(option) === "object") {

        "url" in option && requestOne(option, function () {
          def.resolve(option);
        });
      } else if (option && ui.typeof(option) === "array") {

        option.forEach(function (item, i) {
          var last = option.length - 1;
          if (i == last) {
            "url" in item && requestOne(item, function () {
              def.resolve(option);
            });
          } else {
            "url" in item && requestOne(item);
          }
        });
      }

      return def;
    }

    function load(option) {
      var config = {
        id: "",
        url: "",
        param: {},
        effect: "",
        firstAnimate: param.firstAnimate,
        progress: param.progress,
        reload: param.reload,
        replace: false,
        iframe: false,
        part: false,
        cache: param.cache,
        callback: null
      };
      var opt = $.extend(true, {}, config, option);
      var def = $.Deferred();

      // 上一个历史记录
      var prevHistory = historyModule.getLast() || null;

      var prevPrevHistory = _history[_history.length - 2] || null;

      var _self = this,

      // 传过来的参数
      queryParam = opt.param || {};
      // 每个页面对应唯一id
      opt.id = (opt.id && opt.id.indexOf("#") > -1 ? opt.id.substr(1) : opt.id) || "";
      var gid = opt.replace ? prevHistory.id : opt.id || ui.guid(),
          $id = ui.objId(gid);

      if (!opt.url) {
        ui.showLog("url 不能为空", "bui.router.load");
        return def.promise();
      }

      // 使用外部打开
      if (opt.url.indexOf("tel:") >= 0 || opt.url.indexOf("mailto:") >= 0 || opt.url.indexOf("sms:") >= 0) {
        ui.unit.openExtral(opt.url);
        return def.promise();
      }

      // 如果找不到页面,变成首页
      if (opt.url == "undefined") {
        opt.url = "main";
      }

      // 开启进度条,遮罩是为了防止快速多次点击
      uiMask && uiMask.show();
      opt.progress && uiLoading && uiLoading.show();

      // 解析url地址
      var urlObj = resolveUrl(opt.url),
          pageid = urlObj.pid,

      // 如果是iframe, url 应该等于 http:// 
      url = opt.iframe ? opt.url : urlObj.url,

      // 记录在历史记录里面
      pageHistory = {
        id: gid,
        pid: pageid,
        url: url,
        replace: opt.replace,
        param: queryParam,
        part: {},
        effect: option.effect || param.effect
      };

      // 把页面的id 放到模块里用,便于跟vuejs 结合.
      loader.map({
        moduleName: pageid,
        id: gid
      });

      trigger.call(module, "loadbefore", { prevTarget: prevHistory, target: pageHistory });
      trigger.call(module, "beforeload", { prevTarget: prevHistory, target: pageHistory });

      // 如果有单独传页面加载效果,需要修改上一个页面的效果
      if (_history.length) {
        var lastHistoryIndex = _history.length - 1;
        _history[lastHistoryIndex]["effect"] = opt.effect;
      }

      // 增加历史记录,除了刷新,跟替换
      !isRefresh && !opt.part && !opt.replace && historyModule.add(pageHistory);

      // 替换历史记录
      opt.replace && historyModule.replace(pageHistory);

      // 最后一个历史记录
      var lastHistory = historyModule.getLast();

      // 存储当前页面的局部模块信息
      if (opt.part) {
        lastHistory["part"][pageid] = {
          id: gid,
          pid: pageid,
          url: url,
          param: queryParam

          // 替换历史记录
        };_history.splice(_history.length - 1, 1, lastHistory);
      }

      if (!opt.part) {
        // 获取最后一个模块的历史,除了局部加载
        _currentHistory = pageHistory;
      }

      // 如果有缓存,优先使用缓存
      if (pageid in _cachePages) {

        // 加载缓存
        loadCache({
          pid: pageid,
          progress: opt.progress,
          part: opt.part
        });

        opt.callback && opt.callback({ prevTarget: prevHistory, target: pageHistory });
        // 触发complete事件
        trigger.call(module, "complete", { prevTarget: prevHistory, target: pageHistory });
      } else {
        // iframe 加载,页面比较轻,不加载到页面缓存
        if (opt.iframe) {

          // 加载iframe
          loadIframe({
            id: gid,
            pid: pageid,
            url: opt.url,
            param: queryParam
          });
          return def.promise();
        }

        // 局部加载
        if (opt.part) {
          loadPagePart();
          // 不再继续执行
          return def.promise();
        }

        if (opt.firstAnimate) {

          // 在动画后加载数据
          loadAfterAnimate();
          return def.promise();
        }
        // 在动画前加载数据
        loadBeforeAnmate();
      }

      // 在切换动画后加载数据
      function loadAfterAnimate() {
        // 生成每个页面内容
        var pageTpl = templatePage({ id: gid, content: "", pid: pageid });
        // 渲染加载的页面结构,并设置为主页
        $routerMain && $routerMain.attr("data-main", gid).append(pageTpl);

        // 执行动画后请求页面            
        doAnimate(function () {

          // 异步加载页面
          requestUrl(url, function (res, status, xhr) {
            // 文件找不到还是会进入到 success, 只是返回的内容为空
            // if( res == ""){
            //   ui.showLog(url+"页面的内容不能为空","bui.router.load");
            //   loadErrorPage(url);
            //   return false;
            // }
            var $gid = ui.objId(gid);
            // 切换加载的模板
            $gid.html(res);

            // 初始化main高度
            autoInitMain();
            // 加载模块
            requireModule();
            // 触发事件
            triggerEvent();

            // 增加缓存
            if (opt.cache) {
              var resp = templatePage({ id: gid, content: res, pid: pageid });
              cacheModule.add(pageid, { id: gid, pid: pageid, template: res });
            }

            // 新增操作日志
            logModule.add(pageid, { id: gid, pid: pageid, param: queryParam });
          }, function (res, status, xhr) {
            requestFail(url);
            trigger.call(module, "loadfail", res, status, xhr);
          });
        });
      }
      // 加载新页面
      function loadBeforeAnmate() {

        // 异步加载页面
        requestUrl(url, function (res, status, xhr) {
          // 文件找不到还是会进入到 success, 只是返回的内容为空
          // if( res == ""){
          //   ui.showLog(url+"页面的内容不能为空","bui.router.load");
          //   loadErrorPage(url);

          //   return false;
          // }
          // 切换加载的模板
          var resp = switchLoadTemplate(res);

          // 增加缓存
          if (opt.cache) {
            cacheModule.add(pageid, { id: gid, pid: pageid, template: res });
          }

          // 初始化main高度
          autoInitMain();

          // 执行动画
          doAnimate(function () {
            opt.progress && uiLoading && uiLoading.hide();
          });
          // 加载模块
          requireModule();
          // 触发事件
          triggerEvent();

          // 新增操作日志
          logModule.add(pageid, { id: gid, pid: pageid, param: queryParam });
        }, function (res, status, xhr) {
          requestFail(url);

          trigger.call(module, "loadfail", res, status, xhr);
        });
      }
      // 请求失败
      function requestFail(url) {
        uiMask && uiMask.hide();
        // 跳转默认页面
        opt.progress && uiLoading && uiLoading.hide();

        // 删除最后一条记录,没网络的时候,会导致历史记录新增,需要删除
        historyModule.removeLast();

        def.reject(url);
      }
      // 加载模块
      function requireModule() {

        // 如果没有缓存切不是刷新,则创建脚本
        if (isRefresh || pageid in _instanceCache) {

          refreshPage({
            pid: pageid
          });

          if (needAnimate) {
            doAnimate();
          }
        } else {
          // 有部分模块被先require,跳转的时候,也要执行一次
          if (loader.checkLoad(pageid)) {
            refreshPage({
              pid: pageid
            });
          } else {

            // 加载模块
            loader.require(pageid, function (depend) {

              try {

                opt.firstAnimate && opt.progress && uiLoading && uiLoading.hide();

                // 存储页面的回调实例
                _instanceCache[pageid] = depend || null;

                def.resolve(depend);
              } catch (e) {
                ui.showLog(e, "bui.router.load");

                def.reject();
              }
            });
          }

          opt.callback && opt.callback({ prevTarget: prevHistory, target: pageHistory });
          // 触发complete事件
          trigger.call(module, "complete", { prevTarget: prevHistory, target: pageHistory });
        }
      }

      // 初始化main高度
      function autoInitMain() {
        $nowPage = ui.objId(lastHistory.id);
        var $nowPageInner = $nowPage.find(".bui-page");
        // 自动初始化页面的main 高度
        $nowPageInner.length && param.autoInit && ui.init({
          id: $nowPageInner,
          height: winHeight
        });
      }

      // 执行动画
      function doAnimate(callback) {

        // 切换加载效果
        switchNowPage();
        // 隐藏上一页
        switchPrevPage();
        $nowPage = ui.objId(gid);

        try {
          // 加载模块以后执行动画
          if (!firstLoad && !isRefresh && !opt.replace && !opt.part) {

            uiTogglePrev && uiTogglePrev.hide();
            uiToggleNow && uiToggleNow.show(function () {
              !opt.firstAnimate && opt.progress && uiLoading && uiLoading.hide();

              callback && callback();
              // 可以修复滑动的加载闪动问题
              $nowPage.css("zIndex", 5);

              uiMask && uiMask.hide();

              trigger.call(module, "pagehide", { target: _history[_history.length - 2] });
              trigger.call(module, "pageshow", { target: historyModule.getLast() });
            });
          } else {
            !opt.firstAnimate && opt.progress && uiLoading && uiLoading.hide();

            callback && callback();
            uiMask && uiMask.hide();
            // 可以修复滑动的加载闪动问题
            $nowPage.css("zIndex", 5);

            trigger.call(module, "pageshow", { target: historyModule.getLast() });
          }
        } catch (e) {
          ui.showLog(e, "bui.router.doAnimate");
        }
      }

      // 页面加载的模板内容,不同类型,使用的方式不同
      function switchLoadTemplate(res) {
        var resp = "";

        // 生成模板
        if (opt.part) {
          // 局部加载
          resp = templatePart({ content: res });

          if (opt.id) {
            // 局部加载必须有ID
            $id.html(resp);
          } else {
            ui.showLog("id 不能为空", "router.loadPart");
          }
        } else if (opt.replace) {

          // 替换一个页面
          // 如果是替换,需要知道当前的模块id,或者指定ID
          var lastHistory = historyModule.getLast();
          // 没有历史记录时,则获取第一个父层元素
          $id = _history.length ? ui.objId(lastHistory["id"]) : $routerMain;
          // 修改最后一个历史记录信息
          lastHistory["pid"] = pageid;
          lastHistory["url"] = url;
          lastHistory["param"] = queryParam;

          var index = ui.array.index(pageid, _history, "pid");
          // 这里有bug, 重复替换页面加载过的会有问题,替换后,后退,再进入替换,会有问题
          // 如果该页面已经加载过, 缓存是带 bui-router-item
          if (pageid in _cachePages) {
            // 生成每个页面内容,不需要外层地址
            // var cacheid = cacheModule.get(pageid,"id");

            // var $gid = ui.objId(cacheid);
            // resp = $gid.html();
            resp = cacheModule.get(pageid, "template");
          } else {
            // 生成每个页面内容
            resp = templatePart({ content: res });
          }

          // 局部加载必须有ID
          $id.html(resp).attr("data-page", pageid);
        } else if (!isRefresh) {
          // 增加一个页面
          // 生成每个页面内容
          resp = templatePage({ id: gid, content: res, pid: pageid });
          // 渲染加载的页面结构,并设置为主页
          $routerMain && $routerMain.attr("data-main", gid).append(resp);
        }

        return resp;
      }
      // 刷新页面
      function refreshPage(option) {
        // 获取最后一个历史记录
        var lastHistory = option || historyModule.getLast();

        var lastModule = _modulesMap[lastHistory.pid] && _modulesMap[lastHistory.pid] || {};
        // 刷新
        var callback = lastModule["loaded"];

        // 触发回调,并把公共方法抛出给另外的模块调用
        var shareMethod = callback && callback.apply(lastModule, lastModule["dependExports"]) || lastModule["exports"];

        // 存储页面的回调实例
        _instanceCache[lastHistory.pid] = shareMethod || null;

        // 修复require的模块变成是第一次加载的模块
        lastModule["exports"] = shareMethod;

        isRefresh = false;

        // 已经不是第1次加载
        firstLoad = false;

        trigger.call(module, "refresh", { prevTarget: prevHistory, target: lastHistory });

        // 关闭遮罩
        uiMask && uiMask.hide();
        // 关闭loading
        param.progress && uiLoading && uiLoading.hide();
        def.resolve(shareMethod);
      }

      // 触发事件监听
      function triggerEvent() {

        var lastPrevHistory = _history[_history.length - 2] || null;

        // 获取最后一个历史记录
        var lastHistory = historyModule.getLast();
        // 清空当前事件
        if (firstLoad) {
          // 第一次加载
          trigger.call(module, "firstload", { prevTarget: lastPrevHistory, target: lastHistory });

          firstLoad = false;
        }
        // 只在第一次加载模板的时候触发
        if (opt.part) {

          trigger.call(module, "loadpart", { prevTarget: lastPrevHistory, target: lastHistory });
        } else {
          trigger.call(module, "load", { prevTarget: lastPrevHistory, target: lastHistory });
        }
      }

      // 加载缓存
      function loadCache(opt) {
        // 使用缓存
        var resHtml = cacheModule.get(opt.pid, "template");
        // 切换模板
        switchLoadTemplate(resHtml);

        // 如果不是局部加载,需要初始化页面高度并且执行页面动画及回调.
        if (opt.part) {
          // 刷新局部模块,局部加载的模块没有在历史记录里.
          refreshPage(opt);
          // // 关闭遮罩
          // uiMask && uiMask.hide();
          // // 关闭loading
          // opt.progress && uiLoading && uiLoading.hide();
        } else {
          // 初始化main高度
          autoInitMain();

          // 除了刷新,页面加载都需要动画
          !isRefresh && doAnimate(function () {
            // 关闭loading
            opt.progress && uiLoading && uiLoading.hide();
          });
          // 刷新页面
          refreshPage(opt);
          // // 关闭遮罩
          // uiMask && uiMask.hide();
          // isRefresh &&  opt.progress && uiLoading && uiLoading.hide();
        }
      }

      // 跳转到错误页面
      function loadPagePart() {
        // 异步加载页面
        requestUrl(url, function (res, status, xhr) {
          // 文件找不到还是会进入到 success, 只是返回的内容为空
          // if( res == ""){
          //   loadErrorPage(url);
          //   ui.showLog("找不到"+url,"bui.router.load");
          //   return false;
          // }
          var $gid = ui.objId(gid);
          // 切换加载的模板
          $gid.html(res);

          // 加载模块
          requireModule();
          // 触发事件
          triggerEvent();

          // 增加缓存, 这个缓存不包含 bui-router-item
          if (opt.cache) {
            cacheModule.add(pageid, { id: gid, pid: pageid, template: res });
          }

          // 关闭点击及遮罩
          uiMask && uiMask.hide();
          // 跳转默认页面
          opt.progress && uiLoading && uiLoading.hide();
        }, function (res, status, xhr) {
          requestFail(url);

          trigger.call(module, "loadfail", res, status, xhr);
        });
      }

      // 加载iframe
      function loadIframe(option) {
        // 切换加载的模板
        var resp = templateFramePage({ id: option.id, pid: option.pid, url: option.url, param: option.param });

        // 渲染加载的页面结构,并设置为主页
        $routerMain && $routerMain.attr("data-main", option.id).append(resp);

        // 先执行动画再执行事件
        doAnimate(function () {
          // 动画结束后关闭进度条
          opt.progress && uiLoading && uiLoading.hide();
        });
      }

      return def.promise();
    }

    /**
     * 局部加载
     *  @method loadPart
     *  @param {object} [option] 
     *  @param {string} option.id [ 加载的容器 ]
     *  @param {string} option.url [ 加载的地址,可以是一个模块 ]
     *  @param {object} [option.param] [ 传递给该模块的参数 ]
     *  @return {object} [ 新增1.4.2 返回一个 Deferred 对象 ]
     *  @chainable
     *  @example
     *
     *  方法1: 加载某个模块到页面的id=part2, 模块名为: pages/page2/page2
        
        router.loadPart({ id:"#part2", url: "pages/page2/page2.html "});
     
        // 方法2: 新增回调
       
        router.loadPart({ 
              url: "pages/page2/page2.html", 
              param: {} 
        }).then(function (module) {
          // 加载模块以后执行
        });
     * 
     */
    function loadPart(opt) {
      var config = {
        id: "",
        url: "",
        param: {},
        part: true
      };

      var option = $.extend(true, {}, config, opt);

      // 局部加载
      var defs = load(option);

      return defs.promise();
    }
    // 解析传进来的URL地址
    function resolveUrl(pid) {
      var url = "",
          pageid = pid;
      // 拿到最新的模块地图    
      _map = loader.map();
      _modulesMap = _map["modules"];

      // 页面是否存在.html结尾
      var pointIndex = pageid.indexOf(param.pageSuffix);
      // 如果是有html后缀的,直接跳转, 没有的则查找映射关系
      if (pointIndex > -1) {
        url = pageid;
        pageid = url.substr(0, pointIndex);

        // 如果map映射时,key值等于模板的名称(没有.html),则直接键值
        if (!(pageid in _modulesMap)) {
          // 默认没配置时,pageid等于路径减去.html
          pageid = getPagekey(url) || pageid;
        }
      } else {
        pageid = pageid;
        url = _modulesMap[pageid] && _modulesMap[pageid]["template"] || pageid + param.pageSuffix || "";
      }

      return {
        pid: pageid,
        url: url
      };
    }

    /**
     * 页面返回,支持回调,跟返回多层
     *  @method back
     *  @param {object} [option] 
     *  @param {number} [option.index] [默认:-1, 后退1层 ,负数,如果后退的层级大于历史记录,则退回到首页]
     *  @param {number} [option.name] [ 1.4.1新增 指定模块名称,该模块如果未存在,则后退一层]
     *  @param {function} [option.callback] [后退以后执行回调,回调里可以拿到后退模块的return值]
     *  @chainable
     *  @example
      
       
        方法1: 
       
        router.back();
       
        方法2: 后退上2页
       
        router.back({ index: -2 });
        
        方法3: 后退以后刷新
        
        router.back({ 
          callback: function() {
            router.refresh();
          } 
        });
          方法4: 后退以后执行当前模块的方法
        
        router.back({ 
          callback: function(mod) {
            mod.init();
          } 
        });
          方法5: 全局监听后退事件
        router.on("back",function (e) {
            // 如果回退到首页则刷新页面
              loader.require(["main"],function(main){
                // 刷新main
                main.init()
              })
        })
     * 
     */
    function back(opt) {
      var _self = this;
      var opt = opt || {};

      var option = $.extend(true, { index: -1, name: "", callback: null }, opt);
      var index = parseInt(option.index),
          historyLength = _history.length;

      _map = loader.map();
      _modulesMap = _map["modules"];

      if (index > 0) {
        ui.showLog("index 参数只能是负数", "bui.router.back");
        return;
      }
      // 后退前的最后一个历史记录
      var prevHistory = historyModule.getLast(),
          lastIndex = historyLength - 1;

      trigger.call(module, "backbefore", { prevTarget: null, target: prevHistory });
      trigger.call(module, "beforeback", { prevTarget: null, target: prevHistory });

      // 通过名称后退
      if (option.name) {
        // 获取模块在历史记录最接近的索引
        index = getBackNearIndex(option.name);
      }
      // 如果后退2层,需要记录有2层, 没有自动降为后退1层
      if (Math.abs(index) > lastIndex) {
        index = -lastIndex;
      }

      // 保留第一个加载的页面,并且只能后退一层
      if (historyLength > 1 && backControl) {

        // 找到要切换成now的页面
        if (index < -1) {
          switchPrevPage(index);
        }
        // 防止快速点击
        backControl = false;

        if (opt.effect) {
          uiTogglePrev.option({ effect: opt.effect });
          uiToggleNow.option({ effect: opt.effect });
        }
        // 显示上一个页面
        uiTogglePrev && uiTogglePrev.show();

        uiToggleNow && uiToggleNow.hide(function () {

          // 指定位置
          var assignIndex = historyLength + index;

          // 删除某个位置之后的所有元素
          // !param.cache && removeNextAll(assignIndex)
          removeNextAll(assignIndex);
          // 删除某个索引之后的所有历史记录
          historyModule.removeNext(assignIndex);

          switchPrevPage();
          // 切换成第几个,需要重新获取最后一个记录信息
          var lastHistory = switchNowPage();

          var pid = lastHistory["pid"];

          // 每次后退以后把最后的层级提上来
          ui.objId(lastHistory["id"]).css("zIndex", 5);

          function callback() {
            var obj = {};

            obj = _instanceCache[pid] || {};
            // 执行回调, 需要把回调的依赖返回回去
            option.callback && option.callback.call(_self, obj, lastHistory);
            trigger.call(module, "back", { prevTarget: prevHistory, target: lastHistory });

            _currentHistory = lastHistory;

            trigger.call(module, "pageshow", { target: lastHistory });
            trigger.call(module, "pagehide", { target: prevHistory });

            backControl = true;
          }
          // 后退以后执行
          callback();

          // 不缓存的时候销毁模块
          if (!param.cache) {
            destroy(prevHistory["pid"]);
          }
        });
      }

      return this;
    }

    /**
     * 页面返回,支持回调,跟返回多层
     *  @method destroy
     *  @param {string} [销毁某个页面] 
     *  @chainable
     *  @example
      
       
        方法1: 
       
        router.destroy("page");
       
     * 
     */
    function destroy(page) {

      if (typeof page === "string" && page !== "main") {
        // 销毁模块
        loader.destroy(page);
        // 删除模板缓存,下次才会继续请求
        cacheModule.del(page);
        // 删除实例
        page in _instanceCache && delete _instanceCache[page];
      } else {
        ui.showLog("参数只能是字符串");
      }

      return this;
    }

    // 获取模块最近的一次索引
    function getBackNearIndex(pid) {

      var index,
          nameIndex = ui.array.indexs(pid, _history, "pid"),
          nameLen = nameIndex.length;

      // 有多个同模块则采用就近模块
      if (nameLen) {
        var less = -(_history.length - nameIndex[nameLen - 1] - 1);
        index = less == 0 ? -1 : less;
      } else {
        index = -1;
      }

      return index;
    }

    // 加载url
    function requestUrl(url, successCallback, failCallback) {
      if (typeof url === "string") {
        $.ajax({
          url: url,
          dataType: "html",
          async: param.async,
          success: function success(res, status, xhr) {
            xhr.url = url;
            successCallback && successCallback(res, status, xhr);
            // 触发公共的监听事件
            trigger.call(module, "success", res, status, xhr);
          },
          error: function error(res, status, xhr) {

            failCallback && failCallback(res, status, xhr);

            trigger.call(module, "fail", res, status, xhr);
          }
        });
      } else if (typeof url === "function") {
        // 早期url只支持分离模板
        var tpl = url && url();

        successCallback && successCallback(tpl, 200, {});
        // 触发公共的监听事件
        trigger.call(module, "success", tpl, 200, {});
      } else {
        ui.showLog("url 不能为空", "bui.router.requestUrl");
      }
    }

    /**
     * 刷新当前页
     *  @method refresh
     *  @example
        
        // 方法: 
        router.refresh();
     * 
     */
    function refresh() {

      isRefresh = true;

      var lastIndex = _history.length - 1,
          lastHistory = _history[lastIndex];

      load({
        id: lastHistory["id"],
        url: lastHistory["pid"],
        param: lastHistory["param"]
      });

      return this;
    }

    /**
     * 替换当前页面,为新页面
     *  @method replace
     *  @param {object} [option] 
     *  @param {string} option.url [加载的地址] 
     *  @param {object} [option.param] [传参] 
     *  @return {object} 
     *  @example
        
        router.replace({
            url: "pages/page3/page3.html"
        });
        
     * 
     */
    function replace(opt) {

      opt = opt || {};

      load({
        url: opt["url"] || "",
        param: opt["param"] || {},
        replace: true
      });

      return this;
    }

    /**
     * 获取页面的参数,可以直接使用 bui.getPageParams() 方法获取
     *  @method getPageParams
     *  @return {object} option [返回对象]
     *  @example
      
     *  方法: 
     *  
        var params = router.getPageParams();
         
     *
     * 
     */
    function getPageParams() {
      var lastHistory = historyModule.getLast();

      return lastHistory.param;
    }

    /**
     * [获取当前页面下的局部模块参数]
     * @method getPartParams
     * @param  {[string]} pid [可以通过loader.define的module参数获取到]
     * @since 1.4.2
     * @return {[object]}     [返回得到的参数]
     * @example
      
        loader.define(function(require,exports,module) {
          
          var pid = module.moduleName,
              params = router.getPartParams(pid);
          
        })
     *
     * 
     */
    function getPartParams(pid) {
      if (typeof pid === "undefined") {
        ui.showLog("必须传模块id才能获取参数,可以通过define的module参数获取");
        return;
      }
      var lastHistory = historyModule.getLast();

      var partParam = null,
          partObj = pid in lastHistory["part"] ? lastHistory["part"][pid] : {};

      if ("param" in partObj) {
        partParam = partObj["param"];
      }

      return partParam;
    }

    /**
     * 默认检查模块是否已经加载过,防止事件重复绑定
     *  @method isLoad
     *  @param {string} [pid] [检查某个模块是否已经加载过]
     *  @return {boolean} 
     *  @example
        
        var isLoad = router.isLoad("main");
        
     * 
     */
    function isLoad(pid) {
      var bool;
      if (pid) {
        bool = pid in _instanceCache;
      }
      return bool;
    }

    // 根据url地址获取当前模板在是哪个key
    function getPagekey(url) {
      for (var i in _modulesMap) {
        try {
          var tpl = _modulesMap[i]["template"] || "";
          //检测的数组是对象
          if (tpl === url) {
            return i;
          }
        } catch (e) {
          ui.showLog(e.message);
        }
      }
    }

    // 删除指定的index包含之后的元素
    function removeNextAll(index) {

      $routerMain.children().each(function (i, item) {
        if (i >= index) {
          $(item).remove();
        }
      });
    }

    // 切换当前的页面
    function switchNowPage() {

      var lastHistory = historyModule.getLast(),
          nowId = lastHistory["id"] || "",
          effect = lastHistory["effect"] || param.effect;

      // 重新找到当前页
      if (nowId) {
        trigger.call(module, "beforepageshow", { target: lastHistory });
        uiToggleNow = null;
        uiToggleNow = ui.toggle({
          id: document.getElementById(nowId),
          effect: effects[effect]["inRight"] || ""
        });

        $routerMain && $routerMain.attr("data-main", nowId);
      }

      return lastHistory;
    }

    // 切换上一页
    function switchPrevPage(index) {
      index = index || -1;
      var last = _history.length + index - 1;
      var lastHistory = _history[last];
      var prevId = lastHistory && lastHistory["id"] || "";
      var effect = lastHistory && lastHistory["effect"] || param.effect;
      if (prevId) {
        trigger.call(module, "beforepagehide", { target: lastHistory });
        uiTogglePrev = null;
        uiTogglePrev = ui.toggle({
          id: document.getElementById(prevId),
          effect: effects[effect]["inLeft"] || ""
        });
      }

      return lastHistory;
    }

    // 渲染初始化模板
    function templateInit(opt) {
      opt = opt || {};
      var html = '';
      html += '<div class="bui-router-main" style="width:' + winWidth + 'px;height:' + winHeight + 'px;">';
      html += '</div>';

      return html;
    }

    // 生成iframe
    function templateFramePage(opt) {
      var url = opt.param ? ui.setUrlParams(opt.url, opt.param) : opt.url;
      var html = '';
      html += '<div id="' + opt.id + '" class="bui-router-item" data-page="' + opt.pid + '">';
      html += '<iframe class="bui-router-iframe" src="' + url + '"></iframe>';
      html += '</div>';

      return html;
    }

    // 生成单页的模板
    function templatePage(opt) {

      var html = '';
      html += '<div id="' + opt.id + '" class="bui-router-item" data-page="' + opt.pid + '">';
      html += opt.content || "";
      html += '</div>';

      return html;
    }

    // 加载局部
    function templatePart(opt) {

      var html = '';
      html += opt.content;

      return html;
    }

    /**
     * 获取设置参数
     *  @method option
     *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
     *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
     *  @chainable
     *  @example 
        
        
        //获取所有参数
        var option = router.option();
          //获取某个参数
        var effect = router.option( "effect" );
          //修改一个参数
        router.option( "effect","cover" );
          //修改多个参数
        router.option( {"effect":"cover"} );
            
     */
    function options(key, value) {
      isOption = true;
      return ui.option.call(module, key, value);
    }
    /**
       * 为控件绑定事件,以下事件均为全局事件.
       * 全局事件建议写在index.js监听, 如果写在当前模块里面监听,当路由的参数cache=false时,需要先off掉,否则会有加载两次的,如果cache=true,相同模板只执行1次,则不需要off
       * 
       *  @event on
       *  @since 1.3.0
       *  @param {string} [type] [事件类型: "init" | "refresh"(刷新后触发) | "loadfail"(加载页面失败触发) | "beforeload"<del>"loadbefore"</del>(页面加载之前) | "load"(模块加载成功后触发,相同模板只加载一次) | "loadpart"(局部加载模块触发,相同模板只加载一次) | "back"(后退以后触发) | "beforeback" <del>"backbefore"</del>(后退前触发) | "complete"(页面完成时触发,load的时候就会触发) | "pageshow" 页面显示的时候 |"pagehide" 页面切换的时候  ]
       *  @param {function} [callback] [ 监听事件以后执行 ]
       *  @example 
          
          router.on("refresh",function () {
              // 点击的菜单
              console.log(this);
          });
          
              
       */
    function on(type, callback) {
      ui.on.apply(module, arguments);
      return this;
    }

    /**
     * 为控件取消绑定事件
     *  @event off
     *  @since 1.3.0
     *  @param {string} [type] [事件类型: "init" | "refresh"(刷新后触发) | "loadfail"(加载页面失败触发) | "beforeload"<del>"loadbefore"</del>(页面加载之前) | "load"(模块加载成功后触发,相同模板只加载一次) | "loadpart"(局部加载模块触发,相同模板只加载一次) | "back"(后退以后触发) | "beforeback" <del>"backbefore"</del>(后退前触发) | "complete"(页面完成时触发,load的时候就会触发) | "pageshow" 页面显示的时候 |"pagehide" 页面切换的时候  ]
     *  @param {function} [callback] [ 监听事件以后执行 ]
     *  @example 
        
        router.off("refresh");
        
            
     */
    function off(type, callback) {
      ui.off.apply(module, arguments);
      return this;
    }
    /*
     * 触发自定义事件
     */
    function trigger(type) {
      //点击事件本身,或者为空,避免循环引用
      module.self = this == window || this == module ? null : this;

      ui.trigger.apply(module, arguments);
    }
    /**
     * 获取最后一个历史记录的模块信息,可以用于检测当前在某个模块下
     *  @method currentModule
     *  @since 1.4.2
     *  @return {object} [{ pid: }]
     *  @example 
        var currentModule = router.currentModule();
        
     */

    function currentModule() {
      return _currentHistory;
    }

    /**
     * 获取当前页面下的DOM对象, 常用于当前模块事件绑定, 
     * 防止重复加载相同模块,导致事件重复绑定, 也适用于控件的重复
     *  @method currentPage
     *  @since 1.4.2
     *  @return {object} [DOM对象]
     *  @example 
        
        var currentPage = router.currentPage();
        
        // 绑定当前区域的按钮
        $(currentPage).on("click",".btn",function (e) {
          console.log(this);
        })
          // 当前区域的控件初始化
        var currentAccordion = $(".bui-accordion",currentPage);
        var uiAccordion = bui.accordion({
            id: currentAccordion
        });
            
     */
    function currentPage(id) {
      var obj = document.getElementById(_currentHistory.id);

      return obj;
    }

    /**
     * 单页里面的选择器,只选择当前页面的元素
     *  @method $
     *  @since 1.4.5
     *  @return {object} [$对象]
     *  @example 
        
        // 比方当前页的事件绑定
        router.$("#id").on("click",function (argument) {
          
        })
          // 比方第三方vue所在的页面需要重复加载
        var vue = new Vue({
            el: router.$("#id")[0]
        })
            
     */
    var selector = function selector(id) {
      var obj = document.getElementById(_currentHistory.id) || document;
      return ui.obj(id, obj);
    };

    // 获取当前id
    function currentId(id) {

      return _currentHistory.id;
    }

    /**
     * 单页里面如果需要设置footer显示隐藏,会导致初始化高度不准确,需要手动设置
     *  @method initScroll
     *  @since 1.4.3
     *  @return {object} [路由本身]
     *  @example 
        
        var currentPage = router.currentPage();
          // 例如, 按钮点击的时候,需要显示底部隐藏
        $(".btn").on("click",function (e) {
          
          // 获取当前页的底部
          $("footer",currentPage).hide();
            // 执行一次滚动初始化
          router.initScroll();
          })
            
     */
    function initScroll(obj) {
      // 获取最后一个页面的历史记录
      var lastHistory = historyModule.getLast();

      var $page = ui.objId(lastHistory.id);

      var $nowPageInner = (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" ? $(obj) : $page.find(".bui-page");
      // 自动初始化页面的main 高度
      $nowPageInner.length && ui.init({
        id: $nowPageInner,
        height: winHeight
      });

      return this;
    }

    var module = {
      init: init,
      option: options,
      data: {},
      on: on,
      off: off,
      load: load,
      destroy: destroy,
      loadPart: loadPart,
      replace: replace,
      refresh: refresh,
      back: back,
      isLoad: isLoad,
      $: selector,
      currentId: currentId,
      currentPage: currentPage,
      currentModule: currentModule,
      getPageParams: getPageParams,
      getPartParams: getPartParams,
      getHistory: historyModule.get,
      preload: preload,
      initScroll: initScroll,
      history: {
        get: historyModule.get,
        getLast: historyModule.getLast
      }

    };

    return module;
  };
  return ui;
})(window.bui || {}, window.libs);

// core

/**
 * <h3>常用方法库</h3> 
 * <h5>数组比对</h5>
 * {{#crossLink "bui.array"}}{{/crossLink}}: 常用数组比对 <br>
 * <h5>对象存储</h5>
 * {{#crossLink "bui.storage"}}{{/crossLink}}: 常用于搜索历史记录, 可以存储普通数据也可以存储对象数据, 返回值必定是数组
 * <h5>平台检测</h5>
 * {{#crossLink "bui.platform"}}{{/crossLink}}: 属于什么系统跟浏览器的检测 <br>
 * <h5>其它常用</h5>
 * {{#crossLink "bui.guid"}}{{/crossLink}}: 生成唯一id <br>
 * {{#crossLink "bui.typeof"}}{{/crossLink}}: 检测对象类型 <br>
 * {{#crossLink "bui.checkVersion"}}{{/crossLink}}: 获取最新版本 <br>
 * 
 * @module Method
 */
(function (ui, $) {

    /*
     * 常用页面交互操作,传值,取值
     * -------------------------------------------------------
     */
    /*
     * 设置传过去的地址转码,默认中文转码
     * @namespace  bui
     * @class  setUrlParams
     * @constructor 
     * @param {string} url [url地址]
     * @param {object} param [object参数]
     * @param {boolean} bool [ true | false 是否转码,默认转码 true]
     * @return {string} [返回字符串]
     * @example
     *       var url = bui.setUrlParams("index.html",{"id":"111"})
     *       console.log(url) //index.html?id=111
     * 
     */
    ui.setUrlParams = function (url, param, bool) {

        var bool = bool == false ? false : true,
            param = (typeof param === 'undefined' ? 'undefined' : _typeof(param)) == 'object' ? param : {},
            newurl;

        var params = ui.unit.objectToKeyString(param, bool);

        //有对象字面量才修改url地址
        if (params == "") {
            newurl = url;
        } else {
            newurl = url + '?' + params; //取第1位到结束的字符
        }

        return newurl;
    };
    /*
     * 获取通过网址传递的参数
     * @namespace  bui
     * @class  getUrlParams
     * @constructor 
     * @param {boolean} bool [ true | false 是否需要中文转码,默认转码 true ]
     * @return {object} [返回网址的参数]
     * @example
     *       var url = bui.getUrlParams()
     *        console.log(url) //{id:111}
     * 
     */
    ui.getUrlParams = function (bool) {

        var bool = bool == false ? false : true;
        var url = window.location.search; //获取url中"?"符后的字串
        var obj = {};
        if (url.indexOf("?") > -1) {
            var str = url.substr(1);

            obj = ui.unit.keyStringToObject(str, bool);
        }
        return obj;
    };

    /*
     * 获取url的指定字段
     * @namespace  bui
     * @class  getUrlParam
     * @constructor 
     * @param {string} name [指定某个参数名]
     * @return {string} [返回参数值]
     * @example
     *       var val = bui.getUrlParam("id");
     *        console.log(val) //111
     * 
     */
    ui.getUrlParam = function (name) {

        var url = window.location.search;
        //获取url中"?"符后的键值
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = url.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);return null;
    };

    /**
     * 判断类型, 不能用来判断jq对象,会返回一个数组
     * @namespace  bui
     * @class  typeof
     * @constructor 
     * @param {string} value [要判断的对象]
     * @return {string} [返回 json | regexp | array | object | function | string | number | boolean | null | undefined ]
     * @example
     *       var type = bui.typeof({"id":"123"});
     *        console.log(type) // "object"
     * 
     */
    ui.typeof = function (value) {

        var valueStr = Object.prototype.toString.call(value).slice(8, -1);

        valueStr = valueStr.toLowerCase();

        return valueStr;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * 方法库 
 * @module Method
 */

(function (ui, $) {

    /*
     * 常用数据数组操作,检测,对比,过滤,删除 , 数组的本地存储(历史记录)
     *  <h3>预览地址: <a href="../../index.html#pages/ui_method/bui.array.html" target="_blank">demo</a></h3>
     * -------------------------------------------------------
     */
    /**
     * 常用小方法
     * @namespace  bui
     * @class  array
     * @static
     */
    ui.array = {};
    /**
     * 返回存在的第1个位置,支持普通数组及JSON数组
     * @namespace  bui
     * @method  index
     * @constructor 
     * @param {string} name [字符串]
     * @param {array} arr [数组]
     * @param {string} [key] [object的键名]
     * @return {number} [返回的位置如果大于0,则存在]
     * @example
     * 
          
        //普通数组:
        var arr = ["hello","bui","hi","bui"];
        var index = bui.array.index( "bui", arr );
          // console.log(index) //结果: 1
          //JSON数组: 
        var arr = [{ "id":1,value:"hello"},{ "id":2,value:"bui"}];
        var index = bui.array.index( "bui", arr, "value" );
        // console.log(index) //结果: 1 
     * 
     */
    ui.array.index = ui.inArray = function (name, arr, key) {
        var arr = arr || [];
        if (typeof key === "string") {
            for (var i in arr) {
                try {
                    var arrs = arr[i] && arr[i][key];
                    //检测的数组是对象
                    if (arrs === name) {
                        return parseInt(i);
                    }
                } catch (e) {
                    ui.showLog(e.message, "bui.inArray");
                }
            }
        } else {
            var index = arr.indexOf(name);

            return index;
        }

        return -1;
    };

    /**
     * 比对数组是否已经存在,支持普通数组及JSON数组
     * @namespace  bui
     * @method  compare
     * @constructor 
     * @param {string} name [字符串]
     * @param {array} arr [数组]
     * @param {string} [key] [object的键名]
     * @return {boolean} [返回true|false]
     * @example
     * 
          
        //普通数组:
        var arr = ["hello","bui","hi","bui"];
        var isExist = bui.array.compare( "bui", arr );
          // console.log(isExist) //结果: true
          //JSON数组: 
        var arr = [{ "id":1,value:"hello"},{ "id":2,value:"bui"}];
        var isExist = bui.array.compare( "bui", arr, "value" );
        // console.log(isExist) //结果: true 
     * 
     */
    ui.array.compare = ui.compareArray = function (name, arr, key) {
        var arr = arr || [];

        if (typeof key === "string") {
            for (var i in arr) {
                try {

                    var arrs = arr[i] && arr[i][key];
                    //检测的数组是对象
                    if (arrs === name) {

                        return true;
                    }
                } catch (e) {}
            }
        } else {
            var index = arr.indexOf(name);

            return index > -1;
        }

        return false;
    };
    /**
     * 删除数组的某个值或者对象,支持普通数组及JSON数组
     * @namespace  bui
     * @method  remove
     * @constructor 
     * @param {string} name [字符串]
     * @param {array}  arr [数组]
     * @param {string} [key] [object的键名]
     * @return {array} [返回删除后的数组]
     * @example
     *  
        //普通数组:
        var arr = ["hello","bui","hi","bui"];
        var newArr = bui.array.remove( "bui", arr );
          // console.log(newArr) //结果: ["hello","hi"]
          //JSON数组: 
        var arr = [{ "id":1,value:"hello"},{ "id":2,value:"bui"}];
        var newArr = bui.array.remove( "bui", arr, "value" );
        // console.log(newArr) //结果: [{ "id":1,value:"hello"}] 
     * 
     */
    ui.array.remove = ui.removeArray = function (name, arr, key) {
        var data = arr || [];

        data.map(function (item, index) {

            try {
                var value = typeof key === "string" || typeof key === "number" ? item[key] : item;
                if (value === name) {
                    data.splice(index, 1);
                }
            } catch (e) {}
        });

        return data;
    };
    /**
     * 筛选数组,支持普通数组及JSON数组
     * @namespace  bui
     * @method  filter
     * @constructor 
     * @param {string} name [字符串]
     * @param {array}  arr [数组]
     * @param {string} [key] [object的键名]
     * @return {array} [返回筛选的元素]
     * @example
     *    
         //普通数组:
         var arr = ["hello","bui","hi","easybui"];
         var newArr = bui.array.filter( "bui", arr );
           // console.log(newArr) //结果: ["bui","easybui"]
           //JSON数组: 
         var arr = [{ "id":1,value:"hello"},{ "id":2,value:"bui"},{ "id":3,value:"easybui"}];
         var newArr = bui.array.filter( "bui", arr, "value" );
         // console.log(newArr) //结果: [{ "id":2,value:"bui"},{ "id":3,value:"easybui"}] 
     * 
     */

    ui.array.filter = ui.filterArray = function (name, arr, key) {
        var data = [];
        var arr = arr || [];

        if (typeof key === "string") {
            for (var i in arr) {
                try {

                    var arrs = arr[i] && arr[i][key];
                    var keyword = new RegExp(name);
                    //检测的数组是对象
                    if (keyword.test(arrs)) {
                        data.push(arr[i]);
                    }
                } catch (e) {}
            }
        } else {
            arr.map(function (item, index, array) {
                var keyword = new RegExp(name);
                //检测的数组是对象
                if (keyword.test(item)) {
                    data.push(arr[index]);
                }
                return item === name;
            });
        }

        return data;
    };
    /**
     * 返回数组的所有索引,支持普通数组及JSON数组
     * @namespace  bui
     * @method  indexs
     * @constructor 
     * @param {string} name [字符串]
     * @param {array} arr [数组]
     * @param {string} [key] [object的键名]
     * @return {array} [返回存在的索引数组]
     * @example
     *
            
        //普通数组:
        var arr = ["hello","bui","hi","bui"];
        var index = bui.array.indexs( "bui", arr );
          // console.log(index) //结果: [1,3]
          //JSON数组: 
        var arr = [{ "id":1,value:"hello"},{ "id":2,value:"bui"}];
        var index = bui.array.indexs( "bui", arr, "value" );
        // console.log(index) //结果: [1]
     * 
     */
    ui.array.indexs = ui.indexArray = function (name, arr, key) {
        var arr = arr || [],
            allIndexs = [];
        if (typeof key === "string") {
            for (var i in arr) {
                try {
                    var arrs = arr[i] && arr[i][key];
                    //检测的数组是对象
                    if (arrs === name) {
                        allIndexs.push(+i);
                    }
                } catch (e) {}
            }
        } else {
            arr.forEach(function (item, index, array) {

                item === name ? allIndexs.push(+index) : allIndexs;
            });
        }

        return allIndexs;
    };
    /**
     * 去除数组的多余数据,支持普通数组及JSON数组
     * @namespace  bui
     * @method  excess
     * @constructor 
     * @param {string} name [字符串]
     * @param {array} arr [数组]
     * @param {string} [key] [object的键名]
     * @return {array} [返回一个没有重复数据的数组]
     * @example
     *    
     
         //普通数组:
         var arr = ["hello","bui","hi","bui"];
         var newArr = bui.array.excess( "bui", arr );
           // console.log(newArr) //结果: ["hello","bui","hi"]
           //JSON数组: 
         var arr = [{ "id":1,value:"hello"},{ "id":2,value:"bui"},{ "id":3,value:"bui"}];
         var newArr = bui.array.excess( "bui", arr, "value" );
         // console.log(newArr) //结果: [{ "id":1,value:"hello"},{ "id":2,value:"bui"}] 
     * 
     */
    ui.array.excess = ui.excessArray = function (name, arr, key) {
        var arr = arr || [],
            obj = {},
            newArr = [];

        if (typeof key === "string") {
            for (var i in arr) {
                try {
                    var item = arr[i] && arr[i][key];
                    //检测的数组是对象
                    if (obj[item] !== item) {
                        obj[item] = item;
                        newArr.push(arr[i]);
                    }
                } catch (e) {}
            }
        } else {
            arr.forEach(function (item, index, array) {

                //检测的数组是对象
                if (obj[item] !== item) {
                    obj[item] = item;
                    newArr.push(item);
                }
            });
        }

        return newArr;
    };

    /**
     * 复制数组某一部分
     * @namespace  bui
     * @method  copy
     * @constructor 
     * @param {array} arr [数组]
     * @param {number} from [从第几个复制]
     * @param {number} [length] [复制多少个,不填则是到最后一个]
     * @return {array} [返回一个新的数组]
     * @example
     *
     
        var arr = ["hello","bui","hi","easybui"];
        var newArr = bui.array.copy( arr, 1 );
        var newArr2 = bui.array.copy( arr, 1,2 );
          // console.log(newArr) //结果: ["bui","hi","easybui"]
        // console.log(newArr2) //结果: ["bui","hi"]
            
     * 
     */
    ui.array.copy = ui.copyArray = function (arr, from, length) {
        var newArr = [];
        form = from || 0;
        length = length || arr && arr.length;

        if (arr && ui.typeof(arr) !== "array") {
            return;
        }
        arr.forEach(function (item, i) {
            newArr.push(item);
        });

        var newArrs = newArr.splice(from, length) || [];

        return newArrs;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * 方法库 
 * @module Method
 */

(function (ui, $) {

    /**
     * 本地数据存储,支持字符串跟对象存储,注意:取的时候是返回一个数组
     *  <h3>预览地址: <a href="../../index.html#pages/ui_method/bui.storage.html" target="_blank">存字符demo</a> | <a href="../../index.html#pages/ui_method/bui.storage_json.html" target="_blank">存对象demo</a></h3>
     * @namespace  bui
     * @class  storage
     * @constructor 
     * @param {number|object|number} [size] [可以是对象,也可以是数字,数字代表存储的数据大小,默认是1]
     * @param {number} [object.size] [ 存储多少条数据,默认为1 | 0 为不限制 ]
     * @param {boolean} [object.reverse] [ 1.4新增 默认true(最新的数据在后面),false(最新的数据在前面,常用于最近历史记录) ]
     * @param {boolean} [object.local] [ 默认true 永久存储 | false 临时存储,切换页面则消失 ]
     * @example 
     *
        存储使用示例:
     *
        // 存储1条数据
        var storage = bui.storage();
            storage.set("username","hello");
            storage.set("username","bui");
            // 第2个会覆盖第1个
         // 获取所有数据
       var data = storage.get("username");
         // 默认只存储一条数据
       //console.log( data ) "bui"
       * 多条数据存储示例: 
     *
        // 保存数据
        var storage = bui.storage(2);
        //存储第1条数据
        storage.set("userinfo",{"id":"n1","name":"hello"},"id");
        //存储第2条数据
        storage.set("userinfo",{"id":"n2","name":"bui"},"id");
        //删除1条数据,通过name值比对
        storage.remove("userinfo","hello","name");
        // 获取数据,返回一个数组
        var data = storage.get("userinfo");
        
         //console.log( data ) [{"id":"n2","name":"bui"}]
     * 
     */
    ui.storage = function (s) {

        var names = [],
            defaultSize = 1,
            size,
            reverse,
            bool;

        if (typeof s === "number" || typeof s === "string") {
            //全局配置，如果没有就默认1
            size = parseInt(s) == 0 ? 0 : parseInt(s) || defaultSize;
            bool = true;
            reverse = true;
        } else if ((typeof s === "undefined" ? "undefined" : _typeof(s)) === "object") {
            size = s && s.size == 0 ? 0 : s.size || defaultSize;
            bool = s && s.local == false ? false : true;
            reverse = s && s.reverse == false ? false : true;
        } else {
            size = defaultSize;
            bool = true;
            reverse = true;
        }

        // 最新的数据是在数组前面还是后面, 默认是前面( true ) 后面(false)
        var commond = reverse ? "push" : "unshift";

        // 是临时存储还是永久存储
        var storage = !bool ? sessionStorage : localStorage;

        /**
         * 以数组保存数据,如果数据是一个对象,需要传keyname,防止数据重复增加.
         *  @method set
         *  @chainable
         *  @param {string} name [存储的变量名]
         *  @param {object} value [存储的数据,可以是string,也可以是一个对象]
         *  @param {string} [keyname] [存储的数据的比对字段,不传会导致数据重复,size为1 则都会替换]
         *  @example 
            var storage = bui.storage();
                //普通数组无需传字段,不传最后的值默认只存储1条数据
                storage.set("username","王伟深");
                //存储对象示例
                storage.set("userinfo",{"id":"n1","name":"王伟深"},"id");
                
         */
        function set$$1(name, value, keyname) {

            //获取已有的历史记录
            var data = size == 1 ? null : storage["getItem"](name);

            var datas = [];
            var datastring = '';

            var items = keyname ? value[keyname] : value;

            //添加第一条数据
            if (data === null) {

                datas.push(value);

                // 逐层转换成字符串
                // datastring = ui.unit.jsonToString(datas);//JSON.stringify(datas);
                datastring = JSON.stringify(datas);
                try {
                    storage["setItem"](name, datastring);
                } catch (oException) {
                    if (oException.name == 'QuotaExceededError') {
                        console.log('超出本地存储限额！');
                        //如果历史信息不重要了，可清空后再设置
                        // storage["removeItem"](name)
                        // storage["setItem"](name,datastring);
                    }
                }
            } else {

                var dataobj = JSON.parse(data);
                var bool = keyname ? ui.array.compare(items, dataobj, keyname) : ui.array.compare(items, dataobj);

                //如果存在就覆盖,不存在就增加
                if (!bool) {

                    dataobj[commond](value);
                    //如果超过配置的记录，就删除最后一条
                    if (dataobj.length > size && size != 0) {
                        //删除最后一个元素
                        dataobj.pop();
                    }

                    try {
                        datastring = JSON.stringify(dataobj);
                        storage["setItem"](name, datastring);
                    } catch (oException) {
                        if (oException.name == 'QuotaExceededError') {
                            console.log('超出本地存储限额！');
                        }
                    }
                } else {

                    // 覆盖记录
                    ui.array.remove(items, dataobj, keyname);

                    dataobj[commond](value);

                    try {
                        datastring = JSON.stringify(dataobj);
                        storage["setItem"](name, datastring);
                    } catch (oException) {
                        if (oException.name == 'QuotaExceededError') {
                            console.log('超出本地存储限额！');
                        }
                    }
                }
            }

            return this;
        }

        /**
         * 获取存储的数组,或者某条数据
         *  @method get
         *  @param {string} name [存储的变量名]
         *  @param {string|number} [value] [获取某一条数据,为数字时是在第几条数据,0为第一条数据]
         *  @param {string} keyname [在某个字段里面]
         *  @return {array} 返回数组或者某条数据或者undefined
         *  @example 
                
            var storage = bui.storage();
            
            // 获取数组
            var data = storage.get("username");
            //console.log( data ) // ["区柏荣"]
              // 获取数组里的第1条数据,才是自己存进去的内容
            var data = storage.get("username",0);
            //console.log( data ) // 区柏荣
              // 获取数组里的某条数据在某个字段 本地存储的内容为: [{id:"wangws","name":"王伟深"},{id:"oubr","name":"区柏荣"}]
            var data = storage.get("username","oubr","id");
            //console.log( data ) // {id:"oubr","name":"区柏荣"}
                
         */
        function get$$1(name, value, keyname) {

            var datastr = storage["getItem"](name) || "";
            var data;
            try {
                // data = datastr && JSON.parse(datastr);
                data = datastr && ui.unit.stringToJson(datastr);
            } catch (e) {
                data = datastr;
                ui.showLog(e.name + ": " + e.message, "bui.storage.get");
            }
            //如果有传参数就只获取记录的某一条
            if (typeof value === "number" && keyname) {

                data = data && data[value] && data[value][keyname] || undefined;
            } else if (typeof value === "string") {
                var index = ui.array.index(value, data, keyname);

                data = data && data[index];
            } else if (typeof value === "number") {
                data = data && data[value] || undefined;
            } else {
                data = data;
            }

            return data;
        }

        /**
         * 删除字段的某条信息
         *  @method remove
         *  @chainable
         *  @param {string} name [存储的变量名]
         *  @param {string|number} [value] [ 要删的内容 | 索引(在第几个)  ]
         *  @param {string|number} [keyname] [ 字段名 | 长度(1.4新增,配合value是数字时使用) ]
         *  @example 
                
            var storage = bui.storage();
                  // 删除第几条数据
                storage.remove("username",0);
                  // 删除第1条包含之后的2条数据
                storage.remove("username",1,2);
                // 删除某条数据
                storage.remove("username","王伟深");
                  // 删除某条数据,通过id比对, 如果存储的对象是JSON
                storage.remove("userinfo","n1","id");
                
         */
        function remove(name, value, keyname) {
            //检查字段是否为空
            if (typeof name !== "string") {
                ui.showLog("要删除的字段名只能是字符串", "bui.storage.remove");
                return;
            }
            //获取已有的历史记录
            var data = get$$1(name) || [];
            //如果有传参数就只删除记录的某一条
            if (typeof value === "number") {

                var len = typeof keyname === "number" ? keyname : len;
                // 删除第几条数据
                data.splice(value, len);

                try {
                    var datastring = JSON.stringify(data) || "";

                    storage["setItem"](name, datastring);
                } catch (e) {
                    ui.showLog(e.name + ": " + e.message, "bui.storage.remove");
                }
            } else if (typeof value === "string") {
                var datanow = ui.array.remove(value, data, keyname);

                try {
                    var datastring = JSON.stringify(datanow) || "";

                    storage["setItem"](name, datastring);
                } catch (e) {
                    ui.showLog(e.name + ": " + e.message, "bui.storage.remove");
                }
            } else {

                //删除整个记录
                storage["removeItem"](name);
            }

            return this;
        }

        /**
         * 清空本地存储
         *  @method clear
         *  @chainable
         *  @example 
            var storage = bui.storage();
                storage.clear();
                
         */
        function clear() {

            storage["clear"]();

            return this;
        }
        return {
            get: get$$1,
            set: set$$1,
            remove: remove,
            clear: clear
        };
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * 常用方法库 
 * @module Method
 */

(function (ui, $) {

    /**
     * 常用小方法
     * @namespace  bui
     * @class  unit
     */
    ui.unit = {};

    /**
     * rem的值转换成px 
     * @namespace  bui
     * @method  remToPx
     * @constructor 
     * @param {string} size [ rem的值 ]
     * @example
     *      var size = bui.unit.remToPx(2);
     
     * 
     */
    ui.unit.remToPx = function (size) {

        var htmlSize = window.viewport && window.viewport.fontSize || 100,

        // 比例的换算
        size = (parseFloat(size) * htmlSize).toFixed(2);

        return size;
    };
    /**
     * 脚本获取元素大小px的值转换成rem
     * @namespace  bui
     * @method  pxToRem
     * @constructor 
     * @param {string} size [ px的值 ]
     * @example
     *      var size = bui.unit.pxToRem(200);
     
     * 
     */
    ui.unit.pxToRem = function (size) {

        var htmlSize = window.viewport && window.viewport.fontSize || 100,

        // 比例的换算
        size = (parseFloat(size) / htmlSize).toFixed(2);

        return size;
    };
    /**
     * 原比例转换,540c的元素大小px转换rem单位;
     * @namespace  bui
     * @method  pxToRemZoom
     * @constructor 
     * @param {string} size [ px的值 ]
     * @example
     *      var size = bui.unit.pxToRemZoom(200);
     
     * 
     */
    ui.unit.pxToRemZoom = function (size) {

        var htmlSize = 100,

        // 比例的换算
        size = (parseFloat(size) / htmlSize).toFixed(2);

        return size;
    };

    // 事件优化, 来源网络: http://demo.nimius.net/debounce_throttle/helpers.js

    /*
     * 操作结束后才执行,比方正在输入文本,正在移动鼠标,是实时触发的,通过这个方法,可以让它在操作结束才执行;
     * @namespace  bui
     * @method  debounce
     * @constructor 
     * @param  {[function]} fn  [要执行的函数]
     * @param  {[number]} wait  [等待的时间,单位毫秒]
     * @param  {[object]} scope [函数执行的范围]
     * @return {[function]}       [description]
     * @example
     
            $("#id").on("scroll",bui.unit.debounce(function(){
                // 滚动结束后才执行
            },400);)
     * 
     */
    ui.unit.debounce = function (fn, wait, scope) {
        var timeout;
        return function () {
            var context = scope || this,
                args = arguments;
            var later = function later() {
                timeout = null;
                fn.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /*
     * 间隔执行,函数节流, 用在滑动操作类控件会导致问题,特别是pullrefresh;
     * @namespace  bui
     * @method  throttle
     * @constructor 
     * @param  {[function]} fn  [要执行的函数]
     * @param  {[number]} threshhold  [间隔的时间,单位毫秒]
     * @param  {[object]} scope [函数执行的范围]
     * @return {[function]}       [description]
     * @example
     *      $("#id").on("scroll",bui.unit.throttle(function(){
     *          // 每隔50毫秒就运行一次
     *      },50);)
     
     * 
     */
    ui.unit.throttle = function (fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last, deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date(),
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    };

    // 以ID或者Class开始
    ui.unit.startWithCss = function (str) {
        var reg = new RegExp("^\\.|^#"),
            bool = typeof str == "string" ? reg.test(str) : false;
        return bool;
    };
    // 以ID开始
    ui.unit.startWithId = function (str) {
        var reg = new RegExp("^#"),
            bool = typeof str == "string" ? reg.test(str) : false;
        return bool;
    };
    // 以Class开始
    ui.unit.startWithClass = function (str) {
        var reg = new RegExp("^\\."),
            bool = typeof str == "string" ? reg.test(str) : false;
        return bool;
    };
    // 是否是图片
    ui.unit.endWithImage = function (str) {
        var reg = new RegExp("(\.png|\.jpg|\.gif)$"),
            bool = typeof str == "string" ? reg.test(str) : false;
        return bool;
    };

    /**
     * 拨打电话,单页的a 标签跳转电话无效
     * @namespace  bui
     * @method  tel
     * @constructor 
     * @param  {[number|string]} num  [电话号码, + 代表是国际电话号码]
     * @example
       *      // 拨打电话
     *          bui.unit.tel("13800138000")
     *      // 拨打国际电话
     *          bui.unit.tel("+13800138000")
     * 
     */
    ui.unit.tel = function (num) {
        var num = String(num),
            nums,
            pact = "tel:",
            isPhone = /(^1\d{10}$)|(^0\d{2,3}-?\d{7,8}$)/;

        // if( !isPhone.test(num) && num.indexOf("+") !== 0 ){
        //     return ui;
        // }
        // 支持国际协议
        if (num.indexOf("+") == 0) {
            pact = "wtai://wp/mc;";
        }
        nums = num;

        window.location.href = pact + nums;

        return ui;
    };
    /**
     * 发送短信
     * @namespace  bui
     * @method  sms
     * @constructor 
     * @param  {[string]} num  [电话号码,多个号码用逗号分割]
     * @param  {[string]} content  [发送的内容]
     * @example
       *      // 发送短信
     *      bui.unit.sms("10086","CZMM")
     *          
     * 
     */
    ui.unit.sms = function (num, content) {

        var u = navigator.userAgent,
            isIphone = /(iPhone|iPad|iOS)/i.test(u),
            split = isIphone ? "&" : "?",
            pact = "sms:";

        window.location.href = "sms:" + num + split + "body=" + content;

        return ui;
    };
    /**
     * 发送邮件
     * @namespace  bui
     * @method  mailto
     * @constructor 
     * @param {object} option  
     * @param {string} option.email [收件人,多个收件人英文逗号分开]  
     * @param {string} option.cc [抄送,多个收件人英文逗号分开] 
     * @param {string} option.subject [邮件主题] 
     * @param {string} option.body [邮件内容] 
     * @example
            
          // 收件人带主题
     *    bui.unit.mailto({
     *        email:"test1@163.com",
     *        subject:"Testing"
     *    })
     * 
     */
    ui.unit.mailto = function (option) {
        var option = "email" in option ? option : {};

        if (typeof option.email === "string" && option.email.indexOf("@") > 0) {
            window.location.href = "mailto:" + option.email + "?subject=" + (option.subject || "") + "&body=" + (option.body || "") + "&cc=" + (option.cc || "");
        } else {
            ui.showLog(email + "格式不正确");
        }
        return ui;
    };

    /*
     * 对地址的外部处理,打电话,发短信,写邮件等,保持跟href的写法一致
     * @namespace  bui
     * @method  openExtral
     * @constructor 
     * @param  {[string]} url  [邮箱,多个邮箱用逗号分割]
     * @example
            
          // 收件人带主题
     *    bui.unit.openExtral("mailto:test1@163.com?subject=Testing")
          // 打电话
     *    bui.unit.openExtral("tel:13800138000")
          // 发短信
     *    bui.unit.openExtral("sms:13800138000?body=test")
     * 
     */
    ui.unit.openExtral = function (url) {
        var urls = [],
            newurl = "",
            url = String(url);

        // 发送邮件
        if (url.indexOf("mailto:") >= 0) {

            urls = url.split("mailto:"), newurl = urls[1];

            if (newurl.indexOf("?") > -1) {
                var emails = newurl.split("?");

                var obj = ui.unit.keyStringToObject(emails[1]);
                obj.email = emails[0];

                ui.unit.mailto(obj);
            } else {
                ui.unit.mailto({
                    email: newurl
                });
            }
        }
        // 拨打电话
        if (url.indexOf("tel:") >= 0) {

            urls = url.split("tel:");
            newurl = parseInt(urls[1]);

            ui.unit.tel(newurl);
        }
        // 发送短信
        if (url.indexOf("sms:") >= 0) {

            urls = url.split("sms:");
            newurl = urls[1];

            if (url.indexOf("=") >= 0) {
                var contents = url.split("="),
                    content = contents[1];

                ui.unit.sms(newurl, content);
            } else {

                ui.unit.sms(newurl);
            }
        }
        return ui;
    };

    /*
     * [objectToKeyString 把对象转换成 & 相加]
     * @method  objectToKeyString
     * @param  {[type]} obj  [description]
     * @param  {[type]} bool [description]
     * @return {[type]}      [description]
     */
    ui.unit.objectToKeyString = function (obj, bool) {
        var str = '';
        //用javascript的for/in循环遍历对象的属性
        for (var i in obj) {
            var val = bool ? encodeURIComponent(obj[i]) : obj[i];

            str += '&' + i + '=' + val;
        }

        return str.substr(1);
    };

    /*
     * [keyStringToObject 把key=value的键值字符串转换成对象]
     * @method  keyStringToObject
     * @param  {[type]} obj  [description]
     * @param  {[type]} bool [description]
     * @return {[type]}      [description]
     */
    ui.unit.keyStringToObject = function (str, bool) {
        var obj = {},
            strs = [],
            i;
        try {

            strs = str.split("&");
            for (i = 0; i < strs.length; i++) {
                var val = bool ? decodeURIComponent(strs[i].split("=")[1]) : strs[i].split("=")[1];

                obj[strs[i].split("=")[0]] = val;
            }
        } catch (e) {
            ui.showLog(e);
        }

        return obj;
    };

    /*
     * [检查点击的目标是否包含指定的样式名, 例如 bui.pullrefresh, bui.slide, bui.swipe等控件]
     * @namespace  bui
     * @method  checkTargetInclude
     * @param  {[object]} target     [ 一般为事件的e.target 对象]
     * @param  {[string]} includeHandle [默认:""; 支持多个样式名,用逗号分开,不需要"."]
     * @return {[boolean]}               [返回布尔值]
     */
    ui.unit.checkTargetInclude = function (targetObj, includeHandle) {

        var handle = includeHandle,
            handles = [];

        if (handle.indexOf(",") > -1) {
            handles = handle.split(",");
            var i,
                l = handles.length;
            for (i = 0; i < l; i++) {
                var item = handles[i];
                if (item.indexOf(".") > -1) {
                    handles[i] = item.substr(1);
                }
            }
        } else {
            if (handle.indexOf(".") > -1) {
                handles[0] = handle.substr(1);
            } else {
                handles[0] = handle;
            }
        }

        var n,
            len = handles.length;
        for (n = 0; n < len; n++) {
            if ($(targetObj).hasClass(handles[n])) {
                return true;
            }
        }
        return false;
    };

    /*
     * JSON对象转换成字符串,支持多层转换,用于数据的存储
     * @namespace  bui
     * @method  jsonToString
     * @since  1.4.1
     * @constructor 
     * @param {object} data [对象]
     * @return {string} [返回  string ]
     * @example
            
     *       var obj = {"data":[{"id":"123"}]};
     *       var objStr = bui.unit.jsonToString(obj);
     * 
     */
    ui.unit.jsonToString = function (data) {
        var jsonString;
        if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
            jsonString = objectAllToString(data);
        } else {
            jsonString = data;
        }

        // 一层一层转换成string
        function objectAllToString(data) {
            var datastr;
            if (ui.typeof(data) === "object") {
                for (var i in data) {
                    data[i] = checkObject(data, i);
                }

                // 最后再转换成string
                datastr = JSON.stringify(data);
            } else if (ui.typeof(data) === "array") {
                data.forEach(function (item, i) {
                    data[i] = checkObject(data, i);
                });
                // 最后再转换成string
                datastr = JSON.stringify(data);
            } else {
                datastr = data;
            }

            function checkObject(data, index) {
                var item = data[index];

                if (item && ui.typeof(item) === "object") {
                    data[index] = objectToString(item);
                } else if (item && ui.typeof(item) === "array") {
                    data[index] = arrayToString(item);
                } else {
                    data[index] = item;
                }

                return data[index];
            }

            return datastr;
        }

        // 对象转字符串
        function objectToString(data) {
            if (data && ui.typeof(data) === "object") {
                for (var i in data) {
                    var item = data[i];
                    if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
                        data[i] = JSON.stringify(item);
                    }
                }
                return data;
            }
        }

        // 数组转字符串
        function arrayToString(data) {
            if (data && ui.typeof(data) === "array") {
                data.forEach(function (item, i) {
                    if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
                        data[i] = JSON.stringify(item);
                    }
                });

                return data;
            }
        }

        return jsonString;
    };

    /*
     * 简单的JSON字符串转换成对象,逐层转换
     * @namespace  bui
     * @method  stringToJson
     * @since  1.4.1
     * @constructor 
     * @param {string} str [对象]
     * @return {object} [返回  string ]
     * @example
      
     *     var str = "[\"1\",2,3]",
     *         data = bui.unit.stringToJson(str);
     * 
     */
    ui.unit.stringToJson = function (jsonStr) {
        var jsonObj;

        jsonObj = jsonStr && stringToObject(jsonStr);

        // 转对象
        function stringToObject(str) {
            var data, dataObj;
            try {

                data = (typeof str === "undefined" ? "undefined" : _typeof(str)) === "object" ? str : JSON.parse(str);

                if (ui.typeof(data) === "array") {
                    data.forEach(function (item, i) {
                        data[i] = stringToObject(item);
                    });
                } else if (ui.typeof(data) === "object") {
                    for (var i in data) {
                        var item = data[i];

                        data[i] = stringToObject(item);
                    }
                }

                dataObj = data;
            } catch (e) {
                dataObj = str;
            }

            return dataObj;
        }

        return jsonObj;
    };

    /**
     * 一维数组逐层转json, 把 page.name 转换成 { page: { name: {} }}
     * @namespace  bui
     * @method  setKeyValue
     * @since  1.5.0
     * @constructor 
     * @param {string} name ["page.name"]
     * @param {string} [value] [设置的值]
     * @param {object} [targetObj] [要在哪个对象上设置]
     * @return {object} [返回对象 ]
     * @example
      
        // 新建一个对象
          var data2 = bui.unit.setKeyValue("page.name","test");
          console.log(data2)   // { page: { name: "test" }}
        // 修改一个对象
        var obj = { page: { name: "", tel: 123 }}
            bui.unit.setKeyValue("page.name","test",obj);
          console.log(data2)   // { page: { name: "test", tel: 123 }}
     * 
     */
    ui.unit.setKeyValue = function (name, value, targetObj) {
        var temp = {};
        var obj = targetObj || {};
        if (name && name.indexOf(".") > -1) {
            var names = name.split(".");

            names.reduce(function (total, currentVal, index) {
                var isLast = index === names.length - 1;
                var cvalue = isLast ? value || {} : {};

                if ((typeof total === "undefined" ? "undefined" : _typeof(total)) === "object") {

                    total[currentVal] = cvalue;

                    return total[currentVal];
                } else {
                    obj[total] = obj[total] || {};
                    obj[total][currentVal] = cvalue;
                    return obj[total][currentVal];
                }
            });
        } else {
            obj[name] = value || {};
        }

        return obj;
    };

    /**
     * 根据 page.name 字符串获取数据的值, 用于field配置的映射
     * @namespace  bui
     * @method  getKeyValue
     * @since  1.5.0
     * @constructor 
     * @param {string} name ["page.name"]
     * @param {string} data [设置的值]
     * @return {object} [返回对象 ]
     * @example
        
        var data = { page: { name: "123" }}
          var n = bui.unit.getKeyValue("page.name",data);
          console.log(n)   // 123
       * 
     */
    ui.unit.getKeyValue = function (field, fieldData) {
        var data = field && field.indexOf('.') > -1 ? field.split('.') : [field];

        function extend(pName, o) {
            if (o[pName] && typeof o[pName] === "string" && o[pName].indexOf("{") > -1 && o[pName].indexOf("}") > -1) {
                try {
                    o[pName] = JSON.parse(o[pName]);
                } catch (e) {
                    o[pName] = o[pName];
                }
            }
            // 如果还有长度继续遍历
            if (data.length) {

                return extend(data.shift(), o[pName]);
            }
            return o[pName];
        }
        return extend(data.shift(), fieldData);
    };

    /**
     * 根据 page.name 字符串获取数据的对象, 用于field配置的映射
     * @namespace  bui
     * @method  getKeyObj
     * @since  1.5.0
     * @constructor 
     * @param {string} name ["page.name"]
     * @param {string} data [设置的值]
     * @return {object} [返回  对象 ]
     * @example
        
        var data = { page: { name: "123" }}
        var n = bui.unit.getKeyObj("page.name",data);
          console.log(n)   // {name:123}
       * 
     */
    ui.unit.getKeyObj = function (field, fieldData) {

        var data = field && field.indexOf('.') > -1 ? field.split('.') : [field];

        function extend(pName, o) {

            if (!o[pName] instanceof Array && o[pName] instanceof Object) {

                return extend(data.shift(), o[pName]);
            }
            return o[pName];
        }
        return extend(data.shift(), fieldData);
    };

    /**
     * 根据 page.name 删除某个字段的数据
     * @namespace  bui
     * @method  delKey
     * @since  1.5.0
     * @constructor 
     * @param {string} name ["page.name"]
     * @param {object} data [删除的字段在哪个对象]
     * @return {object} [返回  删除以后的对象 ]
     * @example
        
        var data = { page: { name: "123", tel: 456 }}
            bui.unit.delKey("page.name",data);
          console.log(data)   // { page: { tel: 456 }}
       * 
     */
    ui.unit.delKey = function (field, fieldData) {

        var data = field && field.indexOf('.') > -1 ? field.split('.') : [field];

        function extend(pName, o) {
            if (data.length) {

                return extend(data.shift(), o[pName]);
            }

            delete o[pName];
            return fieldData;
        }
        return extend(data.shift(), fieldData);
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * 方法库 
 * @module Method
 */

(function (ui, $) {

  /**
   * 仅用于安卓及ios移动平台的检测
   * @namespace  bui
   * @class  platform
   * 
   */
  ui.platform = function () {

    var u = navigator.userAgent;

    /**
     * 是否是window平台
     *  @method isWindow
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isWindow();
            
     */
    function isWindow(argument) {
      return (/Windows NT/i.test(u)
      );
    }
    /**
     * 是否是mac平台
     *  @method isMac
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isMac();
            
     */
    function isMac() {
      return (/Macintosh/i.test(u)
      );
    }
    /**
     * 是否是安卓手机
     *  @method isAndroid
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isAndroid();
            
     */
    function isAndroid(argument) {
      return (/(Android|Linux)/i.test(u)
      );
    }
    /**
     * 是否是Iphone
     *  @method isIphone
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isIphone();
            
     */
    function isIphone(argument) {
      return (/(iPhone)/i.test(u)
      );
    }
    /**
     * 是否是Iphone
     *  @method isIphoneX
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isIphoneX();
            
     */
    function isIphoneX(argument) {
      var isX = false;
      if (window.devicePixelRatio == 3 && document.documentElement.clientWidth == 375 && document.documentElement.clientHeight == 812) {
        isX = true;
      }
      return isX;
    }
    /**
     * 是否是Ipad
     *  @method isIpad
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isIpad();
            
     */
    function isIpad(argument) {
      return (/(iPad)/i.test(u)
      );
    }
    /**
     * IOS平台包括Iphone Ipad
     *  @method isIos
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isIos();
            
     */
    function isIos(argument) {
      return (/(iPhone|iPad|iOS)/i.test(u)
      );
    }
    /**
     * 微信浏览器
     *  @method isWeiXin
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isWeiXin();
            
     */
    function isWeiXin(argument) {
      return (/(micromessenger)/i.test(u)
      );
    }
    /**
     * BT应用
     *  @method isBingotouch
     *  @chainable
     *  @return {boolean} [true | false]
     *  @example 
        
           var bool = bui.platform.isBingotouch();
            
     */
    function isBingotouch(argument) {
      return (/(crosswalk)/i.test(u)
      );
    }
    return {
      isAndroid: isAndroid, //是否是安卓
      isIphone: isIphone, //是否是Iphone
      isIpad: isIpad, //是否是Ipad
      isIos: isIos, //是否是IOS系统,包含Iphone及Ipad
      isWeiXin: isWeiXin, //是否是微信浏览器
      isBingotouch: isBingotouch, //是否是BT应用
      isMac: isMac, //是否是Mac系统
      isIphoneX: isIphoneX, //是否是Mac系统
      isWindow: isWindow //是否是Window系统
    };
  }();

  return ui;
})(window.bui || {}, window.libs);

/**
 * @module Method
 */
(function (ui, $) {

    /**
     * <h3>检查版本更新</h3>
     * <p>需要把对应的<a href="http://www.easybui.com/demo/json/versionUpdate.json" target="_blank">versionUpdate.json</a> 放到服务器,然后通过修改里面的值来进行检测更新</p>
     * <p>默认是检测BUI的版本更新,需要替换成自己业务的更新,更新有3种情况</p>
     * <p>第1种,当前版本已经是最新的</p>
     * <p>第2种,当前版本比新版旧,但不一定要更新</p>
     * <p>第3种,当前版本比新版旧,必须更新才功能正常</p>
     * <h5>versionUpdate.json 文件说明: </h5><br>
     * {<br>
            "versionName": "1.0",          //版本名称<br>
            "versionCode": 20160605,       //版本ID<br>
            "minVersionCode": 20160604,    //最小版本号<br>
            "isForced": true,              //是否强制更新,如果强制更新,需要检测最小版本号<br>
            "downloadUrl": "http://www.easybui.com/download/bui.apk",             //下载的地址<br>
            "iosDownloadUrl": "https://itunes.apple.com/cn/app/id1362470378?mt=8",          //下载的地址<br>
            "remark": "版本更新的内容"        //新版本的描述,支持html<br>
        }<br>
     * @namespace  bui
     * @class  checkVersion
     * @requires confirm
     * @param {string} option 
     * @param {string} option.url [请求更新的地址]
     * @param {string} option.currentVersion [当前版本名称,用来提醒的版本名称]
     * @param {string} option.currentVersionCode [当前版本号,用来比对的唯一值]
     * @param {string} [option.id] [检测更新的按钮]
     * @param {string} [option.target] [按钮的圆点要放在哪个位置,默认在i标签下]
     * @param {string} [option.title] [对话框提醒的标题]
     * @param {object} [option.data] [是否需要传参]
     * @param {string} [option.method] [请求的方法 GET | POST ]
     * @param {number} [option.timeout] [超时 20000]
     * @param {object} [option.tips] 
     * @param {string} [option.tips.nowVersion] [当前是最新版本的提醒,默认提醒会有版本号]
     * @param {string} [option.tips.minVersion] [版本太低需要强制更新的提醒]
     * @param {string} [option.tips.fail] [网络请求失败的提醒]
     * @param {function} [option.callback] [点击按钮以后是否还有其它业务处理]
     * @param {function} [option.onSuccess] [1.4.2 新增请求成功的处理]
     * @param {function} [option.onFail] [1.4.2 新增请求失败的处理]
     * @constructor 
     * @example
     *     bui.checkVersion({
     *         id: "#checkUpdate",
               currentVersion: "",
               currentVersionCode: "",
     *         url: "http://www.easybui.com/json/versionUpdate.json"
     *     });
     * 
     */
    ui.checkVersion = function (option) {

        //默认配置
        var config = {
            id: "",
            target: "i",
            title: "版本更新",
            tips: {
                nowVersion: "", //当前是最新版本的提醒
                minVersion: "您的版本太低,需要卸载安装最新版才能正常使用!", //版本低于最小版本的提醒
                fail: "网络超时,请检测网络再次尝试"
            },
            currentVersion: "",
            currentVersionCode: "",
            width: 580,
            height: 500,
            mask: true,
            url: "",
            data: {},
            native: true,
            method: "GET",
            buttons: [{ name: "取消", className: "" }, { name: "立即下载", className: "primary-reverse" }],
            timeout: 20000,
            callback: null,
            onSuccess: null,
            onFail: null
        };
        option = option || {};

        var param = $.extend(true, config, ui.config.checkVersion, option);

        var badges = '<span class="bui-badges"></span>',
            $id = $(param.id),
            hasEventInit = false,

        //当前版本编码
        nowVersion = parseInt(param.currentVersionCode || ui.config.versionCode),
            nowVersionName = param.currentVersion || ui.config.version,
            newVersion,
            newTips,

        //版本更新提醒
        newVersionName,

        // 安卓 下载地址
        downloadUrl,

        // ios 下载地址
        iosDownloadUrl,
            tooLowTips = param.tips.minVersion,
            nowTips = param.tips.nowVersion || "您目前的版本" + nowVersionName + ",已经是最新了 ^_^",
            $target = param.target.indexOf("#") > -1 ? ui.obj(param.target) : $id ? $id.find(param.target) : null;

        //控件
        var uiConfirm = ui.confirm;

        init(param);

        // 初始化
        function init(option) {

            compareVersion(option);
        }

        // 下载
        function download() {

            if (ui.platform.isIos()) {
                ui.run({ id: iosDownloadUrl, native: param.native });
            } else {
                ui.run({ id: downloadUrl, native: param.native });
            }
        }

        //添加圆点
        var appendBages = function appendBages() {

            var length = $target && $target.find(".bui-badges").length;

            if (!length) {
                $target && $target.append(badges);
            }
        };
        //删除圆点
        var removeBages = function removeBages() {
            $target && $target.find(".bui-badges").remove();
        };

        function bind(option) {
            $id.on('click', function () {
                if (nowVersion < newVersion) {
                    appendBages();

                    uiConfirm({
                        title: "新版本" + newVersionName,
                        content: newTips,
                        buttons: option.buttons,
                        width: option.width,
                        height: option.height,
                        mask: option.mask,
                        callback: function callback() {
                            var text = $(this).text().trim();
                            if (text == "立即下载") {

                                download();
                            }
                        }
                    });
                } else {
                    removeBages();
                    ui.hint(nowTips);
                }

                option.callback && option.callback.call(this);
            });

            hasEventInit = true;
        }

        // 检测版本
        function compareVersion(option) {

            ui.ajax(option).done(function (res) {

                var data = res;
                //服务器版本信息
                var minVersion = parseInt(data.minVersionCode);

                downloadUrl = data.downloadUrl || "";
                iosDownloadUrl = data.iosDownloadUrl || "";

                newTips = data.remark || "检测到新版本" + newVersionName + ",是否立即下载";
                newVersion = parseInt(data.versionCode);
                newVersionName = data.versionName;

                // 是否强制更新
                if (data.isForced) {

                    appendBages();

                    if (nowVersion < minVersion) {
                        uiConfirm({
                            title: option.title,
                            content: tooLowTips,
                            width: option.width,
                            height: option.height,
                            mask: option.mask,
                            autoClose: false,
                            buttons: [{ name: "立即下载", className: "primary-reverse" }],
                            callback: function callback() {
                                try {
                                    // 更新
                                    download();
                                } catch (e) {
                                    ui.showLog(e);
                                }
                            }
                        });
                    } else if (nowVersion > minVersion && nowVersion < newVersion) {
                        uiConfirm({
                            title: option.title,
                            content: newTips,
                            buttons: option.buttons,
                            width: option.width,
                            height: option.height,
                            mask: option.mask,
                            callback: function callback() {
                                try {
                                    var text = $(this).text().trim();
                                    if (text == "立即下载") {
                                        download();
                                    }
                                } catch (e) {
                                    ui.showLog(e);
                                }
                            }
                        });
                    } else {

                        removeBages();
                        ui.hint(nowTips);
                    }
                } else {

                    //没有强制更新则新增红点提醒
                    if (nowVersion < newVersion) {
                        appendBages();
                    } else {
                        removeBages();
                    }
                }

                param.onSuccess && param.onSuccess(data);

                if (!hasEventInit && param.id) {
                    bind(option);
                }
            }).fail(function (argument) {
                param.onFail && param.onFail();
                option.tips.fail && ui.hint(option.tips.fail);
            });
        }
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * 方法库 
 * @module Method
 */

(function (ui, $) {

    /**
     * 计时器,可以递减或者递增
     * @namespace  bui
     * @class  timer
     * @constructor 
     * @param  {object} option  
     * @param  {string} option.target  [时间显示在某个id 上]
     * @param  {function} option.onEnd  [时间到以后执行回调]
     * @param  {function} [option.onProcess]  [过程处理函数,参数为当前秒数]
     * @param  {number} [option.times]  [多少秒, 默认:10]
     * @param  {boolean} [option.reduce]  [默认:true 递减 | false 递增]
     * @return {object} [ {{#crossLink "bui.timer/start"}}{{/crossLink}} 开始计时 | {{#crossLink "bui.timer/stop"}}{{/crossLink}} 停止计时 | {{#crossLink "bui.timer/pause"}}{{/crossLink}} 暂停 | {{#crossLink "bui.timer/restart"}}{{/crossLink}} 重新计时 ]
     * @example
           var timer = bui.timer({
            onEnd: function (argument) {
                bui.alert("时间到")
            },
            times: 10
        })
          timer.start();
       * 
     */
    ui.timer = function (opt) {

        // 增加对跨天的支持,时分秒的格式化
        var config = {
            interval: 1000,
            target: null,
            reduce: true,
            onEnd: null,
            onProcess: null,
            times: 10
        };
        var option = $.extend({}, config, opt);
        var reduce = option.reduce; // 是否递减
        var $this = option.target ? ui.obj(option.target) : null;

        var leftTime = 0,
            isPause = false;
        var countnum = reduce ? option.times : 0,
            timeout = null;

        /**
         * 暂停
         * @namespace  bui
         * @method  pause
         * @constructor 
         * @example
              timer.pause();
         
         *      
         * 
         */
        function pause() {
            leftTime = countnum;
            isPause = true;
            clearTimeout(timeout);
            return this;
        }

        /**
         * 重新计时
         * @namespace  bui
         * @method  restart
         * @constructor 
         * @example
              timer.restart();
         
         *      
         * 
         */
        function restart() {
            countnum = reduce ? option.times : 0;
            clearTimeout(timeout);
            start();
            return this;
        }

        /**
         * 开始计时,递减或者递增取决于初始化的reduce是否为true
         * @namespace  bui
         * @method  start
         * @constructor 
         * @example
              timer.start();
         
         *      
         * 
         */
        // 递减
        function countdown() {
            if (isPause) {
                countnum = leftTime;
                isPause = false;
            }

            if (countnum == 0) {
                countnum = 0;
                $this && $this.text(countnum);
                option.onEnd && option.onEnd.call(this, {
                    count: countnum,
                    target: $this && $this[0]
                });
                clearTimeout(timeout);
                return;
            } else {
                var doubleValue = countnum < 10 ? "0" + countnum : countnum;
                $this && $this.text(doubleValue);
                option.onProcess && option.onProcess.call(this, {
                    count: countnum,
                    target: $this && $this[0]
                });
                countnum--;
            }
            // 自执行
            timeout = setTimeout(function () {
                countdown();
            }, option.interval);

            return this;
        }
        // 递增
        function countup() {
            if (isPause) {
                countnum = leftTime;
                isPause = false;
            }
            if (countnum == option.times) {
                option.onEnd && option.onEnd.call(this);
                countnum = option.times;
                $this && $this.text(countnum);
                clearTimeout(timeout);
                return;
            } else {
                var doubleValue = countnum < 10 ? "0" + countnum : countnum;
                $this && $this.text(doubleValue);
                option.onProcess && option.onProcess.call(this, countnum);
                countnum++;
            }
            // 自执行
            timeout = setTimeout(function () {
                countup();
            }, option.interval);

            return this;
        }

        var start = reduce ? countdown : countup;

        /**
         * 停止计时
         * @namespace  bui
         * @method  stop
         * @constructor 
         * @example
              timer.stop();
         
         *      
         * 
         */
        return {
            stop: function stop() {
                leftTime = 0;
                countnum = reduce ? option.times : 0;
                clearTimeout(timeout);
            },
            start: start,
            restart: restart,
            pause: pause
        };
    };

    return ui;
})(window.bui || {}, window.libs);

//method

/**
 * <h3>动画库</h3> 
 * <h5>动画控制器</h5>
   * {{#crossLink "bui.animate"}}{{/crossLink}}: 常用的transform动画及属性动画 <br>
 * <h5>动画切换器</h5>
   * {{#crossLink "bui.toggle"}}{{/crossLink}}: animate.css的常用动画,切换显示 <br>
 * 
 * @module Animate
 */
(function (ui, $) {
          /**
           * 常用的动画,有transform动画,链式动画,属性动画
           *  <h3>预览地址: <a href="../../index.html#pages/ui_method/bui.animate.html" target="_blank">demo</a></h3>
           * 
           * <h5>动画配置修改</h5>
           * {{#crossLink "bui.animate/option"}}{{/crossLink}}: 设置修改参数 <br>
           * {{#crossLink "bui.animate/widget"}}{{/crossLink}}: 获取依赖的控件 <br>
           * {{#crossLink "bui.animate/origin"}}{{/crossLink}}: 修改动画原点 <br>
           * {{#crossLink "bui.animate/transition"}}{{/crossLink}}: 修改动画时间 <br>
           * {{#crossLink "bui.animate/open3D"}}{{/crossLink}}: 开启3D加速对rotate有效果 <br>
           * <h5>综合动画</h5>
           * {{#crossLink "bui.animate/transform"}}{{/crossLink}}: 综合动画,需要熟悉transform属性 <br>
           * <h5>位移动画</h5>
           * {{#crossLink "bui.animate/left"}}{{/crossLink}}: 左移动画 <br>
           * {{#crossLink "bui.animate/right"}}{{/crossLink}}: 右移动画 <br>
           * {{#crossLink "bui.animate/up"}}{{/crossLink}}: 上移动画 <br>
           * {{#crossLink "bui.animate/down"}}{{/crossLink}}: 下移动画 <br>
           * <h5>缩放动画</h5>
           * {{#crossLink "bui.animate/scale"}}{{/crossLink}}: 缩放动画 <br>
           * {{#crossLink "bui.animate/scaleX"}}{{/crossLink}}: 水平缩放动画 <br>
           * {{#crossLink "bui.animate/scaleY"}}{{/crossLink}}: 垂直缩放动画 <br>
           * <h5>旋转动画</h5>
           * {{#crossLink "bui.animate/rotate"}}{{/crossLink}}: 左移动画 <br>
           * {{#crossLink "bui.animate/rotateX"}}{{/crossLink}}: 右移动画 <br>
           * {{#crossLink "bui.animate/rotateY"}}{{/crossLink}}: 左移动画 <br>
           * <h5>扭曲动画</h5>
           * {{#crossLink "bui.animate/skew"}}{{/crossLink}}: 扭曲动画 <br>
           * {{#crossLink "bui.animate/skewX"}}{{/crossLink}}: 水平扭曲动画 <br>
           * {{#crossLink "bui.animate/skewY"}}{{/crossLink}}: 垂直扭曲动画 <br>
           * <h5>属性动画</h5>
           * {{#crossLink "bui.animate/property"}}{{/crossLink}}: 属性动画 性能差,尽量少用<br>
           * 
           * @namespace  bui
           * @class  animate
           * @constructor 
           * @example
           * 
               //初始化page对象
               var uiAnimate = bui.animate("#page");
           
               //链式动画
               uiAnimate.left(100).down(100).start();
             
               //累计动画,左移动画以后下移各自100px,
               uiAnimate.left(100).start(function({
               
                 this.down(100).start();
               }));
           
               //综合动画, 只执行一次,下次执行会从头开始
               uiAnimate.transform("translateX(-100px)") ==  uiAnimate.left(100).stop();
           * 
           */
          ui.animate = function (option) {

                    //默认配置
                    var config = {
                              id: "",
                              zoom: true,
                              open3D: false,
                              animates: []
                    };

                    // zepto库 跟 jquery 对 Object.prototype.toString.call(option) === "[object Array]" 解析不一样
                    if ((typeof option === "undefined" ? "undefined" : _typeof(option)) === "object" && option.id) {

                              option = option || {};
                    } else {
                              var opt = option || "";

                              option = {};
                              option.id = opt;
                    }

                    //方法
                    var module = {
                              origin: origin, //修改动画远点
                              transition: transition, //修改动画的执行时间
                              property: property, //属性动画
                              open3D: open3D, //3D动画,还会开启GPU加速, 对rotateXrotateY有效
                              transform: transform, //综合动画,需要熟悉 transform 动画
                              start: start, //动画串接器,会累积之前的动画位置
                              stop: stop, //停止动画
                              //pause: pause,              //暂停动画
                              clear: clear, //清除动画
                              left: left, //左移动画
                              right: right, //右移动画
                              up: up, //上移动画
                              down: down, //下移动画
                              scale: scale, //缩放动画
                              scaleX: scaleX, //水平缩放
                              scaleY: scaleY, //纵向缩放
                              rotate: rotate, //旋转动画
                              rotateX: rotateX, //开启3D加速才会有效果
                              rotateY: rotateY, //开启3D加速才会有效果
                              skew: skew, //扭曲动画
                              skewX: skewX, //水平扭曲
                              skewY: skewY, //纵向扭曲
                              reverse: reverse, //按原来动画轨迹返回原位,
                              widget: widget,
                              option: options,
                              config: param,
                              init: init
                    };
                    //用于option方法的设置参数
                    var param = module.config = $.extend(true, {}, config, option);

                    var $id,
                        turnOn3D,
                        //开启3D硬件加速
                    rem,
                        animates,
                        animatesCache = [],
                        actionHistorys = [];
                    var trans = "all 300ms ease-out";

                    //初始化动画对象
                    init(param);

                    function init(option) {

                              if (option.id) {
                                        $id = ui.objId(option.id);
                              } else {

                                        ui.showLog("animate id不能为空", "bui.animate");
                                        return;
                              }

                              $id.css({
                                        '-webkit-transition': trans,
                                        'transition': trans
                              });

                              turnOn3D = option.open3D; //开启3D硬件加速
                              rem = option.zoom;

                              animates = option.animates || [];
                              param = module.config = option;

                              return this;
                    }

                    /**
                     *  左移动画
                     *  @method left
                     *  @param {number} num 正数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //链式动画
                         uiAnimate.left(100).start();
                     */
                    function left(num) {

                              var num = num;
                              var value = Math.abs(parseFloat(num));

                              if (typeof num === "string" && num.indexOf("%") > -1) {
                                        num = "-" + num;
                              } else {
                                        num = rem ? -(value / 100) + 'rem' : -value + "px";
                              }
                              var action = "translateX(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  右移动画
                     *  @method right
                     *  @param {number} num 正数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //链式动画
                         uiAnimate.right(100).start();
                     */
                    function right(num) {

                              var num = num;
                              var value = Math.abs(parseFloat(num));

                              if (typeof num === "string" && num.indexOf("%") > -1) {
                                        num = num;
                              } else {
                                        num = rem ? value / 100 + 'rem' : value + "px";
                              }
                              var action = "translateX(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  上移动画
                     *  @method up
                     *  @param {number} num 正数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //链式动画
                         uiAnimate.up(100).start();
                     */
                    function up(num) {

                              var num = num;
                              var value = Math.abs(parseFloat(num));

                              if (typeof num === "string" && num.indexOf("%") > -1) {
                                        num = "-" + num;
                              } else {
                                        num = rem ? -(value / 100) + 'rem' : -value + "px";
                              }
                              var action = "translateY(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  下移动画
                     *  @method down
                     *  @param {number} num 正数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //链式动画
                         uiAnimate.down(100).start();
                     */
                    function down(num) {

                              var num = num;
                              var value = Math.abs(parseFloat(num));

                              if (typeof num === "string" && num.indexOf("%") > -1) {
                                        num = num;
                              } else {
                                        num = rem ? value / 100 + 'rem' : value + "px";
                              }
                              var action = "translateY(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }

                    /**
                     *  缩放动画
                     *  @method scale
                     *  @param {string} num  示例: "2" | "2,2"
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //链式动画
                         uiAnimate.scale("2,2").start();
                     */
                    function scale(num) {
                              var str = String(num);
                              var num = str.indexOf(",") > -1 ? str : num + ",1";
                              var action = "scale(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);
                              return this;
                    }
                    /**
                     *  水平缩放动画
                     *  @method scaleX
                     *  @param {number} num  示例: 2
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //链式动画
                         uiAnimate.scaleX(2).start();
                     */
                    function scaleX(num) {

                              var num = String(num);
                              var action = "scaleX(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  垂直缩放动画
                     *  @method scaleY
                     *  @param {number} num  示例: 2
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //链式动画
                         uiAnimate.scaleY(2).start();
                     */
                    function scaleY(num) {

                              var num = String(num);
                              var action = "scaleY(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  旋转动画
                     *  @method rotate
                     *  @param {number} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //链式动画
                         uiAnimate.rotate(45).start();
                     */
                    function rotate(num) {
                              var str = String(num);
                              var num = str.indexOf("deg") > -1 ? str : str + "deg";

                              var action = "rotate(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  水平旋转动画
                     *  @method rotateX
                     *  @param {number} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //需要开启3d动画才会有效
                         uiAnimate.open3D().rotateX(45).start();
                     */
                    function rotateX(num) {
                              var str = String(num);
                              var num = str.indexOf("deg") > -1 ? str : str + "deg";
                              var action = "rotateX(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  垂直伸展动画
                     *  @method rotateY
                     *  @param {number} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //需要开启3d动画才会有效
                         uiAnimate.open3D().rotateY(45).start();
                     */
                    function rotateY(num) {
                              var str = String(num);
                              var num = str.indexOf("deg") > -1 ? str : str + "deg";
                              var action = "rotateY(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  扭曲动画
                     *  @method skew
                     *  @param {string} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.skew("10,10").start();
                     */
                    function skew(num) {
                              var str = String(num);
                              var num;
                              var values = [];
                              //分别判断是否带deg
                              if (str.indexOf(",") > -1) {
                                        values = str.split(",");
                                        num = "";
                                        $.each(values, function (i, item) {

                                                  if (i < 2) {
                                                            num += item.indexOf('deg') > -1 ? "," + item : "," + item + "deg";
                                                  }
                                        });

                                        num = num.substr(1);
                              } else {
                                        num = str.indexOf("deg") > -1 ? str : str + "deg,0";
                              }

                              var action = "skew(" + num + ")";

                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }

                    /**
                     *  横向扭曲
                     *  @method skewX
                     *  @param {number} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.skewX(20).start();
                     */
                    function skewX(num) {
                              var str = String(num);
                              var num = str.indexOf("deg") > -1 ? str : str + "deg";
                              var action = "skewX(" + num + ")";

                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }
                    /**
                     *  纵向扭曲
                     *  @method skewY
                     *  @param {number} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.skewY(20).start();
                     */
                    function skewY(num) {
                              var str = String(num);
                              var num = str.indexOf("deg") > -1 ? str : str + "deg";
                              var action = "skewY(" + num + ")";

                              //保存动画
                              animates.push(action);
                              animatesCache.push(action);

                              return this;
                    }

                    /**
                     *  在做动画前更改原点,几种写法 left,top || 25%,75% || right 对旋转放大扭曲有效
                     *  @method origin
                     *  @param {string} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.origin("25%,75%").rotate(45).start();
                     */
                    function origin(num) {

                              var str = String(num);
                              $id.css({
                                        '-webkit-transform-origin': str,
                                        'transform-origin': str
                              });

                              return this;
                    }

                    /**
                     *  动画的执行时间
                     *  @method transition
                     *  @param {number} time  动画的执行时间 单位:ms
                     *  @param {string} [easing]  动画的效果 ease-in | ease-out | ease
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.transition(500).left(200).start();
                     */
                    function transition(time, easing) {

                              var ease = easing || "ease-out";
                              // 缓冲时间
                              if (typeof time === "number") {
                                        trans = "all " + time + "ms " + ease;
                              } else {
                                        if (time == false || time == "none") {
                                                  trans = "none";
                                        } else if (time == true) {
                                                  trans = "all 300ms " + ease;
                                        } else {
                                                  trans = time || "all 300ms " + ease;
                                        }
                              }
                              $id.css({
                                        '-webkit-transition': trans,
                                        'transition': trans
                              });

                              return this;
                    }

                    /**
                     *  清除动画
                     *  @method clear
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.clear().left(200).start();
                     */
                    function clear() {

                              //清除每一步的动画
                              animates = [];
                              //清除动画的所有缓存
                              animatesCache = [];
                              //历史动画的所有缓存
                              actionHistorys = [];
                              // 还原start的索引
                              index = 0;
                              return this;
                    }
                    /**
                     *  清除动画并返回原来位置
                     *  @method stop
                     *  @param {function} [callback]  动画执行完触发
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.stop();
                     */
                    function stop(callback) {

                              if (pauseStaus) {

                                        transition();

                                        pauseStaus = false;
                              }

                              $id.css({
                                        '-webkit-transform': "",
                                        'transform': ""
                              });

                              //动画结束以后回调
                              if (trans != "none") {
                                        $id.one('webkitTransitionEnd', function () {

                                                  callback && callback.call(module, this);
                                        });
                              }

                              //清除动画
                              clear();

                              return this;
                    }

                    /**
                     *  动画链式的触发
                     *  @method start
                     *  @param {function} [callback]  动画执行完触发
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.left(200).down(200).start();
                     */

                    var index = 0;

                    function start(callback) {

                              var action = turnOn3D ? animatesCache.join("") + "translateZ(0)" : animatesCache.join("");

                              try {
                                        // 每执行一次start,记录每一步动画
                                        actionHistorys[index] = [];
                                        actionHistorys[index].push(animates.join(""));

                                        // 清空对应的动画
                                        animates = [];

                                        index++;
                              } catch (e) {}

                              $id.css({
                                        '-webkit-transform': action,
                                        'transform': action
                              });

                              //动画结束以后回调
                              if (trans != "none") {

                                        $id.one('webkitTransitionEnd', function () {
                                                  callback && callback.call(module, this);
                                        });
                              } else {
                                        callback && callback.call(module, this);
                              }

                              return this;
                    }

                    var pauseStaus = false;
                    function reverse(callback) {

                              var i = 0;
                              var historyReverse = actionHistorys.reverse(),
                                  action;

                              function extend(data) {
                                        var datas = data[i] || [],
                                            nextDatas = data[i + 1] || [];

                                        action = turnOn3D ? datas.join("") + "translateZ(0)" : datas.join("");
                                        action = animatesCache.join("") + action.replace(/\(.*?\)/g, '(0)');

                                        // console.log(animatesCache.join("")+action);
                                        $id.css({
                                                  '-webkit-transform': "",
                                                  'transform': ""
                                        });

                                        i++;

                                        try {

                                                  $id.one('webkitTransitionEnd', function () {
                                                            if (nextDatas && nextDatas.length) {
                                                                      extend(historyReverse);
                                                            } else {
                                                                      i = 0;
                                                                      historyCache = [];
                                                                      return;
                                                            }
                                                  });
                                        } catch (e) {}
                              }

                              // 调转历史记录
                              extend(historyReverse);

                              // clear();
                              return this;
                    }

                    /**
                     *  transform独立动画,无需start,但要配合transition使用
                     *  @method transform
                     *  @param {string} action  要执行的动画
                     *  @param {function} [callback]  动画执行完触发
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //执行动画
                         uiAnimate.transition(500).transform("translateX(-200px)";
                     */
                    function transform(action, callback) {

                              $id.css({
                                        '-webkit-transform': action,
                                        'transform': action
                              });

                              //动画结束以后回调
                              if (callback && transition != "none") {
                                        $id.one('webkitTransitionEnd', function () {

                                                  callback.call(module, this);
                                        });
                              }

                              return this;
                    }

                    /**
                     *  开启3D透视,景深,对旋转动画有效,同时会开启GPU硬件加速
                     *  @method open3D
                     *  @param {number} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //需要开启3d动画才会有效
                         uiAnimate.open3D().rotateY(45).start();
                     */
                    function open3D(num) {
                              num = parseFloat(num) || 100;

                              //开启3D硬件加速
                              turnOn3D = true;
                              $id.parent().css({
                                        "perspective": num + 'px'
                              });

                              return this;
                    }

                    /**
                     *  属性动画,无需start 相对transform会比较耗性能, 配合 transition使用
                     *  @method property
                     *  @param {number} num  度数
                     *  @chainable
                     *  @example 
                        //初始化page对象
                         var uiAnimate = bui.animate("#page");
                     
                         //清除动画的位置
                         uiAnimate.transition(500).property("width","500px");
                     */
                    function property(key, value) {

                              var obj = {};

                              if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
                                        obj = key;
                                        value = "";
                              } else if (typeof key === "string") {
                                        obj[key] = value || "";
                              }

                              $id.css(obj);
                              // 也可以通过这种动画去做;
                              //window.requestAnimationFrame()

                              return this;
                    }

                    /**
                     * 获取依赖的控件
                     *  @method widget
                     *  @param {string} [name] [ 依赖控件名 ]
                     *  @example 
                        
                        //获取依赖控件 
                        var uiAnimateWidget = uiAnimate.widget();
                        
                            
                     */
                    function widget(name) {
                              var control = {};
                              return ui.widget.call(control, name);
                    }
                    /**
                     * 获取设置参数
                     *  @method option
                     *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
                     *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
                     *  @chainable
                     *  @example 
                        
                        
                        //获取所有参数
                         //获取所有参数
                        var option = uiAnimate.option();
                          //获取某个参数
                        var id = uiAnimate.option( "id" );
                          //修改一个参数
                        uiAnimate.option( "open3D",false );
                          //修改多个参数
                        uiAnimate.option( {"open3D":false} );
                            
                     */
                    function options(key, value) {

                              return ui.option.call(module, key, value);
                    }
                    return module;
          };

          return ui;
})(window.bui || {}, window.libs);

/**
 * 动画库
 * @module Animate
 */
(function (ui, $) {
    "use strict";
    /**
     * 常用动画切换器,只能运行已经配置好的动画,更多效果需要引入animate.css 外部样动画库 <br>
     * 
     *  <h3>预览地址: <a href="../../index.html#pages/ui_method/bui.toggle.html" target="_blank">demo</a></h3>
     * 
     * {{#crossLink "bui.toggle/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.toggle/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     * {{#crossLink "bui.toggle/show"}}{{/crossLink}}: 显示 <br>
     * {{#crossLink "bui.toggle/hide"}}{{/crossLink}}: 隐藏 <br>
     * {{#crossLink "bui.toggle/remove"}}{{/crossLink}}: 移除 <br>
     * {{#crossLink "bui.toggle/isShow"}}{{/crossLink}}: 显示状态 since 1.3.5 <br>
     * @namespace  bui
     * @class  toggle
     * @param {string} id [要操控的元素的选择器]
     * @param {string} effect [内置的效果, none (无动画) | showIn | fadeIn | fadeInLeft | fadeInRight | fadeInDown | fadeInUp | zoomIn | bounceIn | rotateIn | flipInX | flipInY]
     * @param {boolean} inOrder [ 是否按顺序出场, 默认:false (从哪进,就从哪出) ->进 <-出 | true (顺着进来的方向出) ->进 ->出 ]
     * @constructor 
     * @example
     * 
      方法1: 
     *
              //初始化page对象
          var uiToggle = bui.toggle("#page");
                //显示动画
              uiToggle.show();
              
              //隐藏动画
              uiToggle.hide();
          
      方法2:
      *
          var uiToggle = bui.toggle({ id:"#page" ,effect:"fadeInLeft"});
              uiToggle.show();
              uiToggle.hide();
          
      方法3: 自定义动画库里面没有的动画
      *
          var uiToggle = bui.toggle("#page");
              uiToggle.show("fadeInLeft");
              uiToggle.hide("fadeOutLeft");
     * 
     */

    ui.toggle = function (option) {

        //默认配置
        var config = {
            id: "",
            effect: "fadeIn",
            revert: true, // 还原样式,动画完成以后会删除样式
            inOrder: false
        };

        if (typeof option === "string") {
            var opt = option || "";

            option = {};
            option.id = opt;
        }

        //方法
        var module = {
            show: show, //显示效果
            hide: hide, //隐藏效果
            remove: remove,
            isShow: isShow,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, option);

        var isDestroy = false;

        //内置的常用动画
        var animated = {
            show: ["fadeIn", "fadeInLeft", "fadeInRight", "fadeInDown", "fadeInUp", "fadeInLeftBig", "fadeInRightBig", "fadeInUpBig", "fadeInDownBig", "zoomIn", "bounceIn", "rotateIn", "rollIn", "flipInX", "flipInY", "lightSpeedIn", "showIn", "slideInRight", "slideInLeft", "coverInLeft", "coverInRight", "zoomSlideInLeft", "zoomSlideInRight", "pushInLeft", "pushInRight"],
            hide: ["fadeOut", "fadeOutLeft", "fadeOutRight", "fadeOutUp", "fadeOutDown", "fadeOutLeftBig", "fadeOutRightBig", "fadeOutDownBig", "fadeOutUpBig", "zoomOut", "bounceOut", "rotateOut", "rollOut", "flipOutX", "flipOutY", "lightSpeedOut", "showOut", "slideOutRight", "slideOutLeft", "coverOutLeft", "coverOutRight", "zoomSlideOutLeft", "zoomSlideOutRight", "pushOutLeft", "pushOutRight"],
            hideInOrder: ["fadeOut", "fadeOutRight", "fadeOutLeft", "fadeOutDown", "fadeOutUp", "fadeOutRightBig", "fadeOutLeftBig", "fadeOutUpBig", "fadeOutDownBig", "zoomOut", "bounceOut", "rotateOut", "rollOut", "flipOutX", "flipOutY", "lightSpeedOut", "showOut", "slideOutLeft", "slideOutRight", "coverOutRight", "coverOutLeft", "zoomSlideOutRight", "zoomSlideOutLeft", "pushOutRight", "pushOutLeft"]
        };

        var id,
            $id,
            hideClass,
            showClass,
            switchShowControl = true,
            switchHideControl = true,

        // 打开状态
        status = false,
            myClass;

        //初始化
        init(param);

        if (param.id) {
            //初始化
            init(param);
        }

        //初始化动画对象
        function init(option) {
            option = option || param;
            isDestroy = false;

            if (option.id) {
                $id = ui.objId(option.id);
            } else {
                ui.showLog("toggle id不能为空", "bui.toggle");
                return;
            }

            //option获取新参数使用
            param = module.config = option;

            myClass = $id.attr('class') || "";

            var effect = option.effect;
            var inOrder = option.inOrder ? ui.array.index(effect, animated["hideInOrder"]) : ui.array.index(effect, animated["hide"]);
            var showIndex = effect && (ui.array.index(effect, animated["show"]) > -1 ? ui.array.index(effect, animated["show"]) : inOrder);

            // 检测初始化的status
            status = $id[0] && $id[0].style.display == "none" || $id.css("display") == "none" ? false : true;
            //检测在不在已经有的动画里面
            if (showIndex < 0) {
                showClass = animated["show"][0];

                hideClass = option.inOrder ? animated["hideInOrder"][0] : animated["hide"][0];
            } else {
                showClass = animated["show"][showIndex];
                hideClass = option.inOrder ? animated["hideInOrder"][showIndex] : animated["hide"][showIndex];

                return;
            }

            return this;
        }

        /**
         *  当前元素的显示状态
         *  @method isShow
         *  @since 1.3.5
         *  @example 
         *  
            var uiToggle = bui.toggle("#page");
                uiToggle.isShow();
         */
        function isShow() {
            return status;
        }
        /**
         *  显示动画
         *  @method show
         *  @param {string} [effect] 指定单次显示动画效果
         *  @param {function} [callback] 回调
         *  @chainable
         *  @example 
         *  
            var uiToggle = bui.toggle("#page");
                uiToggle.show();
         */
        function show(effect, callback) {
            if (isDestroy) {
                return;
            }

            if (!switchShowControl && !switchHideControl) {
                return false;
            }
            switchShowControl = false;

            if (typeof effect === "function") {
                callback = effect;
                effect = showClass || "";
            } else {
                effect = effect || showClass || "";
            }
            // showClass = effect;
            // 如果隐藏,需要先显示再执行动画
            if ($id[0] && $id[0].style.display == "none") {
                $id.css("display", "block");
            }
            $id.addClass("animated " + effect);
            if (effect == "showIn" || effect == "showOut" || effect == "none") {

                param.revert && $id.removeClass("animated " + effect);
                //执行回调
                callback && callback.call(module, this);
                // 打开状态
                status = true;

                switchShowControl = true;
            } else {
                $id.one('webkitAnimationEnd', function () {

                    try {

                        !status && $id.css("display", "block");
                        param.revert && $id.removeClass("animated " + effect);

                        //执行回调
                        callback && callback.call(module, this);
                        // 打开状态
                        status = true;

                        switchShowControl = true;
                    } catch (e) {
                        ui.showLog(e, "toggle show method");
                    }
                });
            }

            return this;
        }

        /**
         *  隐藏动画
         *  @method hide
         *  @param {string} [effect] 指定单次隐藏动画效果
         *  @param {function} [callback] 回调
         *  @chainable
         *  @example 
         *  
            var uiToggle = bui.toggle("#page");
                uiToggle.hide();
         */
        function hide(effect, callback) {

            if (isDestroy) {
                return;
            }

            if (!switchShowControl && !switchHideControl) {
                return;
            }
            // 要动画结束后才能继续调用
            switchHideControl = false;

            if (typeof effect === "function") {
                callback = effect;
                effect = hideClass || "";
            } else {
                effect = effect || hideClass || "";
            }

            $id.css("display", "block").addClass("animated " + effect);

            // hideClass = effect;

            if (effect == "showIn" || effect == "showOut" || effect == "none") {
                $id.css("display", "none");
                param.revert && $id.removeClass("animated " + effect);
                //执行回调
                callback && callback.call(module, this);
                // 打开状态
                status = false;

                switchHideControl = true;
            } else {
                $id.one('webkitAnimationEnd', function () {
                    try {
                        $id.css("display", "none");
                        param.revert && $id.removeClass("animated " + effect);
                        //执行回调
                        callback && callback.call(module, this);

                        // 打开状态
                        status = false;

                        switchHideControl = true;
                    } catch (e) {
                        ui.showLog(e, "toggle hide method");
                    }
                });
            }

            return this;
        }

        /**
         *  删除动画元素
         *  @method remove
         *  @chainable
         *  @example 
         *  
            var uiToggle = bui.toggle("#page");
                uiToggle.remove();
         */
        function remove() {
            $id.remove();

            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiToggle.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;
            if ($id) {
                $id.off();
                bool && $id.remove();
            }
            isDestroy = true;
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiToggleWidget = uiToggle.widget();
            
                
         */
        function widget(name) {
            var control = {};
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiToggle.option();
              //获取某个参数
            var id = uiToggle.option( "id" );
              //修改一个参数
            uiToggle.option( "time",10 );
              //修改多个参数
            uiToggle.option( {"time":10} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

//animate

/**
 * <h3>UI控件库</h3>
 * {{#crossLink "bui.btn"}}{{/crossLink}}: 绑定跳转,提交 <br>
 * {{#crossLink "bui.list"}}{{/crossLink}}: 滚动加载,下拉刷新,快速版本 <br>
 * {{#crossLink "bui.searchbar"}}{{/crossLink}}: 搜索 <br>
 * {{#crossLink "bui.scroll"}}{{/crossLink}}: 滚动加载,下拉刷新控件 <br>
 * {{#crossLink "bui.pullrefresh"}}{{/crossLink}}: 下拉刷新控件 <br>
 * {{#crossLink "bui.swipe"}}{{/crossLink}}: 滑动控件 <br>
 * {{#crossLink "bui.sidebar"}}{{/crossLink}}: 菜单侧滑 <br>
 * {{#crossLink "bui.listview"}}{{/crossLink}}: 列表侧滑 <br>
 * {{#crossLink "bui.slide"}}{{/crossLink}}: 滑动控件 <br>
 * {{#crossLink "bui.hint"}}{{/crossLink}}: 自动消失的提醒 <br>
 * {{#crossLink "bui.alert"}}{{/crossLink}}: 弹出提醒,可以支持调试Object <br>
 * {{#crossLink "bui.confirm"}}{{/crossLink}}: 确认提醒 <br>
 * {{#crossLink "bui.accordion"}}{{/crossLink}}: 折叠菜单 <br>
 * {{#crossLink "bui.dialog"}}{{/crossLink}}: 弹出框 <br>
 * {{#crossLink "bui.stepbar"}}{{/crossLink}}: 步骤条 <br>
 * {{#crossLink "bui.loading"}}{{/crossLink}}: 加载进度 <br>
 * {{#crossLink "bui.mask"}}{{/crossLink}}: 遮罩 <br>
 * {{#crossLink "bui.select"}}{{/crossLink}}: 下拉选择菜单 <br>
 * {{#crossLink "bui.pickerdate"}}{{/crossLink}}: 日期控件 <br>
 * {{#crossLink "bui.dropdown"}}{{/crossLink}}: 下拉菜单 <br>
 * {{#crossLink "bui.actionsheet"}}{{/crossLink}}: 上拉菜单 <br>
 * {{#crossLink "bui.number"}}{{/crossLink}}: 数字增减条 <br>
 * {{#crossLink "bui.rating"}}{{/crossLink}}: 评分 <br>
 * {{#crossLink "bui.actionsheet"}}{{/crossLink}}: 上拉选择菜单 <br>
 * {{#crossLink "bui.input"}}{{/crossLink}}: 输入框 <br>
 * {{#crossLink "bui.prompt"}}{{/crossLink}}: 弹出输入框 <br>
 * {{#crossLink "bui.tab"}}{{/crossLink}}: tab选项卡 <br>
 * {{#crossLink "bui.levelselect"}}{{/crossLink}}: 层级选择 <br>
 * 
 * @module UI
 */
(function (ui, $) {
    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>Mask遮罩控件</h2>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.mask.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.mask/remove"}}{{/crossLink}}: 移除遮罩 <br>
     * {{#crossLink "bui.mask/show"}}{{/crossLink}}: 显示遮罩,如果不存在则创建再显示 <br>
     * {{#crossLink "bui.mask/hide"}}{{/crossLink}}: 隐藏遮罩,如果不存在则不操作 <br>
     * {{#crossLink "bui.mask/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.mask/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.mask.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-mask_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class mask
     *  @constructor 
     *  @param {object} [option] 
     *     @param [option.id] {string} [ 遮罩的id, 用于跟其它控件绑定, 默认可以不传 ]
     *     @param [option.appendTo] {string} [ 遮罩生成的位置,默认在body标签下 ]
     *     @param [option.opacity] {number} [ 透明度,小数点 ]
     *     @param [option.autoTrigger] {boolean} [ 是否自动触发 默认 true | false ]
     *     @param [option.background] {string} [ 背景颜色 ]
     *     @param [option.callback] {function} [ 回调 ]
     * @example
     * 
     *   方法1:
     *   
            // 遮罩初始化
            var uiMask = bui.mask();
            
                // 调用 show 方法
                uiMask.show();
    
     *
     */
    ui.mask = function (option) {

        //默认配置
        var config = {
            id: "",
            appendTo: "",
            opacity: 0.3,
            background: "",
            zIndex: 100,
            autoTrigger: false,
            autoClose: false,
            callback: null
        };

        //方法
        var module = {
            handle: {},
            on: on,
            off: off,
            hide: hide,
            show: show,
            isShow: isShow,
            remove: remove,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.mask, option);
        var guid = ui.guid(),

        // 确保id 不含 #
        id = param.id ? param.id.indexOf("#") > -1 ? param.id.substring(1) : param.id : guid,
            $body = $('body'),
            $id = null,
            $parentId = null,
            defaultPosition,
            status,
            $mask = null,
            isPublicMask = false,
            hasEventInit = false,
            isDestroy = false;

        //执行初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            isDestroy = false;
            var option = $.extend(true, config, param, opt);
            option.appendTo = option.appendTo || "body";

            $parentId = $(option.appendTo);

            //option获取新参数使用
            param = module.config = option;

            defaultPosition = $parentId.css("position");
            //添加遮罩
            option.autoTrigger && add(option);

            $mask = ui.objId(option.id);

            return this;
        }

        //遮罩点击事件
        function bind(option) {

            var handleMask = function handleMask(e) {

                option.callback && option.callback.call(module, e);

                option.autoClose && hide();

                e.stopPropagation();
            };

            $mask.on("click.mask", handleMask);

            hasEventInit = true;
        }
        //生成遮罩模板
        function template(option) {

            var bgcolor = option.background ? option.background : 'rgba(0,0,0,' + option.opacity + ')';

            var html = '';
            html += '<div id="' + id + '" class="' + ui.prefix('mask') + '" style="background:' + bgcolor + ';z-index:' + option.zIndex + '"></div>';

            return html;
        }

        /*
         * 遮罩添加方法 已弃用
         *  @method add
         *  @param {object} [option] 
         *  @param option.appendTo {string} [ 遮罩生成的位置,默认在body标签下 ]
         *  @param option.opacity {number} [ 遮罩的透明度,小数点 ]
         *  @param option.background {string} [ 遮罩的背景颜色 ]
         *  @param option.callback {function} [ 遮罩点击的回调 ]
         *  @chainable
         *  @example 
            var uiMask = bui.mask();
                uiMask.add();
           */

        function add(opt) {
            if (isDestroy) {
                return;
            }
            var option = $.extend(true, {}, config, param, opt);

            var tpl = template(option);
            // id 私有遮罩可以随意取消删除
            $mask = ui.objId(id);

            if ($mask.length < 1) {
                $parentId.append(tpl).css("position", "relative");
                $mask = ui.objId(id);
            } else {
                $mask.css("display", "block");
            }

            // 遮罩的状态
            status = true;

            trigger.call(module, "show");

            if (!hasEventInit) {
                // 添加的时候才绑定事件
                bind(option);
            }

            return this;
        }
        /**
         * 遮罩移除方法
         *  @method remove
         *  @chainable
         *  @example 
            var uiMask = bui.mask();
                uiMask.remove();
                
         */

        function remove() {
            if (isDestroy) {
                return;
            }

            // z802t 中兴手机移除时会有泛白
            $mask && $mask.remove();
            $mask = null;

            $parentId.css("position", defaultPosition || "static");

            status = false;

            hasEventInit = false;

            trigger.call(module, "hide");

            return this;
        }

        function show(opt) {

            if (isDestroy) {
                return;
            }
            $mask = ui.objId(id);

            // 遮罩是添加在body还是在id下
            if ($mask && $mask.length) {
                $mask.css("display", "block");
                $parentId.css("position", "relative");
                status = true;
            } else {
                add(opt);
            }

            trigger.call(module, "show");
            return this;
        }

        /**
         * 隐藏遮罩
         *  @method hide
         *  @example 
            var uiMask = bui.mask();
                uiMask.hide();
           */

        function hide() {
            if (isDestroy) {
                return;
            }

            $mask && $mask.css("display", "none");
            $parentId.css("position", "relative");
            status = false;

            trigger.call(module, "hide");

            return this;
        }
        /**
         * 遮罩是否显示
         *  @method isShow
         *  @since 1.3.0 
         *  @example 
            var uiMask = bui.mask(),
                isShow = uiMask.isShow();
           */
        function isShow() {

            return status;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiMask.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            remove();

            if ($parentId) {
                $parentId.off("click.mask");
            }

            off("show");
            off("hide");

            isDestroy = true;
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiMaskWidget = uiMask.widget();
            
                
         */
        function widget(name) {
            var control = {};
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiMask.option();
              //获取某个参数
            var id = uiMask.option( "appendTo" );
              //修改一个参数
            uiMask.option( "opacity",0.5 );
              //修改多个参数
            uiMask.option( {"opacity":0.5} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }
        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show" | "hide" ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiMask.on("show",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show" | "hide" ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiMask.off("show");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {

    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>进度条</h2>
     *     <p>默认为公用进度条,一个页面一个进度条就够了, 有appendTo的时候是在id下的操作,没有的是在body下的,可以控制是否显示文本,或者自动关闭,甚至你还可以自定义你的进度条模板</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.loading.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.loading/show"}}{{/crossLink}}: 显示加载,如果存在则显示,如果不存在则创建 <br>
     * {{#crossLink "bui.loading/hide"}}{{/crossLink}}: 隐藏加载,如果存在则隐藏,不存在则没有操作 <br>
     * {{#crossLink "bui.loading/pause"}}{{/crossLink}}: 暂停滚动 <br>
     * {{#crossLink "bui.loading/text"}}{{/crossLink}}: 修改文本 <br>
     * {{#crossLink "bui.loading/showRing"}}{{/crossLink}}: 显示圈圈 <br>
     * {{#crossLink "bui.loading/hideRing"}}{{/crossLink}}: 隐藏圈圈 <br>
     * {{#crossLink "bui.loading/start"}}{{/crossLink}}: 显示加载,重新创建 <br>
     * {{#crossLink "bui.loading/stop"}}{{/crossLink}}: 移除加载 <br>
     * {{#crossLink "bui.loading/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.loading/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.loading.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-loading_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class loading
     *  @constructor 
     *  @param {object} [option] 
     *     @param option.appendTo {string} [ appendTo是进度条生成的位置ID,默认在body标签下 ]
     *     @param option.width {number} [ 宽度 ]
     *     @param option.height {number} [ 高度 ]
     *     @param option.text {string} [ 加载的文本 ]
     *     @param option.autoTrigger {boolean} [ 是否自动触发 默认 true | false ]
     *     @param option.onlyText {boolean} [ 是否只显示文本 ]
     *     @param option.autoClose {boolean} [ 默认true | false 是否点击自动关闭 ]
     *     @param option.display {string} [ inline ]
     *     @param [option.timeout] {string}  [ since1.3.0 是否开启定时关闭 默认0,大于零则开启定时关闭 ] 
     *     @param [option.zIndex] {string}  [ since1.3.0 默认""的时候为110 ] 
     *     @param option.callback {function} [ 回调 ]
     * @example
     * 
     *
     *      // 效果1:
            var uiLoading = bui.loading();
            //开启进度条
            //uiLoading.show();
            //关闭进度条
            //uiLoading.hide();
    
            // 效果2:
            var uiLoading = bui.loading({
                appendTo:"#loading",
                display: "block",
                width: 30,
                height: 30,
                opacity: 0,
                callback: function (argument) {
                    console.log("clickloading")
                }
            });
     *
     */
    ui.loading = function () {

        var openCache = [];

        return function (option) {
            //默认配置
            var config = {
                appendTo: "",
                width: 30,
                height: 30,
                text: "",
                onlyText: false,
                mask: true,
                zIndex: "",
                autoTrigger: false,
                autoClose: true,
                timeout: 0,
                opacity: 0,
                display: "block",
                template: null,
                callback: null

                //方法
            };var module = {
                handle: {},
                on: on,
                off: off,
                start: start,
                stop: stop,
                pause: pause,
                text: text,
                showRing: showRing,
                hideRing: hideRing,
                show: show,
                hide: hide,
                destroy: destroy,
                widget: widget,
                option: options,
                config: param,
                init: init
            };
            //用于option方法的设置参数
            var param = module.config = $.extend(true, {}, config, ui.config.loading, option);

            var id,
                $body = $('body'),

            // loading 可以加在body标签
            $id = null,
                guid = ui.guid(),
                maskId = guid + "-mask",
                $loading = null,
                $mask = null,
                $text,
                $ring,
                hasEventInit = false,
                isDestroy = false,
                timeout = null;

            //引用遮罩模块
            var uiMask = null;

            // 控件初始化
            init(param);

            /**
             * 初始化方法,用于重新初始化结构,事件只初始化一次
             *  @method init
             *  @param {object} [option] [参数控件本身]
             *  @chainable
             */
            function init(opt) {
                isDestroy = false;
                var option = $.extend(true, param, opt);
                option.appendTo = option.appendTo || "body";

                // loading 可以加在body标签
                $id = $(option.appendTo);
                $loading = $id.children(".bui-loading");
                $mask = ui.objId(maskId);
                //option获取新参数使用
                param = module.config = option;

                option.autoTrigger && start(option);

                // 修改mask的回调
                var callback = option.callback;
                option.callback = function (e) {
                    //是否绑定移除事件
                    option.autoClose && stop();
                    callback && callback.call(module, e);
                };

                option.id = $loading.length ? $loading.attr("id") + "-mask" : maskId;
                param.callback = option.callback;
                // 遮罩初始化
                uiMask = option.mask && ui.mask(option);

                return this;
            }

            //绑定事件
            function bind(option) {
                $loading = $id.children(".bui-loading");

                var handleLoading = function handleLoading(e) {

                    if (option.appendTo) {
                        option.callback && option.callback.call(module, e);
                    } else {
                        var lastCallback = openCache[openCache.length - 1];
                        // 执行最后一个的Callback
                        lastCallback && lastCallback.callback && lastCallback.callback.call(this, e);
                    }

                    e.stopPropagation();
                };
                //会存在点透问题,需要在页面绑定mask再阻止一次
                $id.on("click.bui", ".bui-loading", handleLoading);

                hasEventInit = true;

                return this;
            }

            //模板工厂
            function template(option) {

                option = option || {};
                //是否传text进来
                var bool = option.text;
                var pWidth = $id.width();
                var height = bool && option.display == "block" ? parseInt(option.height) + 30 : parseInt(option.height);
                var left = -(pWidth / 2);
                var top = -(height / 2);
                var display = option.display == "block" ? ui.prefix('loading-block') : ui.prefix('loading-inline');

                var html = '';
                html += '<div id="' + guid + '" class="' + ui.prefix('loading') + ' ' + display + '" style="width:' + pWidth + 'px;height:' + height + 'px;line-height:' + height + 'px;margin-left:' + left + 'px;margin-top:' + top + 'px;' + (option.zIndex ? 'z-index:' + option.zIndex : '') + '" >';
                if (!option.onlyText) {
                    html += '<div class="' + ui.prefix('loading-cell') + '" style="width:' + parseFloat(option.width) + 'px;height:' + parseFloat(option.height) + 'px;"></div>';
                }
                //是否显示文本提醒
                // if( bool ){
                html += '<div class="' + ui.prefix('loading-text') + '">' + option.text + '</div>';
                // }         
                html += '</div>';

                var newhtml = option && option.template ? option.template.call(module, option) : html;

                return newhtml;
            }

            /**
             * 显示loading , 参数参考loading的初始化, 每次都重新创建
             *  @method start
             *  @chainable
             *  @example 
                var uiLoading = bui.loading();
                    uiLoading.start();
                    
             */
            function start(option) {

                if (isDestroy) {
                    return;
                }
                var options = $.extend(true, param, option);

                $loading = $id.children(".bui-loading");
                $ring = $loading.children(".bui-loading-cell");

                if ($loading && $loading.hasClass("bui-loading-pause")) {
                    $loading && $loading.removeClass("bui-loading-pause");
                    trigger.call(this, "start");
                } else {

                    // 增加公共的遮罩缓存
                    options.appendTo == "" && addCache(options);
                    if ($loading.length) {
                        $loading.remove();
                        //uiMask && uiMask.remove();
                    }
                    var tpl = template(options);

                    $id.append(tpl);

                    // console.log(options.autoClose);

                    uiMask && uiMask.show(options);

                    trigger.call(this, "show");
                }

                // 定时关闭
                if (options.timeout) {
                    timeout && clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        stop();
                    }, options.timeout);
                }

                if (!hasEventInit) {
                    bind(options);
                }

                // 导致 list pullrefresh 的下拉出现问题
                // $id.css("position","relative");

                return this;
            }

            /**
             * 修改文本
             *  @method text
             *  @chainable
             *  @example 
                var uiLoading = bui.loading();
                    uiLoading.text("正在加载");
                    
             */
            function text(name) {

                if (isDestroy) {
                    return;
                }
                $text = $loading && $loading.children(".bui-loading-text");

                var val;
                if (typeof name == "undefined") {
                    val = $text && $text.text();
                    return val;
                } else {
                    $text && $text.text(name);

                    return this;
                }
            }

            /**
             * 显示圈圈
             *  @method showRing
             *  @chainable
             *  @example 
                    uiLoading.showRing();
                    
             */
            function showRing() {

                if (isDestroy) {
                    return;
                }
                $ring = $loading && $loading.children(".bui-loading-cell");

                $ring && $ring.css("display", "inline-block");

                $loading && $loading.removeClass("bui-loading-pause");
            }
            /**
             * 隐藏圈圈
             *  @method hideRing
             *  @chainable
             *  @example 
                var uiLoading = bui.loading();
                    uiLoading.hideRing();
                    
             */
            function hideRing() {

                if (isDestroy) {
                    return;
                }
                $ring = $loading && $loading.children(".bui-loading-cell");
                $ring && $ring.css("display", "none");
                $loading && $loading.addClass("bui-loading-pause");
            }

            /**
             * 关闭并移除loading
             *  @method stop
             *  @chainable
             *  @example 
                var uiLoading = bui.loading();
                    uiLoading.stop();
                    
             */
            function stop() {

                if (isDestroy) {
                    return;
                }
                $loading = $id.children(".bui-loading");

                if (param.appendTo) {

                    // z802t 中兴手机移除时会有泛白
                    $loading && $loading.remove();
                    $loading = null;

                    uiMask && uiMask.remove();
                } else {
                    removeCache();

                    // mask 里面也有堆栈
                    uiMask && uiMask.remove();

                    if (openCache.length < 1 && $loading && $loading.length) {
                        $loading && $loading.remove();
                        $loading = null;
                    }
                }

                hasEventInit = false;

                trigger.call(this, "remove");
                trigger.call(this, "hide");

                return this;
            }
            /**
             * 暂停loading
             *  @method pause
             *  @since 1.3.0
             *  @chainable
             *  @example 
                var uiLoading = bui.loading();
                    uiLoading.pause();
                    
             */
            function pause() {

                if (isDestroy) {
                    return;
                }
                $loading = $id.children(".bui-loading");

                if ($loading && $loading.length) {

                    $loading.addClass("bui-loading-pause");

                    trigger.call(this, "pause");
                }
                return this;
            }

            /**
             * 显示loading
             *  @method show
             *  @chainable
             *  @example 
                var uiLoading = bui.loading();
                    uiLoading.show();
                    
             */
            function show(option) {

                if (isDestroy) {
                    return;
                }
                var options = $.extend(true, param, option);

                $loading = $id.children(".bui-loading");

                if ($loading && $loading.length) {

                    text(options.text);

                    $loading.css("display", "block");
                    //添加遮罩
                    uiMask && uiMask.show();

                    options.appendTo == "" && addCache(param);
                    trigger.call(this, "show");
                } else {

                    start(options);
                }

                // 定时隐藏
                if (param.timeout) {
                    timeout && clearTimeout(timeout);
                    timeout = setTimeout(function (argument) {
                        hide();
                    }, param.timeout);
                }

                return this;
            }

            /**
             * 隐藏loading
             *  @method hide
             *  @chainable
             *  @example 
                var uiLoading = bui.loading();
                    uiLoading.hide();
                    
             */
            function hide() {

                if (isDestroy) {
                    return;
                }
                $loading = $id.children(".bui-loading");

                if (param.appendTo) {
                    $loading.css("display", "none");
                    uiMask && uiMask.hide();
                } else {
                    removeCache();

                    if (openCache.length < 1 && $loading && $loading.length) {
                        $loading.css("display", "none");
                        uiMask && uiMask.hide();
                    }
                }

                trigger.call(this, "hide");

                return this;
            }

            function addCache(option) {

                if (!ui.array.compare(guid, openCache, "id") && option.callback) {
                    openCache.push({ id: guid, callback: option.callback });
                }
            }

            function removeCache() {

                // 移除已经打开的id及事件
                openCache.pop();
            }

            /**
             * [销毁控件]
             *  @method destroy
             *  @since 1.4.2
             *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
             *  @example 
                
                //销毁
                uiLoading.destroy();
                
             */
            function destroy(bool) {
                var bool = bool == true ? true : false;

                stop();

                if ($id && openCache.length < 1) {
                    $id.off("click.bui");
                }

                off("show");
                off("hide");
                off("start");
                off("stop");
                off("pause");
                off("remove");

                uiMask && uiMask.destroy(bool);

                isDestroy = true;
            }
            /**
             * 获取依赖的控件
             *  @method widget
             *  @param {string} [name] [ 依赖控件名 mask]
             *  @example 
                
                //获取依赖控件
                var uiLoadingWidget = uiLoading.widget();
                
                    
             */
            function widget(name) {
                var control = { mask: uiMask || {} };

                return ui.widget.call(control, name);
            }
            /**
             * 获取设置参数
             *  @method option
             *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
             *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
             *  @chainable
             *  @example 
                
                
                //获取所有参数
                 //获取所有参数
                var option = uiLoading.option();
                  //获取某个参数
                var id = uiLoading.option( "appendTo" );
                  //修改一个参数
                uiLoading.option( "autoClose",true );
                  //修改多个参数
                uiLoading.option( {"autoClose":true} );
                    
             */
            function options(key, value) {

                return ui.option.call(module, key, value);
            }

            /**
             * 为控件绑定事件
             *  @event on
             *  @since 1.3.0
             *  @param {string} [type] [ 事件类型: "show" | "hide" | "pause" (暂停转圈)| "start" (开始转圈) | "remove" (删除时)   ]
             *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
             *  @example 
                
                uiLoading.on("show",function () {
                    // 点击的菜单
                    console.log(this);
                });
                
                    
             */
            function on(type, callback) {
                ui.on.apply(module, arguments);
                return this;
            }

            /**
             * 为控件取消绑定事件
             *  @event off
             *  @since 1.3.0
             *  @param {string} [type] [ 事件类型: "show" | "hide" | "pause" (暂停转圈)| "start" (开始转圈) | "remove" (删除时) ]
             *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
             *  @example 
                
                uiLoading.off("show");
                
                    
             */
            function off(type, callback) {
                ui.off.apply(module, arguments);
                return this;
            }
            /*
             * 触发自定义事件
             */
            function trigger(type) {
                //点击事件本身,或者为空,避免循环引用
                module.self = this == window || this == module ? null : this;

                ui.trigger.apply(module, arguments);
            }

            return module;
        };
    }();

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
  /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>滑动控件</h2>
     *     <p>滑动控件比较灵活,对参数要了解得更多一点,可以用来制作: <a href="../../index.html#pages/ui_controls/bui.slide.html" target="_blank">焦点图</a>,<a href="../../index.html#pages/ui_controls/bui.slide_tab.html" target="_blank">TAB选项卡</a>,全屏相册,上下滑屏,过滤筛选,层级选择器,滚动公告,等等</p>
     *     <p><strong>1.4,新增自动加载远程地址参数,配合href使用</strong></p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.slide.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.slide/start"}}{{/crossLink}}: 自动播放<br>
     * {{#crossLink "bui.slide/stop"}}{{/crossLink}}: 停止自动播放 <br>
     * {{#crossLink "bui.slide/lock"}}{{/crossLink}}: 不允许滑动 <br>
     * {{#crossLink "bui.slide/unlock"}}{{/crossLink}}: 允许滑动 <br>
     * {{#crossLink "bui.slide/prev"}}{{/crossLink}}: 是否存在,返回index <br>
     * {{#crossLink "bui.slide/next"}}{{/crossLink}}: 是否存在,返回boolean <br>
     * {{#crossLink "bui.slide/to"}}{{/crossLink}}: 跳转到指定的 某一个slide <br>
     * {{#crossLink "bui.slide/load"}}{{/crossLink}}: 加载远程地址模板 <br>
     * {{#crossLink "bui.slide/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.slide/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.slide.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-slide_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class slide
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [控件id]  
     *  @param {string} [option.menu] [ 默认".bui-slide-head ul" (循环元素的父级), 如果控制菜单要独立,可以使用id选择器]  
     *  @param {string} [option.children] [ 默认".bui-slide-main ul" (循环元素的父级), 如果控制内容要独立,可以使用id选择器, slide嵌套必须使用id ]  
     *  @param {string} [option.stopHandle] [ 1.4.2新增,样式名,默认为空,支持多个样式名,以逗号间隔. 当这个值等于slide里面的某个样式,不触发滑动,一般用于事件冲突,比方 input[type=range] 无法滑动的时候 ]  
     *  @param {number} [option.width] [0 为默认屏幕宽度]   
     *  @param {number} [option.height] [0 为默认屏幕高度,会计算剩余的高度]  
     *  @param {number} [option.index] [ 默认:0 ,第一次加载第几个 ]  
     *  @param {string} [option.direction] [ 水平滑动还是纵向滑动 默认: x | y ]  
     *  @param {string} [option.alignClassName] [ since 1.3.4 默认是"",全屏默认是:"bui-box-center", 每个li的盒子对齐样式名,主要用于全屏时的内容对齐,自带几种对齐方式 左:bui-box-align-left 水平中:bui-box-align-right 右:bui-box-align-center 上:bui-box-align-top 垂直中:bui-box-align-middle 下:bui-box-align-bottom  ]  
     *  @param {boolean} [option.swipe] [ 是否允许侧滑,默认允许 true | false ]  
     *  @param {boolean} [option.animate] [ 点击菜单跳转到某个位置是否采用动画 默认: true | false ] 
     *  @param {boolean} [option.scroll] [ 是否允许垂直滚动 false | true , 如果单独需要滚动 可以给滑动的li的属性加上 data-scroll=true ]  
     *  @param {boolean} [option.fullscreen] [ 是否全屏 默认:false | true ]  
     *  @param {boolean} [option.autopage] [ 是否自动分页 默认:false | true; true时自动生成 bui-slide-head结构 ]  
     *  @param {boolean} [option.autoplay] [ 是否自动播放 默认:false | true ]   
     *  @param {boolean} [option.autoheight] [ 1.4.3新增, 自动高度,由内容撑开 默认:false | true ]   
     *  @param {boolean} [option.zoom] [ 保持比例缩放 默认 true | false]  
     *  @param {boolean} [option.loop] [ 1.5新增,循环 默认 false | true, 如果为true, index是加1的值]  
     *  @param {number} [option.transition] [ transform效果持续时间 ]  
     *  @param {number} [option.interval] [ 自动运行间隔 ]  
     *  @param {number} [option.visibleNum] [ 1.4.5新增, 可视个数,默认为1 ]  
     *  @param {number} [option.scrollNum] [ 1.4.5新增, 一次滚动个数,默认为1 ]  
     *  @param {boolean} [option.template] [ 1.5新增, 需要return 正确的结构,便于数据请求处理动态模板 ]  
     *  @param {boolean} [option.bufferEffect] [ 1.3.0 新增的参数, 在第1页跟最后1页是否还可以继续拖动, 默认允许: true | false   ]  
     *  @param {number} [option.distance] [ 默认40, 拖拽大于distance才会生效,配合delay可以防止slide又有上下其它事件 ]  
     *  @param {function} [option.callback] [ 点击的回调 1.3.0 以后不再推荐,自行绑定就可 ] 
     *  @param {boolean} [option.autoload] [ 1.4新增 默认: false | true 远程加载菜单按钮上的 href 地址, 如果点击的按钮有disabled属性或者样式,则不跳转]  
     *  @example
     *   html:
     *
            <div id="slide" class="bui-slide">
              <div class="bui-slide-main">
                <ul>
                  <li>
                    <img src="../images/slideshow.png" alt="">
                  </li>
                </ul>
              </div>
            </div>
     *      
     *   js: 
     *   
            // 初始化
            var uiSlide = bui.slide({
                        id:"#slide",
                        height:160,
                        autopage:true
                      })
  
        1.5.0 动态渲染:
        html: 
  
        <div id="slide" class="bui-slide"></div>
        
        // 请求成功以后渲染
        bui.ajax({
            url: "http://www.easybui.com/demo/json/shop.json",
            data: {},//接口请求的参数
            // 可选参数
            method: "GET"
        }).then(function(result){
  
            // 初始化
            var uiSlide = bui.slide({
                  id:"#slide",
                  height:160,
                  template: function () {
                      var html = `<div class="bui-slide-main">
                                    <ul>${result.data.map((item,index)=>`
                                          <li><img src="${item.image}" alt=""></li>`
                                      ).join('') }
                                    </ul>
                                  </div>`
  
                      return html;
                  },
                  autopage:true
                })
        });
  
  
     *
     *
     */
  ui.slide = function (option) {

    var config = {
      id: "",
      menu: ".bui-slide-head > ul",
      children: ".bui-slide-main > ul",
      header: "header",
      footer: "footer",
      item: "li",
      prev: ".bui-slide-prev",
      next: ".bui-slide-next",
      alignClassName: "",
      stopHandle: "",
      width: 0,
      height: 0,
      zoom: true,
      transition: 200,
      interval: 5000,
      swipe: true,
      animate: true,
      delay: false,
      bufferEffect: true,
      visibleNum: 1,
      scrollNum: 1,
      distance: 40,
      direction: "x",
      autoplay: false,
      loop: false,
      cross: false,
      autoheight: false,
      scroll: false,
      index: 0,
      fullscreen: false,
      autopage: false,
      autoload: false,
      async: true, // 如果改为同步, 会导致"load"事件监听第一次不触发   
      template: null,
      callback: null,
      onStart: null,
      onMove: null,
      onEnd: null
    };
    //方法
    var module = {
      handle: {},
      on: on,
      off: off,
      to: to,
      load: load,
      getPageParams: getPageParams,
      getPages: getPages,
      $active: getActive,
      prev: prev,
      next: next,
      stop: stop,
      start: start,
      lock: lock,
      index: index,
      unlock: unlock,
      destroy: destroy,
      widget: widget,
      option: options,
      config: param,
      init: init
    };
    //用于option方法的设置参数
    var param = module.config = $.extend(true, {}, config, ui.config.slide, option);

    var $id,
        el,
        $inner,
        $menu,
        $menuChildren,
        $children,
        $childrenParent,
        $item,
        touch = {},
        //保存拖拽的坐标
    length,
        nowIndex = 0,
        interPlay,
        //        
    innerWidth,
        innerHeight,
        fullWidth,
        fullHeight,
        direction,
        itemWidth,
        deltaX,
        deltaY,
        itemHeight,
        slideAdaptiveHeight,
        //父层自适应的高度
    slideHeight,
        slideMainHeight,
        winWidth,
        winHeight,
        movingDistance,
        isAutoPlay,
        cacheLength,
        //  循环前的个数
    hasEventInit = false,
        pages,

    //拖动的默认配置
    positionInit,

    // 页面动态加载缓存
    urlCache = {},

    // 记录当前tab是否已经加载
    cacheIndex = [],
        cacheParams = [],
        firstInit = false,
        dragConfig = {
      x: {},
      y: {}
    };
    //滑动兼容处理
    var isTouchPad = /hp-tablet/gi.test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        direction = "",
        lastY = 0,
        lastX = 0,
        isTouchstart = false,
        //解决PC一直触发mousemove事件
    isTouchmove = false,
        touch = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      direction: ""
    };

    try {
      //初始化
      init(param);
    } catch (e) {
      ui.showLog(e);
    }

    /**
     * 初始化方法,用于重新初始化结构,事件只初始化一次
     *  @method init
     *  @param {object} [option] [参数控件本身]
     *  @chainable
     */
    function init(opt) {
      var option = $.extend(true, param, opt);
      if (option.id) {
        $id = ui.obj(option.id);
      } else {
        ui.showLog("slide id不能为空", "bui.slide.init");
        return;
      }

      //option获取新参数使用
      param = module.config = option;

      direction = option.direction;

      option.height = parseFloat(option.height);
      option.width = parseFloat(option.width);

      // 屏幕的宽度
      winWidth = window.viewport.width() || document.documentElement.clientWidth;
      winHeight = window.viewport.height() || document.documentElement.clientHeight;

      // 模板
      option.template && $id.html(option.template() || "");

      //菜单选择器如果传# 代表这个菜单是独立的,可以跟切换的内容分开
      $menu = option.menu.indexOf("#") == 0 ? ui.obj(option.menu) : $id.find(option.menu).eq(0);
      $menuChildren = $menu.children();

      $children = $id.find(option.children).eq(0);
      $childrenParent = $children.parent();

      //单个滚动的内容
      $item = $children.children();
      cacheLength = $item.length;
      // 循环的处理只初始化一次
      if (option.loop && !hasEventInit) {

        var lastItem = $item.eq($item.length - 1).clone(true);
        var firstItem = $item.eq(0).clone(true);

        $children.prepend(lastItem).append(firstItem);
        $item = $children.children();
        var lastIndex = $item.length - 1;

        // 监听动画后的事件
        on("afterto", function (index) {
          if (index == 0) {
            to(lastIndex - 1, "none");
          }
          if (index == lastIndex) {
            to(1, "none");
          }
        });

        to(1, "none");
        var hasLoop = $id.hasClass(".bui-slide-loop");
        !hasLoop && $id.addClass("bui-slide-loop");
      }

      // 跨屏的处理,只初始化一次
      if (option.cross && !hasEventInit) {
        var hasCross = $id.hasClass(".bui-slide-cross");
        !hasCross && $id.addClass("bui-slide-cross");
        on("to", function (index) {
          var prevIndex = index - 1;
          var nextIndex = index + 1;
          var $this = $item.eq(index);

          $this.removeClass("bui-cross-prev").removeClass("bui-cross-next");
          $this.prev().removeClass("bui-cross-next").addClass("bui-cross-prev");
          $this.next().removeClass("bui-cross-prev").addClass("bui-cross-next");
        });
        to(1, "none");
      }

      autoHeight(option);
      //初始化结构
      display();

      isAutoPlay = option.autoplay;
      if (isAutoPlay) {
        // 自动播放
        autoPlay();
      }

      if (!hasEventInit) {
        bind();

        // 第一次加载的时候, 保持 to 事件在autoload 跟普通加载的时候保持一致, 默认第一次不加载
        firstInit = true;
      }

      //初始化index值
      nowIndex = $children.children(".active").length ? $children.children(".active").index() : nowIndex || option.index;
      // 如果有初始值,跳到对应的值
      if (parseInt(option.index) > 0) {
        to(option.index, "none");
      } else {
        // 如果重复使用init初始化,一般采用动画
        to(nowIndex, "none");
      }

      // if( option.autoload ){
      //   loadCurrent(nowIndex);
      // }
      return this;
    }

    // 自动计算main高度
    function autoHeight(option) {
      // 单个焦点图的基本信息是否全屏 offsetTop 会把第一个子元素的margin-top 一起算上
      var $parentPage = $id.parents(".bui-page"),
          $parentMain = $id.parents("main"),
          offsetTop = $id[0] && $id[0].offsetTop || 0,
          $header = $parentPage.children(option.header),
          $headerHeight = $header[0] && $header[0].offsetHeight || 0,
          $footer = $parentPage.children(option.footer),
          $footerHeight = $footer[0] && $footer[0].offsetHeight || 0;

      slideAdaptiveHeight = winHeight - ($headerHeight || 0) - ($footerHeight || 0) - offsetTop;
      slideHeight = option.height == 0 ? slideAdaptiveHeight : option.height;

      // tab内容高度
      // 是否是绝对定位
      var slideHeadPosition = $menu.parent().css("position") == "static" ? $menu.css("position") : $menu.parent().css("position");
      slideMainHeight = $id.find(option.menu).length ? slideHeadPosition == "absolute" || slideHeadPosition == "fixed" ? slideHeight : slideHeight - ($menu[0] && $menu[0].offsetHeight || 0) : slideHeight;
      // 判断是否全屏 或者高度自适应, 高度自适应的话要判断菜单是在结构里面还是外面,里面需要减掉menu的高度 
      fullHeight = option.fullscreen ? winHeight : option.height == 0 ? slideMainHeight : option.height;
      fullWidth = option.fullscreen ? winWidth : option.width || winWidth;

      length = $item.length;

      itemWidth = direction == "x" ? fullWidth / param.visibleNum : fullWidth;
      itemHeight = direction == "y" ? fullHeight / param.visibleNum : fullHeight;

      // 移动多少
      movingDistance = param.direction == "y" ? itemHeight * param.scrollNum : itemWidth * param.scrollNum;

      //滑动的宽度
      innerWidth = fullWidth * length / param.visibleNum;
      innerHeight = fullHeight * length / param.visibleNum;
    }

    function bind() {

      /* 事件绑定
      ------------------------------------
       */
      // //绑定菜单
      // $menuChildren.length && $(document).off("click.bui").on("click.bui",function (e) {
      var transormPage = function transormPage(e) {

        var active = $(this).hasClass("active"),
            index = $(this).index(),
            attrDisabled = $(this).attr("disabled"),
            disabled = $(this).hasClass("disabled") || attrDisabled == "" || attrDisabled == "true" || attrDisabled == "disabled";

        if (!active && !disabled) {

          if (param.animate) {
            //跳转到对应的位置
            to(index);
          } else {
            to(index, "none");
          }

          //添加激活的状态
          addStatus(index);

          if (isAutoPlay) {
            // 如果是自动播放,需要先清除原来的时间重新计算
            autoPlay();
          }
        }
        e.stopPropagation();
      };

      // 如果传id,事件需要绑定在外层
      if (param.menu.indexOf("#") == 0) {
        $menu.on("click.bui", "li", transormPage);
      } else {
        $id.on("click.bui", param.menu + " li", transormPage);
      }

      //绑定左右按钮

      $id.on("click.bui", param.prev, prev);

      $id.on("click.bui", param.next, next);

      var item = param.children + " " + param.item;
      //点击以后的回调 jquery 不支持绑定在选择器上,所以这里多了一个参数用于绑定点击的回调
      // pc 会绑定
      $id.on("click.bui", item, function (e) {

        // var self = this;
        // var item = $(e.target).closest($item);

        trigger.call(module, "click", e);
        param.callback && param.callback.call(module, e, module);
      });

      //绑定拖拽(如果一开始不先绑定事件,在手机调试切换tab的时候,会导致swipe失效,原因不明)
      unlock();
      if (!param.swipe) {
        lock();
      }

      hasEventInit = true;
    }

    //初始化宽高布局
    function display() {

      // 不同方向的滑动配置
      dragConfig = {
        x: {
          swipeDir: "swipeleft",
          swipeDir2: "swiperight",
          width: movingDistance
        },
        y: {
          swipeDir: "swipeup",
          swipeDir2: "swipedown",
          width: movingDistance
        }

        //初始化方向的位置配置
      };positionInit = {
        x: {
          parentInitKey: "width",
          parentInitValue: innerWidth,
          boxCss: "display:-webkit-box;display:box;-webkit-box-align: start;-webkit-box-pack: center;width:100%;",
          boxItemCSS: "-webkit-box-flex:1;box-flex:1;width:" + itemWidth + "px;height:" + itemHeight + "px;"
        },
        y: {
          parentInitKey: "height",
          parentInitValue: innerHeight,
          box: "display:-webkit-box;display:box;-webkit-box-align: start;-webkit-box-pack: center;width:100%;-webkit-box-orient: vertical;box-orient: vertical;",
          boxItemCSS: "-webkit-box-flex:1;box-flex:1;width:" + itemWidth + "px;height:" + itemHeight + "px;"
        }

        //父级宽度
      };$childrenParent[positionInit[direction]["parentInitKey"]](positionInit[direction]["parentInitValue"]);

      var i,
          l = $item.length;

      for (i = 0; i < l; i++) {
        // 外部属性优先原则
        var attrScroll = $item[i].getAttribute("data-scroll");
        var needScroll = attrScroll == null ? param.scroll : attrScroll == "false" ? false : true;

        positionInit[direction]["boxItemCSS"] = positionInit[direction]["boxItemCSS"] + (needScroll ? "overflow:auto;" : "overflow:hidden;");
        $item[i].style.cssText = positionInit[direction]["boxItemCSS"];
      }

      try {
        $children[0].style.cssText = positionInit[direction]["boxCss"];
      } catch (e) {
        console.log("请检查下children参数是否正确.", "bui.slide id:" + param.id);
      }

      // 可视个数大于1的时候,每个的高度要重新计算
      var slideItemHeight = direction == "y" && param.visibleNum > 1 ? slideMainHeight / param.visibleNum : slideMainHeight;
      // 是否需要转换成rem
      var slideHeightRem = param.zoom ? slideHeight / 100 + "rem" : slideHeight + "px",
          slideMainHeightRem = param.zoom ? slideItemHeight / 100 + "rem" : slideItemHeight + "px",
          itemWidthRem = param.zoom ? itemWidth / 100 + "rem" : itemWidth + "px";

      //是否是全屏
      if (param.fullscreen) {
        $("main").css({
          "position": "static"
        });
        $id.addClass('bui-slide-fullscreen').css({
          "position": "absolute",
          "top": 0,
          "left": 0,
          "right": 0,
          "bottom": 0,
          "z-index": 10,
          "overflow": "hidden",
          "width": fullWidth,
          "height": winHeight
        });

        $item.addClass(param.alignClassName || "bui-box-center").css("height", winHeight);
      } else {

        //初始化宽度 宽度默认为全屏,zoom 只设置高度的缩放
        $id.css({
          "position": "relative",
          "overflow": "hidden",
          "width": fullWidth,
          "height": slideHeightRem
        });

        // $childrenParent.height(slideHeight);
        $item.addClass(param.alignClassName).height(slideMainHeightRem);
      }

      // 自动高度,内容撑开
      if (param.autoheight) {
        $id.addClass("bui-slide-autoheight");
      }

      //自动分页
      if (param.autopage) {
        var pages = getPages();
        var initIndex = $children.find(".active").index() + 1;
        var pageHtml = templatePage(pages, initIndex);

        $id.children(".bui-slide-head").remove();

        $id.append(pageHtml);

        $menuChildren = $id.find(param.menu).eq(0).children();
      }
    }

    // 获取分页
    function getPages() {
      var length = $item.length;
      var leftItem = length - param.visibleNum;
      var pages = length % param.scrollNum != 0 ? leftItem + 1 : leftItem / param.scrollNum + 1;
      return pages;
    }

    var scrollLeft, scrollHeight;
    function onstart(e) {
      var targetTouches = e.originalEvent && e.originalEvent.targetTouches || e.targetTouches;

      var point = hasTouch ? targetTouches[0] : e;
      touch.x1 = point.pageX;
      touch.y1 = point.pageY;
      touch.direction = "";

      // 排除掉某个样式
      if (param.stopHandle && ui.unit.checkTargetInclude(e.target, param.stopHandle)) {
        isTouchstart = false;
        return;
      }
      scrollLeft = -nowIndex * movingDistance;
      scrollHeight = -nowIndex * movingDistance;
      // 多手指操作不执行
      if (targetTouches.length > 1 || e.scale && e.scale !== 1) {
        move(direction == "x" ? scrollLeft : scrollHeight);
        return;
      }
      // 如果是自动播放,需要先清除原来的时间重新计算
      if (isAutoPlay) {

        stop();
        // 重新修改自动播放状态
        isAutoPlay = true;
      }

      trigger.call(module, "touchstart", e, touch);

      //开始的时候计算
      param.onStart && param.onStart.call(module, e, touch, module);

      // 导致slide 里面的元素的点击,需要触发2次
      // e.stopPropagation();
      isTouchstart = true;
    }

    function onmove(e) {
      var targetTouches = e.originalEvent && e.originalEvent.targetTouches || e.targetTouches;

      //当屏幕有多个touch或者页面被缩放过，就不执行move操作
      if (targetTouches.length > 1 || e.scale && e.scale !== 1) {
        move(direction == "x" ? scrollLeft : scrollHeight);
        return;
      }
      //当前坐标
      if (!isTouchstart) {
        return;
      }

      var point = hasTouch ? targetTouches[0] : e;
      touch.x2 = point.pageX;
      touch.y2 = point.pageY;

      //第一次下拉的方向
      if (!touch.direction) {
        //方向
        touch.direction = ui.swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
      }
      //阻止默认事件,除了滚动条,解决红米不触发end问题
      if (touch.direction === "swipeleft" || touch.direction === "swiperight") {
        e.preventDefault();
        // 滑动过程中只对左右做冒泡处理, 如果上下也处理,会影响到 pullrefresh
        e.stopPropagation();
      }

      trigger.call(module, "touchmove", e, touch);

      try {
        // 如果是纵向,并且可以滚动的话,需要针对内容滚动触发做处理
        if (direction == "y" && param.scroll) {
          var $itemScroll = $(e.target).closest(".active"),
              itemScrollTop = $itemScroll[0].scrollTop || 0,
              itemScrollHeight = $itemScroll[0].scrollHeight || 0,
              itemHeight = $itemScroll[0].offsetHeight || 0,
              canSwipeDownWithScroll = false,
              canSwipeUpWithScroll = false;

          if (touch.direction === "swipedown" && itemScrollTop > 1) {
            isTouchmove = false;
            return;
          }
          if (touch.direction === "swipeup" && itemScrollHeight - itemScrollTop - itemHeight >= 2) {

            isTouchmove = false;
            return;
          }
        }
      } catch (e) {}

      deltaX = touch.x2 - touch.x1, deltaY = touch.y2 - touch.y1;

      dragConfig["x"]["move"] = scrollLeft + deltaX;
      dragConfig["x"]["absDelta"] = Math.abs(deltaX);

      dragConfig["y"]["move"] = scrollHeight + deltaY;
      dragConfig["y"]["absDelta"] = Math.abs(deltaY);

      var pages = getPages();
      if (touch.direction === dragConfig[direction]["swipeDir"] || touch.direction === dragConfig[direction]["swipeDir2"]) {
        // 延迟显示的滑动
        if (param.delay && dragConfig[direction]["absDelta"] > param.distance) {
          move(dragConfig[direction]["move"], "none");
        }
        //拖动效果马上可见
        if (!param.delay) {
          // 是否在第1页跟最后一页需要缓冲效果
          if (!param.bufferEffect) {
            if (nowIndex == 0 && pages > 1 && (touch.direction == "swipeleft" || touch.direction == "swipeup")) {
              move(dragConfig[direction]["move"], "none");
            } else if (nowIndex == pages - 1 && pages > 1 && (touch.direction == "swiperight" || touch.direction == "swipedown")) {
              move(dragConfig[direction]["move"], "none");
            } else if (nowIndex > 0 && nowIndex < pages - 1 && pages > 1) {
              move(dragConfig[direction]["move"], "none");
            }
          } else {
            move(dragConfig[direction]["move"], "none");
          }

          e.preventDefault();
        }
        //移动过程中计算
        param.onMove && param.onMove.call(module, e, touch, module);
      }

      isTouchmove = true;
    }
    //松开手指以后执行
    function onend(e) {
      trigger.call(module, "touchend", e, touch);
      if (!isTouchmove) {
        return;
      }
      //当前坐标

      deltaX = touch.x2 - touch.x1, deltaY = touch.y2 - touch.y1;

      dragConfig["x"]["delta"] = scrollLeft;
      dragConfig["x"]["absDelta"] = Math.abs(deltaX);

      dragConfig["y"]["delta"] = scrollHeight;
      dragConfig["y"]["absDelta"] = Math.abs(deltaY);

      // 如果是自动播放,需要先清除原来的时间重新计算

      if (dragConfig[direction]["absDelta"] > param.distance) {
        slide.call(this, e, touch, dragConfig);
        //结束的时候回调
        param.onEnd && param.onEnd.call(module, e, touch, module);
      } else if (dragConfig[direction]["absDelta"] < param.distance) {

        move(dragConfig[direction]["delta"]);
      }

      if (isAutoPlay) {
        autoPlay();
      }

      // 防止安卓4.3触发click, 还得防止冒泡导致pullrefresh的下拉刷新不触发end事件
      if (touch.direction == "swipeleft" || touch.direction == "swiperight") {
        e.stopPropagation();
      }
      //保存最后的位置
      lastY = lastY + (touch.y2 - touch.y1);
      lastX = lastX + (touch.x2 - touch.x1);

      touch.lastX = lastX;
      touch.lastY = lastY;
      //清空滑动缓存
      touch = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        direction: ""
      };

      isTouchstart = false;
      isTouchmove = false;

      transitionEnd();
    }

    //水平滚动
    function slide(e, touch, dragConfig) {

      //当前的焦点
      nowIndex = $children.children(".active").index();
      var index;
      if (touch.direction == dragConfig[direction].swipeDir) {
        var length = $item.length;
        var leftItem = length - param.visibleNum;
        var pages = length % param.scrollNum != 0 ? leftItem + 1 : leftItem / param.scrollNum + 1;
        //是否最后一页
        if (nowIndex >= pages - 1) {
          index = nowIndex;

          dragConfig[direction]["delta"] = -index * dragConfig[direction]["width"];
          move(dragConfig[direction]["delta"]);

          nowIndex = index;
          //添加激活的状态
          addStatus(index);

          trigger.call(module, "last", index);
        } else {
          index = nowIndex + 1;

          dragConfig[direction]["delta"] = -index * dragConfig[direction]["width"];
          move(dragConfig[direction]["delta"]);

          nowIndex = index;
          //添加激活的状态
          addStatus(index);

          if (option.autoload) {
            loadCurrent(nowIndex);
          } else {
            var $currentMenu = $item.eq(nowIndex);
            if (option.loop && nowIndex > cacheLength) {
              return;
            }
            trigger.call(module, "to", index);
          }
        }
        trigger.call(module, "next", index);
      } else if (touch.direction == dragConfig[direction].swipeDir2) {

        //是否是第一个
        if (nowIndex > 0) {
          index = nowIndex - 1;

          dragConfig[direction]["delta"] = -index * dragConfig[direction]["width"];
          move(dragConfig[direction]["delta"]);

          nowIndex = index;
          //添加激活的状态
          addStatus(index);

          if (option.autoload) {
            loadCurrent(nowIndex);
          } else {
            var $currentMenu = $item.eq(nowIndex);
            if (option.loop && nowIndex == 0) {
              return;
            }
            trigger.call(module, "to", index);
          }
          trigger.call(module, "prev", index);
        } else {
          index = nowIndex;

          dragConfig[direction]["delta"] = -index * dragConfig[direction]["width"];
          move(dragConfig[direction]["delta"]);

          nowIndex = index;
          //添加激活的状态
          addStatus(index);
          //事件在后面才不会被覆盖
          trigger.call(module, "first", index);
        }
      }
    }

    //位移动画
    function move(width, transition) {
      //默认时间
      var time = param.transition,
          transition = transition || "all " + time + "ms",
          width = width || 0;

      switch (direction) {
        case "x":
          // translateZ(0) 会导致中兴z802t 的下拉一次,上拉滚动加载只请求一次失效
          transform(width + "px", 0, transition, $childrenParent);
          break;
        case "y":
          transform(0, width + "px", transition, $childrenParent);
          break;
      }

      return this;
    }

    function transform(x, y, transition, ele) {

      var yRem = y || 0;
      if (direction == "y" && param.zoom && String(y).indexOf("%") <= -1) {
        yRem = parseInt(y) / 100 + "rem";
      }

      var transition,
          ele = ele || $id,
          //jquery 对象
      x = x || 0,
          xRem = x,
          xVal = String(x).indexOf("%") > -1 ? String(x) : xRem,
          yVal = String(y).indexOf("%") > -1 ? String(y) : yRem;
      if (typeof transition === "number") {
        transition = "all " + transition + "ms";
      } else {
        transition = transition || "all 300ms";
      }
      try {
        // translateZ(0) 会导致中兴z802t 的下拉一次,上拉滚动加载只请求一次失效
        ele.css({
          "-webkit-transition": transition,
          "transition": transition,
          "-webkit-transform": "translate(" + xVal + "," + yVal + ")",
          "transform": "translate(" + xVal + "," + yVal + ")"
        });
      } catch (e) {
        console.log(e.message);
      }
    }

    function transitionEnd(callback) {
      //清除动画过渡时间,下次拉动才不会有延迟现象
      $childrenParent.one('webkitTransitionEnd', function () {

        $childrenParent.css({
          "-webkit-transition": "none",
          "transition": "none"
        });

        callback && callback.call(module, nowIndex);
        trigger.call(module, "afterto", nowIndex);
      });
    }

    /**
     * 跳到第几个
     *  @method to
     *  @param {number} index [索引,从0开始]
     *  @param {string} [transition] [  "all 300ms"(不传则默认) | "none"(不要动画) | "all 300ms ease-out" (可以加上缓冲效果) ]
     *  @chainable
     *  @example 
        
        //跳到第2个
        uiSlide.to(1);
            
     */
    function to(name, transition, needEvent) {

      var index = 0;
      var callback = null;
      var needEvent = needEvent == false ? false : true;
      if (typeof name === "string" && name.indexOf(".html") > -1) {
        var attrs = [];
        $menuChildren.each(function (i, item) {
          var attr = $(item).attr("href") || undefined;
          attrs[i] = attr;
          if (attr == name) {
            index = i;
          }
        });
      } else {
        index = parseInt(name);
      }

      if (typeof transition === "function") {
        callback = transition;
        transition = "";
      }

      var _self = this;

      var movePosition = {
        x: {
          transform: -index * parseFloat(movingDistance)
        },
        y: {
          transform: -index * parseFloat(movingDistance)
        }
      };

      var pages = getPages();
      // 显示可视个数以后,大于最大页数以后不做处理
      if (index >= pages || index < 0) {
        return false;
      }

      move(movePosition[direction]["transform"], transition);

      //更新状态
      nowIndex = index;
      addStatus(index);

      //如果是自动播放为true,跳转以后自动播放要继续
      if (isAutoPlay) {
        autoPlay();
      }

      // 加载远程地址
      if (option.autoload) {
        loadCurrent(nowIndex);
      } else {
        // 初始化的时候,第一次是不触发的
        var $currentMenu = $item.eq(nowIndex);
        if (!needEvent) {
          return;
        }
        trigger.call(module, "to", index);
      }
      // 执行最后的动画
      transitionEnd(callback);
      return this;
    }
    //自动播放
    function autoPlay(time) {
      var time = time || param.interval;

      stop();

      //修改自动播放的状态,在拖拽时时间才会重新计算
      isAutoPlay = true;

      var index = nowIndex;
      interPlay = setInterval(function () {
        var pages = getPages();

        if (index >= 0 && index < pages - 1) {
          index = index + 1;
        } else {
          index = 0;
        }

        to(index);
      }, time);

      trigger.call(module, "play");
    }

    /**
    * 停止自动播放
    *  @method stop
    *  @chainable
    *  @example 
       
       //自动播放
       uiSlide.stop();
           
    */
    function stop(argument) {

      if (interPlay) {
        try {

          window.clearInterval(interPlay);

          //更新自动播放的状态
          isAutoPlay = false;

          trigger.call(module, "stop");
        } catch (e) {}
      }

      return this;
    }

    /**
     * 自动播放
     *  @method start
     *  @param {number} time [重新设置循环时间]
     *  @chainable
     *  @example 
        
        //自动播放
        uiSlide.start();
            
     */
    function start(time) {
      autoPlay(time);
    }

    /**
     * 当前索引
     *  @method index
     *  @since 1.3.0
     *  @chainable
     *  @example 
        
        var index = uiSlide.index();
            
     */
    function index() {

      return nowIndex;
    }
    /**
     * 上一个
     *  @method prev
     *  @chainable
     *  @example 
        
        uiSlide.prev();
            
     */
    function prev() {

      var index = nowIndex - 1;

      if (param.loop && index == -1) {
        index = cacheLength;
      }
      to(index);
      trigger.call(module, "prev", index);

      return this;
    }

    /**
     * 下一个
     *  @method next
     *  @chainable
     *  @example 
        
        uiSlide.next();
            
     */
    function next() {

      var index = nowIndex + 1;

      if (param.loop && index > cacheLength + 1) {
        index = 1;
      }
      to(index);
      trigger.call(module, "next", index);

      return this;
    }

    //添加当前状态
    function addStatus(index) {
      index = index || 0;

      $item.removeClass('active');
      $item.eq(index).addClass('active');

      $menuChildren.removeClass('active');
      $menuChildren.eq(index).addClass('active');
    }

    /**
    * 不允许拖拽
    *  @method lock
    *  @chainable
    *  @example 
       
       uiSlide.lock();
           
    */
    function lock() {

      $id.off("touchstart", onstart).off("touchmove", onmove).off("touchend", onend).off("touchcancel");
      // .off("touchcancel",function () {
      // // 导致UC,微信误操作触发返回第一页
      // //   move( direction == "x"? scrollLeft : scrollHeight );
      // });

      trigger.call(module, "lock");

      return this;
    }

    /**
     * 允许拖拽
     *  @method unlock
     *  @chainable
     *  @example 
        
        uiSlide.unlock();
            
     */
    function unlock(argument) {

      //绑定拖拽
      $id.on("touchstart", onstart).on("touchmove", onmove).on("touchend", onend).on("touchcancel", function () {
        move(direction == "x" ? scrollLeft : scrollHeight);
      });

      trigger.call(module, "unlock");

      return this;
    }

    //自动分页
    function templatePage(data, index) {
      var html = '';
      var index = index || 1;
      var i;
      html += '<div class="bui-slide-head">';
      html += '<ul >';
      for (i = 1; i < Number(data) + 1; i++) {
        html += '<li ' + (i == index ? 'class="active"' : "") + '>' + i + '</li>';
      }
      html += '</ul >';
      html += '</div >';

      return html;
    }

    // 动态加载当前页面
    function loadCurrent(index) {
      var $currentItem = $item.eq(index);
      var $currentMenu = $menuChildren.eq(index);
      var href = $currentMenu.attr("href") || "";

      if (ui.array.compare(index, cacheIndex)) {
        // 如果存在也会触发to事件,但不触发load事件
        trigger.call(module, "to", index, "200");
        return false;
      }

      if (param.autoload) {

        if (href) {
          $.ajax({
            url: href,
            dataType: "html",
            async: param.async,
            success: function success(res, status) {

              $currentItem.html(res);
              // 增加tab缓存
              cacheIndex.push(index);

              trigger.call(module, "load", index, status);

              // 第一次不触发to事件
              !firstInit && trigger.call(module, "to", index, status);
              firstInit = false;
            },
            error: function error(res, status) {
              trigger.call(module, "loadfail", index, status);
            }
          });
        } else {
          // 修复动态加载如果没有href 不触发to 事件问题
          !firstInit && trigger.call(module, "to", index);
          firstInit = false;
        }
      }
    }

    // 增加一个
    function append(len) {
      var id = ui.guid();
      var i,
          len = len || 1;
      var html = '';
      for (i = 0; i < len; i++) {
        html += '<li id="' + id + '" style="-webkit-box-flex:1;box-flex:1;width:' + itemWidth + 'px;height:' + itemHeight + 'px;"></li>';
      }

      $children.append(html);
      // 重新设置宽度
      $item = $children.children();

      var allWidth = itemWidth * $item.length;
      length = $item.length;
      $childrenParent.width(allWidth);
    }
    /**
     * <div class="oui-fluid">
     *   <div class="span12">
     *     <h2>动态加载页面,模拟路由</h2>
     *     <p>由于多页开发,后退不能刷新页面,所以便有这个slide来模拟简单的路由加载, 用于跟多页配合</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.slide_tab_router.html" target="_blank">demo</a></h3>
     *   </div>
     * </div>
     *  @method load
     *  @since 1.4.0
     *  @param {object} [option] [ 页面跳转的地址  ]
     *  @param {string} option.url [ 页面跳转的地址  ]
     *  @param {object} [option.id] [ 页面结果加载到的地方,可选,默认是下一个  ]
     *  @param {boolean} [option.preload] [ 预加载,默认: false 自动跳转到加载的页面 | true, 则不跳转  ]
     *  @param {function} [option.success] [ 成功回调  ]
     *  @param {function} [option.fail] [ 失败回调  ]
     *  @example 
        
        uiTab.load({
          url: "bui.slide_tab_router_page1.html"
        })
            
     */
    function load(option) {
      var _config = {
        id: null,
        url: "",
        preload: false,
        param: {},
        success: null,
        fail: null
      };
      var opt = $.extend(true, {}, _config, option);
      var _self = this,
          url = opt.url || "",
          $id = null,
          index = $item.length ? nowIndex + 1 : 0;

      // 如果有传id,则在对应的ID渲染上内容
      if (opt.id) {
        $id = ui.obj(opt.id);
      } else {
        // 如果有下一个
        var $next = $item.eq(index);
        if ($next.length) {
          $id = $next;
        } else {
          // 动态增加
          append();
          $item = $children.children();
          $id = $item.eq(index);
        }
      }

      if (url) {

        nowIndex = index;
        // 缓存传进来的参数
        cacheParams[index] = opt.param;

        if (url in urlCache) {
          var stat = "cache";

          if (!ui.array.compare(index, cacheIndex)) {
            // 增加tab缓存
            cacheIndex.push(index);
            $id.html(urlCache[url]);
            opt.success && opt.success.call(module, urlCache[url], stat);
            trigger.call(module, "load", urlCache[url], stat);
          }

          // 如果不是预加载,则自动跳过去
          if (!opt.preload) {
            to(index);
          }
        } else {

          $.ajax({
            url: url,
            success: function success(res, status) {
              if (res) {
                // 避免重复加载
                urlCache[url] = res;
                if (!ui.array.compare(index, cacheIndex)) {
                  // 增加tab缓存
                  cacheIndex.push(index);
                  $id.html(urlCache[url]);
                  opt.success && opt.success.call(module, urlCache[url], status);
                  trigger.call(module, "load", res, status);
                }

                // 如果不是预加载,则自动跳过去
                if (!opt.preload) {
                  to(index);
                }
              } else {
                opt.fail && opt.fail.call($id, res, status);
                trigger.call(module, "loadfail", res, status);
              }
            },
            error: function error(res, status) {
              opt.fail && opt.fail.call(module, res, status);
              trigger.call(module, "loadfail", res, status);
            }
          });
        }
      }

      return this;
    }

    // 返回当前页的参数
    function getPageParams(index) {

      var index = typeof index === "number" ? index : nowIndex;

      return cacheParams[index] || {};
    }

    // 返回当前页的参数
    function getActive(index) {

      var $selectItem = $item.eq(nowIndex);

      return $selectItem[0];
    }

    /**
     * [销毁控件]
     *  @method destroy
     *  @since 1.4.2
     *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
     *  @example 
        
        //销毁
        uiSlide.destroy();
        
     */
    function destroy(bool) {
      var bool = bool == true ? true : false;

      stop();

      if ($menu) {
        $menu.off("click.bui");
        bool && $menu.remove();
      }
      if ($id) {
        $id.off();
        bool && $id.remove();
      }

      off("stop");
      off("play");
      off("first");
      off("last");
      off("to");
    }
    /**
     * 获取依赖的控件
     *  @method widget
     *  @param {string} [name] [ 依赖控件名 ]
     *  @example 
        
        //获取依赖控件
        var uiSlideWidget = uiSlide.widget();
        
            
     */
    function widget(name) {
      var control = {};
      return ui.widget.call(control, name);
    }
    /**
     * 获取设置参数
     *  @method option
     *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
     *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
     *  @chainable
     *  @example 
        
        
        //获取所有参数
         //获取所有参数
        var option = uiSlide.option();
          //获取某个参数
        var id = uiSlide.option( "id" );
          //修改一个参数
        uiSlide.option( "autoplay",false );
          //修改多个参数
        uiSlide.option( {"autoplay":false} );
            
     */
    function options(key, value) {

      return ui.option.call(module, key, value);
    }

    /**
     * 为控件绑定事件
     *  @event on
     *  @since 1.3.0
     *  @param {string} [type] [ 事件类型: "play"(播放的时候触发) |"stop"(停止的时候触发) |"first"(在第一个往左边操作的时候触发) | "last"(在最后一个往右边操作的时候触发) | "to"(每次跳转时触发,除了第1次不触发) | "afterto"(每次跳转后触发) | "load"(自动加载远程页面  1.4) ]
     *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
     *  @example 
        
        uiSlide.on("lock",function () {
            // 点击的菜单
            console.log(this);
        });
        
            
     */
    function on(type, callback) {
      ui.on.apply(module, arguments);
      return this;
    }

    /**
     * 为控件取消绑定事件
     *  @event off
     *  @since 1.3.0
     *  @param {string} [type] [ 事件类型: "play"(播放的时候触发) |"stop"(停止的时候触发) |"first"(在第一个往左边操作的时候触发) | "last"(在最后一个往右边操作的时候触发) | "to"(每次跳转时触发,除了第1次不触发) | "afterto"(每次跳转后触发) | "load"(自动加载远程页面 1.4)  ]
     *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
     *  @example 
        
        uiSlide.off("lock");
        
            
     */
    function off(type, callback) {
      ui.off.apply(module, arguments);
      return this;
    }
    /*
     * 触发自定义事件
     */
    function trigger(type) {
      //点击事件本身,或者为空,避免循环引用
      module.self = this == window || this == module ? null : this;

      ui.trigger.apply(module, arguments);
    }
    return module;
  };

  return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
              /**
               * <div class="oui-fluid">
               *   <div class="span8">
               *     <h2>swipe滑动控件</h2>
               *     <p>滑动控件,支持4个方向的滑动, sidebar 跟 listview 都基于swipe控件制作</p>
               *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.swipe.html" target="_blank">demo</a></h3>
               *     <h3>方法说明:</h3>
               * {{#crossLink "bui.swipe/active"}}{{/crossLink}}: 获取当前打开的对象 <br>
               * {{#crossLink "bui.swipe/isActive"}}{{/crossLink}}: 是否打开状态 <br>
               * {{#crossLink "bui.swipe/open"}}{{/crossLink}}: 打开哪个方向的 <br>
               * {{#crossLink "bui.swipe/close"}}{{/crossLink}}: 关闭 <br>
               * {{#crossLink "bui.swipe/lock"}}{{/crossLink}}: 不允许滑动 <br>
               * {{#crossLink "bui.swipe/unlock"}}{{/crossLink}}: 允许滑动 <br>
               *   </div>
               *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.swipe.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-swipe_low.gif" alt="控件预览"/></a></div>
               * </div>
               * 
               *  @namespace bui
               *  @class swipe
               *  @constructor 
               *  @since 1.3.0
               *  @param {object} option  
               *  @param {string} option.id [控件id]  
               *  @param {string} [option.handle] [触发的区域,配合swipe可以滑动触发 ]  
               *  @param {string} [option.swiperight] [触发右滑的目标 ]
               *  @param {string} [option.swipeleft] [触发左滑的目标 ]
               *  @param {string} [option.swipeup] [触发上滑的目标 ] 
               *  @param {string} [option.swipedown] [触发下滑的目标 ] 
               *  @param {number} [option.direction] [ x | y | xy ]
               *  @param {number} [option.width] [ id的宽度, 默认0 即 屏幕宽度 ]
               *  @param {number} [option.height] [id的高度, 默认0 即 屏幕高度 ]
               *  @param {number} [option.movingDistance] [ handle 移动的距离,默认位移280]
               *  @param {number} [option.initDistance] [ handle 初始化的距离,默认0]
               *  @param {boolean} [option.alwaysTrigger] [ 1.3.4增加 默认false; 不管滑动的距离有没有达标,总是触发open或者close事件 ]  
               *  @param {boolean} [option.hasChild] [ swipe下面有多个swipe的时候为true ]  
               *  @param {boolean} [option.handleMove] [ handle是否需要移动 默认 true | false]  
               *  @param {boolean} [option.targetMove] [ target是否需要移动 默认 true | false]  
               *  @param {boolean} [option.zoom] [ 是否缩放 默认 false | true]  
               *  @param {number} [option.distance] [ 默认40, 拖拽大于distance才会生效,配合delay可以防止slide又有上下其它事件 ]  
               *  @param {number} [option.transition] [ 默认300, 滑动动画的过渡时长 ]  
               *  @example
               *
              
                
                  html: 
              
                   <div id="sidebarWrap" class="wrap">
                     <div class="swipeleft">往左滑动出现的内容</div>
                     <div class="bui-page">滑动区域</div>
                   </div>  
              
                  js: 
                  var uiSwipe = bui.swipe({
                            id: "#sidebarWrap",
                            handle: ".bui-page",
                            movingDistance: 200,
                            direction: "xy",
                        });
              
               *
               */

              ui.swipe = function () {
                            // 缓存注册的方向控件
                            var touches = [],

                            // 当前激活的对象,只有hasChild为true才会在这里增加
                            activeUI = null,
                                $target = null;

                            return function (option) {
                                          var config = {
                                                        id: "",
                                                        handle: ".handle",
                                                        swiperight: ".swiperight",
                                                        swipeleft: ".swipeleft",
                                                        swipeup: ".swipeup",
                                                        swipedown: ".swipedown",
                                                        direction: "x",
                                                        stopHandle: "",
                                                        hasChild: false,
                                                        handleMove: true,
                                                        targetMove: true,
                                                        alwaysTrigger: false,
                                                        width: 0,
                                                        height: 0,
                                                        movingDistance: 280,
                                                        initDistance: 0,
                                                        zoom: false,
                                                        distance: 40,
                                                        transition: 300
                                          };

                                          //方法
                                          var module = {
                                                        handle: {},
                                                        active: active,
                                                        isActive: isOpen,
                                                        on: on,
                                                        off: off,
                                                        close: close,
                                                        open: open,
                                                        destroy: destroy,
                                                        lock: lock,
                                                        unlock: unlock,
                                                        init: init
                                          };

                                          //用于option方法的设置参数
                                          var param = module.config = $.extend(true, {}, config, ui.config.swipe, option);
                                          var $id,
                                              el,
                                              $menu,
                                              $handle,
                                              $parent,
                                              touch = {},
                                              //保存拖拽的坐标
                                          menuWidth,
                                              menuRemWidth,

                                          // 注册的方向
                                          direction = param.direction,
                                              winWidth,
                                              winHeight,
                                              handlers = {},
                                              $hasHandle,
                                              $swipeLeft,
                                              $swipeRight,
                                              $swipeUp,
                                              $swipeDown,

                                          //自定义位移
                                          hasLeftWidth,
                                              hasRightWidth,
                                              hasUpWidth,
                                              hasDownWidth,
                                              hasChild = param.hasChild,
                                              movingDistance,

                                          // 初始化状态
                                          displayStatus = false,
                                              canSwipeRight = false,
                                              canSwipeLeft = false,
                                              canSwipeUp = false,
                                              canSwipeDown = false,
                                              swipeLeftActive = false,
                                              swipeRightActive = false,
                                              swipeDownActive = false,
                                              swipeUpActive = false,
                                              handleMove = param.handleMove,
                                              targetMove = param.targetMove,
                                              hasEventInit = false,
                                              openTarget = null,
                                              openHandle = null,
                                              isDestroy = false,
                                              isActive = false;
                                          //滑动兼容处理
                                          var isTouchPad = /hp-tablet/gi.test(navigator.appVersion),
                                              hasTouch = 'ontouchstart' in window && !isTouchPad,
                                              lastY = 0,
                                              lastX = 0,
                                              isTouchstart = false,
                                              //解决PC一直触发mousemove事件
                                          isTouchmove = false,
                                              touch = {
                                                        x1: 0,
                                                        x2: 0,
                                                        y1: 0,
                                                        y2: 0,
                                                        direction: "",
                                                        deltax: 0,
                                                        movingleft: 0,
                                                        movingright: 0,
                                                        movingup: 0,
                                                        movingdown: 0
                                          },
                                              firstDir = '',
                                              initDistance = param.initDistance,
                                              doc = document,
                                              docElement = doc.documentElement;

                                          //初始化
                                          init(param);

                                          // 控件注册
                                          function init(opt) {
                                                        var option = $.extend(true, param, opt);
                                                        isDestroy = false;

                                                        if (option.id) {
                                                                      $id = ui.obj(option.id);
                                                        } else {
                                                                      ui.showLog("swipe id不能为空", "bui.swipe.init");
                                                                      return;
                                                        }

                                                        // var canGoOn = register(option.id,"swipe");

                                                        // if( !canGoOn ){
                                                        //   return;
                                                        // }
                                                        // 屏幕的宽度
                                                        winWidth = option.width > 0 ? option.width : docElement.clientWidth;
                                                        winHeight = option.height > 0 ? option.height : docElement.clientHeight;

                                                        // 没有子集的操作
                                                        $handle = $id.children(option.handle);
                                                        $parent = hasChild ? $id.children() : $id;

                                                        // 定位滑动的目标,要求是在操作的元素的腹肌
                                                        $swipeLeft = $parent.children(option.swipeleft);
                                                        $swipeRight = $parent.children(option.swiperight);
                                                        $swipeUp = $parent.children(option.swipeup);
                                                        $swipeDown = $parent.children(option.swipedown);

                                                        movingDistance = parseFloat(option.movingDistance);
                                                        menuWidth = movingDistance;

                                                        // 检测滑动的方向
                                                        checkSwipeDirection();

                                                        if (!displayStatus) {
                                                                      // 初始化位置
                                                                      display(option);

                                                                      displayStatus = true;
                                                        }

                                                        // 如果有激活,重新加载的时候,需要先关闭掉
                                                        activeUI && activeUI.close();

                                                        if (!hasEventInit) {
                                                                      //绑定拖拽事件
                                                                      bind();
                                                        }

                                                        return this;
                                          }

                                          //初始化显示的状态
                                          function display(option) {
                                                        // 修复部分手机的宽度100%会导致横向滚动条
                                                        $parent.css({
                                                                      "width": winWidth,
                                                                      // "height": winHeight,
                                                                      "position": "relative",
                                                                      "overflow": "hidden"
                                                        });

                                                        // 如果不是有多个的时候,默认父级高度等于屏幕高度
                                                        !hasChild && $parent.css({
                                                                      "height": winHeight
                                                        });

                                                        $handle.css({
                                                                      "position": "relative",
                                                                      "z-index": 10
                                                                      //"height": winHeight
                                                        });

                                                        // 获取自定义movingDistance

                                                        try {

                                                                      var hasLeftWidth = $swipeLeft.attr("data-moving") || movingDistance,
                                                                          hasRightWidth = $swipeRight.attr("data-moving") || movingDistance,
                                                                          hasUpWidth = $swipeUp.attr("data-moving") || movingDistance,
                                                                          hasDownWidth = $swipeDown.attr("data-moving") || movingDistance,
                                                                          hasLeftRemWidth = getRemWidth(hasLeftWidth),
                                                                          hasRightRemWidth = getRemWidth(hasRightWidth),
                                                                          hasUpRemWidth = getRemWidth(hasUpWidth),
                                                                          hasDownRemWidth = getRemWidth(hasDownWidth);

                                                                      canSwipeLeft && $swipeLeft.css({
                                                                                    "width": hasLeftRemWidth
                                                                      });
                                                                      canSwipeRight && $swipeRight.css({
                                                                                    "width": hasRightRemWidth
                                                                      });
                                                                      canSwipeDown && $swipeDown.css({
                                                                                    "height": hasDownRemWidth
                                                                      });
                                                                      canSwipeUp && $swipeUp.css({
                                                                                    "height": hasUpRemWidth
                                                                      });
                                                        } catch (e) {}
                                          }

                                          // 获取缩放后的值
                                          function getRemWidth(num) {
                                                        var val = param.zoom ? num / 100 + 'rem' : num + 'px';

                                                        return val;
                                          }

                                          // 检测是否能够滑动
                                          function checkSwipeDirection() {

                                                        // 能否右滑
                                                        if (direction == "x") {
                                                                      canSwipeRight = !!$swipeRight.length;
                                                                      // 能否左滑
                                                                      canSwipeLeft = !!$swipeLeft.length;
                                                        } else if (direction == "y") {
                                                                      // 能否下滑
                                                                      canSwipeDown = !!$swipeDown.length;
                                                                      // 能否上滑
                                                                      canSwipeUp = !!$swipeUp.length;
                                                        } else if (direction == "xy") {

                                                                      // 全部方向
                                                                      canSwipeDown = !!$swipeDown.length;
                                                                      canSwipeUp = !!$swipeUp.length;
                                                                      canSwipeLeft = !!$swipeLeft.length;
                                                                      canSwipeRight = !!$swipeRight.length;
                                                        }
                                          }
                                          var displayIndexs = [];
                                          var targetScrollTop = 0;
                                          var scrollTopNum = 0;
                                          function onstart(e) {
                                                        var targetTouches = e.originalEvent && e.originalEvent.targetTouches || e.targetTouches;

                                                        //当屏幕有多个touch或者页面被缩放过，就不执行move操作
                                                        if (targetTouches.length > 1 || e.scale && e.scale !== 1) {
                                                                      isTouchstart = false;
                                                                      return;
                                                        }
                                                        // 排除掉某个样式
                                                        if (param.stopHandle && ui.unit.checkTargetInclude(e.target, param.stopHandle)) {
                                                                      isTouchstart = false;
                                                                      return;
                                                        }
                                                        var point = hasTouch ? targetTouches[0] : e;
                                                        touch.id = param.id;
                                                        touch.x1 = point.pageX;
                                                        touch.y1 = point.pageY;
                                                        touch.direction = "", $hasHandle = $(e.target).closest(param.handle);

                                                        // 触发touchstart
                                                        trigger.call(module, "touchstart", e, touch);

                                                        // 拖拽的区域是否有滚动条
                                                        scrollTopNum = $hasHandle.scrollTop();

                                                        // 针对有多个handle的情况 listview
                                                        if (hasChild && !isActive) {
                                                                      $handle = $hasHandle;
                                                                      $parent = $handle.parent();

                                                                      // 定位滑动的目标,要求是在操作的元素的腹肌
                                                                      $swipeLeft = $parent.children(param.swipeleft);
                                                                      $swipeRight = $parent.children(param.swiperight);
                                                                      $swipeUp = $parent.children(param.swipeup);
                                                                      $swipeDown = $parent.children(param.swipedown);

                                                                      // 检测是否能够滑动
                                                                      checkSwipeDirection();

                                                                      // 重新初始化位置一次
                                                                      var index = $parent.index();
                                                                      // 如果缓存,会导致下次初始化可能反而出现问题,所以这里每次都重新操作
                                                                      // if( !displayIndexs[index] ){
                                                                      // 重新初始化位置
                                                                      display(param);

                                                                      // 在没有给li或者传height的时候,动态设置每行的高度,动态设置高度会导致按下去的时候有轻微跳动
                                                                      (param.height == 0 || $parent[0].style.height == "") && $parent.height($hasHandle[0].offsetHeight);
                                                                      // displayIndexs[index] = true;
                                                                      // }
                                                        }

                                                        // 缓存自定义的位移记录传给move;
                                                        touch.movingleft = parseInt($swipeLeft.attr("data-moving") || movingDistance);
                                                        touch.movingright = parseInt($swipeRight.attr("data-moving") || movingDistance);
                                                        touch.movingup = parseInt($swipeUp.attr("data-moving") || movingDistance);
                                                        touch.movingdown = parseInt($swipeDown.attr("data-moving") || movingDistance);

                                                        // 能否下一步
                                                        if ($hasHandle.length) {
                                                                      var next = false;
                                                                      switch (direction) {
                                                                                    case "x":
                                                                                                  next = canSwipeLeft || canSwipeRight ? true : false;
                                                                                                  break;
                                                                                    case "y":
                                                                                                  next = canSwipeUp || canSwipeDown ? true : false;
                                                                                                  break;
                                                                                    case "xy":
                                                                                                  next = canSwipeLeft || canSwipeRight || canSwipeUp || canSwipeDown ? true : false;
                                                                                                  break;

                                                                      }
                                                        }

                                                        //每个回调可以控制返回是否继续下一步操作, 返回false则无法继续下一步
                                                        isTouchstart = next == undefined || next == true ? true : false;
                                          }

                                          function onmove(e) {
                                                        var targetTouches = e.originalEvent && e.originalEvent.targetTouches || e.targetTouches;

                                                        //当屏幕有多个touch或者页面被缩放过，就不执行move操作
                                                        if (targetTouches.length > 1 || e.scale && e.scale !== 1) {

                                                                      swipeActiveClose();

                                                                      return;
                                                        }
                                                        var point = hasTouch ? targetTouches[0] : e;
                                                        touch.x2 = point.pageX;
                                                        touch.y2 = point.pageY;

                                                        trigger.call(module, "touchmove", e, touch);

                                                        // 如果swipe 的 child 激活,不要触发父层的其它swipe
                                                        activeUI && e.stopPropagation();

                                                        if (!isTouchstart) {
                                                                      return;
                                                        }

                                                        // 阻止微信的浏览器下拉事件
                                                        if (touch.y2 - touch.y1 > 0 && scrollTopNum <= 0) {
                                                                      e.preventDefault();
                                                        }

                                                        //第一次下拉的方向
                                                        if (!touch.direction) {
                                                                      //方向
                                                                      touch.direction = ui.swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
                                                        }

                                                        //阻止默认事件,除了滚动条,解决红米不触发end问题,也可以解决低端手机滑动过程感觉卡顿问题
                                                        if (touch.direction === "swipeleft" || touch.direction === "swiperight") {
                                                                      e.preventDefault();
                                                        }

                                                        try {
                                                                      if (touch.direction === "swipeup" || touch.direction === "swipedown") {
                                                                                    var idScrollTop = $id[0].scrollTop || 0,
                                                                                        idScrollHeight = $id[0].scrollHeight || 0,
                                                                                        handleScrollTop = $hasHandle[0].scrollTop || 0,
                                                                                        handleScrollHeight = $hasHandle[0].scrollHeight || 0,
                                                                                        targetScrollTop = $(e.target)[0].scrollTop || 0,
                                                                                        targetHeight = e.target.offsetHeight || 0,
                                                                                        targetScrollHeight = e.target.scrollHeight || 0,
                                                                                        canSwipeDownWithScroll = false,
                                                                                        canSwipeUpWithScroll = false;

                                                                                    if (idScrollTop == 0 && handleScrollTop == 0 && targetScrollTop == 0) {
                                                                                                  canSwipeDownWithScroll = true;
                                                                                    }

                                                                                    // 2 为误差值
                                                                                    if (targetScrollHeight - targetScrollTop - targetHeight <= 2) {
                                                                                                  canSwipeUpWithScroll = true;
                                                                                    }
                                                                      }
                                                        } catch (e) {}

                                                        var deltaX = touch.direction == "swiperight" || touch.direction == "swipeleft" ? touch.x2 - touch.x1 : touch.y2 - touch.y1;
                                                        var targetDeltax = 0;
                                                        touch.deltax = isActive ? Math.abs(deltaX) : Math.abs(deltaX) + initDistance;

                                                        // 打开 swiperight && swipedown 一样的计算方式 swipeleft && swipeup 一样的计算方式
                                                        if (canSwipeRight && touch.direction == "swiperight" && !swipeRightActive && !isActive && !$target) {
                                                                      // -> swiperight 打开
                                                                      menuWidth = touch.movingright;
                                                                      // 负数 -> 0 的转变
                                                                      targetDeltax = movingNegativeToZero(touch, touch.movingright);
                                                                      // 负数 -> 0
                                                                      targetMove && move(targetDeltax, 0, "none", $swipeRight);
                                                                      // 0 -> 正数
                                                                      handleMove && move(touch.deltax, 0, "none", $handle);

                                                                      trigger.call(module, "movingright", e, touch);

                                                                      isTouchmove = true;
                                                                      e.stopPropagation();
                                                        } else if (canSwipeDownWithScroll && canSwipeDown && touch.direction == "swipedown" && !swipeDownActive && !isActive && !$target) {
                                                                      // -> swipedown 打开
                                                                      menuWidth = touch.movingdown;
                                                                      // 
                                                                      // 负数 -> 0 的转变
                                                                      targetDeltax = movingNegativeToZero(touch, touch.movingdown);
                                                                      // 负数 -> 0
                                                                      targetMove && move(0, targetDeltax, "none", $swipeDown);
                                                                      // 0 -> 正数
                                                                      handleMove && move(0, touch.deltax, "none", $handle);

                                                                      trigger.call(module, "movingdown", e, touch);

                                                                      isTouchmove = true;

                                                                      e.preventDefault();

                                                                      e.stopPropagation();
                                                        } else if (canSwipeLeft && touch.direction == "swipeleft" && !swipeLeftActive && !isActive && !$target) {
                                                                      // -> swipeleft 打开
                                                                      menuWidth = touch.movingleft;

                                                                      // 正数 -> 0 的转变
                                                                      targetDeltax = movingPlusToZero(touch, touch.movingleft);
                                                                      // 正数 -> 0
                                                                      targetMove && move(targetDeltax, 0, "none", $swipeLeft);
                                                                      // 0 -> 负数
                                                                      handleMove && move(-touch.deltax, 0, "none", $handle);

                                                                      trigger.call(module, "movingleft", e, touch);

                                                                      isTouchmove = true;
                                                                      e.stopPropagation();
                                                        } else if (canSwipeUpWithScroll && canSwipeUp && touch.direction == "swipeup" && !swipeUpActive && !isActive && !$target) {
                                                                      // -> swipeup 打开
                                                                      menuWidth = touch.movingup;

                                                                      // 正数 -> 0 的转变
                                                                      targetDeltax = movingPlusToZero(touch, touch.movingup);
                                                                      // 正数 -> 0
                                                                      targetMove && move(0, targetDeltax, "none", $swipeUp);
                                                                      // 0 -> 负数
                                                                      handleMove && move(0, -touch.deltax, "none", $handle);

                                                                      trigger.call(module, "movingup", e, touch);

                                                                      isTouchmove = true;

                                                                      e.preventDefault();
                                                                      e.stopPropagation();
                                                        } else if (touch.direction == "swipeleft" && swipeRightActive) {
                                                                      // swipeleft <- 关闭
                                                                      menuWidth = touch.movingright;
                                                                      // 负数 -> 0 的转变
                                                                      targetDeltax = movingNegativeToZero(touch, touch.movingright);
                                                                      // 0 -> 负数 的转变
                                                                      targetMove && move(-touch.deltax, 0, "none", $target || $swipeRight);
                                                                      // 正数 -> 0 的转变
                                                                      handleMove && move(-targetDeltax, 0, "none", $handle);

                                                                      trigger.call(module, "movingleft", e, touch);

                                                                      isTouchmove = true;
                                                                      e.stopPropagation();
                                                        } else if (touch.direction == "swipeup" && swipeDownActive) {
                                                                      // swipeup <- 关闭
                                                                      menuWidth = touch.movingdown;
                                                                      // 负数 -> 0 的转变
                                                                      targetDeltax = movingNegativeToZero(touch, touch.movingdown);
                                                                      // 0 -> 负数 的转变
                                                                      targetMove && move(0, -touch.deltax, "none", $target || $swipeDown);
                                                                      // 正数 -> 0 的转变
                                                                      handleMove && move(0, -targetDeltax, "none", $handle);

                                                                      trigger.call(module, "movingup", e, touch);

                                                                      isTouchmove = true;
                                                                      e.preventDefault();

                                                                      e.stopPropagation();
                                                        } else if (touch.direction == "swiperight" && swipeLeftActive) {
                                                                      // swiperight <- 关闭

                                                                      menuWidth = touch.movingleft;
                                                                      // 负数 -> 0 的转变
                                                                      targetDeltax = movingNegativeToZero(touch, touch.movingleft);

                                                                      targetMove && move(touch.deltax, 0, "none", $target || $swipeLeft);
                                                                      handleMove && move(targetDeltax, 0, "none", $handle);

                                                                      trigger.call(module, "movingright", e, touch);

                                                                      isTouchmove = true;
                                                                      e.stopPropagation();
                                                        } else if (touch.direction == "swipedown" && swipeUpActive) {
                                                                      // swipedown <- 关闭
                                                                      menuWidth = touch.movingup;
                                                                      // 负数 -> 0 的转变
                                                                      targetDeltax = movingNegativeToZero(touch, touch.movingup);

                                                                      targetMove && move(0, touch.deltax, "none", $target || $swipeUp);
                                                                      handleMove && move(0, targetDeltax, "none", $handle);

                                                                      trigger.call(module, "movingdown", e, touch);

                                                                      isTouchmove = true;

                                                                      e.preventDefault();
                                                                      e.stopPropagation();
                                                        }
                                          }

                                          function onend(e) {
                                                        trigger.call(module, "touchend", e, touch);

                                                        if (!isTouchmove) {
                                                                      return;
                                                        }

                                                        // var moveX = (direction == "x" ) ? Math.abs(touch.x2-touch.x1) : Math.abs(touch.y2-touch.y1);
                                                        var moveX = touch.direction == "swiperight" || touch.direction == "swipeleft" ? Math.abs(touch.x2 - touch.x1) : Math.abs(touch.y2 - touch.y1);

                                                        if (canSwipeRight && touch.direction == "swiperight" && moveX > param.distance && !swipeRightActive && !isActive) {
                                                                      // console.log("swiperight")
                                                                      swipeRightOpen();
                                                                      trigger.call(module, touch.direction, e, touch);
                                                                      trigger.call(module, "open", touch.direction);
                                                        } else if (canSwipeLeft && touch.direction == "swipeleft" && moveX > param.distance && !swipeLeftActive && !isActive) {
                                                                      // console.log("swipeleft")
                                                                      swipeLeftOpen();
                                                                      trigger.call(module, touch.direction, e, touch);
                                                                      trigger.call(module, "open", touch.direction);
                                                        } else if (canSwipeUp && touch.direction == "swipeup" && moveX > param.distance && !swipeUpActive && !isActive) {
                                                                      // console.log("swipeup")
                                                                      swipeUpOpen();
                                                                      trigger.call(module, touch.direction, e, touch);
                                                                      trigger.call(module, "open", touch.direction);
                                                        } else if (canSwipeDown && touch.direction == "swipedown" && moveX > param.distance && !swipeDownActive && !isActive) {
                                                                      // console.log("swipedown")
                                                                      swipeDownOpen();
                                                                      trigger.call(module, touch.direction, e, touch);
                                                                      trigger.call(module, "open", touch.direction);
                                                        } else if (isActive && moveX < param.distance) {
                                                                      canSwipeLeft && swipeLeftActive && swipeLeftOpen();
                                                                      canSwipeRight && swipeRightActive && swipeRightOpen();
                                                                      canSwipeUp && swipeUpActive && swipeUpOpen();
                                                                      canSwipeDown && swipeDownActive && swipeDownOpen();

                                                                      trigger.call(module, touch.direction, e, touch);
                                                                      param.alwaysTrigger && trigger.call(module, "open", touch.direction);
                                                        } else if (isActive && moveX > param.distance) {
                                                                      canSwipeLeft && swipeLeftActive && swipeLeftClose();
                                                                      canSwipeRight && swipeRightActive && swipeRightClose();
                                                                      canSwipeUp && swipeUpActive && swipeUpClose();
                                                                      canSwipeDown && swipeDownActive && swipeDownClose();

                                                                      trigger.call(module, touch.direction, e, touch);
                                                                      trigger.call(module, "close", touch.direction);
                                                        } else if (!isActive && moveX < param.distance) {
                                                                      touch.direction === "swipeleft" && canSwipeLeft && !swipeLeftActive && swipeLeftClose();
                                                                      touch.direction === "swiperight" && canSwipeRight && !swipeRightActive && swipeRightClose();
                                                                      touch.direction === "swipeup" && canSwipeUp && !swipeUpActive && swipeUpClose();
                                                                      touch.direction === "swipedown" && canSwipeDown && !swipeDownActive && swipeDownClose();

                                                                      param.alwaysTrigger && trigger.call(module, "close", touch.direction);
                                                                      trigger.call(module, touch.direction, e, touch);
                                                        }

                                                        isTouchstart = false;
                                                        isTouchmove = false;
                                                        e.stopPropagation();
                                          }

                                          // 负数 -> 0 的转变
                                          function movingNegativeToZero(touch, distance) {
                                                        var targetDeltax = -distance + touch.deltax;
                                                        targetDeltax = targetDeltax > 0 ? 0 : targetDeltax;

                                                        return targetDeltax;
                                          }
                                          // 正数 -> 0 的转变
                                          function movingPlusToZero(touch, distance) {
                                                        var targetDeltax = distance - touch.deltax;
                                                        targetDeltax = targetDeltax > distance ? distance : targetDeltax;

                                                        return targetDeltax;
                                          }

                                          // 右边菜单,左滑出来
                                          function swipeLeftOpen(opt) {
                                                        opt = opt || {};
                                                        opt.transition = opt.transition || param.transition;
                                                        opt.target = opt.target || $swipeLeft;
                                                        opt.handle = opt.handle || $handle;

                                                        // 先关闭
                                                        activeUI && activeUI.close();

                                                        // 再设置当前激活状态
                                                        isActive = true;
                                                        swipeLeftActive = true;

                                                        if (hasChild) {
                                                                      activeUI = module;
                                                                      $target = $swipeLeft;
                                                                      // 所有事件先关闭一次
                                                                      docElement.addEventListener("click", handleClose, true);
                                                        }

                                                        targetMove && move(0, 0, opt.transition, opt.target);
                                                        handleMove && move(-menuWidth, 0, opt.transition, opt.handle);
                                          }
                                          // 左边菜单,右滑出来
                                          function swipeRightOpen(opt) {
                                                        opt = opt || {};
                                                        opt.transition = opt.transition || param.transition;
                                                        opt.target = opt.target || $swipeRight;
                                                        opt.handle = opt.handle || $handle;

                                                        activeUI && activeUI.close();
                                                        isActive = true;
                                                        swipeRightActive = true;

                                                        if (hasChild) {
                                                                      activeUI = module;
                                                                      $target = $swipeRight;

                                                                      // 所有事件先关闭一次
                                                                      docElement.addEventListener("click", handleClose, true);
                                                        }

                                                        targetMove && move(0, 0, opt.transition, opt.target);
                                                        handleMove && move(menuWidth, 0, opt.transition, opt.handle);
                                          }
                                          function swipeUpOpen(opt) {
                                                        opt = opt || {};
                                                        opt.transition = opt.transition || param.transition;
                                                        opt.target = opt.target || $swipeUp;
                                                        opt.handle = opt.handle || $handle;
                                                        activeUI && activeUI.close();
                                                        isActive = true;
                                                        swipeUpActive = true;

                                                        if (hasChild) {
                                                                      activeUI = module;
                                                                      $target = $swipeUp;

                                                                      // 所有事件先关闭一次
                                                                      docElement.addEventListener("click", handleClose, true);
                                                        }

                                                        targetMove && move(0, 0, opt.transition, opt.target);
                                                        handleMove && move(0, -menuWidth, opt.transition, opt.handle);
                                          }
                                          // 左边菜单,右滑出来
                                          function swipeDownOpen(opt) {
                                                        opt = opt || {};
                                                        opt.transition = opt.transition || param.transition;
                                                        opt.target = opt.target || $swipeDown;
                                                        opt.handle = opt.handle || $handle;
                                                        activeUI && activeUI.close();
                                                        isActive = true;
                                                        swipeDownActive = true;

                                                        if (hasChild) {
                                                                      activeUI = module;
                                                                      $target = $swipeDown;

                                                                      // 所有事件先关闭一次
                                                                      docElement.addEventListener("click", handleClose, true);
                                                        }

                                                        targetMove && move(0, 0, opt.transition, opt.target);
                                                        handleMove && move(0, menuWidth, opt.transition, opt.handle);
                                          }
                                          // 右边边菜单,右滑关闭
                                          function swipeRightClose(opt) {
                                                        opt = opt || {};
                                                        opt.transition = opt.transition || param.transition;
                                                        // opt.target = openTarget || $swipeRight;
                                                        opt.target = $swipeRight;
                                                        opt.handle = openHandle || $handle;

                                                        isActive = false;
                                                        swipeRightActive = false;
                                                        if (hasChild) {
                                                                      activeUI = null;
                                                                      $target = null;
                                                                      openTarget = null;
                                                                      openHandle = null;
                                                                      // 所有事件先关闭一次
                                                                      docElement.removeEventListener("click", handleClose, true);
                                                        }
                                                        // 加了1个像素修正
                                                        targetMove && move(-(menuWidth + 1), 0, opt.transition, opt.target);
                                                        handleMove && move(initDistance, 0, opt.transition, opt.handle);
                                          }
                                          // 左边菜单,左滑关闭
                                          function swipeLeftClose(opt) {
                                                        opt = opt || {};
                                                        opt.transition = opt.transition || param.transition;
                                                        // 通过open 方法打开的对象或者通过滑动打开
                                                        // opt.target = openTarget || $swipeLeft;
                                                        opt.target = $swipeLeft;
                                                        opt.handle = openHandle || $handle;

                                                        isActive = false;
                                                        swipeLeftActive = false;
                                                        if (hasChild) {
                                                                      activeUI = null;
                                                                      $target = null;

                                                                      openTarget = null;
                                                                      openHandle = null;
                                                                      // 所有事件先关闭一次
                                                                      docElement.removeEventListener("click", handleClose, true);
                                                        }

                                                        // 菜单在右边如果是以rem单位,100%会导致能看到小小误差
                                                        targetMove && move("101%", 0, opt.transition, opt.target);
                                                        handleMove && move(-initDistance, 0, opt.transition, opt.handle);
                                          }
                                          // 右边边菜单,右滑关闭
                                          function swipeUpClose(opt) {
                                                        opt = opt || {};
                                                        opt.transition = opt.transition || param.transition;
                                                        // opt.target = openTarget || $swipeUp;
                                                        opt.target = $swipeUp;
                                                        opt.handle = openHandle || $handle;

                                                        isActive = false;
                                                        swipeUpActive = false;
                                                        if (hasChild) {
                                                                      activeUI = null;
                                                                      $target = null;
                                                                      openTarget = null;
                                                                      openHandle = null;
                                                                      // 所有事件先关闭一次
                                                                      docElement.removeEventListener("click", handleClose, true);
                                                        }

                                                        targetMove && move(0, "100%", opt.transition, opt.target);
                                                        handleMove && move(0, -initDistance, opt.transition, opt.handle);
                                          }
                                          // 左边菜单,左滑关闭
                                          function swipeDownClose(opt) {
                                                        opt = opt || {};
                                                        opt.transition = opt.transition || param.transition;
                                                        // opt.target = openTarget || $swipeDown;
                                                        opt.target = $swipeDown;
                                                        opt.handle = openHandle || $handle;

                                                        isActive = false;
                                                        swipeDownActive = false;
                                                        if (hasChild) {
                                                                      activeUI = null;
                                                                      $target = null;
                                                                      openTarget = null;
                                                                      openHandle = null;
                                                                      // 所有事件先关闭一次
                                                                      docElement.removeEventListener("click", handleClose, true);
                                                        }
                                                        targetMove && move(0, -menuWidth, opt.transition, opt.target);
                                                        handleMove && move(0, initDistance, opt.transition, opt.handle);
                                          }

                                          // 不符合条件时全部还原
                                          function swipeActiveClose() {
                                                        swipeRightActive && swipeRightClose();
                                                        swipeLeftActive && swipeLeftClose();
                                                        swipeDownActive && swipeDownClose();
                                                        swipeUpActive && swipeUpClose();

                                                        trigger.call(module, "close");
                                          }
                                          /**
                                            * 关闭侧滑栏
                                            *  @method close
                                            *  @chainable
                                            *  @example 
                                               
                                               //关闭所有侧滑
                                               uiSwipe.close();
                                                   
                                            */
                                          function close() {
                                                        if (isDestroy) {
                                                                      return;
                                                        }
                                                        swipeActiveClose();

                                                        return this;
                                          }
                                          /**
                                            * 打开侧滑
                                            *  @method open
                                            *  @param {object} option  
                                            *  @param {string} [option.target] [打开侧滑的方向, 默认: "swiperight"(在左边的菜单) | "swipeleft"(在右边的菜单) | "swipeup"(在下边的菜单) | "swipedown"(在上边的菜单)]  
                                            *  @param {string} [option.index] [打开第几个侧滑 ]
                                            *  @param {string} [option.transition] [打开是否需要动画, 默认 300 毫秒, 不需要动画则设置为 "none" ]  
                                            *  @chainable
                                            *  @example 
                                               
                                               //显示菜单
                                               uiSwipe.open();
                                                 uiSwipe.open({
                                                 "target":"swipedown",
                                                 "transition": "none"
                                               });
                                                     
                                            */
                                          function open(opt) {
                                                        if (isDestroy) {
                                                                      return;
                                                        }
                                                        var option = opt || {};
                                                        option.transition = option.transition || param.transition;
                                                        // target 的index
                                                        option.index = option.index || 0;
                                                        var dir = option.target,

                                                        // handle 的index 根据是否存在target 而来
                                                        index;

                                                        switch (dir) {
                                                                      case "swiperight":
                                                                                    option.target = $swipeRight.eq(option.index);
                                                                                    index = option.target.parent().index();
                                                                                    option.handle = hasChild ? $id.children().eq(index).children(param.handle) : $handle;

                                                                                    // 通过调用打开方法的对象,关闭的时候需要用
                                                                                    openHandle = option.handle;
                                                                                    openTarget = option.target;

                                                                                    canSwipeRight && swipeRightOpen(option);
                                                                                    break;
                                                                      case "swipeleft":
                                                                                    option.target = $swipeLeft.eq(option.index);
                                                                                    index = option.target.parent().index();
                                                                                    option.handle = hasChild ? $id.children().eq(index).children(param.handle) : $handle;
                                                                                    openHandle = option.handle;

                                                                                    openTarget = option.target;
                                                                                    canSwipeLeft && swipeLeftOpen(option);
                                                                                    break;
                                                                      case "swipedown":
                                                                                    option.target = $swipeDown.eq(option.index);
                                                                                    index = option.target.parent().index();
                                                                                    option.handle = hasChild ? $id.children().eq(index).children(param.handle) : $handle;
                                                                                    openHandle = option.handle;
                                                                                    openTarget = option.target;
                                                                                    canSwipeDown && swipeDownOpen(option);
                                                                                    break;
                                                                      case "swipeup":
                                                                                    option.target = $swipeUp.eq(option.index);
                                                                                    index = option.target.parent().index();
                                                                                    option.handle = hasChild ? $id.children().eq(index).children(param.handle) : $handle;
                                                                                    openHandle = option.handle;
                                                                                    openTarget = option.target;
                                                                                    canSwipeUp && swipeUpOpen(option);
                                                                                    break;
                                                                      default:
                                                                                    option.target = $swipeRight.eq(option.index);
                                                                                    index = option.target.parent().index();
                                                                                    option.handle = hasChild ? $id.children().eq(index).children(param.handle) : $handle;
                                                                                    openHandle = option.handle;
                                                                                    openTarget = option.target;
                                                                                    canSwipeRight && swipeRightOpen(option);
                                                                                    break;
                                                        }

                                                        trigger.call(module, "open", dir);

                                                        return this;
                                          }

                                          /**
                                            * 获取激活的对象,只有在有多个需要激活的active才会有,正常情况下是null
                                            *  @method active
                                            *  @chainable
                                            *  @example 
                                               
                                               
                                               var activeUI = uiSwipe.active();
                                                 activeUI.close();
                                                   
                                            */
                                          function active() {
                                                        return activeUI;
                                          }

                                          /**
                                            * 是否已经激活
                                            *  @method isActive
                                            *  @since  1.3.4
                                            *  @chainable
                                            *  @example 
                                               
                                               var isActive = uiSwipe.isActive();
                                                   
                                            */
                                          function isOpen() {
                                                        return isActive;
                                          }

                                          // 如果是激活状态,先关闭掉默认事件
                                          function handleClose(e) {
                                                        var $target = $(e.target),
                                                            target = $target.closest($swipeLeft).length || $target.closest($swipeRight).length || $target.closest($swipeUp).length || $target.closest($swipeDown).length || e.target.className.indexOf("bui-mask") > -1 || e.target.className.indexOf("bui-click") > -1;

                                                        //如果是激活状态,则先关闭边栏菜单再操作;
                                                        if (activeUI) {
                                                                      // 点击自动关闭
                                                                      if (target) {
                                                                                    // 如果事件触发的父层等于当前操作区,则可以点击
                                                                                    // 如果事件触发的样式名是bui-mask,bui-click也可以点击
                                                                      } else {
                                                                                    activeUI.close();
                                                                                    // 事件被捕获,不触发其它事件
                                                                                    e.stopPropagation();
                                                                      }
                                                        }
                                          }

                                          function bind() {
                                                        $id.on("touchstart", onstart).on("touchmove", onmove).on("touchend", onend).on("touchcancel", function () {
                                                                      // 导致sidebar 在oppo手机的debugtool中会无法滚动
                                                                      //     swipeClose();
                                                        });

                                                        hasEventInit = true;
                                          }
                                          //对象移动
                                          function move(x, y, transition, el) {

                                                        var transition,
                                                            $el = el || $id,
                                                            //jquery 对象
                                                        x = x || 0,
                                                            y = y || 0,
                                                            xRem = param.zoom ? parseFloat(x) / 100 + "rem" : parseFloat(x) + "px",
                                                            yRem = param.zoom ? parseFloat(y) / 100 + "rem" : parseFloat(y) + "px",
                                                            xVal = String(x).indexOf("%") > -1 ? x : xRem,
                                                            yVal = String(y).indexOf("%") > -1 ? y : yRem;

                                                        if (typeof transition === "number") {
                                                                      transition = "all " + transition + "ms";
                                                        } else {
                                                                      transition = transition || "all 300ms";
                                                        }

                                                        // translateZ(0) 会导致中兴z802t 的下拉一次,上拉滚动加载只请求一次失效
                                                        //清除动画过渡时间,下次拉动才不会有延迟现象
                                                        $el.css({
                                                                      "-webkit-transition": transition,
                                                                      "transition": transition,
                                                                      "-webkit-transform": "translate(" + xVal + "," + yVal + ")",
                                                                      "transform": "translate(" + xVal + "," + yVal + ")"
                                                        }).one('webkitTransitionEnd', function () {

                                                                      $el.css({
                                                                                    "-webkit-transition": "none",
                                                                                    "transition": "none"
                                                                      });
                                                        });
                                                        return this;
                                          }

                                          /**
                                           * 不允许滑动
                                           *  @method lock
                                           *  @chainable
                                           *  @example 
                                              
                                              //锁住滑动
                                              uiSwipe.lock();
                                                  
                                           */
                                          function lock() {
                                                        if (isDestroy) {
                                                                      return;
                                                        }
                                                        // $id.off("touchstart",param.handle,onstart);
                                                        $id.off("touchmove", onmove).off("touchend", onend).off("touchcancel", function () {
                                                                      //swipeClose();
                                                        });

                                                        trigger.call(module, "lock");
                                                        return this;
                                          }
                                          /**
                                           * 允许滑动
                                           *  @method unlock
                                           *  @chainable
                                           *  @example 
                                              
                                              //可以滑动
                                              uiSwipe.unlock();
                                                  
                                           */
                                          function unlock() {

                                                        if (isDestroy) {
                                                                      return;
                                                        }
                                                        $id.on("touchmove", onmove).on("touchend", onend).on("touchcancel", function () {
                                                                      // 会导致oppo手机在debugtool中滑动出现问题
                                                                      // swipeClose();
                                                        });

                                                        trigger.call(module, "unlock");
                                                        return this;
                                          }

                                          /**
                                           * [销毁控件]
                                           *  @method destroy
                                           *  @since 1.4.2
                                           *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
                                           *  @example 
                                              
                                              //销毁
                                              uiSwipe.destroy();
                                              
                                           */
                                          function destroy(bool) {
                                                        var bool = bool == true ? true : false;

                                                        if ($id) {
                                                                      $id.off();
                                                                      bool && $id.remove();
                                                        }

                                                        off("open");
                                                        off("close");

                                                        isDestroy = true;
                                          }

                                          /**
                                           * 为控件绑定事件
                                           *  @event on
                                           *  @since 1.3.0
                                           *  @param {string} [type] [ 事件类型: "open" | "close" | "touchstart" | "touchmove" | "touchend"  ]
                                           *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
                                           *  @example 
                                              
                                              uiSwipe.on("lock",function () {
                                                  // 点击的菜单
                                                  console.log(this);
                                              });
                                              
                                                  
                                           */
                                          function on(type, callback) {
                                                        ui.on.apply(module, arguments);
                                                        return this;
                                          }

                                          /**
                                           * 为控件取消绑定事件
                                           *  @event off
                                           *  @since 1.3.0
                                           *  @param {string} [type] [ 事件类型: "open" | "close" | "touchstart" | "touchmove" | "touchend"  ]
                                           *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
                                           *  @example 
                                              
                                              uiSwipe.off("lock");
                                              
                                                  
                                           */
                                          function off(type, callback) {
                                                        ui.off.apply(module, arguments);
                                                        return this;
                                          }
                                          /*
                                           * 触发自定义事件
                                           */
                                          function trigger(type) {
                                                        //点击事件本身,或者为空,避免循环引用
                                                        module.self = this == window || this == module ? null : this;

                                                        ui.trigger.apply(module, arguments);
                                          }
                                          return module;
                            };
              }();

              return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {

    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>侧滑栏</h2>
     *     <p>侧滑栏,也叫抽屉菜单, bui.sidebar滑动出来的内容是什么,完全由你自己自定义,你也可以控制菜单在左边还是右边,也可以同时左右都有.</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.sidebar.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.sidebar/isActive"}}{{/crossLink}}: 当前是否激活 <br>
     * {{#crossLink "bui.sidebar/open"}}{{/crossLink}}: 打开侧滑栏 <br>
     * {{#crossLink "bui.sidebar/close"}}{{/crossLink}}: 关闭侧滑栏 <br>
     * {{#crossLink "bui.sidebar/lock"}}{{/crossLink}}: 不允许滑动<br>
     * {{#crossLink "bui.sidebar/unlock"}}{{/crossLink}}: 允许滑动 <br>
     * {{#crossLink "bui.sidebar/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.sidebar/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.sidebar.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-sidebar_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class sidebar
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [控件id]  
     *  @param {string} [option.trigger] [点击触发侧滑的按钮]
     *  @param {string} [option.handle] [滑动区域,默认: ".bui-page" ]  
     *  @param {boolean} [option.handleMove] [是否允许操作区域滑动,默认: true|false ]  
     *  @param {string} [option.swipeleft] [往左滑出来的菜单, 默认: ".swipeleft" ]  
     *  @param {string} [option.swiperight] [往右滑出来的菜单, 默认: ".swiperight" ]  
     *  @param {number} [option.width] [默认宽度280]
     *  @param {number} [option.height] [ 菜单的高度 0为自适应 ]  
     *  @param {boolean} [option.handleMove] [ handle是否移动 默认 true | false]  
     *  @param {number} [option.opacity] [ 遮罩透明度 默认 0.1 ]  
     *  @param {boolean} [option.zoom] [ 保持比例缩放 默认 true | false]  
     *  @param {number} [option.distance] [ 默认40, 拖拽大于distance才会生效,配合delay可以防止slide又有上下其它事件 ]  
     *  @example
     *   html:
     *
            <div id="sidebar" class="bui-sidebar-wrap">
              <div class="bui-sidebar swiperight">
                <!-- 侧滑菜单 -->
              </div>
              <div id="page" class="bui-page">
                <a id="menu" class="bui-btn"><i class="icon-menu"></i></a>
                <!-- 正文内容 -->
              </div>
            </div>
     *      
     *   js: 
     *   
            // 初始化
            var uiSidebar = bui.sidebar({
                  id: "#sidebar", 
                  trigger: "#menu"
                })
     *
     *
     */
    ui.sidebar = function (option) {
        var config = {
            id: "",
            trigger: "",
            handle: ".bui-page",
            swiperight: ".swiperight",
            swipeleft: ".swipeleft",
            handleMove: true,
            mask: true,
            width: 280,
            opacity: 0.1,
            height: 0,
            zoom: true,
            distance: 40
        };

        //方法
        var module = {
            handle: {},
            on: on,
            off: off,
            active: active,
            isActive: isActive,
            open: open,
            close: close,
            lock: lock,
            unlock: unlock,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };

        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.sidebar, option);
        var uiMask = null,
            uiSwipe,
            $handle = null,
            isOpen = false,
            hasEventInit = false,
            $menu = null;
        //初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);
            //option获取新参数使用
            param = module.config = option;

            //绑定菜单
            if (option.trigger) {
                $menu = ui.obj(option.trigger);
            }

            $handle = ui.obj(option.handle);

            // 初始化侧滑栏
            uiSwipe = bui.swipe({
                id: option.id,
                handle: option.handle,
                movingDistance: option.width,
                swiperight: option.swiperight,
                swipeleft: option.swipeleft,
                direction: "x",
                hasChild: false,
                width: 0,
                height: 0,
                handleMove: option.handleMove,
                zoom: option.zoom,
                distance: option.distance,
                transition: 300
            });

            // 初始化遮罩
            if (param.mask) {
                uiMask = bui.mask({
                    id: option.id + "-mask",
                    appendTo: $handle,
                    autoTrigger: false,
                    opacity: option.opacity,
                    callback: function callback() {
                        uiSwipe.close();
                    }
                });
            }

            if (!hasEventInit) {
                // 绑定事件
                bind();

                if (option.height > 0) {
                    ui.obj(option.id).height(option.height);
                }
            }

            return this;
        }

        function bind() {
            var _self = this;
            uiSwipe.on("open", function (dir) {

                $menu && $menu.addClass('active');
                uiMask && uiMask.show();
                //去掉滚动
                $handle.css("overflow-y", "hidden");

                isOpen = true;

                trigger.call(_self, "open", dir);
            });

            uiSwipe.on("close", function () {

                $menu && $menu.removeClass('active');
                uiMask && uiMask.hide();
                //去掉滚动
                $handle.css("overflow-y", "auto");

                isOpen = false;

                trigger.call(_self, "close");
            });

            $menu && $menu.on("click.bui", function (e) {

                if ($(this).hasClass("disabled")) {
                    return;
                }
                var position = $(this).attr("data-target") || "swiperight";

                if (isOpen) {
                    close();
                } else {
                    open({ target: position });
                }
            });

            hasEventInit = true;
        }
        /**
         * 打开菜单
         *  @method open
         *  @since 1.3.0
         *  @param {object} option  
         *  @param {string} [option.target] [打开侧滑的方向, 默认: "swiperight"(在左边的菜单) | "swipeleft"(在右边的菜单) ]  
         *  @param {string} [option.transition] [打开是否需要动画, 默认 300 毫秒, 不需要动画则设置为 "none" ]  
         *  @chainable
         *  @example 
            
            //显示菜单
            uiSidebar.open();
                
         */
        function open(opt) {
            var option = opt || {};
            option.target = option.target || "swiperight";
            option.transition = option.transition || 300;
            // 默认打开左边
            uiSwipe.open(option);

            return this;
        }
        /**
         * 关闭菜单
         *  @method close
         *  @chainable
         *  @example 
            
            //关闭菜单
            uiSidebar.close();
                
         */
        function close() {

            uiSwipe.close();

            return this;
        }

        /**
         * 不允许滑动
         *  @method lock
         *  @chainable
         *  @example 
            
            //关闭菜单
            uiSidebar.lock();
                
         */
        function lock() {
            uiSwipe.lock();

            trigger.call(this, "lock");

            return this;
        }

        /**
        * 允许滑动
        *  @method unlock
        *  @chainable
        *  @example 
           
           //关闭菜单
           uiSidebar.unlock();
               
        */
        function unlock(argument) {
            uiSwipe.unlock();

            trigger.call(this, "unlock");

            return this;
        }

        /**
        * 是否打开 已弃用,直接判断 active() 对象是否为null就可以了
        *  @method isActive
        *  @deprecated
        *  @return { boolean } [ 打开为 true | false ]
        *  @example 
           
           //是否打开
           var isActive = uiSidebar.isActive();
               
        */
        function isActive() {
            return isOpen;
        }
        /*
        * 获取激活对象,废弃,sidebar无激活对象
        *  @method active
        *  @since 1.3.0
        *  @return { object } [ swipe对象 或者为 null ]
        *  @example 
           
           //是否打开
           var activeUI = uiSidebar.active();
               
        */
        function active() {
            return uiSwipe.active();
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiSidebar.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($menu) {
                $menu.off("click.bui");
            }

            off("open");
            off("close");

            uiMask && uiMask.destroy(bool);
            uiSwipe && uiSwipe.destroy(bool);
        }
        /**
        * 获取依赖的控件
        *  @method widget
        *  @param {string} [name] [ 依赖控件名 ]
        *  @example 
           
           //获取依赖控件
           var uiSidebarWidget = uiSidebar.widget();
           
               
        */
        function widget(name) {
            var control = { swipe: uiSwipe, mask: uiMask };
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiSidebar.option();
              //获取某个参数
            var id = uiSidebar.option( "id" );
              //修改一个参数
            uiSidebar.option( "fullHeight",false );
              //修改多个参数
            uiSidebar.option( {"fullHeight":false} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
           * 为控件绑定事件
           *  @event on
           *  @since 1.3.0
           *  @param {string} [type] [ 事件类型: "open" | "close"  ]
           *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
           *  @example 
              
              uiSidebar.on("lock",function () {
                  // 点击的菜单
                  console.log(this);
              });
              
                  
           */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "open" | "close"  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiSidebar.off("lock");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }
        return module;
    };

    return ui;
})(bui || {}, libs);

/**
 * UI控件库 
 * @module UI
 */
(function (ui, $) {
    /**
     * 
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>侧滑列表</h2>
     *     <p>支持动态渲染以及静态渲染, 两种的区别就在于,动态渲染初始化简单, 静态渲染灵活,支持自定义按钮样式,并且支持左右侧滑.</p>
     *     <p>可以同时有左边跟右边菜单,菜单的个数也可以不一样多,留意示例的几种不同效果</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.listview.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.listview/active"}}{{/crossLink}}: 返回当前激活的对象 <br>
     * {{#crossLink "bui.listview/open"}}{{/crossLink}}: 打开某一个 <br>
     * {{#crossLink "bui.listview/close"}}{{/crossLink}}: 关闭所有 <br>
     * {{#crossLink "bui.listview/lock"}}{{/crossLink}}: 不允许滑动 <br>
     * {{#crossLink "bui.listview/unlock"}}{{/crossLink}}: 允许滑动 <br>
     * {{#crossLink "bui.listview/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.listview/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.listview.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-listview_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class listview
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [控件id]  
     *  @param {array} [option.data] [点击触发侧滑的按钮 例如:[{ "text": "修改", "classname":"btn-blue"}] ]  
     *  @param {string} [option.data.text] [菜单的文本]  
     *  @param {string} [option.data.classname] [菜单的样式]  
     *  @param {string} [option.handle] [触发的区域,默认是.bui-btn ]  
     *  @param {number} [option.width] [ listview的宽度,默认:0, 0 为自适应屏幕宽度]   
     *  @param {number} [option.height] [ listview的高度,默认:0, 0 为自适应内容高度]   
     *  @param {number} [option.menuWidth] [菜单总宽度,默认:100]   
     *  @param {number} [option.menuHeight] [ 菜单的高度 默认:0 自适应内容高度 ]  
     *  @param {string} [option.position] [ 菜单侧滑的方向 right | left ]  
     *  @param {boolean} [option.zoom] [ since 1.3.0 是否采用缩放宽高的方式 默认 false | true ]  
     *  @param {boolean} [option.mask] [ 遮罩 true ]  
     *  @param {number} [option.distance] [ 默认80, 拖拽大于distance才会生效,配合delay可以防止listview又有上下其它事件 ]  
     *  @param {function} [option.callback] [ 点击的回调 ]  
     *  @example
     *   html:
     *
       示例结构1: 动态渲染
            <ul id="listview" class="bui-listview">
                  <li>
                      <div class="bui-btn">
                          菜单
                      </div>
                  </li>
              </ul>
        示例结构2: 禁止渲染
            <ul id="listview" class="bui-listview">
              <!-- 设置status属性可以避免渲染菜单 -->
              <li status="1">
                <div class="bui-btn bui-box">
                  <div class="span1">不渲染</div>
                  <i class="icon-listright"></i>
                </div>
              </li>
            </ul>
        示例结构3: 静态渲染,可以允许左右都有按钮
            <ul id="listview" class="bui-listview">
              <li status="1">
                <div class="bui-btn bui-box" href="pages/ui_controls/bui.listview.html" param='{"id":"123"}'>
                  <div class="span1">静态渲染-左右菜单</div>
                  <span class="bui-badges">荐</span>
                  <i class="icon-listright"></i>
                </div>
                <div class="bui-listview-menu swipeleft" data-moving="240">
                    <div class="bui-btn primary">置顶</div>
                    <div class="bui-btn primary">修改</div>
                    <div class="bui-btn danger">删除</div>
                </div>
                <div class="bui-listview-menu swiperight">
                    <div class="bui-btn primary">修改</div>
                    <div class="bui-btn danger">删除</div>
                </div>
              </li>
            </ul>
     *      
     *   js: 
     *   
          // 初始化
          var uiListview = bui.listview({ 
                  id: "#listview",
                  data: [{ "text": "修改", "classname":"btn-blue"},
                          { "text": "删除", "classname":"btn-red"}],
                  callback: function (e) {
                    var index = $(e.target).text();
                        if( index == "修改" ){
                            //do something
                        }
                        this.close();
                  }
              });
     *
     *
     */
    ui.listview = function (option) {

        var config = {
            id: "",
            data: [],
            handle: ".bui-btn",
            swiperight: ".swiperight",
            swipeleft: ".swipeleft",
            position: "right",
            width: 0,
            height: 0,
            menuWidth: 160,
            menuHeight: 0,
            distance: 80,
            zoom: false,
            callback: null
        };

        //方法
        var module = {
            active: active,
            lock: lock,
            unlock: unlock,
            open: open,
            close: close,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.listview, option);

        var uiSwipe,
            $id,
            $children,
            itemHeight,
            hasEventInit = false,
            isActive = false;

        //初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);
            //option获取新参数使用
            param = module.config = option;

            $id = ui.obj(option.id);
            $children = $id.children();
            // 初始化listview的菜单数据
            $children.length && display(option);

            if (!hasEventInit) {
                // 绑定事件
                bind(option);
            }

            return this;
        }

        //渲染结构
        function display(option) {
            if (option.height > 0) {
                $id.height(option.height);
            }
            if (option.data.length) {

                $children.each(function (i, el) {

                    // 是否有写在样式上的宽度
                    var $el = $(el),

                    // =1 不动态渲染菜单
                    status = $el.attr("status");

                    var itemHeight = option.menuHeight > 0 ? option.menuHeight : el.offsetHeight;

                    // 如果还没渲染则渲染模板
                    if (!status) {
                        //渲染按钮模板
                        var html = template(option);
                        $el.append(html).attr("status", "1");
                    }

                    if (!el.style.height) {
                        $(el).height(itemHeight);
                    }
                });
            } else {

                // 如果没有手动设置高度,会导致滑动的按钮的高度不能自适应
                $children.each(function (i, item) {
                    var itemHeight = option.menuHeight > 0 ? option.menuHeight : item.offsetHeight;

                    if (!item.style.height) {
                        $(item).height(itemHeight);
                    }
                });
            }
        }

        function bind(option) {
            var _slef = this;
            var handleSwipe = function handleSwipe(e) {
                e.ui = module;
                option.callback && option.callback.call(module, e, uiSwipe);
            };

            $id.on("click.bui", ".bui-listview-menu .bui-btn", handleSwipe);

            // 初始化侧滑栏
            uiSwipe = bui.swipe({
                id: option.id,
                handle: option.handle,
                movingDistance: option.menuWidth,
                swiperight: option.swiperight,
                swipeleft: option.swipeleft,
                direction: "x",
                hasChild: true,
                width: option.width,
                height: 0,
                zoom: param.zoom,
                distance: option.distance,
                transition: 300
            });

            uiSwipe.on("open", function (dir) {

                isActive = true;

                trigger.call(_slef, "open", dir);
            });

            uiSwipe.on("close", function (dir) {

                isActive = false;

                trigger.call(_slef, "close", dir);
            });

            hasEventInit = true;
        }

        //模板渲染
        function template(option) {

            var html = '';
            var position = option.position == "right" ? option.swipeleft.substr(1) : option.swiperight.substr(1);

            html += '<div class="bui-listview-menu ' + position + '">';

            $.each(option.data, function (i, el) {
                html += '    <div class="bui-btn ' + el.classname + '">' + el.text + '</div>';
            });
            html += '</div>';

            return html;
        }

        /**
        * 获取激活对象
        *  @method active
        *  @since 1.3.0
        *  @return { object } [ swipe对象 ]
        *  @example 
           
           //是否打开
           var activeUI = uiListview.active();
               
        */
        function active() {
            return uiSwipe.active();
        }

        /*
         * 打开菜单
         *  @method open
         *  @since 1.3.0
         *  @param {object} option  
         *  @param {string} [option.target] [打开侧滑的方向, 默认: "swiperight"(在左边的菜单) | "swipeleft"(在右边的菜单) ]  
         *  @param {string} [option.index] [打开第几个侧滑 ]
         *  @param {string} [option.transition] [打开是否需要动画, 默认 300 毫秒, 不需要动画则设置为 "none" ]  
         *  @chainable
         *  @example 
            
            //显示菜单
            uiListview.open();
                
         */
        function open(opt) {
            var option = opt || {};
            option.target = option.target || (param.position == "right" ? param.swipeleft.substr(1) : param.swiperight.substr(1));
            option.transition = option.transition || 300;
            option.index = option.index || 0;
            // 默认打开左边
            uiSwipe.open(option);

            return this;
        }
        /**
         * 关闭菜单
         *  @method close
         *  @since 1.3.0
         *  @chainable
         *  @example 
            
            //关闭菜单
            uiListview.close();
                
         */
        function close() {

            uiSwipe.close();

            return this;
        }

        /**
         * 不允许滑动
         *  @method lock
         *  @since 1.3.0
         *  @chainable
         *  @example 
            
            //关闭菜单
            uiListview.lock();
                
         */
        function lock() {
            uiSwipe.lock();

            trigger.call(this, "lock");

            return this;
        }

        /**
        * 允许滑动
        *  @method unlock
        *  @since 1.3.0
        *  @chainable
        *  @example 
           
           //关闭菜单
           uiListview.unlock();
               
        */
        function unlock(argument) {
            uiSwipe.unlock();

            trigger.call(this, "unlock");

            return this;
        }

        /**
        * [销毁控件]
        *  @method destroy
        *  @since 1.4.2
        *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
        *  @example 
           
           //销毁
           uiListview.destroy();
           
        */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($children) {
                $children.off("click.bui");
                $children = null;
            }
            if ($id) {
                $id.off("click.bui");
                bool && $id.remove();
                $id = null;
            }

            off("open");
            off("close");

            uiSwipe && uiSwipe.destroy(bool);

            param = null;
            module = null;
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiListviewWidget = uiListview.widget();
            
                
         */
        function widget(name) {
            var control = { swipe: uiSwipe };
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiListview.option();
              //获取某个参数
            var id = uiListview.option( "id" );
              //修改一个参数
            uiListview.option( "width",120 );
              //修改多个参数
            uiListview.option( {"width":120} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
           * 为控件绑定事件
           *  @event on
           *  @since 1.3.0
           *  @param {string} [type] [ 事件类型:  "open" | "close"   ]
           *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
           *  @example 
              
              uiListview.on("lock",function () {
                  // 点击的菜单
                  console.log(this);
              });
              
                  
           */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    "use strict";
    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>绑定按钮跳转</h2>
     *     <p>一个页面只需要静态绑定一次,在最外层的ID,找到页面所有要跳转的按钮,获取页面参数请查看 {{#crossLink "bui.getPageParams"}}{{/crossLink}}</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.btn.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.btn/load"}}{{/crossLink}}: 页面跳转,支持单个页面跟容器内的多个按钮 <br>
     * {{#crossLink "bui.btn/submit"}}{{/crossLink}}: 提交数据<br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.btn.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-btn_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class btn
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [页面id]  
     *  @param {string} [option.handle] [监听的按钮] 
     *  @example
     * 
     *  
     *  html:
     *  
       <div id="page">
           <div class="bui-btn" href="btn.html">首页</div>
           <div class="bui-btn" href="btn.html?id=222">新闻</div>
       </div>
    *  js:
    *
    *   var uiBtn = bui.btn({ 
            id:"#page",
            handle: ".bui-btn"  // 绑定多个样式名 ".bui-btn,.submit"
        })
        
        // 所以按钮有href时点击会跳转
        uiBtn.load();
     *
     */

    ui.btn = function (option) {

        var $id,
            opt = {},
            progress,
            replace,
            $children;

        //初始化
        init(option);

        function init(option) {

            //id 传的是否是json ,这里统一了控件的初始化方式,快速初始化则不用
            if (ui.typeof(option) === "object") {

                opt.id = option["id"] || "";
                opt.handle = option["handle"] || "";
                opt.progress = "progress" in option ? option["progress"] : false;
                opt.replace = "replace" in option ? option["replace"] : false;
                opt.timeout = option["timeout"] || 3000;
            } else if (ui.typeof(option) === "string") {
                // 如果传的是字符串,则可能会有2个参数
                opt.id = option || "";
                opt.handle = "";
                opt.progress = false;
                opt.replace = false;
                opt.timeout = 3000;
            }

            //初始化选择器
            $id = ui.obj(opt["id"]);
            $children = opt["handle"];
            progress = opt.progress;
            replace = opt.replace;

            return this;
        }

        /**
         * 页面跳转,跟 {{#crossLink "bui.load"}}{{/crossLink}} 的区别在于,通过按钮绑定跳转会增加一层防止快速点击加载2次的问题
         * 注意: 这个默认跳转会阻止默认事件,a, input的checkbox label的for 等等,包在btn元素里面都会失效
         * 页面如何接收参数请查看 {{#crossLink "bui.getPageParams"}}{{/crossLink}}
         *  @method load
         *  @example 
         *  
         *  示例: 绑定页面所有有href的按钮的跳转(一个页面只需要初始化一次)
         *  
         *  html:
         *  
           <div id="page">
               <div class="bui-btn" href="btn.html">首页</div>
               <div class="bui-btn" href="btn.html" param='{"id":"222"}'>新闻</div>
           </div>
        *  js:
        *  
            bui.btn({ 
                id:"#page",
                handle: ".bui-btn"  // 绑定多个 ".bui-btn,.submit"
            }).load();
                
         */
        function load(url) {

            //进度条参数是否提前
            var url = url;

            //重新赋值
            var timeout, loadingTimeout;

            off();
            var timeEnd = 0;
            $id.on("click.bui", $children, function (e) {
                //兼容以前的写法
                var href = url || $(this).attr("href"),
                    target = $(this).attr("target"),
                    attrDisabled = $(this).attr("disabled"),
                    disabled = $(this).hasClass("disabled") || attrDisabled == "" || attrDisabled == "true" || attrDisabled == "disabled";
                var param3 = {};

                if (!href || disabled) {
                    return;
                }
                if (href && href.indexOf("javascript:") > -1) {
                    return;
                }
                if (href && href.indexOf("?") > -1) {
                    var paramArr = href.split("?");
                    param3 = ui.unit.keyStringToObject(paramArr[1]);
                    href = paramArr[0];
                }

                //传过去的参数
                var paramStr = $(this).attr("param") || "";
                var param2 = paramStr && paramStr.indexOf("{") > -1 && paramStr.indexOf("}") > -1 ? JSON.parse($(this).attr("param")) : {};

                //合并参数
                var paramObj = $.extend(true, param3, param2);
                var loading;

                var progress2 = $(this).attr("progress") ? $(this).attr("progress") == "false" ? false : true : progress;

                //如果需要跳转加上进度条
                if (progress2) {
                    loading = ui.loading({
                        autoTrigger: true,
                        display: "block",
                        opacity: 0,
                        timeout: opt.timeout
                    });
                }

                //解决BT的快速点击导致页面加载两次, 如果在滑动的时候,继续点击,还是会触发两次,这个需要在原生层面解决.
                var timeNow = +new Date();
                if (timeNow - timeEnd < 350) {
                    return false;
                }
                timeEnd = timeNow;

                //传参数
                var params = { url: href, param: paramObj, replace: replace };
                //网址是http://开头
                if (target == "_blank") {
                    ui.run({ id: href, data: paramObj });
                } else {
                    //页面跳转
                    ui.load(params);
                }

                //阻止原有的事件跳转
                return false;
            });
        }

        /**
         * 绑定按钮提交数据,提交数据成功以后需要在回调里面关闭进度条
         *  @method submit
         *  @param {function} callback [提交的回调]
         *  @param {object} param [ loading 的参数修改]
         *  @example 
            
            bui.btn("#btn").submit(function(loading){ 
                 //关闭进度条
                 loading.stop(); 
             });
                
         */
        function submit(callback, param) {

            var param = param || {};

            off();

            $id.on("click.bui", $children, function (e) {

                var _self = this;
                var myBackground = $(_self).css("background-color");

                //覆盖原来的颜色
                var background = myBackground == "none" ? "#fff" : myBackground;

                param.appendTo = _self;
                param.background = param.background || background;
                param.display = param.display || "inline";
                param.width = param.width || 15;
                param.height = param.height || 15;
                param.text = param.text || "加载中";
                param.autoClose = param.autoClose == false ? false : true;
                param.autoTrigger = param.autoTrigger == false ? false : true;

                //创建loading
                var loading = ui.loading(param);

                // 在回调中手动关闭进度 loading.stop();
                return callback && callback.call(_self, loading);
            });
        }

        /**
         * 取消事件
         *  @method off
         *  @example 
            
            uiBtn.off();
                
         */
        function off() {

            $id.off("click.bui", $children);

            return this;
        }

        return {
            load: load,
            submit: submit,
            off: off
        };
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    "use strict";
    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>对话框</h2>
     *     <p>对话框同样是一个只关注交互的一个控件,可以从不同方向弹出,并且支持全屏,交互里面的内容是什么,完全由你定义, 可以是文本,也可以是控件, 完全可以由你定义, 像 提醒框 | 确认框 | 上拉菜单 | 选择列表菜单 | 日期等,都是基于dialog.</p>
     *     <p>注意: 当页面有{{#crossLink "bui.listview"}}{{/crossLink}} 控件时,侧滑出来的按钮如果要触发弹窗,会导致点击弹窗按钮第一次无效,需要设置弹窗的buttons的样式名为 bui-click </p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.dialog.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.dialog/isOpen"}}{{/crossLink}}: 是否打开状态 <br>
     * {{#crossLink "bui.dialog/open"}}{{/crossLink}}: 打开弹出窗 <br>
     * {{#crossLink "bui.dialog/close"}}{{/crossLink}}: 关闭弹出窗 <br>
     * {{#crossLink "bui.dialog/remove"}}{{/crossLink}}: 移除弹出窗 <br>
     * {{#crossLink "bui.dialog/create"}}{{/crossLink}}: 动态创建弹出窗<br>
     * {{#crossLink "bui.dialog/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.dialog/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.dialog.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-dialog_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class dialog
     *  @constructor 
     *  @param {object} option  
     *  @param {string} [option.id] [ render:true 不需要传对话框的id | render:false 为静态绑定, 不传id只是引用,不初始化]  
     *  @param {string} [option.className] [ 增加自定义的对话框样式,防止修改 ]  
     *  @param {string} [option.effect] [对话框的打开效果,修改position会有默认的效果, 要修改具体可以查看 {{#crossLink "bui.toggle"}}{{/crossLink}} 有哪些效果]  
     *  @param {string} [option.position] [ 对话框的位置 默认 center | left | right | top | bottom ]  
     *  @param {string} [option.width] [ 对话框的宽度, 只在 position:center | left | right 有效 ]  
     *  @param {string} [option.height] [ 对话框的高度, 只在 position:center | top | bottom 有效 ]  
     *  @param {boolean} [option.fullscreen] [ 全屏显示对话框 ]  
     *  @param {boolean} [option.scroll] [ true | false 是否计算最大高度,配合height参数,超出可以滚动 ]  
     *  @param {boolean} [option.mask] [是否显示遮罩]  
     *  @param {number} [option.opacity] [ 遮罩的透明度 ]  
     *  @param {boolean} [option.zoom] [ 保持比例缩放 默认 false | true ]   
     *  @param {boolean} [option.zIndex] [ 1.5.0新增 默认:102  ]   
     *  @param {function} [option.callback] [ 点击按钮的回调, this 指点击的按钮 ]  
     *  @param {function} [option.onMask] [ 点击遮罩的回调 ]  
     *  @param {function} [option.onClose] [ 对话框关闭的回调 ]  
     *  
     *  @param {boolean} [option.render] [ 是否动态填充,动态填充以下参数才会有效 ]  
     *  @param {string} [option.title] [ render:true 对话框的标题才会显示 ]  
     *  @param {string} [option.content] [ render:true 对话框的内容]  
     *  @param {boolean} [option.close] [ render:true 显示关闭文本 ]  
     *  @param {string|html} [option.closeText] [ render:true 才能把图标改为文本并且可以更改图标 ]  
     *  @param {boolean} [option.autoClose] [ true点击按钮会自动关闭,如果false需要手动关闭 调用自身的close()方法]  
     *  @param {array} [option.buttons] [ render:true 底部的按钮 格式为:["确定","取消"] || [{name:"确定",className:"primary-reverse"}]  ]  
     *  @param {string|object} [option.appendTo] [ 1.4.3新增 默认:"body",添加到哪里去,主要配合单页使用 ]   
     *  @example
     * 
     *  html: 
     *
            //对话框的标准结构
            <div id="dialog" class="bui-dialog" style="display:none;">
                <div class="bui-dialog-head">对话框标题</div>
                <div class="bui-dialog-main">对话框的内容</div>
            </div>
     *  js: 
      
        var uiDialog = bui.dialog({
              id: "#dialog"
            });
     *
     */

    ui.dialog = function (option) {
        var config = {
            id: "",
            title: "",
            effect: "zoomIn",
            content: "",
            className: "",
            appendTo: "",
            position: "center",
            fullscreen: false,
            width: 0,
            height: 0,
            mask: true,
            opacity: 0.6,
            render: false,
            autoClose: true,
            close: true,
            scroll: true,
            closeText: "",
            zoom: false,
            zIndex: 100,
            buttons: [],
            onMask: null,
            onClose: null,
            callback: null
        };

        //方法
        var module = {
            selector: selector,
            $el: selector,
            $: selector,
            handle: {},
            on: on,
            off: off,
            open: open,
            close: close,
            isOpen: isOpen,
            create: create,
            remove: remove,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(false, {}, config, ui.config.dialog, option);

        var $id,
            uiToggle,
            cssName = "",
            dialogWidth = "",
            dialogHeight = "",
            defaultEffect = "fadeInDown",
            effect,
            status = 0,
            //中间高度自适应
        isOpen = false,
            hasEventInit = false,
            handlers = {},
            winWidth = window.viewport.width() || document.documentElement.clientWidth,
            winHeight = window.viewport.height() || document.documentElement.clientHeight,
            uiMask,
            isDestroy = false,
            count = 0;

        if (param.id) {
            //初始化
            init(param);
        }

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);
            option.appendTo = option.appendTo || (ui.hasRouter ? router.currentPage() || "body" : "body");
            isDestroy = false;

            effect = option.effect;

            //自定义效果跟位置有关
            switch (option.position) {
                case "top":
                    cssName = "bui-dialog-top";
                    effect = option.effect || "fadeInDown";
                    break;
                case "bottom":
                    cssName = "bui-dialog-bottom";
                    effect = option.effect || "fadeInUp";

                    break;
                case "left":
                    cssName = "bui-dialog-left";
                    effect = option.effect || "fadeInLeft";

                    break;
                case "right":
                    cssName = "bui-dialog-right";
                    effect = option.effect || "fadeInRight";

                    break;
                case "center":
                    cssName = "bui-dialog-center";
                    effect = option.effect || defaultEffect;

                    break;
            }

            //是否全屏
            if (option.fullscreen) {
                cssName = "bui-dialog-fullscreen";
                effect = option.effect || defaultEffect;
                // opt.mask = false;
            }

            //动态渲染,无需传id,会生成guid
            if (option.render) {

                option.id = ui.guid();

                render(option);

                $id = ui.objId(option.id);
            } else {

                $id = ui.obj(option.id);

                $id.addClass(cssName);
            }

            // 最大高度最大宽度问题 
            // 
            dialogWidth = $id.width() > winWidth ? winWidth : $id.width();
            dialogHeight = $id.height() > winHeight ? winHeight : $id.height();

            //默认先隐藏dialog
            $id.css("display", "none");
            //初始化dialog切换器,显示隐藏基于这个控件
            uiToggle = ui.toggle({
                id: option.id,
                effect: effect
            });

            try {
                //显示遮罩, appendTo 为了解决单页的遮罩问题.
                uiMask = opt.mask && ui.mask({
                    id: option.id + "-mask",
                    opacity: opt.opacity,
                    appendTo: $id.parent(),
                    autoTrigger: false,
                    onlyOne: true,
                    autoClose: false,
                    zIndex: parseInt(opt.zIndex, 10) - 1,
                    callback: function callback(e) {
                        opt.onMask && opt.onMask.call(module, e);
                        if (param.autoClose) {
                            if (param.render) {
                                close(remove);
                            } else {
                                close();
                            }
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }

            //绑定事件
            if (!hasEventInit || param.render) {
                bind();
            }
            //option获取新参数使用
            param = module.config = option;

            return this;
        }

        //动态渲染模板
        function template(option) {

            var html = '';

            // 这里的 option.id 是动态生成的guid,在callback中可以拿到
            html += '<div id="' + option.id + '" class="bui-dialog ' + cssName + ' ' + option.className + '" style="display:block;z-index:' + option.zIndex + '">';
            option.title && (html += '	<div class="bui-dialog-head">' + option.title + '</div>');
            html += '	<div class="bui-dialog-main">';
            option.content && (html += option.content);
            html += '	</div>';
            option.buttons && option.buttons.length && (html += '	<div class="bui-dialog-foot bui-box">', $(option.buttons).each(function (i, item) {
                html += '		<div class="bui-btn span1 ' + (item.className || '') + '" value="' + (item.value || '') + '">' + (item.name || item) + '</div>';
            }), html += '	</div>');
            //是否显示关闭按钮
            option.close && (html += '   <div class="bui-dialog-close">' + (option.closeText ? option.closeText : '<i class="icon-close"></i>') + '</div>');
            html += '</div>';

            return html;
        }

        /**
            * 打开对话框
            *  @method open
            *  @chainable
            *  @param {function} [callback] [回调]
            *  @example 
                 uiDialog.open();
                   
            */
        function open(callback) {

            if (isOpen || isDestroy) {
                return;
            }

            $id.css("display", "block");

            var status = $id.attr("status") || 0;

            //通过状态判断,不用每次都重新计算高度
            if (status == 0) {

                // 有一些宽度高度如果没设置,需要获取本身的宽度高度,例如 pickerdate
                dialogWidth = param.width || $id.width();
                dialogHeight = param.height || $id.height();

                var dialogRemWidth = ui.unit.pxToRemZoom(dialogWidth),
                    dialogRemHeight = ui.unit.pxToRemZoom(dialogHeight);

                // 是否采用等比缩放
                var dialogWidthValue = param.zoom ? dialogRemWidth + 'rem' : dialogWidth + 'px',
                    dialogHeightValue = param.zoom ? dialogRemHeight + 'rem' : dialogHeight + 'px',
                    dialogTopValue = param.zoom ? '-' + dialogRemHeight / 2 + 'rem' : '-' + dialogHeight / 2 + 'px',
                    dialogLeftValue = param.zoom ? '-' + dialogRemWidth / 2 + 'rem' : '-' + dialogWidth / 2 + 'px';

                //不是全屏 center 才有效
                if (param.position == "center" && !param.fullscreen) {

                    $id.css({
                        "width": dialogWidthValue,
                        "height": dialogHeightValue,
                        "top": "50%",
                        "margin-top": dialogTopValue,
                        "left": "50%",
                        "margin-left": dialogLeftValue,
                        "right": "auto"
                    });
                }
                //左右的时候有宽度就设置宽度
                if (!param.fullscreen) {

                    $id.css({
                        "width": dialogWidthValue,
                        "height": dialogHeightValue
                    });
                }

                // 如果需要超出滚动条,则设置scroll还有高度
                if (param.scroll) {

                    var $dialogHead = $id.children('.bui-dialog-head'),
                        $dialogFoot = $id.children('.bui-dialog-foot'),
                        $dialogMain = $id.children('.bui-dialog-main');
                    var headHeight = $dialogHead.length ? $dialogHead.height() : 0,
                        footHeight = $dialogFoot.length ? $dialogFoot.height() : 0,
                        mainHeight = $id.height() - headHeight - footHeight;

                    // 获取缩放以后的值进行加减
                    $dialogMain.css({
                        "height": mainHeight
                    });
                }

                $id.attr("status", "1");
            }

            uiMask && uiMask.show();

            //引用动画控制器
            uiToggle.show(function (argument) {
                isOpen = true;
                callback && callback.call(module, { toggle: uiToggle });

                trigger.call(module, "openafter", { toggle: uiToggle });
            });

            //绑定事件
            if (!hasEventInit) {
                bind();
            }

            // 触发监听事件
            trigger.call(module, "open", { toggle: uiToggle });

            return this;
        }

        // 绑定监听
        function isOpen(argument) {
            return isOpen;
        }
        /**
         * 关闭对话框
         *  @method close
         *  @chainable
         *  @param {function} [callback] [回调]
         *  @example 
              uiDialog.close();
                
         */
        function close(callback) {
            if (!isOpen || isDestroy) {
                return;
            }
            var callback = callback || param.onClose;
            try {

                uiToggle.hide(function (argument) {

                    isOpen = false;

                    callback && callback.call(module, { toggle: uiToggle });
                });

                //隐藏遮罩
                uiMask && uiMask.hide();

                // 触发监听事件
                trigger.call(this, "close", { toggle: uiToggle });
            } catch (e) {
                ui.showLog(e, "bui.dialog.close");
            }

            return this;
        }

        /**
         * 移除对话框
         *  @method remove
         *  @chainable
         *  @example 
              uiDialog.remove();
                
         */
        function remove() {
            try {

                $id.remove();

                if (uiMask) {

                    //移除遮罩
                    uiMask.remove();

                    //解决ios8 遮罩可以滚动问题
                    // $("main").css({
                    //     "overflow-y":"auto"
                    // });
                }
                trigger.call(this, "remove");
            } catch (e) {
                ui.showLog(e, "bui.dialog.remove");
            }

            return this;
        }

        //渲染模板
        function render(option) {
            //生成模板
            var html = template(option);

            $(option.appendTo).append(html);

            return this;
        }

        //绑定关闭及底部按钮事件
        function bind() {

            //绑定关闭事件
            $id.on('click.bui', ".bui-dialog-close", function (event) {
                //执行回调
                param.onClose && param.onClose.call(module, event, module);

                //如果autoClose=true 并且是动态渲染,则关闭移除
                if (param.autoClose) {
                    if (param.render) {
                        close(remove);
                    } else {
                        close();
                    }
                }
                event.stopPropagation();
            });
            //点击底部的按钮
            $id.on('click.bui', ".bui-dialog-foot .bui-btn", function (event) {
                event.target = this;
                //执行回调
                param.callback && param.callback.call(module, event, module);

                //如果autoClose=true 并且是动态渲染,则关闭移除
                if (param.autoClose) {
                    if (param.render) {
                        close(remove);
                    } else {
                        close();
                    }
                }
                event.stopPropagation();
            });

            hasEventInit = true;

            return this;
        }

        // 返回控件自身的选择器
        function selector(id) {
            return ui.selector.call($id, id);
        }

        /**
         * 动态增加对话框
         *  @method create
         *  @param {object} option [参考{{#crossLink "bui.dialog"}}{{/crossLink}} 的参数]
         *  @chainable
         *  @example 
              uiDialog.create({ content:"提醒内容", title:"标题"}).open();
                
         */
        function create(option) {

            config.title = "提示";
            config.content = "";
            config.close = false;
            config.render = true;
            config.autoClose = true;
            config.mask = true;
            config.buttons = ["确定"];

            param = $.extend(true, config, option);

            init(param);

            // 触发监听事件
            trigger.call(module, "create");

            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @example 
            
            //销毁
            uiDialog.destroy();
            
         */
        function destroy() {
            var bool = bool == true ? true : false;

            if ($id) {
                $id.off("click.bui");
                $id.remove();
                $id = null;
            }

            off("open");
            off("close");

            uiMask && uiMask.destroy(bool);
            uiToggle && uiToggle.destroy(bool);

            isDestroy = true;
        }

        /**
         * 获取依赖的控件 
         *  @method widget
         *  @param {string} [name] [ 依赖 toggle 控件]
         *  @example 
            
            //获取依赖控件
            var uiDialogWidget = uiDialog.widget("toggle");
                
         */
        function widget(name) {
            var control = { toggle: uiToggle, mask: uiMask };
            return ui.widget.call(control, name);
        }

        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiDialog.option();
              //获取某个参数
            var id = uiDialog.option( "id" );
              //修改一个参数
            uiDialog.option( "fullscreen",true );
              //修改多个参数
            uiDialog.option( {"fullscreen":true} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "open"(打开的窗口时候触发) | "openafter"(完全打开之后触发) | "close"(关闭窗口的时候触发)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiDialog.on("open",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "open"(打开的窗口时候触发) | "close"(关闭窗口的时候触发)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiDialog.off("open");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        return module;
    };

    return ui;
})(bui || {}, libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    "use strict";

    /**
     * 
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>提醒框</h2>
     *     <p>可以提醒json, 更多参数请参考 {{#crossLink "bui.dialog"}}{{/crossLink}}</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.alert.html" target="_blank">demo</a></h3>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.alert.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-alert_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class alert
     *  @extends bui.dialog
     *  @constructor 
     *  @param {string} text [提醒的文本 ]
     *  @param {function} [callback] [点击回调  this 指点击的按钮]
     *  @example
     * 
            bui.alert("提醒对话框")
     *
     */

    ui.alert = function (text, callback) {

        var uiDialog = ui.dialog();
        var config = {};
        config.className = "bui-alert";
        config.title = "";
        config.width = 580;
        config.height = 360;
        config.scroll = true;
        config.zIndex = 111;
        config.position = "center";
        config.autoClose = true;
        config.zoom = true;
        config.buttons = [{ name: "确定", className: "primary-reverse" }];
        config.callback = callback || function () {};

        var param = $.extend(config, ui.config.alert);
        var str = "";
        try {
            //html标签
            if (typeof text == "string" && text.indexOf('<') > -1 && text.indexOf('>') > -1) {
                str = "<xmp>" + text + "</xmp>";
            } else if (text && (ui.typeof(text) === "object" || ui.typeof(text) === "array")) {
                str = JSON.stringify(text);
            } else if (text && ui.typeof(text) === "function") {
                str = text.toString();
            } else {
                str = text;
            }
            param.content = '<div class="bui-dialog-text bui-box-center" style="height:100%;">' + str + '</div>';
        } catch (e) {
            ui.showLog(e, "bui.alert");
        }

        uiDialog.create(param).open();

        return uiDialog;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    "use strict";

    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>确定提醒框</h2>
     *     <p>常见的提醒方式都可以在场景里面看到</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.confirm.html" target="_blank">demo</a></h3>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.confirm.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-confirm_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class confirm
     *  @extends bui.dialog
     *  @constructor 
     *  @param {string} text [提醒的文本 ]
     *  @param {function} [callback] [点击回调,点击的按钮通过回调的 e.target ]
     *  @example
     * 
    方法1, 确认提醒:
     *        
            bui.confirm("提醒内容",function(e){
                var text = $(e.target).text();
                if( text == "确定" ){
                  //do something
                }
                this.close();
            });
    方法2 可以修改更多参数: 
     * 
            bui.confirm({ 
                content:"确定会删除信息,不可还原",
                title:"修改了标题",
                buttons:["取消","确定"],
                callback:function(e){
                    var text = $(e.target).text();
                    if( text == "确定"){
                        // do something
                    }
                    this.close();
                }
            })
     *
     */

    ui.confirm = function (option, callback) {

        var uiDialog = ui.dialog();
        var config = {};
        config.className = "bui-confirm";
        config.title = "";
        config.width = 580;
        config.height = 360;
        config.scroll = true;
        config.zIndex = 111;
        config.autoClose = true;
        config.zoom = true;
        config.position = "center";
        config.buttons = [{ name: "取消", className: "" }, { name: "确定", className: "primary-reverse" }];
        config.callback = callback || function () {};

        var param = {};
        if ((typeof option === "undefined" ? "undefined" : _typeof(option)) === "object") {
            option.content = '<div class="bui-dialog-text bui-box-center" style="height:100%;">' + option.content + '</div>';

            param = $.extend(config, ui.config.confirm, option);
        } else {

            param = $.extend(config, ui.config.confirm);

            param.content = '<div class="bui-dialog-text bui-box-center" style="height:100%;">' + option + '</div>';
            param.callback = callback || function () {};
        }
        uiDialog.create(param).open();

        return uiDialog;
    };

    return ui;
})(window.bui || {}, window.libs);

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var bui_prompt = createCommonjsModule(function (module) {
    /**
     * UI控件库 
     * @module UI
     */

    (function (ui, $) {
        "use strict";
        /**
         * <div class="oui-fluid">
         *   <div class="span8">
         *     <h2>输入对话框,可以通过实例后的value方法获取输入的值</h2>
         *     <p>可以使用</p>
         *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.prompt.html" target="_blank">demo</a></h3>
         *   </div>
         *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.prompt.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-prompt_low.gif" alt="控件预览"/></a></div>
         * </div>
         *  @namespace bui
         *  @class prompt
         *  @extends bui.dialog
         *  @since 1.3.6
         *  @constructor 
         *  @param {string|object} option [输入的文本提醒 ]
         *  @param {function} [callback] [点击回调  this 指点击的按钮]
         *  @example
         * 
        方法1, 确认提醒:
         *        
               bui.prompt("请输入您的名字",function(ui){
                    // 获取输入的值
                    console.log(ui.value());
               })
        方法2 利用onChange做表单验证: 
         * 
              bui.prompt({
                content:"请输入手机号码",
                callback: function(ui){ 
                    var text = $(e.target).text(); 
                    console.log(this.value())
                    if(text == "确定" && checkMobile(this.value())){ 
                        this.close();
                    }
                },
                onChange: function (e) {
                    // 校验
                    if( !checkMobile(this.value()) ){
                        e.target.value = '';
                    }
                }
            })
              // 校验是否是手机号码
            function isMobile(str) {
              var re = /^1\d{10}$/
              if (re.test(str)) {
                return true;
              } else {
                return false;
              }
            }
         *
         */

        ui.prompt = function (option, callback) {

            var uiDialog = ui.dialog();
            var config = {};
            config.className = "bui-prompt";
            config.title = "";
            config.width = 580;
            config.height = 400;
            config.scroll = true;
            config.autoClose = false;
            config.zoom = true;
            config.zIndex = 111;
            config.position = "center";
            config.buttons = [{ name: "取消", className: "" }, { name: "确定", className: "primary-reverse" }];
            config.callback = callback || function () {};
            // prompt 新增信息
            config.placeholder = "";
            config.row = 1;
            config.type = "text";
            config.value = "";
            config.onChange = null;

            var param = {};
            var detail = "";
            var val = "";
            if ((typeof option === "undefined" ? "undefined" : _typeof(option)) === "object") {
                param = $.extend(config, ui.config.prompt, option);
                detail = param.content || "";
            } else {

                param = $.extend(config, ui.config.prompt);
                param.callback = callback || function () {};
                detail = option || "";
            }

            switch (param.type) {
                case "number":
                    param.content = '<div class="bui-prompt-main bui-box-vertical"> <div class="bui-prompt-label">' + detail + '</div> <div class="span1"> <input class="bui-prompt-text" placeholder="' + param.placeholder + '" type="' + param.type + '" value="' + param.value + '"/> </div> </div>';
                    break;
                default:
                    param.content = '<div class="bui-prompt-main bui-box-vertical"> <div class="bui-prompt-label">' + detail + '</div> <div class="span1"> <textarea class="bui-prompt-text" placeholder="' + param.placeholder + '" rows="' + param.row + '" >' + param.value + '</textarea> </div> </div>';
                    break;
            }

            uiDialog.create(param).open();

            $("#" + uiDialog.config.id).on("change", ".bui-prompt-text", function (e) {
                val = this.value;

                param.onChange && param.onChange.call(module, e);
            });

            /**
             * 获取输入的值或者设置
             *  @method value
             *  @since 1.3.6
             *  @example 
                
                var uiPrompt = bui.prompt("请输入您的名字",function(ui){
                    // 获取输入的值
                    console.log(ui.value());
                    // 或者
                    console.log(uiPrompt.value());
               })
                    
             */
            uiDialog.value = function (opt) {

                if (typeof opt === "undefined") {
                    return val;
                } else {
                    $("#" + uiDialog.config.id).find(".bui-prompt-text").val(opt);
                    val = opt;
                    return val;
                }
            };
            /**
             * 聚焦
             *  @method focus
             *  @since 1.4.2
             *  @example 
                
                var uiPrompt = bui.prompt("请输入您的名字",function(ui){
                    
               })
                 uiPrompt.focus();
                    
             */
            uiDialog.focus = function (opt) {

                $("#" + uiDialog.config.id).find(".bui-prompt-text").focus();
            };

            return uiDialog;
        };

        return ui;
    })(window.bui || {}, window.libs);
});

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    "use strict";
    /**
     * 
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>自动消失提示框</h2>
     *     <p>默认从底部弹出,4秒后消失,可以自行修改,也可以改成手动关闭的方式.</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.hint.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     *  {{#crossLink "bui.hint/hide"}}{{/crossLink}}: 隐藏 <br>
     *  {{#crossLink "bui.hint/show"}}{{/crossLink}}: 显示 <br>
     *  {{#crossLink "bui.hint/isShow"}}{{/crossLink}}: 当前状态 <br>
     *  {{#crossLink "bui.hint/remove"}}{{/crossLink}}: 移除 <br>
     *  {{#crossLink "bui.hint/option"}}{{/crossLink}}: 获取设置参数 <br>
     *  {{#crossLink "bui.hint/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.hint.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-hint_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class hint
     *  @constructor 
     *  @param {object} [option] 
     *     @param option.appendTo {string} [ 在某个容器内 例如:#page ]
     *     @param option.content {string} [ 提醒的内容,没有内容只是引用,不执行 ]
     *     @param option.skin {string} [ 1.5.0新增, 默认:"" | warning | primary | success | danger ]
     *     @param option.effect {string} [ 动画效果,参考toggle ]
     *     @param option.timeout {number} [ 多少秒后消失 单位:ms ]
     *     @param option.autoClose {boolean} [ 是否自动关闭 默认true | false ]
     *     @param option.position {string} [ bottom | top ]
     *     @param option.onClose {function} [ 回调 ]
     * @example
     * 
        方法1: 快速提醒
     *
            bui.hint("确定会删除信息,不可还原");
     
     *   方法2: 可以修改更多参数
     *
           bui.hint({
                appendTo: "",
                content: "",
                timeout: 2000,
                autoClose: false,      //不开启倒计时
                position: "bottom", // bottom || top
                onClose: null
            })
    
     *   方法2: 居中提醒示例
     *
        bui.hint({
            content:"<i class='icon-check'></i><br />欢迎使用BUI", 
            position:"center" , 
            effect:"fadeInDown"
        });
        
     *
     */

    ui.hint = function (option, callback) {

        var config = {
            appendTo: "",
            content: "",
            timeout: 2000,
            autoClose: true,
            showClose: false,
            opacity: 1,
            background: "",
            effect: "fadeInUp",
            skin: "", // warning info danger
            position: "bottom",
            onClose: null
        };

        if (typeof option === "number" || typeof option === "string") {
            var opt = option || "";

            option = {};
            option.content = opt;
            option.onClose = callback || null;
        } else if ((typeof option === "undefined" ? "undefined" : _typeof(option)) === "object" && option.content) {
            option = option;
        }

        //方法
        var module = {
            handle: {},
            on: on,
            off: off,
            remove: remove,
            hide: hide,
            show: show,
            isShow: isShow,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };

        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.hint, option);

        //z-index累计值
        var count = 0,
            uiToggle,
            $id = null,
            effect = "",
            status = false,
            hasEventInit = false,
            guid,
            timeout;

        if (param.content) {
            init(param);
        }

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);

            //生成guid
            guid = ui.guid();

            if (option.position === "top") {
                effect = "fadeInDown";
            } else if (option.position === "bottom") {
                effect = "fadeInUp";
            } else {
                effect = option.effect;
            }

            //获取参数使用
            param = module.config = option;

            //新增信息
            render(guid, option.content, count, option.appendTo);
            ++count;

            $id = ui.objId(guid);

            //初始化动画控制器
            uiToggle = ui.toggle({ id: $id, effect: effect });
            status = true;
            uiToggle.show();

            //开启定时
            if (option.autoClose) {

                if (timeout) {
                    clearTimeout(timeout);
                }

                //4秒自动消失
                timeout = setTimeout(function () {

                    //时间到了执行回调
                    option.onClose && option.onClose.call(module);

                    remove();
                }, option.timeout);
            }

            if (!hasEventInit) {
                bind(option);
            }

            return this;
        }

        function bind(option) {
            //绑定关闭按钮
            option.showClose && $id.on("click.bui", ".bui-hint-close", function (e) {

                remove();

                //时间到了执行回调
                option.onClose && option.onClose.call(module, e);
            });
            hasEventInit = true;
        }
        //渲染
        function render(guid, text, count, parentId) {

            //重复覆盖要在最上面
            var index = "11" + count,
                $obj = parentId ? ui.obj(parentId) : $("body"),

            //显示的位置
            position;

            switch (param.position) {
                case "top":
                    position = "bui-hint-top";
                    break;
                case "bottom":
                    position = "bui-hint-bottom";
                    break;
                case "center":
                    position = "bui-hint-center";
                    break;
            }

            var bgcolor = param.background ? 'background:' + param.background : '';
            var style = bgcolor + ';z-index:' + index + ';opacity:' + param.opacity;

            var html = '<div id="' + guid + '" class="bui-hint ' + position + ' ' + param.skin + '" style="' + style + '">' + text + '' + (param.showClose ? '<div class="bui-hint-close"><i class="icon-close"></i></div>' : '') + '</div>';

            $obj.append(html);

            //有父层的时候,位置要是相对的
            if (parentId) {
                $obj.css("position", "relative");
            }
        }

        /**
         * 当前的显示状态
         *  @method isShow
         *  @chainable
         *  @example 
            var uiHint = bui.hint("提醒的信息");
                uiHint.isShow();
                
         */
        function isShow() {

            return status;
        }

        /**
         * 新增提醒
         *  @method remove
         *  @chainable
         *  @param {string} text [提醒的文本]
         *  @example 
            var uiHint = bui.hint("提醒的信息");
                uiHint.remove();
                
         */
        function remove() {
            var _self = this;
            if (uiToggle) {
                status = false;
                uiToggle.hide(function () {
                    uiToggle.remove();
                    trigger.call(_self, "remove", { toggle: uiToggle });

                    uiToggle = null;
                });
            }
            return this;
        }
        /**
         * 隐藏提醒
         *  @method hide
         *  @chainable
         *  @param {string} text [提醒的文本]
         *  @example 
            var uiHint = bui.hint({ "content": "提醒的信息", "autoClose": true});
                
                //如果一直存在,就需要手动关闭了
                uiHint.hide();
                
         */
        function hide(callback) {
            var _self = this;
            if (uiToggle) {
                status = false;
                uiToggle.hide(function () {
                    callback && callback.call(module, { toggle: uiToggle });
                    trigger.call(_self, "hide", { toggle: uiToggle });
                });
            }
            return this;
        }
        /**
         * 显示提醒
         *  @method show
         *  @chainable
         *  @param {string} text [提醒的文本]
         *  @example 
            var uiHint = bui.hint({ "content": "提醒的信息", "autoClose": true});
                
                //如果一直存在,就需要手动关闭了
                uiHint.show();
                
         */
        function show(callback) {
            var _self = this;
            if (uiToggle) {
                status = true;
                uiToggle.show(function (argument) {
                    trigger.call(_self, "show", { toggle: uiToggle });
                    callback && callback.call(module, { toggle: uiToggle });
                });
            }
            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiHint.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            $id.off("click.bui");

            uiToggle && uiToggle.destroy(bool);

            off("show");
            off("hide");
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @since 1.4.2
         *  @param {string} [name] [ 依赖控件名 toggle ]
         *  @example 
            
            //获取依赖控件
            var uiHintWidget = uiHint.widget();
            
                
         */
        function widget(name) {
            var control = { toggle: uiToggle };
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiHint.option();
              //获取某个参数
            var id = uiHint.option( "appendTo" );
              //修改一个参数
            uiHint.option( "autoClose",true );
              //修改多个参数
            uiHint.option( {"autoClose":true} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }
        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show" | "hide"(隐藏或者移除时)   ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiHint.on("show",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show" | "hide"(隐藏或者移除时)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiHint.off("show");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }
        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {

    /**
     * 
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>下拉刷新控件</h2>
     *     <p>可以自由定义下拉事件 </p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.pullrefresh.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     *  {{#crossLink "bui.pullrefresh/reverse"}}{{/crossLink}}: 还原位置,下拉请求完数据以后,需要还原位置 <br>
     *  {{#crossLink "bui.pullrefresh/fail"}}{{/crossLink}}: 请求失败以后,可以变为点击加载 <br>
     *  {{#crossLink "bui.pullrefresh/refresh"}}{{/crossLink}}: 手动刷新数据 <br>
     *  {{#crossLink "bui.pullrefresh/option"}}{{/crossLink}}: 获取设置参数 <br>
     *  {{#crossLink "bui.pullrefresh/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *  <h5>内容交互</h5>
     *  {{#crossLink "bui.pullrefresh/lock"}}{{/crossLink}}: 锁住滑动,一般用于控件冲突 <br>
     *  {{#crossLink "bui.pullrefresh/unlock"}}{{/crossLink}}: 解锁滑动,一般用于控件冲突 <br>
     *  {{#crossLink "bui.pullrefresh/setHeight"}}{{/crossLink}}: 设置内容滚动高度 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.list_news.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-list_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class pullrefresh
     *  @constructor 
     *  @param {object} [option] 
     *     @param option.id {string} [ 控件的ID,需要满足固定的结构 ]
     *     @param option.autoLoad {boolean} [ 是否第一次先执行加载 true | false ]
     *     @param option.lastUpdated {boolean} [ 是否显示更新的时间提醒 ]
     *     @param option.distance {number} [ 默认90,下拉的距离超过才会触发事件 ]
     *     @param option.maxDistance {number} [ 1.4.2新增 默认0,下拉的距离超过最大值自动触发事件并返回 ]
     *     @param option.stopHandle {string} [ 1.4.2新增,样式名,默认为空,支持多个样式名,以逗号间隔. 当这个值等于下拉刷新里面的某个样式,不触发下拉刷新,一般用于事件冲突,比方 input[type=range] 无法滑动的时候 ]
     *     @param option.onRefresh {function} [ 上拉以后执行 ]
     *     @param option.refreshTips {object} 
     *          @param option.refreshTips.start {string} [ 开始加载的文本提醒 ]
     *          @param option.refreshTips.release {string} [ 下拉的文本提醒 ]
     *          @param option.refreshTips.end {string} [ 下拉高度不足提醒 ]
     *          @param option.refreshTips.fail {string} [ 下拉加载失败提醒 ]
     *          @param option.refreshTips.success {string} [ 成功提醒 ]
     * @example
     * 
     
     html:
     *
            <div id="scroll" class="bui-scroll">
                <div class="bui-scroll-head"></div>
                <div class="bui-scroll-main">
                    <ul class="bui-list">
                        <li class="bui-btn">这里是循环的内容</li>
                    </ul> 
                </div>
                <div class="bui-scroll-foot"></div>
            </div>
    
     js: 
     *   
            // 初始化
            var uiPullRefresh = bui.pullrefresh({
                id: "#scroll",
                onRefresh: getData
            })
            
            //数据请求示例
            var start = 1;
            var pagesize = 4;
            function getData (start,pagesize) {
                var _self = this;
                bui.ajax({
                    url: "http://localhost/mysite/yumeng/index.php/API/Usercenter/getUserList",
                    data: {
                        pageindex:start,
                        pagesize:pagesize
                    }
                }).done(function(res) {
    
                    console.log(res);
    
                    //请求成功以后还原位置
                    uiPullRefresh.reverse();
    
                }).fail(function (res) {
                    //请求失败以后改为点击加载
                    uiPullRefresh.fail();
    
                })
            }
     *
     */

    ui.pullrefresh = function (option) {

        //一个刷新要用到的默认结构
        var childrenTop = "." + ui.prefix("scroll-head"),
            childrenMain = "." + ui.prefix("scroll-main"),
            childrenBottom = "." + ui.prefix("scroll-foot");

        var config = {

            id: "",
            stopHandle: "",
            childrenTop: childrenTop,
            childrenMain: childrenMain,
            header: ".bui-page header",
            footer: ".bui-page footer",
            // 滚动的距离要大于这个数才会触发
            distance: 90,
            maxDistance: 0,

            //默认自动加载数据
            autoLoad: true,
            lastUpdated: false,
            height: 0,
            // 底下的文本提醒
            refreshTips: {
                start: "刷新中..",
                release: "松开刷新",
                end: "下拉刷新",
                fail: "刷新失败,请检查下网络再试试",
                success: "刷新成功"
            },
            onRefresh: null

            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            reverse: reverse,
            refresh: refresh,
            setHeight: setHeight,
            fail: fail,
            lock: lock,
            unlock: unlock,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.pullrefresh, option);

        var id,
            $id,
            el,
            $children,
            $childrenTop,
            $childrenMain,
            $childrenBottom,
            moveY,
            isLock = false,
            //锁定刷新
        initTime = new Date().getTime(),
            //计算更新的时间
        endText,
            //更新时间的文本
        loadUpFn,
            isLoad = false,
            //是否正在加载
        hasEventInit = false,
            isFail = false,
            loading;

        //滑动兼容处理
        var isTouchPad = /hp-tablet/gi.test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad,
            direction = "",
            lastY = 0,
            lastX = 0,
            isTouchstart = false,
            //解决PC一直触发mousemove事件
        isTouchmove = false,
            touch = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
            direction: ""
        };
        //初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);

            if (option.id) {
                $id = ui.obj(option.id);
            } else {
                ui.hint("pullrefresh id不能为空");
                return;
            }

            //option获取新参数使用
            param = module.config = option;

            el = $id[0];

            //一个scroll固有的结构
            $childrenTop = $id.children(childrenTop);
            $childrenMain = $id.children(childrenMain);
            $childrenBottom = $id.children(childrenBottom);

            //加载数据
            loadUpFn = load;

            //获取更新时间的
            endText = option.refreshTips.end;

            //创建刷新的loading
            loading = ui.loading({
                appendTo: $childrenTop,
                width: 15,
                height: 15,
                autoClose: false,
                text: endText,
                onlyText: true,
                display: "inline",
                autoTrigger: false,
                mask: false
            });

            //第一次是否先加载数据,还是等拉动刷新再加载
            if (option.autoLoad) {

                isLoad = true;

                loading.start({
                    text: option.refreshTips.start,
                    onlyText: false
                });
                loadUpFn();
            }

            if (!hasEventInit) {
                //拉动加载
                bind(option);
            }

            //设置高度才会有滚动条
            setHeight(option.height);
            // el.addEventListener("scroll", canLoad);

            return this;
        }

        //加载数据
        function load() {

            //更新的时间
            initTime = new Date().getTime();

            param.onRefresh && param.onRefresh.call(module);

            trigger.call(module, "refresh");
        }
        //更新时间的状态提醒
        function timeTips() {

            var nowTime = new Date().getTime();

            var timeCount = nowTime - initTime;

            var second = 1000,
                minute = 60 * second,
                hour = 60 * minute;

            var hours = Math.floor(timeCount / hour);
            var minutes = Math.floor(timeCount / minute);
            var seconds = Math.floor(timeCount / second);
            var text;

            if (hours <= 0 && minutes <= 0) {
                text = "刚刚更新";
            } else if (hours <= 0 && minutes > 0) {
                text = minutes + "分钟前更新";
            } else {
                text = "上次更新时间:" + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
            }

            return text;
        }

        //绑定事件
        function bind(option) {

            if (!isLock) {

                // 如果有传loadUp 则开启下拉刷新模式
                unlock();
            }

            hasEventInit = true;
        }

        //滚动条大于
        var scrollTopNum = 0;
        function onStart(e) {
            // jquery || zepto
            var targetTouches = e.originalEvent && e.originalEvent.targetTouches || e.targetTouches;
            var point = hasTouch ? targetTouches[0] : e;
            touch.x1 = point.pageX;
            touch.y1 = point.pageY;
            touch.direction = "";

            scrollTopNum = $id.scrollTop();
            // 排除掉某个样式
            if (param.stopHandle && ui.unit.checkTargetInclude(e.target, param.stopHandle)) {
                isTouchstart = false;
                return;
            }
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (targetTouches.length > 1 || e.scale && e.scale !== 1) {
                isTouchstart = false;
                return;
            }

            endText = param.lastUpdated ? timeTips() : param.refreshTips.end;

            trigger.call(module, "touchstart", e, touch);

            if ($(window).scrollTop() <= 0 && scrollTopNum <= 0 && param.onRefresh && !isLoad) {

                isTouchstart = true;
            } else {
                isTouchstart = false;
            }
        }

        // 移动过程中只修改进度条一次
        var moreThanDistance = false,
            lessThanDistance = false;

        function onMove(e) {
            // jquery || zepto

            var targetTouches = e.originalEvent && e.originalEvent.targetTouches || e.targetTouches;

            if (!isTouchstart) {
                move();
                return;
            }
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (targetTouches.length > 1 || e.scale && e.scale !== 1) {
                move();
                return;
            }
            var point = hasTouch ? targetTouches[0] : e;
            touch.x2 = point.pageX;
            touch.y2 = point.pageY;
            //第一次下拉的方向
            if (!touch.direction) {
                //方向
                touch.direction = ui.swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
            }

            trigger.call(module, "touchmove", e, touch);

            //阻止默认事件,除了滚动条,解决红米不触发end问题
            if (touch.direction === "swipeleft" || touch.direction === "swiperight") {
                e.preventDefault();
            }

            // 阻止微信的浏览器下拉事件
            if (touch.y2 - touch.y1 > 0 && scrollTopNum <= 0) {
                e.preventDefault();
            }
            if (touch.direction == "swipedown") {
                // pull 
                trigger.call(module, "movingdown", e, touch);

                //移动的距离
                moveY = Math.abs(touch.y2 - touch.y1);

                //计算移动的距离
                move(moveY / 2, false);

                if (moveY >= param.distance) {

                    if (!moreThanDistance) {
                        //释放刷新提醒
                        loading.show({
                            text: param.refreshTips.release,
                            onlyText: false
                        }).pause();

                        moreThanDistance = true;
                    }
                } else {

                    if (!lessThanDistance) {
                        //下拉提醒
                        loading.show({
                            text: endText,
                            onlyText: false
                        }).pause();

                        lessThanDistance = true;
                    }
                }
                // 可以触发touchend
                isTouchmove = true;

                // 如果有设置最大值,并且滑动的距离超过最大值,
                if (param.maxDistance > param.distance && moveY >= param.maxDistance) {
                    loading.show({
                        text: param.refreshTips.start,
                        onlyText: false
                    }).start();

                    isLoad = true;
                    //刷新加载下一页
                    param.onRefresh && loadUpFn();

                    // 不触发touchend
                    isTouchmove = false;

                    moreThanDistance = false;
                    lessThanDistance = false;
                    //清除掉这个数据
                    touch = {};

                    //保存最后的位置
                    lastY = lastY + (touch.y2 - touch.y1);
                    lastX = lastX + (touch.x2 - touch.x1);

                    touch.lastX = lastX;
                    touch.lastY = lastY;
                    //清空滑动缓存
                    touch = {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 0,
                        direction: ""
                    };

                    isTouchstart = false;
                    isTouchmove = false;
                }

                //解决红米监听不到touchend事件
                e.preventDefault();
                e.stopPropagation();
            } else if (touch.direction == "swipeup") {
                // pull 
                trigger.call(module, "movingup", e, touch);

                isTouchmove = true;
            }
        }

        function onEnd(e) {
            trigger.call(module, "touchend", e, touch);
            if (!isTouchmove) {
                //清空滑动缓存
                touch = {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 0,
                    direction: ""
                };

                isTouchstart = false;
                isTouchmove = false;
                return;
            }

            if (touch.direction == "swipedown") {
                trigger.call(module, touch.direction, e, touch);

                if (moveY >= param.distance) {

                    move(param.distance / 2);
                    //计算移动的距离

                    loading.show({
                        text: param.refreshTips.start,
                        onlyText: false
                    }).start();

                    isLoad = true;
                    //刷新加载下一页
                    param.onRefresh && loadUpFn();
                } else {

                    move();
                }

                //解决红米监听不到touchend事件
                e.stopPropagation();

                moreThanDistance = false;
                lessThanDistance = false;
                //清除掉这个数据
                touch = {};
            } else if (touch.direction == "swipeup") {
                // pull 
                trigger.call(module, touch.direction, e, touch);
            }

            //保存最后的位置
            lastY = lastY + (touch.y2 - touch.y1);
            lastX = lastX + (touch.x2 - touch.x1);

            touch.lastX = lastX;
            touch.lastY = lastY;
            //清空滑动缓存
            touch = {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0,
                direction: ""
            };

            isTouchstart = false;
            isTouchmove = false;
        }
        /**
         * 锁住拖动刷新,跟unlock配合使用
         *  @method lock
         *  @param {function} [callback] 回调
         *  @chainable
         *  @example 
         *  
            //uiPullRefresh基于顶部例子
            uiPullRefresh.lock();
           */
        function lock(callback) {
            //锁定状态
            isLock = true;

            $id.off("touchstart", onStart).off("touchmove", onMove).off("touchend", onEnd).off("touchcancel", move);

            //还原位置
            move();

            callback && callback.call(module);

            trigger.call(module, "lock");

            return this;
        }

        /**
         * 绑定拖动刷新,跟lock配合使用
         *  @method unlock
         *  @param {function} [callback] 回调
         *  @chainable
         *  @example 
         *  
            //uiPullRefresh基于顶部例子
            uiPullRefresh.unlock();
           */
        function unlock(callback) {

            isLock = false;
            //继续绑定
            $id.on("touchstart", onStart).on("touchmove", onMove).on("touchend", onEnd).on("touchcancel", move);

            callback && callback.call(this);

            trigger.call(module, "unlock");

            return this;
        }

        /**
         * 返回原位
         *  @method reverse
         *  @param {number} [num] 数字
         *  @param {boolean} [bool] 是否使用动画 true | false
         *  @param {function} [callback] 回调
         *  @chainable
         *  @example 
         *  
            //回调里面触发 uiPullRefresh基于顶部例子
            uiPullRefresh.reverse();
           */
        var timeoutRevert;

        function reverse(num, bool, callback) {
            if (!isFail) {
                loading.show({
                    text: param.refreshTips.success,
                    onlyText: false
                });
                // 定时
                // if( timeoutRevert ){
                //     clearTimeout(timeoutRevert);
                // }
                // timeoutRevert = setTimeout(function(){

                move(num, bool);

                // //清除动画过渡时间,下次拉动才不会有延迟现象
                $childrenMain.one('webkitTransitionEnd', function () {

                    //成功才会移除进度条
                    loading && loading.hide();

                    isFail = false;

                    callback && callback.call(module);
                });
                // },500)
            }

            return this;
        }

        function move(num, bool) {

            bool = bool == false ? false : true;
            num = num || 0;

            isLoad = false;

            var transition = bool ? "all 300ms ease-out" : "none";

            transform(0, num + "px", transition, $childrenMain);

            if ($childrenBottom.length) {
                transform(0, num + "px", transition, $childrenBottom);
            }

            return this;
        }

        // transform 会改变定位的层级, 跟dropdown使用时,需要设置为bui-scroll-main transform:none;
        function transform(x, y, transition, ele) {
            var transition,
                ele = ele || $id,
                //jquery 对象
            x = x || 0,
                y = y || 0,
                xRem = x,
                yRem = y,
                xVal = String(x).indexOf("%") > -1 ? String(x) : xRem,
                yVal = String(y).indexOf("%") > -1 ? String(y) : yRem;
            if (typeof transition === "number") {
                transition = "all " + transition + "ms";
            } else {
                transition = transition || "all 300ms";
            }

            try {
                // translateZ(0) 会导致中兴z802t 的下拉一次,上拉滚动加载只请求一次失效
                ele.css({
                    "-webkit-transition": transition,
                    "transition": transition,
                    "-webkit-transform": "translate(" + xVal + "," + yVal + ")",
                    "transform": "translate(" + xVal + "," + yVal + ")"
                });

                //清除动画过渡时间,下次拉动才不会有延迟现象
                ele.one('webkitTransitionEnd', function () {

                    ele.css({
                        "-webkit-transition": "none",
                        "transition": "none"
                    });
                });
            } catch (e) {
                console.log(e.message);
            }
        }

        /**
         * 请求失败改为点击加载,一般在请求的fail里面
         *  @method fail
         *  @param {object} [option] 
         *  @chainable
         *  @example 
         *  
            //uiPullRefresh基于顶部例子
            uiPullRefresh.fail();
           */
        function fail() {

            isFail = true;
            //还原位置
            move();
            ui.hint(param.refreshTips.fail);
            trigger.call(module, "fail");
        }

        /**
         * 手动刷新数据
         *  @method refresh
         *  @chainable
         *  @example 
         *  
            //uiPullRefresh基于顶部例子
            uiPullRefresh.refresh();
           */
        function refresh() {

            move(param.distance / 2, true);
            loading.start({
                text: param.refreshTips.start,
                onlyText: false
            });

            param.onRefresh && loadUpFn();
        }

        /**
         * 设置滚动的高度,常用于$(window).resize(fun)
         *  @method setHeight
         *  @param {number|string} [height] 设置的高度
         *  @chainable
         *  @example 
         *  
            //uiPullRefresh基于顶部例子
            uiPullRefresh.setHeight(300);
           */
        function setHeight(height) {
            var $page = $id.parents(".bui-page"),
                $parentMain = $page.children("main"),
                offsetTop = el && el.offsetTop || 0,
                $header = $page.children(param.header),
                $headerHeight = $header.length > 1 ? $header.eq($header.length - 1).height() : $header.height(),
                $footer = $page.children(param.footer),
                $footerHeight = $footer.length > 1 ? $footer.eq($footer.length - 1).height() : $footer.height();

            var mainHeight = window.viewport.height() - ($headerHeight || 0) - ($footerHeight || 0) - offsetTop;

            var pullRefreshHeight = height ? parseFloat(height) : mainHeight;
            //设置高度才能滚动
            $id.height(pullRefreshHeight);
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiPullRefresh.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($id) {
                $id.off();
                bool && $id.remove();
            }

            loading && loading.destroy(bool);

            off("refresh");
            off("movingdown");
            off("swipedown");
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 loading ]
         *  @example 
            
            //获取依赖控件
            var uiPullRefreshWidget = uiPullRefresh.widget();
            
                
         */
        function widget(name) {
            var control = { loading: loading };
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiPullRefresh.option();
              //获取某个参数
            var id = uiPullRefresh.option( "id" );
              //修改一个参数
            uiPullRefresh.option( "lastUpdated",false );
              //修改多个参数
            uiPullRefresh.option( {"lastUpdated":false} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "refresh"(刷新时) | "swipedown"(往下滑) | "movingdown"(往下滑移动实时)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiPullrefresh.on("refresh",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型:  "refresh"(刷新时) | "swipedown"(往下滑) | "movingdown"(往下滑移动实时)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiPullrefresh.off("refresh");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {

            /**
             * <div class="oui-fluid">
             *   <div class="span8">
             *     <h2>滚动控件</h2>
             *     <p>上拉加载,下拉刷新</p>
             *     <p>可以自由定义上拉事件,下拉事件,如果无特殊要求,推荐使用 {{#crossLink "bui.list"}}{{/crossLink}} </p>
             *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.scroll.html" target="_blank">demo</a></h3>
             *     <h3>方法说明:</h3>
             *  {{#crossLink "bui.scroll/refresh"}}{{/crossLink}}: 触发下拉的方法 <br>
             *  {{#crossLink "bui.scroll/reverse"}}{{/crossLink}}: 还原位置,下拉请求完数据以后,需要还原位置 <br>
             *  {{#crossLink "bui.scroll/load"}}{{/crossLink}}: 触发加载某一页数据 <br>
             *  {{#crossLink "bui.scroll/nextPage"}}{{/crossLink}}: 触发加载下一页数据 <br>
             *  {{#crossLink "bui.scroll/prevPage"}}{{/crossLink}}: 触发加载上一页数据 <br>
             *  {{#crossLink "bui.scroll/filter"}}{{/crossLink}}: 过滤数据 <br>
             *  {{#crossLink "bui.scroll/fail"}}{{/crossLink}}: 请求失败以后,可以变为点击加载 <br>
             *  {{#crossLink "bui.scroll/updatePage"}}{{/crossLink}}: 更新分页及缓存 <br>
             *  {{#crossLink "bui.scroll/isRefresh"}}{{/crossLink}}: 获取当前是刷新状态还是加载 <br>
             *  <h5>内容交互方法</h5>
             *  {{#crossLink "bui.scroll/lock"}}{{/crossLink}}: 不允许滚动加载 <br>
             *  {{#crossLink "bui.scroll/unlock"}}{{/crossLink}}: 允许滚动加载 <br>
             *  {{#crossLink "bui.scroll/setHeight"}}{{/crossLink}}: 设置内容滚动高度 <br>
             *  {{#crossLink "bui.scroll/to"}}{{/crossLink}}: 滚动条跳转到第几个元素 <br>
             *  <h5>公共方法</h5>
             *  {{#crossLink "bui.scroll/option"}}{{/crossLink}}: 获取设置参数 <br>
             *  {{#crossLink "bui.scroll/widget"}}{{/crossLink}}: 获取依赖控件 <br>
             *   </div>
             *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.list_news.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-list_low.gif" alt="控件预览"/></a></div>
             * </div>
             *  @namespace bui
             *  @class scroll
             *  @constructor 
             *  @param {object} [option] 
             *     @param option.id {string} [ 控件的ID,需要满足固定的结构 ]
             *     @param option.children {string} [ 列表的样式不能为空, 找到要循环遍历的元素的父层 例如 .bui-list ]
             *     @param option.handle {string} [ 默认li, 找到要循环遍历的元素  ]
             *     @param option.lastUpdated {bollean} [ 下拉的文本提醒是否显示时间 ]
             *     @param option.distance {number} [ 下拉的距离大于这个数才会触发 ]
             *     @param option.maxDistance {number} [ 1.4.2新增 默认0,下拉的距离超过最大值自动触发返回 ]
             *     @param option.stopHandle {string} [ 1.4.2新增,样式名,默认为空,支持多个样式名,以逗号间隔. 当这个值等于下拉刷新里面的某个样式,不触发下拉刷新,一般用于事件冲突,比方 input[type=range] 无法滑动的时候 ]
             *     @param option.height {number} [ 为0时,自适应高度 ]
             *     @param option.page {number} [ 请求的页数,默认为1 ]
             *     @param option.pageSize {number} [ 每页的大小,默认为10 ]
             *     @param option.autoRefresh {boolean} [ 默认false 自动刷新 ]
             *     @param option.autoNext {boolean} [ 默认true 当高度不足时,会继续请求下一页,直到高度出现滚动条 ]
             *     @param option.refresh {boolean}  [ 允许下拉刷新, 默认true | false  ]
             *     @param option.autoScroll {boolean} [ 默认true 滚动到底部触发, false 自己监听 ]
             *     @param option.onRefresh {function} [ 下拉以后执行 ]
             *     @param option.onLoad {function} [ 上拉到底部执行 ]
             *     @param option.onScrolling {function} [ 滚动时触发 ]
             *     @param option.refreshTips {object} 
             *          @param option.refreshTips.start {string} [ 开始加载的文本提醒,"刷新中.." ]
             *          @param option.refreshTips.release {string} [ 下拉的文本提醒,"松开刷新" ]
             *          @param option.refreshTips.end {string} [ 下拉高度不足提醒,"下拉刷新" ]
             *          @param option.refreshTips.fail {string} [ 下拉加载失败提醒,"点击加载" ]
             *          @param option.refreshTips.success {string} [ 成功提醒,"刷新成功" ]
             *     @param option.scrollTips {object} 
             *          @param option.scrollTips.start {string} [ 开始加载的文本提醒,"努力加载中.." ]
             *          @param option.scrollTips.end {string} [ 上拉加载的提醒,"上拉加载更多" ]
             *          @param option.scrollTips.fail {string} [ 上拉加载失败提醒,"点击重新加载" ]
             *          @param option.scrollTips.last {string} [ 最后一页的提醒,"没有更多内容" ]
             *          @param option.scrollTips.nodata {string} [ 没有数据的提醒,"没有更多内容" ]
             * @example
             *
             
             html:
             *
                    <div id="scroll" class="bui-scroll">
                        <div class="bui-scroll-head"></div>
                        <div class="bui-scroll-main">
                            <ul id="scrollList" class="bui-list">
                                <li class="bui-btn">这里是循环的内容</li>
                            </ul> 
                        </div>
                        <div class="bui-scroll-foot"></div>
                    </div>
            
             js: 
             *   
                    // 初始化
                    var uiScroll = bui.scroll({
                        id: "#scroll",
                        children: ".bui-list",
                        page:1,
                        pageSize:10,
                        onRefresh: refresh,
                        onLoad: getData
                    })
                    
                    //刷新数据
                    function refresh () {
            
                        page = 1;
                        pagesize = 10;
                        //请求数据
                        getData(page,pagesize,"html");
                    }
            
                    //滚动加载下一页
                    function getData (page,pagesize,command) {
                        command = command || "append";
                        
                        bui.ajax({
                            url: "http://localhost/mysite/yumeng/index.php/API/Usercenter/getUserList",
                            data: {
                                pageindex:page,
                                pagesize:pagesize
                            }
                        }).done(function(res) {
                            
                            var data = JSON.parse(res);//有可能需要转换,视接口而定
                            
                            //生成html
                            var html = "";
                            //数据渲染
            
                            //渲染数据
                            $("#scrollList")[command](html);
            
                            //更新分页信息
                            uiScroll.updatePage(start,res.data);
                            //还原位置
                            uiScroll.reverse();
            
                        }).fail(function (res) {
            
                            // 可以点击重新加载
                            uiScroll.fail(start,pagesize,res);
                        })
                    }
             *
             */
            ui.scroll = function (opt) {

                        //一个滚动加载需要用到的默认结构
                        var item = "." + ui.prefix("list"),
                            childrenTop = "." + ui.prefix("scroll-head"),
                            childrenMain = "." + ui.prefix("scroll-main"),
                            childrenBottom = "." + ui.prefix("scroll-foot");

                        var config = {

                                    id: "",
                                    childrenTop: childrenTop,
                                    childrenMain: childrenMain,
                                    childrenBottom: childrenBottom,
                                    children: item,
                                    stopHandle: "",
                                    header: ".bui-page header",
                                    footer: ".bui-page footer",
                                    handle: "li",
                                    distance: 100,
                                    endDistance: 1,
                                    height: 0,
                                    page: 1,
                                    pageSize: 10,
                                    lastUpdated: true,
                                    autoRefresh: false,
                                    autoNext: true,
                                    autoScroll: true,
                                    refresh: true,
                                    delayTime: 100,
                                    // 底下的文本提醒
                                    scrollTips: {
                                                start: "努力加载中..",
                                                end: "上拉加载更多",
                                                nodata: "没有更多内容",
                                                last: "没有更多内容",
                                                fail: "点击重新加载"
                                    },
                                    // 刷新的文本提醒
                                    refreshTips: {
                                                start: "刷新中..",
                                                release: "松开刷新",
                                                end: "下拉刷新",
                                                fail: "点击加载",
                                                success: "刷新成功"
                                    },
                                    onScrolling: null,
                                    // 上拉执行
                                    onRefresh: null,
                                    // 请求数据, 传页码及多少条数据
                                    onLoad: null

                                    //方法
                        };var module = {
                                    handle: {},
                                    on: on,
                                    off: off,
                                    reverse: reverse,
                                    updateCache: updatePage,
                                    updatePage: updatePage,
                                    getCache: getCache,
                                    clearCache: clearCache,
                                    fail: fail,
                                    filter: filter,
                                    to: to,
                                    scrollTop: scrollTop,
                                    lock: lock,
                                    unlock: unlock,
                                    refresh: refresh,
                                    load: loadData,
                                    nextPage: nextPage,
                                    prevPage: prevPage,
                                    setHeight: setHeight,
                                    isRefresh: isRefresh,
                                    destroy: destroy,
                                    widget: widget,
                                    option: options,
                                    config: param,
                                    init: init
                        };
                        //用于option方法的设置参数
                        var param = module.config = $.extend(true, {}, config, ui.config.scroll, opt);

                        var id,
                            $id,
                            el,
                            $win,
                            $children,
                            $childrenTop,
                            $childrenBottom,
                            $childrenMain,
                            defaultPage = param.page,
                            loadUpFn,
                            loadDownFn,
                            loading,
                            //滚动条
                        uiRefresh,
                            //定义刷新控件
                        isFail = false,
                            //请求失败
                        isUpLock = false,
                            //是否刷新已经锁定
                        isDownLock = false,
                            //是否加载已经锁定
                        isLoad = false,
                            //是否正在加载
                        isFail = false,
                            //是否失败
                        firstFlag = true,
                            //是否是第一次加载
                        nextFlag = true,
                            //加载下一页
                        lastFlag = false,
                            //最后一页
                        isRefreshing = false,
                            page = param.page,
                            pageSize = param.pageSize,
                            hasEventInit = false,
                            cache = {};

                        //初始化
                        init(param);

                        /**
                         * 初始化方法,用于重新初始化结构,事件只初始化一次
                         *  @method init
                         *  @param {object} [option] [参数控件本身]
                         *  @chainable
                         */
                        function init(opt) {
                                    var option = $.extend(true, param, opt);

                                    $win = $(window);

                                    if (option.id) {
                                                $id = ui.obj(option.id);
                                    } else {
                                                ui.hint("scroll id不能为空");
                                                return;
                                    }

                                    page = option.page;
                                    pageSize = option.pageSize;
                                    //option获取新参数使用
                                    param = module.config = option;
                                    firstFlag = true; //是否是第一次加载
                                    nextFlag = true; //加载下一页
                                    lastFlag = false; //最后一页
                                    isRefreshing = false;

                                    el = $id[0];

                                    //一个scroll固有的结构
                                    $childrenTop = $id.children(childrenTop);
                                    $childrenMain = $id.children(childrenMain);
                                    $childrenBottom = $id.children(childrenBottom);

                                    //防止第一条数据丢失
                                    $childrenMain.css({
                                                "position": "relative"
                                    });

                                    //创建loading
                                    loading = ui.loading({
                                                appendTo: $childrenBottom,
                                                width: 20,
                                                height: 20,
                                                autoClose: false,
                                                text: option.scrollTips.start,
                                                display: "inline",
                                                autoTrigger: false,
                                                mask: false
                                    });

                                    loadUpFn = loadUp;
                                    loadDownFn = loadFn;

                                    if (uiRefresh) {
                                                uiRefresh.init({
                                                            id: option.id,
                                                            onRefresh: loadUpFn,
                                                            distance: option.distance,
                                                            maxDistance: option.maxDistance,
                                                            lastUpdated: option.lastUpdated,
                                                            height: option.height,
                                                            refreshTips: option.refreshTips,
                                                            autoLoad: option.autoRefresh
                                                });
                                    } else if (option.refresh && option.onRefresh) {
                                                //绑定刷新,但默认不加载数据
                                                uiRefresh = ui.pullrefresh({
                                                            id: option.id,
                                                            onRefresh: loadUpFn,
                                                            distance: option.distance,
                                                            stopHandle: option.stopHandle,
                                                            maxDistance: option.maxDistance,
                                                            lastUpdated: option.lastUpdated,
                                                            header: option.header,
                                                            footer: option.footer,
                                                            height: option.height,
                                                            refreshTips: option.refreshTips,
                                                            autoLoad: option.autoRefresh
                                                });

                                                uiRefresh.lock();
                                                isUpLock = true;
                                    } else {
                                                //初始化高度
                                                setHeight(option.height);
                                    }
                                    try {
                                                // 先请求数据
                                                loadDownFn && loadDownFn.call(module, page, pageSize);
                                    } catch (e) {
                                                ui.showLog(e, "bui.scroll.init");
                                    }

                                    if (!hasEventInit) {
                                                //滚动加载
                                                bind(option);
                                    }

                                    return this;
                        }

                        //绑定事件
                        function bind(option) {
                                    // 如果加载了多页以后,直接调用刷新方法会多请求几次
                                    $id.on("scroll", ui.unit.debounce(loadMore, option.delayTime));

                                    hasEventInit = true;
                        }

                        //loadMore 滚动加载更多
                        function loadMore(e) {
                                    var tar = e.target;
                                    var scrollTop = tar.scrollTop || 0;
                                    // 滚到底部了
                                    // 滚动到顶部触发
                                    if (scrollTop == 0) {
                                                trigger.call(module, "scrolltop", e);
                                    } else if (tar.scrollTop + tar.clientHeight >= (tar && tar.scrollHeight - param.endDistance) && param.onLoad) {

                                                //重新修改参数
                                                param.page = module.config.page = ++page;
                                                //继续加载请求数据
                                                param.autoScroll && loadDownFn && loadDownFn.call(module, param.page, pageSize);

                                                trigger.call(module, "scrollbottom", e);
                                    }

                                    // 滚动结束触发
                                    trigger.call(module, "scrollend", e);

                                    param.onScrolling && param.onScrolling.call(module, e, module);
                        }

                        //加载数据
                        function loadFn(start, count) {

                                    isLoad = true;
                                    isRefreshing = false;
                                    if (nextFlag && !lastFlag) {
                                                //重新修改参数
                                                param.page = module.config.page = start;
                                                //是否是最后一页了
                                                param.onLoad && loading && loading.start({ text: param.scrollTips.start, onlyText: false });

                                                param.onLoad && param.onLoad.call(module, start, count);
                                    }

                                    // 解锁刷新
                                    if (isUpLock && param.refresh) {

                                                uiRefresh && uiRefresh.unlock();
                                    }

                                    return this;
                        }

                        //刷新
                        function loadUp() {

                                    isLoad = true;

                                    nextFlag = true;
                                    lastFlag = false;
                                    // 刷新以后,又是重新加载
                                    firstFlag = true;

                                    isRefreshing = true;
                                    page = defaultPage;
                                    pageSize = param.pageSize;

                                    cache = {};

                                    loading && loading.start({ text: param.scrollTips.end, onlyText: true });

                                    //重新修改参数
                                    param.page = module.config.page = page;

                                    trigger.call(module, "refresh", page);

                                    param.onRefresh && param.onRefresh.call(module, page, pageSize);
                        }
                        /**
                         * 更新请求的分页及缓存,并继续请求下一页, 旧接口<del>updateCache</del>不再使用.
                         *  @method updatePage
                         *  @param {string} start [当前分页]
                         *  @param {object} data [当前数据]
                         *  @chainable
                         *  @example 
                         *  
                            //回调里面触发 uiScroll基于顶部例子
                            uiScroll.updatePage(2,data);
                           */

                        var timeToGetHeight;
                        function updatePage(start, data, bool) {

                                    //是否继续请求下一页
                                    var bool = bool == false ? false : true;

                                    //需要缓存的数据
                                    if (data && ui.typeof(data) == "array") {
                                                data = data;
                                    } else {
                                                ui.showLog("scroll 控件的updatePage 第2个参数,必须是一个数组,如果是list控件,检测field的data映射是否准确", "bui.scroll.updatePage");
                                                data = [];
                                                return;
                                    }

                                    isLoad = false;

                                    if (timeToGetHeight) {
                                                clearTimeout(timeToGetHeight);
                                    }
                                    // 延迟获取高度,用于vuejs 等第三方的模板渲染
                                    timeToGetHeight = setTimeout(function () {
                                                //计算内容的高度
                                                var parentHeight = parseInt($id.height());

                                                var scrollHeight = parseInt($id.find(param.childrenMain)[0] && $id.find(param.childrenMain)[0].scrollHeight);

                                                //是否继续请求数据,默认是
                                                if (bool) {
                                                            // 判断是否是最后一页
                                                            if (data && data.length > pageSize - 1) {

                                                                        //可以下一页
                                                                        nextFlag = true;
                                                                        lastFlag = false;
                                                                        firstFlag = false;

                                                                        loading && loading.start({ text: param.scrollTips.end, onlyText: true });

                                                                        //高度不足,无法出现滚动条,需要继续请求数据
                                                                        if (scrollHeight >= 10 && scrollHeight < parentHeight && param.autoNext && param.onLoad) {

                                                                                    var nextPage = ++page;

                                                                                    loadDownFn && loadDownFn.call(module, nextPage, pageSize);
                                                                        }

                                                                        trigger.call(module, "loadpage", data, page);
                                                            } else {

                                                                        //已经最后一页
                                                                        nextFlag = false;
                                                                        lastFlag = true;

                                                                        //第一页没有数据那变提醒没有数据而不是提醒最后一页
                                                                        var tips = firstFlag && data.length < 1 ? param.scrollTips.nodata : param.scrollTips.last;

                                                                        loading && loading.start({ text: tips, onlyText: true });

                                                                        trigger.call(module, "loadpage", data, page);
                                                                        trigger.call(module, "lastpage", data, page);
                                                            }
                                                } else {

                                                            //无需继续请求
                                                            nextFlag = false;
                                                            lastFlag = true;

                                                            loading && loading.stop();
                                                }

                                                //缓存数据
                                                return cache[start] = data;
                                    }, 10);
                        }

                        /**
                         * 返回原位
                         *  @method reverse
                         *  @param {function} [callback] 回调
                         *  @chainable
                         *  @example 
                         *  
                            //回调里面触发 uiScroll基于顶部例子
                            uiScroll.reverse();
                           */
                        function reverse(callback) {

                                    uiRefresh && uiRefresh.reverse();

                                    callback && callback.call(module, uiRefresh);

                                    return this;
                        }

                        //isRefresh 获取执行状态
                        function isRefresh() {
                                    return isRefreshing;
                        }
                        //getCache 获取页面缓存
                        function getCache(argument) {
                                    return cache;
                        }
                        //clearCache 清除缓存
                        function clearCache(argument) {
                                    cache = {};

                                    return;
                        }

                        /**
                         * 失败点击可以重新加载当前页
                         *  @method fail
                         *  @param {number} [start] 第几页
                         *  @param {number} [count] 每页多少条
                         *  @chainable
                         *  @example 
                         *  
                            //回调里面触发 uiScroll基于顶部例子
                            uiScroll.fail();
                           */
                        function fail(start, count) {

                                    isFail = true;
                                    isUpLock = true;

                                    loading.show({
                                                text: param.scrollTips.fail,
                                                onlyText: true,
                                                callback: function callback(argument) {
                                                            //点击重新加载
                                                            loadFn(start, count);
                                                }
                                    });

                                    //锁定拖拽
                                    uiRefresh && uiRefresh.lock();

                                    return this;
                        }

                        /**
                         * 数据过滤,用于已有缓存过滤
                         *  @method filter
                         *  @param {string} keyword 关键字
                         *  @param {string} key 在哪个字段
                         *  @return {array} [返回符合条件的数据]
                         *  @example 
                         *  
                            //过滤数据中的phone字段,是否含有139224这个数据
                            var filterData = uiScroll.filter("139224","phone");
                           */
                        function filter(keyword, key) {
                                    var data = [];
                                    var i, j;

                                    if (keyword && key) {

                                                for (i in cache) {

                                                            var result = ui.array.filter(keyword, cache[i], key);

                                                            if (result.length) {
                                                                        //转变为1维数组
                                                                        for (j in result) {

                                                                                    data.push(result[j]);
                                                                        }
                                                            }
                                                }
                                    }
                                    return data;
                        }

                        /**
                         * 跳到指定元素
                         *  @method to
                         *  @param {number} index 内容的索引,例如第3个li 则 index=2
                         *  @param {function} callback 跳转后执行
                         *  @chainable
                         *  @example 
                         *  
                            uiScroll.to(2);
                           */
                        function to(index, callback) {

                                    var index = index || 0;
                                    $children = $id.find(param.children).children(param.handle);

                                    var parentHeight = $id.height(),
                                        itemHeight = parseFloat($children.height());

                                    //计算当前总高度
                                    var childHeight = el.scrollHeight;

                                    // 得到指定的索引的滚动条高度
                                    var itemScrollTop = itemHeight * parseInt(index) - itemHeight;

                                    if (childHeight > parentHeight) {

                                                el.scrollTop = itemScrollTop;
                                                trigger.call(module, "to", index);

                                                callback && callback.call(module, parseInt(index));
                                    }
                                    return this;
                        }

                        /**
                         * 跳到指定的滚动高度值
                         *  @method scrollTop
                         *  @since 1.4.3
                         *  @param {number|object} [num] [ 非必须,默认:0 ]
                         *  @chainable
                         *  @example 
                         *  
                            uiScroll.scrollTop(2);
                           */
                        function scrollTop(obj) {
                                    var num = 0;

                                    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
                                                num = $(obj)[0].offsetTop;
                                    } else if (typeof obj === "string" && obj.indexOf("#") > -1) {
                                                num = $(obj)[0].offsetTop;
                                    } else {
                                                num = parseInt(obj) || 0;
                                    }

                                    el.scrollTop = num;

                                    return this;
                        }

                        /**
                         * 设置滚动的高度,常用于$(window).resize(fun)
                         *  @method setHeight
                         *  @param {number|string} [height] 设置的高度
                         *  @chainable
                         *  @example 
                         *  
                            //uiScroll基于顶部例子
                            uiScroll.setHeight(300);
                           */
                        function setHeight(height) {
                                    var $page = $id.parents(".bui-page"),
                                        $parentMain = $page.children("main"),
                                        offsetTop = el && el.offsetTop || 0,
                                        $header = $page.children(param.header),
                                        $headerHeight = $header.length > 1 ? $header.eq($header.length - 1).height() : $header.height(),
                                        $footer = $page.children(param.footer),
                                        $footerHeight = $footer.length > 1 ? $footer.eq($footer.length - 1).height() : $footer.height();

                                    var mainHeight = window.viewport.height() - ($headerHeight || 0) - ($footerHeight || 0) - offsetTop;
                                    var pullRefreshHeight = height ? parseFloat(height) : mainHeight;
                                    //设置高度才能滚动
                                    $id.height(pullRefreshHeight);
                        }

                        /**
                         * 不允许滚动加载
                         *  @method lock
                         *  @chainable
                         *  @example 
                         *  
                            //uiScroll基于顶部例子
                            uiScroll.lock();
                           */
                        function lock() {

                                    $id.off("scroll", ui.unit.debounce(loadMore, param.delayTime));

                                    trigger.call(module, "lock");

                                    return this;
                        }

                        /**
                         * 允许滚动加载
                         *  @method unlock
                         *  @chainable
                         *  @example 
                         *  
                            //uiScroll基于顶部例子
                            uiScroll.unlock();
                           */
                        function unlock(argument) {

                                    $id.on("scroll", ui.unit.debounce(loadMore, param.delayTime));

                                    trigger.call(module, "unlock");

                                    return this;
                        }

                        /**
                         * 手动执行刷新数据
                         *  @method refresh
                         *  @chainable
                         *  @example 
                         *  
                            //uiScroll基于顶部例子
                            uiScroll.refresh();
                           */
                        function refresh() {
                                    // 刷新前先把滚动条置顶,这样可以防止多次请求.
                                    to(1);
                                    uiRefresh && uiRefresh.refresh();

                                    return this;
                        }

                        /**
                         * 手动加载更多数据
                         *  @method load
                         *  @chainable
                         *  @example 
                         *  
                            //uiScroll基于顶部例子
                            uiScroll.load();
                           */
                        function loadData(p) {
                                    var p = p || page;
                                    page = p;
                                    loadDownFn && loadDownFn.call(module, page, pageSize);

                                    return this;
                        }
                        /**
                         * 加载下一页数据
                         *  @method nextPage
                         *  @chainable
                         *  @example 
                         *  
                            //uiScroll基于顶部例子
                            uiScroll.nextPage();
                           */
                        function nextPage() {
                                    loadDownFn && loadDownFn.call(module, ++page, pageSize);
                                    return this;
                        }
                        /**
                         * 加载上一页数据
                         *  @method prevPage
                         *  @chainable
                         *  @example 
                         *  
                            //uiScroll基于顶部例子
                            uiScroll.prevPage();
                           */
                        function prevPage() {
                                    if (page-- > 0) {

                                                loadDownFn && loadDownFn.call(module, page--, pageSize);
                                    }
                                    return this;
                        }

                        /**
                         * [销毁控件]
                         *  @method destroy
                         *  @since 1.4.2
                         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
                         *  @example 
                            
                            //销毁
                            uiScroll.destroy();
                            
                         */
                        function destroy(bool) {
                                    var bool = bool == true ? true : false;

                                    if ($id) {
                                                $id.off("scroll");
                                                bool && $id.remove();
                                    }

                                    uiRefresh && uiRefresh.destroy(bool);
                                    loading && loading.destroy(bool);

                                    off("loadpage");
                                    off("lastpage");
                                    off("scrolltop");
                                    off("scrollbottom");
                                    off("scrollend");
                        }
                        /**
                         * 获取依赖的控件
                         *  @method widget
                         *  @param {string} [name] [ 依赖控件名 pullrefresh loading ]
                         *  @example 
                            
                            //获取依赖控件
                            var uiScrollWidget = uiScroll.widget();
                            
                                
                         */
                        function widget(name) {
                                    var control = { pullrefresh: uiRefresh, loading: loading };
                                    return ui.widget.call(control, name);
                        }
                        /**
                         * 获取设置参数
                         *  @method option
                         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
                         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
                         *  @chainable
                         *  @example 
                            
                            
                            //获取所有参数
                             //获取所有参数
                            var option = uiScroll.option();
                              //获取某个参数
                            var id = uiScroll.option( "id" );
                              //修改一个参数
                            uiScroll.option( "distance",100 );
                              //修改多个参数
                            uiScroll.option( {"distance":100} );
                                
                         */
                        function options(key, value) {

                                    return ui.option.call(module, key, value);
                        }
                        /**
                         * 为控件绑定事件
                         *  @event on
                         *  @since 1.3.0
                         *  @param {string} [type] [ 事件类型: "loadpage"(数据加载后) | "lastpage"(加载最后一页时触发) | "scrollend"(每次滚动结束) | "scrolltop"(滚动到顶部) |"scrollbottom"(滚动到底部)   ]
                         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
                         *  @example 
                            
                            uiScroll.on("scrollend",function () {
                                // 点击的菜单
                                console.log(this);
                            });
                            
                                
                         */
                        function on(type, callback) {
                                    ui.on.apply(module, arguments);
                                    return this;
                        }

                        /**
                         * 为控件取消绑定事件
                         *  @event off
                         *  @since 1.3.0
                         *  @param {string} [type] [ 事件类型: "loadpage"(数据加载后) | "lastpage"(加载最后一页时触发) | "scrollend"(每次滚动结束) | "scrolltop"(滚动到顶部) |"scrollbottom"(滚动到底部)  ]
                         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
                         *  @example 
                            
                            uiScroll.off("scrollend");
                            
                                
                         */
                        function off(type, callback) {
                                    ui.off.apply(module, arguments);
                                    return this;
                        }
                        /*
                         * 触发自定义事件
                         */
                        function trigger(type) {
                                    //点击事件本身,或者为空,避免循环引用
                                    module.self = this == window || this == module ? null : this;

                                    ui.trigger.apply(module, arguments);
                        }
                        return module;
            };

            return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    /**
     * 
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>列表下拉刷新</h2>
     *     <p>这是用得最多的一个控件, 你只需要传一个数据请求的地址及列表模板, 分页及交互都由控件完成. 模板的构建可以使用最简单的html字符串,也可以使用其它模板插件, 甚至目前比较流行的Vuejs 都可以很好的配合.</p>
     *     <p>list = scroll + pullrefresh 把scroll的数据请求逻辑封装,只需要传id,url,data,模板的生成器,field(把数据映射),如果需要你的页面的逻辑比较复杂,建议参考 <a href="../../index.html#pages/ui_controls/bui.scroll.html" target="_blank">bui.scroll</a> </p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.list.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.list/refresh"}}{{/crossLink}}: 手动刷新数据 <br>
     * {{#crossLink "bui.list/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.list/widget"}}{{/crossLink}}: 获取依赖的scroll控件,然后使用scroll的方法 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.list_news.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-list_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class list
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [控件id]  
     *  @param {string} option.url [数据请求地址]  
     *  @param {object} [option.data] [数据请求许可参数]  
     *  @param {string} [option.method] ["GET" || "POST"]  
     *  @param {number} [option.timeout] [默认:20000]  
     *  @param {object} [option.headers] [ {} ]  
     *  @param {number} [option.localData] [1.4.5新增,本地数据,格式保持跟接口返回数据一致,如果有本地数据,不再请求]  
     *  @param {object} [option.field] [ 请求及返回的配置字段, 例如: 请求的分页字段为 "pagination", 大小字段名为: "psize" , 返回的数据为 {"result":[]}, 则filed = { page:"pagination",size:"psize",data:"result" }  ]  
     *  @param {string} [option.field.page] [ 默认: "page", 分页的字段名, 如果分页的字段名不是"page",需要更改]  
     *  @param {string} [option.field.size] [ 默认: "pageSize", 每页多少条的字段名, 如果条数的字段名不是"pageSize",需要更改,但不能为"length"]  
     *  @param {string} [option.field.data] [ 默认: "", 返回的字段的数组在哪个字段, 例如, 返回的数据为 {"result":[]}, 则filed = {data:"result"} , 返回的数据有层级,则使用对象字符串, 例如 {"result":{ data: [] }}'result.data' ]  
     *  @param {number} [option.page] [请求的数据页数, 默认:1]  
     *  @param {number} [option.pageSize] [请求每页多少条, 默认:10]  
     *  @param {string} [option.children] [列表的选择器,默认: ".bui-list"]  
     *  @param {string} [option.handle] [列表的循环子元素,默认: ".bui-btn"]  
     *  @param {string} [option.stopHandle] [1.4.2新增,样式名,默认为空,支持多个样式名,以逗号间隔. 当这个值等于下拉刷新里面的某个样式,不触发下拉刷新,一般用于事件冲突,比方 input[type=range] 无法滑动的时候] 
     *  @param {number} [option.height] [列表的高度,0 自适应]  
     *  @param {string} [option.commandRefresh] [刷新的操作,跟jquery操作dom一样, 默认是"html"|"append"|"prepend"|]  
     *  @param {string} [option.commandLoad] [加载的操作,跟jquery操作dom一样, 默认是"append"|"prepend"|]  
     *  @param {boolean}  option.autoNext [ 默认true 当高度不足时,会继续请求下一页,直到高度出现滚动条 ]
     *  @param {boolean}  option.autoScroll [ 默认true 滚动到底部触发, false 自己监听 ]
     *  @param {boolean}  option.refresh [ 允许下拉刷新, 默认true | false  ]
     *  @param {function} [option.template] [ 请求到数据以后生成的模板,需要返回html字符串 ]  
     *  @param {function} [option.onRefresh] [ 刷新数据以后的回调 ]  
     *  @param {function} [option.onLoad] [ 页面渲染完成以后的回调 ]  
     *  @param {function} [option.onFail] [ 失败的回调 ]  
     *  @param {function} [option.callback] [ 点击每个handle的回调 ] 
     *    @param option.refreshTips.start {string} [ 开始加载的文本提醒,"刷新中.." ]
     *    @param option.refreshTips.release {string} [ 下拉的文本提醒,"松开刷新" ]
     *    @param option.refreshTips.end {string} [ 下拉高度不足提醒,"下拉刷新" ]
     *    @param option.refreshTips.fail {string} [ 下拉加载失败提醒,"点击加载" ]
     *    @param option.refreshTips.success {string} [ 成功提醒,"刷新成功" ]
     *    @param option.scrollTips {object} 
     *    @param option.scrollTips.start {string} [ 开始加载的文本提醒,"努力加载中.." ]
     *    @param option.scrollTips.end {string} [ 上拉加载的提醒,"上拉加载更多" ]
     *    @param option.scrollTips.fail {string} [ 上拉加载失败提醒,"点击重新加载" ]
     *    @param option.scrollTips.nodata {string} [ 没有数据的提醒,"没有更多内容" ]
     *  @example
     * 
     *   html:
     *
            <div id="scroll" class="bui-scroll">
                <div class="bui-scroll-head"></div>
                <div class="bui-scroll-main">
                    <ul class="bui-list">
                    </ul>
                </div>
                <div class="bui-scroll-foot"></div>
            </div>
     *      
     *   js: 
     *
          // 假设: userlist.json 返回的数据格式为: { status:200, list:[] }, 配置 field: {data:"list"}
              // 初始化
            var uilist = bui.list({ 
                id: "#scroll",
                url: "http://www.easybui.com/demo/json/userlist.json",
                data: {},
                height:300,
                field: {
                  data: "data"
                },
                template: template,
                callback: function(e) {
                  // 解决zepto的事件委托冲突 bui-btn 为整行的样式
                  if( $(e.target).hasClass("bui-btn") ){
                      // 点击整行的时候执行
                      console.log(this)
                  }
                }
              });
              // 生成模板
            function template (data) {
                var html = "";
                  $.each(data,function(index, el) {
                      html += '<li class="bui-btn"><i class="icon-facefill"></i>'+el.name+'</li>';
                });
                  return html;
            }
      
     *
     */
    ui.list = function (option) {

        var config = {
            id: "",
            url: "",
            data: {},
            method: "GET",
            dataType: "json",
            headers: {},
            contentType: "",
            timeout: 20000,
            field: {
                page: "page",
                size: "pageSize",
                data: ""
            },
            // 底下的文本提醒
            scrollTips: {
                start: "努力加载中..",
                end: "上拉加载更多",
                nodata: "没有更多内容",
                last: "没有更多内容",
                fail: "点击重新加载"
            },
            // 底下的文本提醒
            refreshTips: {
                start: "刷新中..",
                release: "松开刷新",
                end: "下拉刷新",
                fail: "点击加载",
                success: "刷新成功"
            },
            lastUpdated: false,
            page: 1,
            pageSize: 10,
            autoNext: true,
            autoScroll: true,
            native: true,
            refresh: true,
            stopHandle: "",
            children: ".bui-list",
            handle: ".bui-btn",
            header: ".bui-page header", // 页面的头部
            footer: ".bui-page footer", // 页面的底部
            height: 0,
            commandRefresh: "html",
            commandLoad: "append",
            localData: null,
            template: null,
            onRefresh: null,
            onLoad: null,
            onFail: null,
            callback: null
            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            empty: empty,
            refresh: refresh,
            modify: modify,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.list, option);

        var $id,
            id,
            el,
            defaultPage = param.page,
            $children,
            $handle,
            uiAjax,
            uiScroll,
            jsonData = {},
            hasEventInit = false,
            oldParamData = param.data,
            $target;

        //执行初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);

            //验证id
            $id = ui.obj(option.id);

            $children = $id.find(option.children);

            //option获取新参数使用
            param = module.config = option;
            jsonData = param.data;

            var onRefresh = param.refresh == false ? null : loadData;

            if (!param.url) {
                return;
            }
            if (uiScroll) {

                uiScroll.init({
                    id: option.id,
                    children: option.children,
                    handle: option.handle,
                    page: option.page,
                    pageSize: option.pageSize,
                    distance: option.distance,
                    maxDistance: option.maxDistance,
                    height: option.height,
                    refresh: option.refresh,
                    autoNext: option.autoNext,
                    autoScroll: option.autoScroll,
                    scrollTips: option.scrollTips,
                    refreshTips: option.refreshTips,
                    lastUpdated: option.lastUpdated,
                    onRefresh: onRefresh,
                    onLoad: load
                });
            } else {
                //初始化滚动加载
                uiScroll = bui.scroll({
                    id: option.id,
                    children: option.children,
                    handle: option.handle,
                    header: option.header,
                    footer: option.footer,
                    page: option.page,
                    pageSize: option.pageSize,
                    distance: option.distance,
                    stopHandle: option.stopHandle,
                    maxDistance: option.maxDistance,
                    height: option.height,
                    refresh: option.refresh,
                    autoNext: option.autoNext,
                    autoScroll: option.autoScroll,
                    scrollTips: option.scrollTips,
                    refreshTips: option.refreshTips,
                    lastUpdated: option.lastUpdated,
                    onRefresh: onRefresh,
                    onLoad: load
                });
            }

            if (!hasEventInit) {
                //绑定事件
                bind(option);
            }

            return this;
        }

        function bind(option) {

            //绑定搜索, 解决外部的事件冒泡
            // option.callback && ui.bind($id,"click",option.handle,function (e) {
            //     option.callback.call(e.target,e,module,uiScroll);
            // })
            option.callback && $id.on("click", option.handle, function (e) {
                option.callback.call(module, e);
            });

            hasEventInit = true;

            return this;
        }

        //滚动加载下一页
        function load(start, pagesize, com) {
            var _self = this;
            //跟刷新共用一套数据
            var command = com || param.commandLoad,
                pages = [],
                pageSizes = [];

            jsonData = $.extend(true, {}, oldParamData, param.data, jsonData);
            // 分页支持 page.index
            param.field.page.length && ui.unit.setKeyValue(param.field.page, start, jsonData);
            // 分页大小支持 pagesize.size
            param.field.size.length && ui.unit.setKeyValue(param.field.size, pagesize, jsonData);

            // 更新分页
            param.page = module.config.page = start;
            param.data = jsonData;

            // 如果有本地数据
            if (param.localData) {
                success(param.localData, 200);
                return;
            }
            uiAjax = ui.ajax(param).done(success).fail(function (res, status, xhr) {

                trigger.call(_self, "fail", res, start, xhr);

                param.onFail && param.onFail.call(module, status, uiScroll, start, xhr);
                // 可以点击重新加载
                uiScroll && uiScroll.fail(start, pagesize, res);
            });

            // 数组分页
            function pagination(page, size, array) {
                var offset = (page - 1) * size;
                return offset + size >= array.length ? array.slice(offset, array.length) : array.slice(offset, offset + size);
            }
            // 请求成功
            function success(res, status, xhr) {

                var dataObj, //所有结果
                datas; //二级数据

                if (typeof res === "string") {
                    dataObj = res && JSON.parse(res) || {};
                } else {
                    dataObj = res || {};
                }

                if (param && param.field && param.field.data == "") {
                    datas = dataObj || [];
                } else {

                    // 通过.分割字段名,找到对应的对象
                    datas = ui.unit.getKeyValue(param.field.data, dataObj);
                }

                // 本地数据分页
                if (param.localData) {
                    datas = pagination(start, param.pageSize, datas);
                }

                //生成html
                var html = option.template && option.template(datas, dataObj, start) || "";

                // 如果传模板才使用这种方式增加,否则利用其它方式渲染,例如vue
                html && $children && $children[command](html);

                // 获取当前执行刷新操作还是加载操作
                var isRefresh = uiScroll && uiScroll.isRefresh() || false;

                trigger.call(_self, "success", res, start, xhr);

                try {
                    if (isRefresh) {

                        // 要在load前面才能修改到请求的参数
                        param.onRefresh && param.onRefresh.call(module, uiScroll, dataObj, xhr);

                        trigger.call(_self, "refresh", res, start, xhr);

                        // 刷新的时候返回位置
                        param.refresh && uiScroll.reverse();
                    } else {

                        param.onLoad && param.onLoad.call(module, uiScroll, dataObj, xhr);
                    }

                    //更新分页信息,如果高度不足会自动请求下一页
                    if (param.localData) {
                        _self && _self.updatePage(start, datas);
                    } else {
                        uiScroll && uiScroll.updatePage(start, datas);
                    }
                } catch (e) {}
            }

            return this;
        }

        // 刷新请求数据
        function loadData() {

            var page = defaultPage;
            var pagesize = param.pageSize;

            trigger.call(this, "refreshbefore");

            load(page, pagesize, param.commandRefresh);

            return this;
        }
        /**
         * 刷新方法
         *  @method refresh
         *  @since 1.3.0
         *  @example 
            
            //获取依赖控件
            uiList.refresh();
                
         */
        function refresh() {

            trigger.call(this, "refreshbefore");

            uiScroll.refresh();

            return this;
        }

        //动态修改参数,无需重新初始化控件
        function modifyData(key, value) {
            var obj;
            if (typeof value === "string") {
                try {
                    obj = JSON.parse(value);
                } catch (e) {
                    ui.showLog("data 参数必须为对象", "bui.list.modifyData");
                    return;
                }
            } else {
                obj = value;
            }

            jsonData = $.extend(true, {}, oldParamData, obj);

            return jsonData;
        }

        /**
         * [清空数据]
         *  @method empty
         *  @since 1.4.7
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //清空数据
            uiList.empty();
            
         */
        function empty() {

            $children.html('');
        }
        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiList.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($id) {
                $id.off("click.bui");
                bool && $id.remove();
                $id = null;
            }

            off("refreshbefore");
            off("refresh");
            off("success");
            off("fail");

            uiScroll && uiScroll.destroy(bool);
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 scroll ]
         *  @example 
            
            //获取依赖控件
            var uiListScroll = uiList.widget("scroll");
            
            //使用scroll的方法
            uiListScroll.nextPage();
                
         */
        function widget(name) {
            var control = { scroll: uiScroll, ajax: uiAjax };
            return ui.widget.call(control, name);
        }

        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
            var option = uiList.option();
              //获取某个参数
            var id = uiList.option( "id" );
              //修改data参数,只是修改,不初始化. 如果修改多个参数,会自动初始化, 在onLoad 参数里面变成死循环. 
            uiList.option( "data",{"keyword":"关键字"} );
              //修改多个参数
            uiList.option( {"height":200} );
                
         */
        function options(key, value) {

            //修改data参数,不需要重新初始化
            if (key == "data" && typeof value !== "undefined") {

                return modifyData(key, value);
            } else {

                return ui.option.call(module, key, value);
            }
        }

        /**
         * 修改多个参数,但不执行初始化
         *  @method modify
         *  @param { object } [option] [ 修改参数,跟初始化一样是一个对象. ]
         *  @chainable
         *  @example 
            
              //修改多个参数
            uiList.modify( {"height":200, data:{"keyword":"关键字"} } );
                
         */
        function modify(opt) {

            param = module.config = $.extend(true, {}, module.config, opt);
            jsonData = param.data;

            return this;
        }

        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型:  "refreshbefore"(刷新前触发) | "refresh"(刷新后触发) | "success"(请求成功时触发) | "fail" (请求失败时触发)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiList.on("refresh",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型:  "refreshbefore"(刷新前触发) | "refresh"(刷新后触发) | "success"(请求成功时触发) | "fail" (请求失败时触发)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiListScroll.off("refresh");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {

    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>搜索条</h2>
     *     <p>输入时会延迟执行.示例是 searchbar 跟 list 一起使用的场景.</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.searchbar.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.searchbar/search"}}{{/crossLink}}: 单独调用搜索方法 <br>
     * {{#crossLink "bui.searchbar/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.searchbar/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.searchbar.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-searchbar_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class searchbar
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [控件id]  
     *  @param {string} [option.handle] [点击的搜索按钮]  
     *  @param {function} [option.onInput] [ 实时搜索的回调 ]  
     *  @param {function} [option.onRemove] [ 移除关键词以后的回调 ]  
     *  @param {function} [option.callback] [ 点击按钮的回调 ]  
     *  @example
     * 
     *   html:
     *
            <div id="searchbar" class="bui-searchbar">
                <div class="bui-input">
                    <i class="icon-search"></i>
                    <input type="text" value="" placeholder="搜索"/>
                </div>
            </div>
     *      
     *   js: 
     *   
            // 初始化
            var uiSearchbar = bui.searchbar({ 
                id: "#searchbar",
                callback: function(e,keyword) {
                    // 点击以后做什么事情
                }
              });
      
            
     *
     */
    // onInput 需要使用函数节流来控制输入的关键词的判断
    ui.searchbar = function (option) {

        var config = {
            id: "",
            handle: ".icon-search,.btn-search",
            handleRemove: ".icon-removefill",
            delayTime: 400,
            onInput: null,
            onRemove: null,
            callback: null
            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            search: search,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.searchbar, option);

        var $id,
            id,
            el,
            keywordCache,
            hasEventInit = false,
            $input,
            $remove,
            $target;

        //执行初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);

            //验证id
            $id = ui.obj(option.id);

            //option获取新参数使用
            param = module.config = option;

            $input = $id.find("input");

            //增加删除按钮
            $id.find(option.handleRemove).length > 0 ? $remove : $input.after('<i class="' + option.handleRemove.substr(1) + '"></i>');
            $remove = $id.find(option.handleRemove);
            $remove.hide();

            if (!hasEventInit) {
                //绑定事件
                bind(option);
            }

            return this;
        }

        function bind(option) {
            //绑定搜索
            $id.on("click.bui", option.handle, function (e) {

                document.activeElement.blur();

                var keyword = $input.val();
                keywordCache = keyword;

                trigger.call(module, "search", e, keyword);

                option.callback && option.callback.call(module, e, keyword);
            });

            //绑定删除
            $id.on("click.bui", option.handleRemove, function (e) {

                document.activeElement.blur();

                $input.val('');

                var keyword = $input.val();
                keywordCache = keyword;

                $(this).hide();

                trigger.call(module, "remove", e, keyword);
                option.onRemove && option.onRemove.call(module, e, keyword);
            });

            //监测搜索框有没有内容, 使用延迟执行优化
            $id.on("input", "input", ui.unit.debounce(function (e) {
                var keyword = $input.val();
                keywordCache = keyword;

                if (keyword) {
                    $remove.show();
                } else {
                    $remove.hide();
                }
                trigger.call(module, "input", e, keyword);
                option.onInput && option.onInput.call(module, e, keyword);
            }, option.delayTime));

            hasEventInit = true;
            return this;
        }

        /**
         * 调用搜索的方法
         *  @method search
         *  @since 1.3.0
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            uiSearchbar.search();
                
         */
        function search(keyword) {
            keyword = keyword || keywordCache;

            trigger.call(this, "search", {}, keyword);

            param.callback && param.callback.call(this, {}, keyword);

            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiSearchbar.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($id) {
                $id.off();
                bool && $id.remove();
            }

            off("search");
            off("remove");
            off("input");
        }

        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiSearchbarWidget = uiSearchbar.widget();
            
                
         */
        function widget(name) {
            var control = {};
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
            var option = uiSearchbar.option();
              //获取某个参数
            var id = uiSearchbar.option( "id" );
              //修改一个参数
            uiSearchbar.option( "handle",".btn-search" );
              //修改多个参数
            uiSearchbar.option( {"handle":".btn-search"} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "search"(搜索时触发) | "remove"(移除关键字时触发) | "input"(每次输入时触发) ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiSearchbar.on("show",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "search"(搜索时触发) | "remove"(移除关键字时触发) | "input"(每次输入时触发) ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiSearchbar.off("show");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }
        return module;
    };

    return ui;
})(bui || {}, libs);

/**
 * UI控件库 
 * @module UI
 */
(function (ui, $) {
    "use strict";

    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>选择列表</h2>
     *     <p>选择列表同样也支持动态渲染,及静态渲染,一个是简单,一个是自由,支持单选和多选,可以自己定义checkbox的样式以及位置.</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.select.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.select/value"}}{{/crossLink}}: 获取或者设置值 <br>
     * {{#crossLink "bui.select/values"}}{{/crossLink}}: 1.5新增,获取键值对数组 <br>
     * {{#crossLink "bui.select/text"}}{{/crossLink}}: 获取或者设置文本 <br>
     * {{#crossLink "bui.select/active"}}{{/crossLink}}: 选中第几个数据 <br>
     * {{#crossLink "bui.select/show"}}{{/crossLink}}: 显示 <br>
     * {{#crossLink "bui.select/hide"}}{{/crossLink}}: 隐藏 <br>
     * {{#crossLink "bui.select/selectAll"}}{{/crossLink}}: 全选 <br>
     * {{#crossLink "bui.select/selectNone"}}{{/crossLink}}: 全不选 <br>
     * {{#crossLink "bui.select/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.select/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.select.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-select_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class select
     *  @constructor 
     *  @param {object} option  
     *  @param {string} [option.id] [ select 控件id 静态绑定的ID]  
     *  @param {array} [option.data] [二级菜单的数据,静态绑定无需传数据,name,value 如果不是这2个字段,可以通过field字段配置.]  
     *  @param {string} [option.data.name] [显示的文本]  
     *  @param {string} [option.data.value] [文本的值,相当于option的value] 
     *  @param {string} [option.trigger] [触发select框的按钮,需要为ID]  
     *  @param {string} [option.triggerChildren] [选中后值的位置]  
     *  @param {string} [option.className] [自定义checkbox的值]   
     *  @param {string} [option.name] [ 1.4.5新增 radio,checkbox 上的name 值, 默认为空,会自动生成]   
     *  @param {object} [option.field] [1.4.5新增 默认,{name:"name",value:"value"}]   
     *  @param {string} [option.field.name] [ 数据的文本字段 ]   
     *  @param {string} [option.field.value] [ 数据的值字段 ]   
     *  @param {string} [option.title] [弹出层的标题]   
     *  @param {string} [option.placeholder] [等待的脚本]   
     *  @param {boolean} [option.popup] [ 是否弹出, 为true 下面效果才会有效 ]  
     *  @param {number} [option.height] [ 默认0]  
     *  @param {number} [option.width] [ 默认0]  
     *  @param {boolean} [option.autoClose] [ 默认false | true 点击以后自动关闭 checkbox 需要手动隐藏]  
     *  @param {boolean} [option.mask] [ true | false 是否显示遮罩]  
     *  @param {boolean} [option.toggle] [ 1.4.5新增 单选的时候,是否可以点击取消选择, 默认 false ]  
     *  @param {boolean} [option.fullscreen] [ false | true 是否全屏]  
     *  @param {string|array} [option.value] [ 1.4.5新增 初始化选中的文本 例如: ["广东"]  ]   
     *  @param {string} [option.effect] [出现的效果,更多参考{{#crossLink "bui.toggle"}}{{/crossLink}}]  
     *  @param {string} [option.type] [ 选择的类型 radio | checkbox | select ]  
     *  @param {string} [option.direction] [ type出现的位置 left | right | center]  
     *  @param {string} [option.position] [ 显示的位置 top | bottom | center  ]  
     *  @param {string} [option.template] [ 1.4.6新增 自定义模板, 返回每行的模板, 如例子2  ]  
     *  @param {function} [option.onChange] [ 点击checkbox | radio 的回调 ]  
     *  @param {function} [option.onInited] [ 初始化以后的回调,在值设置以后 ]  
     *  @param {array} [option.buttons] [ 底部的按钮 格式为:["确定","取消"] || [{name:"确定",className:"primary-reverse"}]  ]  
     *  @param {function} [option.callback] [ 点击确定按钮的回调 ]  
     *  @param {function} [option.callbackHandle] [ classname 用于定义触发callback, 默认为底部的按钮 .bui-dialog-foot .bui-btn ]  
     *  @param {string|object} [option.appendTo] [ 1.4.3新增 默认:"body",添加到哪里去,主要配合单页使用 ]   
     *  @example
     *
     *  例子1: 动态绑定
     *  
     *   html:
     *
            <div id="select" class="bui-select">请选择</div>
     *      
     *   js: 
     *   
            // 动态绑定初始化
            var uiSelect = bui.select({
                trigger: "#select",
                type:"checkbox",
                data: [{
                    "name":"广东",
                    "value":"11"
                },{"name":"广西",
                    "value":"22"
                },{
                    "name":"上海",
                    "value":"33"
                },{"name":"北京",
                    "value":"44"
                },{
                    "name":"深圳",
                    "value":"55"
                },{"name":"南京",
                    "value":"66"
                }]
            })
       *  例子2: 自定义模板
     *  
     *   html:
     *
            <div id="select" class="bui-select">请选择</div>
     *      
     *   js: 
     *   
            // 动态绑定初始化
            var uiSelect = bui.select({
                trigger: "#select",
                type:"checkbox",
                data: [{
                    "name":"广东",
                    "value":"11"
                },{"name":"广西",
                    "value":"22"
                },{
                    "name":"上海",
                    "value":"33"
                },{"name":"北京",
                    "value":"44"
                },{
                    "name":"深圳",
                    "value":"55"
                },{"name":"南京",
                    "value":"66"
                }],
                template: function (data) {
                    var html = '';
                    $.each(data,function (i,item) {
                        html +='<div class="bui-btn bui-btn-line bui-box">';
                        html +='    <i class="icon-face"></i>';
                        html +='<div class="span1">'+item.name+'</div>';
                        html +='<input type="checkbox" name="test" class="bui-choose" value="'+item.value+'" text="'+item.name+'">';
                        html +='</div>';
                    })
                    return html;
                }
            })
        * 例子3: 静态绑定--全屏选择列表分组示例
      
      *  html:
          <div id="select" class="bui-select bui-box">
            <div class="span1">请选择区域</div>
            <i class="icon-listright"></i>
        </div>
          <!-- select 静态弹出自定义框 放在body层-->
        <div id="select-dialog" class="bui-dialog" style="display:none;">
          <div class="bui-dialog-head bui-box-align-middle">
            <div class="span1">请选择区域</div>
            <div id="close" class="bui-btn primary round">确定</div>
          </div>
          <div class="bui-dialog-main">
            <div class="bui-list">
              <div class="bui-btn-title">
                南方
              </div>
              <div class="bui-btn bui-btn-line bui-box">
                <i class="icon-face"></i>
                <div class="span1">广东</div>
                <input type="checkbox" class="bui-choose" value="11" text="广东">
              </div>
              <div class="bui-btn bui-btn-line bui-box">
                <i class="icon-face"></i>
                <div class="span1">广西</div>
                <input type="checkbox" class="bui-choose" value="22" text="广西">
              </div>
            </div>
          </div>
        </div>
         * js:
          var uiSelect2 = bui.select({
                id:"#select-dialog",
                trigger:"#select",
                type:"checkbox",
                effect: "fadeInRight",
                position: "left",
                fullscreen: true,
                buttons: []
            });
            
        // 绑定关闭
        $("#close").on("click",function (argument) {
            uiSelect2.hide();
        });
     * 
     *
     */

    ui.select = function (option) {

        //默认配置
        var config = {
            id: "", //静态绑定        
            trigger: "",
            triggerChildren: ".span1",
            handle: ".bui-list .bui-btn",
            className: "",
            name: "",
            appendTo: "",
            data: [],
            popup: true,
            title: "",
            autoClose: false,
            placeholder: "",
            field: {
                name: "name",
                value: "value",
                image: "image",
                icon: "icon"
            },
            height: 0,
            width: 0,
            mask: true,
            change: true,
            toggle: false, // radio 不允许取消,除非设置为true
            effect: "fadeInUp",
            type: "select", //radio | checkbox | select
            direction: "left",
            position: "bottom",
            fullscreen: false,
            value: "",
            buttons: [], // {name: "确定",className: "primary"}
            onInited: null,
            onChange: null,
            callbackHandle: ".bui-dialog-foot .bui-btn",
            callback: null

            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            value: value,
            values: values,
            index: index,
            active: active,
            disabled: disabled,
            enabled: enabled,
            empty: empty,
            text: text,
            show: show,
            hide: hide,
            selectAll: selectAll,
            selectNone: selectNone,
            unselect: unselect,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(false, {}, config, ui.config.select, option);

        var $trigger,
            $id,
            $input,

        //对话框的id
        gid = ui.guid(),

        // input name 属性
        gidname = param.name || ui.guid(),
            initText,
            $children,
            uiMask,
            fieldName = param.field.name,
            fieldValue = param.field.value,
            fieldImg = param.field.image,
            fieldIcon = param.field.icon,
            selects = [],

        // 选中的文本
        selectText = [],

        // 选中的值
        selectValue = [],
            selectIndex = [],
            $handle,
            hasEventInit = false,
            uiDialog;

        //执行初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);
            // 父级的处理
            option.appendTo = option.appendTo || (ui.hasRouter ? router.currentPage() || "body" : "body");

            selectText = [];
            selectValue = [];
            selectIndex = [];
            //对话框的id
            gid = option.id ? ui.obj(option.id).attr("id") : gid;

            //option获取新参数使用
            param = module.config = option;

            //动态数据
            if (option.data && option.data.length) {
                //生成结构
                var htmlList = templateList(option.data);
            }

            //是否是弹出
            if (option.popup) {

                if (!uiDialog) {

                    // 如果有id 不用重新渲染dialog 结构
                    if (option.id) {
                        $id = ui.obj(option.id);
                    } else {
                        var htmlDialog = template();
                        $(option.appendTo).append(htmlDialog);

                        $id = ui.obj(gid);
                        // 渲染数据
                        $id.find(".bui-dialog-main").html(htmlList);
                    }

                    uiDialog = ui.dialog({
                        id: gid,
                        effect: option.effect,
                        mask: option.mask,
                        position: option.position,
                        autoClose: false,
                        height: option.height,
                        width: option.width,
                        zoom: false,
                        fullscreen: option.fullscreen,
                        onMask: function onMask(argument) {
                            hide();
                        }
                    });
                } else {

                    uiDialog.close();

                    // 重新渲染数据
                    $id.find(".bui-dialog-main").html(htmlList);
                }
            } else {

                if (!option.id) {
                    ui.hint("select id 必须有");
                    return;
                }
                $id = ui.obj(option.id);

                //动态数据
                if (option.data && option.data.length) {

                    $id.html(htmlList);
                }
            }

            $handle = $id.find(option.handle);

            // 如果不是通过data传参,则从属性拿值,设置 param.data 的值
            if (option.data.length < 1) {
                getInputValue();
            }

            if (!hasEventInit) {
                bind(option);
            }

            if (option.value) {
                value(option.value);
            }

            option.onInited && option.onInited({ target: null, value: option.value });
            return this;
        }

        // 获取静态input的值
        function getInputValue() {

            var inputValue = [],
                inputText = [];

            $handle.find('input').each(function (i, item) {
                var $input = $(this);

                if ($input.length < 1) {
                    return;
                }
                var val = $input.val();
                var valText = $input.attr("text");
                var valImg = $input.attr("image");
                var valIcon = $input.attr("icon");
                var isChecked = $input.is(':checked');

                // 从静态获取值
                param.data[i] = {};
                param.data[i][fieldName] = valText;
                param.data[i][fieldValue] = val;
                param.data[i][fieldImg] = valImg;
                param.data[i][fieldIcon] = valIcon;

                // 扁平化值
                inputValue.push(val);
                inputText.push(valText);

                // 把选中的值储存
                if (isChecked) {
                    addValue({
                        name: valText,
                        value: val,
                        index: i
                    });
                }

                // 执行回调
                // callback && callback.call(this,i,item);
            });

            return {
                value: inputValue,
                text: inputText
            };
        }

        // 增加值
        function addValue(opt) {
            var index = parseInt(opt.index, 10);
            switch (param.type) {
                case "radio":
                    selectText = [];
                    selectValue = [];
                    selectIndex = [];
                    selectText.push(opt.name);
                    selectValue.push(opt.value);
                    selectIndex.push(index);
                    break;
                case "select":
                    selectText = [];
                    selectValue = [];
                    selectIndex = [];
                    selectText.push(opt.name);
                    selectValue.push(opt.value);
                    selectIndex.push(index);
                    break;
                case "checkbox":
                    selectText.push(opt.name);
                    selectValue.push(opt.value);
                    selectIndex.push(index);
                    break;
            }
        }
        function bind(option) {
            if (option.trigger) {

                $trigger = ui.obj(option.trigger);

                //是否里面有布局的情况
                $children = $trigger.find(option.triggerChildren).length ? $trigger.find(option.triggerChildren) : $trigger;
                //初始化select的值
                initText = option.placeholder || $.trim($children.html());
                //把title设置进去,这样才能点击到
                if (option.placeholder) {

                    $children.html(option.placeholder);
                }
                //绑定按钮触发
                $trigger.on("click.bui", function (argument) {
                    if ($(this).hasClass("disabled")) {
                        return;
                    }
                    // var status = $id.attr("status") || 0;
                    // if( status == "0" ){
                    // 显示
                    show();
                    // }
                });
            }

            // 有2种改变的方式,通过方法改变,通过点击改变, 
            // 方法可以改变多个值,点击只能一次改变一个

            var change = function change(e) {
                //如果点中的是 input
                var $input = $(e.target[e.target.length - 1]),
                    val = $input.val(),
                    name = $input.attr("text"),
                    index = $input.attr("index"),

                // 这里如果点击的不是input 则取input的值,如果点击的是input,则要取相反的值
                isChecked = e.srcElement.nodeName !== 'INPUT' ? $input.is(':checked') : !$input.is(':checked');
                // 修改点击的对象为input
                e.target = $input[0];
                e.index = index;

                // 点击的是input会变成反选
                if (!isChecked) {
                    // 触发选中事件
                    trigger.call(module, "check", e);

                    // 增加数据
                    addValue({
                        name: name,
                        value: val,
                        index: index
                    });

                    // 回调
                    option.onChange && option.onChange.call(module, e);
                } else if (isChecked && (option.toggle || option.type == "checkbox")) {
                    // 选中状态,并且是多选或者设置允许切换,才可以取消,针对radio不能点击取消
                    // 触发取消选中事件
                    trigger.call(module, "uncheck", e);

                    ui.array.remove(name, selectText);
                    ui.array.remove(val, selectValue);
                    ui.array.remove(index, selectIndex);

                    // 回调
                    option.onChange && option.onChange.call(module, e);
                }

                value(selectValue.join(",") || "", e);
                text(selectText.join(",") || "");
            };

            var changeValue = function changeValue(e) {

                var $input = null;

                // jquery || zepto
                e.srcElement = e.originalEvent && e.originalEvent.srcElement || e.srcElement;

                // 如果点中的是按钮
                $input = $(this).find("input");

                e.target = [$input[0]];

                // 没选中则选中
                change.call(module, e);

                //如果是要自动关闭,那点击li会触发关闭
                if (option.popup && option.autoClose) {
                    hide();
                }

                trigger.call(module, "select", e);

                e.stopPropagation();
            };

            //绑定二级菜单点击,事件绑在input避免触发两次,因为label已经触发到input
            $id.on("click", option.handle, changeValue);

            // 点击弹窗的确定取消按钮
            var clickFooter = function clickFooter(e) {

                // 回调
                option.callback && option.callback.call(module, e, module);
                e.stopPropagation();
            };
            $id.on("click.bui", option.callbackHandle, clickFooter);

            hasEventInit = true;
        }

        //生成模板
        function template(data) {

            var html = '';
            //生成弹窗
            if (param.popup) {
                html += '<div id="' + gid + '" class="bui-dialog bui-dialog-select">';

                //多选框需要标题
                if (param.title) {
                    html += '<div class="bui-dialog-head">' + param.title + '</div>';
                }
                html += '  <div class="bui-dialog-main">';
            }

            if (param.popup) {

                html += '  </div>';

                //手动控制隐藏
                if (param.buttons.length > 0) {

                    html += '    <div class="bui-dialog-foot bui-box">';
                    $.each(param.buttons, function (i, item) {
                        html += '        <div class="span1">';
                        html += '             <div class="bui-btn ' + (item.className || '') + '" value="' + (item.value || '') + '">' + (item.name || item) + '</div>';
                        html += '        </div>';
                    });
                    html += '    </div>';
                }
                html += '</div>';
            }
            return html;
        }

        function templateCheckbox(obj) {
            var obj = obj || {};
            var input = document.createElement("input");

            var html = '';
            for (var i in obj) {
                if (typeof obj[i] === "string" || typeof obj[i] === "number") {
                    input.setAttribute(i, obj[i]);
                }
            }
            switch (param.type) {
                case "select":
                    input.setAttribute("type", "radio");
                    input.setAttribute("class", param.className || "bui-choose");
                    break;
                case "radio":
                    input.setAttribute("type", "radio");
                    input.setAttribute("class", param.className || "bui-radio");
                    break;
                case "checkbox":
                    input.setAttribute("type", "checkbox");
                    input.setAttribute("class", param.className || "bui-choose");
                    break;
                default:
                    input.setAttribute("type", "checkbox");
                    break;
            }
            return input;
        }
        //生成 list 模板
        function templateList(data) {

            var guid = gidname;
            var html = '';
            var itemHtml = '';
            var hasTemplate = param.template && param.template(data, param);

            if (hasTemplate) {
                itemHtml = hasTemplate;
            } else {
                $.each(data, function (i, el) {
                    var name = typeof el == "string" ? el : el[fieldName] || el || "";
                    var img = el && el[fieldImg] ? el[fieldImg] || el : "";
                    var icon = el && el[fieldIcon] ? el[fieldIcon] || el : "";
                    var value = el && el[fieldValue] ? el[fieldValue] || el : el || name || i;
                    var index = i;

                    var obj = {
                        name: guid,
                        value: value,
                        text: name,
                        index: index
                    };
                    img && (obj.image = img);
                    icon && (obj.icon = icon);

                    el = el && ui.typeof(el) === "object" ? el : {};

                    var newobj = $.extend(true, {}, el, obj);
                    //选择框的类型
                    var checkbox = templateCheckbox(newobj).outerHTML;

                    //label标签下如果有input外标签,比方文本在div标签下,导致ios 下的label标签无法触发input
                    itemHtml += '    <div class="bui-btn bui-box bui-btn-line">';

                    //出现的位置
                    if (param.direction == "left") {
                        itemHtml += checkbox;
                    }
                    //图片,支持路径或者样式名
                    if (img) {
                        var imgSrc = ui.unit.endWithImage(img) ? '<div class="thumbnail"><img src="' + img + '" alt="" /></div>' : '<div class="thumbnail ' + img + '"></div>';
                        itemHtml += imgSrc;
                    }
                    //图标,支持路径或者样式名
                    if (icon) {
                        var iconSrc = ui.unit.endWithImage(icon) ? '<i class="icon"><img src="' + icon + '" alt="" /></i>' : '<i class="icon ' + icon + '"></i>';
                        itemHtml += iconSrc;
                    }
                    if (param.direction == "center") {
                        //itemHtml +='        <div class="span1" align="center"><label for="check-'+guid+'-'+i+'" >'+name+'</label></div>';
                        itemHtml += '        <div class="span1" align="center">' + name + '</div>';
                        itemHtml += checkbox;
                    } else {
                        // itemHtml +='        <div class="span1"><label for="check-'+guid+'-'+i+'" >'+name+'</label></div>';
                        itemHtml += '        <div class="span1">' + name + '</div>';
                    }
                    if (param.direction == "right") {
                        itemHtml += checkbox;
                    }
                    itemHtml += '    </div>';
                });
            }

            html += '    <div class="bui-list bui-list-select">';

            html += itemHtml;

            html += '    </div>';

            return html;
        }

        /**
         * 菜单显示
         *  @method show
         *  @chainable
         *  @example 
            
            //显示菜单
            uiSelect.show();
                
         */
        function show(callback) {
            trigger.call(this, "showbefore");
            if (param.popup && uiDialog) {

                //显示菜单
                !uiDialog.isOpen() && uiDialog.open(function () {

                    callback && callback.call(module);
                    trigger.call(module, "show");
                });
            } else {
                $id.css("display", "block"); //.attr("status","1"); 

                callback && callback.call(module);
                trigger.call(module, "show");
            }

            return this;
        }
        /**
         * 清空数据
         *  @method empty
         *  @since 1.4.7
         *  @chainable
         *  @example 
            
            //清空数据
            uiSelect.empty();
                
         */
        function empty() {

            $id.html('');
            param.data = [];
            return this;
        }

        /**
         * 菜单隐藏
         *  @method hide
         *  @chainable
         *  @example 
            
            //显示菜单
            uiSelect.hide();
                
         */
        function hide(callback) {
            trigger.call(this, "hidebefore");
            if (param.popup && uiDialog) {

                //隐藏菜单
                uiDialog.isOpen() && uiDialog.close(function () {
                    callback && callback.call(module);
                    trigger.call(module, "hide");
                });
            } else {
                $id.css("display", "none"); //.attr("status","0");

                callback && callback.call(module);
                trigger.call(module, "hide");
            }

            return this;
        }

        /**
         * 获取选中的索引
         *  @method index
         *  @since 1.5.0
         *  @example 
            
            var index = uiSelect.index();
                
         */
        function index() {

            return selectIndex.join(",");
        }
        /**
         * 设置或者获取值, 会按二级菜单出现的顺序重新排序
         *  @method value
         *  @param {string} [text] [设置的值]
         *  @example 
            
            //设置值
            uiSelect.value("10");
                  // 多选,设置多个值
            uiSelect.value("10,12");
                
         */
        function value(vals, e) {

            if (typeof vals === "undefined") {
                // var attrValue = $id.attr("value");
                return selectValue.join(",");
            } else {

                $handle = $id.find(param.handle);

                var inputDoms = [];

                var _selectText = [],
                    _selectValue = [],
                    _selectIndex = [];
                var data = [];

                //为了点击确定的时候,把值设置回去
                if (typeof vals === "string" && vals.indexOf(",") > -1) {
                    data = vals.split(",");
                } else if (vals instanceof Array) {
                    data = vals;
                } else {
                    vals && data.push(vals);
                }

                param.data.forEach(function (item, i) {
                    // 对数据全部转成字符串处理,拿到的值全部会是字符串
                    // 
                    // 获取input的文本
                    var valText = item && ui.typeof(item) === "object" && item.hasOwnProperty(fieldName) ? String(item[fieldName]) : String(item);
                    var val = item && ui.typeof(item) === "object" && item.hasOwnProperty(fieldValue) ? String(item[fieldValue]) : String(item) || String(i); //没值时为索引

                    var $input = $handle.eq(i).find("input");

                    if (item == "") {
                        $input.prop("checked", false);
                        selectText = [];
                        selectValue = [];
                        selectIndex = [];
                        return;
                    }

                    var index = ui.array.index(valText, data);
                    var indexVal = ui.array.index(val, data);

                    if (indexVal > -1 || index > -1) {
                        if (param.type == "radio" || param.type == "select") {
                            _selectText = [];
                            _selectValue = [];
                            _selectIndex = [];
                        }
                        //重新排序
                        _selectText.push(valText);
                        _selectValue.push(val);

                        _selectIndex.push(i);

                        inputDoms[i] = $input;

                        //更改为确定
                        $input.prop("checked", true);
                    } else {
                        //取消选择
                        $input.prop("checked", false);
                    }
                });

                selectText = _selectText.slice(0);
                selectValue = _selectValue.slice(0);
                selectIndex = _selectIndex.slice(0);

                var context = e || { target: inputDoms[inputDoms.length - 1], index: selectIndex };

                // 最后一个触发的change,levelselect 需要用到
                trigger.call(module, "change", context);

                if ($trigger && param.change) {
                    //设置值
                    $trigger.attr("value", _selectValue.join(","));
                    $children.text(selectText.join(","));
                }

                $id.attr("value", _selectValue.join(","));
            }
        }
        /**
         * 获取对象值
         *  @method values
         *  @param {string} [text] [设置的值]
         *  @example 
            
            //设置值
            var selectVal = uiSelect.values();
            // [{name:"",value:"",index:0}]
                      
         */
        function values() {
            var vals = [];
            selectValue.forEach(function (item, i) {
                vals.push({
                    value: item,
                    name: selectText[i],
                    index: selectIndex[i]
                });
            });

            return vals;
        }

        /**
         * 设置或者获取文本
         *  @method text
         *  @param {string} [text] [设置文本]
         *  @example 
            
            //设置文本
            uiSelect.text("广东省");
                
         */
        function text(value) {

            if (typeof value === "undefined") {

                return selectText.join(",");
            } else {

                if ($trigger && param.change) {
                    $trigger.attr("text", value);
                    $children.html(value || initText);
                }

                $id.attr("text", value);

                return this;
            }
        }

        /**
         * 默认选中第几个, 支持多个
         *  @method active
         *  @since 1.3.0
         *  @param {string} [index] [索引值, 如果是多个,使用逗号分开, 例如: "0,2"]
         *  @example 
            
            //激活选中的checkbox
            uiSelect.active(1);
                
         */
        function active(index) {
            var indexs = [];
            // var inputDoms = [];
            if (String(index).indexOf(",") > -1) {
                indexs = index.split(",");
            } else {
                indexs.push(parseInt(index));
            }

            //先清空已有数据
            selectText = [];
            selectValue = [];

            indexs.forEach(function (item, i) {
                // 把选中的值存储
                param.data[item] && selectText.push(param.data[item][fieldName] || param.data[item]);
                param.data[item] && selectValue.push(param.data[item][fieldValue] || i);
            });

            if (param.type == "checkbox") {
                text(selectText.join(","));
                value(selectValue.join(","));
            } else {
                text(selectText[0]);
                value(selectValue[0]);
            }

            return this;
        }

        /**
         * 全选,多选才能全选
         *  @method selectAll
         *  @example 
            
            //设置文本
            uiSelect.selectAll();
                
         */
        function selectAll() {

            //多选才有选择
            if (param.type == "checkbox") {
                var indexs = param.data.map(function (item, i) {
                    return i;
                });
                active(indexs.join(","));
            } else {
                active(0);
            }

            return this;
        }

        /**
         * 全不选
         *  @method selectNone
         *  @example 
            
            //设置文本
            uiSelect.selectNone();
                
         */
        function selectNone() {
            //重新排序
            selectText = [];
            selectValue = [];

            //弹出菜单的时候,要知道原来设置的值哪个是选中的
            $handle.find("input").prop("checked", null);

            value("");
            text("");

            trigger.call(this, "reset");

            return this;
        }
        /**
         * 反选
         *  @method unselect
         *  @example 
            
            //设置文本
            uiSelect.unselect();
                
         */
        function unselect() {

            if (param.type == "checkbox") {
                // 缓存当前选中
                var _selevtText = selectText.map(function (item, i) {
                    return item;
                }),
                    _selectValue = selectValue.map(function (item, i) {
                    return item;
                });

                // 清空选中
                selectText = [];
                selectValue = [];
                param.data.forEach(function (item, i) {

                    var $input = $handle.eq(i).find("input");

                    var index = ui.array.index(item[fieldName], _selevtText);

                    // 存在
                    if (index > -1) {
                        $input.prop("checked", null);
                    } else {
                        $input.prop("checked", true);

                        selectText.push(item[fieldName]);
                        selectValue.push(item[fieldValue]);
                    }
                });

                value(selectValue.join(",") || "");
                text(selectText.join(",") || "");
            } else {
                selectNone();
            }

            return this;
        }
        /**
         * 阻止触发
         *  @method disabled
         *  @chainable
         *  @since 1.4
         *  @example 
            
            //显示第几个
            uiSelect.disabled();
                
         */
        function disabled() {
            var $handleItem = $trigger;

            $handleItem && $handleItem.addClass("disabled");
            return this;
        }

        /**
         * 允许触发
         *  @method enabled
         *  @chainable
         *  @since 1.4
         *  @example 
            
            //显示第几个
            uiSelect.enabled();
                
         */
        function enabled() {
            var $handleItem = $trigger;

            $handleItem && $handleItem.removeClass("disabled");
            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiSelect.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($id) {
                $id.off();
                bool && $id.remove();
            }
            if ($trigger) {
                $trigger.off("click.bui");
                bool && $trigger.remove();
            }

            uiDialog && uiDialog.destroy(bool);

            off("show");
            off("hide");
            off("change");
            off("select");
            off("check");
            off("uncheck");

            return this;
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 dialog ]
         *  @example 
            
            //获取依赖控件
            var uiSelectWidget = uiSelect.widget();
            
                
         */
        function widget(name) {
            var control = { dialog: uiDialog || {} };
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiSelect.option();
              //获取某个参数
            var id = uiSelect.option( "id" );
              //修改一个参数
            uiSelect.option( "popup",false );
              //修改多个参数
            uiSelect.option( {"popup":false} );
                
         */
        function options(key, value) {
            return ui.option.call(module, key, value);
        }
        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "change"(点击选择框改变的时候触发) | "select"(点击选择框的时候触发)| "check"(选中才触发)| "uncheck"(取消选中才触发) | "reset"(全部清0的时候触发) | "show"(如果是popup:true才会有show事件) | "hide"(如果是popup:true才会有hide事件) |  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiSelect.on("show",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "change"(点击选择框改变的时候触发) | "select"(点击选择框的时候触发)| "check"(选中才触发)| "uncheck"(取消选中才触发) | "reset"(全部清0的时候触发) | "show"(如果是popup:true才会有show事件) | "hide"(如果是popup:true才会有hide事件) |  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiSelect.off("show");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }
        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */
(function (ui, $) {
    "use strict";
    /**
     * 
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>下拉菜单</h2>
     *     <p>下拉的菜单默认是相对于页面宽度的,当你需要相对按钮宽度时,relative改为false;下拉菜单可以选中不修改值,一般在点击的时候触发,也可以控制小三角的显示,具体可以查看demo.</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.dropdown.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.dropdown/active"}}{{/crossLink}}: 初始化显示第几个二级菜单的值 <br>
     * {{#crossLink "bui.dropdown/value"}}{{/crossLink}}: 不传参则获取,传参则设置 <br>
     * {{#crossLink "bui.dropdown/text"}}{{/crossLink}}: 不传参则获取文本,传参则设置文本 <br>
     * {{#crossLink "bui.dropdown/hide"}}{{/crossLink}}: 隐藏二级菜单 <br>
     * {{#crossLink "bui.dropdown/show"}}{{/crossLink}}: 显示二级菜单 <br>
     * {{#crossLink "bui.dropdown/hideAll"}}{{/crossLink}}: 隐藏所有二级菜单 <br>
     * {{#crossLink "bui.dropdown/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.dropdown/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.dropdown.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-dropdown-scenes_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class dropdown
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [控件id]  
     *  @param {string} [option.handle] [一级菜单的按钮]  
     *  @param {string} [option.handleChildren] [文本值的位置]  
     *  @param {string} [option.target] [二级菜单,默认是按钮的下一个]   
     *  @param {string} [option.targetHandle] [二级菜单的按钮,点击触发callback]   
     *  @param {number} [option.width] [ 二级菜单的宽度,一级自适应宽度 ]  
     *  @param {boolean} [option.showArrow] [ 是否显示箭头 ]  
     *  @param {boolean} [option.showActive] [ 是否显示选中的高亮效果 ]  
     *  @param {boolean} [option.relative] [ true相对于屏幕两边 false相对于父层 ]  
     *  @param {boolean} [option.change] [ true修改文本, false只是做选择操作,可以通过change属性定义 ]  
     *  @param {boolean} [option.autoClose] [ 1.4.5新增,点击二级菜单的时候自动关闭, 默认:true | false ]  
     *  @param {boolean} [option.stopPropagation] [ 1.4.5新增,点击二级菜单的时候自动关闭, 默认:true | false ]  
     *  @param {string} [option.position] [ 显示的位置 bottom | top | left | right 也可以通过position属性设置,权限会更高 ]  
     *  @param {function} [option.callback] [ 点击按钮的回调,第一个参数是自己的引用 ]  
     *  @example
     * 
     *   html:
     *
            <div id="dropdown" class="bui-dropdown">
                <div class="bui-btn">
                    下拉菜单
                </div>
            </div>
     *      
     *   js: 
     *   
            // 初始化
            var uiDropdown = bui.dropdown({
                id: "#dropdown",
                data: [{name:"分享",value:"share"}],
            })
     *
     *
     */

    ui.dropdown = function (option) {

        //默认配置
        var config = {
            id: "",
            handle: ".bui-btn",
            handleChildren: ".span1",
            target: ".bui-list",
            targetHandle: ".bui-btn",
            data: [],
            position: "bottom",
            showArrow: false,
            showActive: true,
            autoClose: true,
            stopPropagation: false,
            width: 0,
            relative: true,
            change: true,
            callback: null

            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            active: active,
            disabled: disabled,
            enabled: enabled,
            value: value,
            text: text,
            hide: hide,
            show: show,
            hideAll: hideAll,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.dropdown, option);

        var id,
            $id,
            $menu,

        //是否使用相对定位,相对定位没有定义宽度的话是继承父层的宽度,如果
        winWidth = document.documentElement.clientWidth,
            handlers = {},
            direction,
            relative,
            submenuWidth,
            hasEventInit = false,
            $submenu,
            selectVal = "";

        //执行初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);

            if (option.id) {
                $id = ui.obj(option.id);
            } else {
                ui.showLog("dropdown id不能为空", "bui.dropdown.init");
                return;
            }

            //option获取新参数使用
            param = module.config = option;
            $menu = $id.children(option.handle);
            $submenu = option.target ? $id.find(option.target) : $menu.next();

            if (option.data.length) {
                var html = template(option.data);
                $submenu.length ? $submenu.remove() && $menu.after(html) : $id.append(html);

                $submenu = $id.find(option.target);
            }

            relative = option.relative;

            //下拉菜单的方向
            direction = $id.attr("position") || option.position;

            var offsetLeft = $id[0] && $id[0].offsetLeft >= document.documentElement.clientWidth ? 0 : $id[0] && $id[0].offsetLeft,
                left = option.width ? "auto" : -offsetLeft + "px",
                position = {
                "bottom": {
                    menuPosition: "bui-menu-bottom",
                    arrowPosition: "bui-arrow-up",
                    left: left
                },
                "top": {
                    menuPosition: "bui-menu-top",
                    arrowPosition: "bui-arrow-down",
                    left: left
                },
                "left": {
                    menuPosition: "bui-menu-left",
                    arrowPosition: "bui-arrow-right",
                    left: "auto"
                },
                "right": {
                    menuPosition: "bui-menu-right",
                    arrowPosition: "bui-arrow-left",
                    left: "100%"
                }
            };

            //二级菜单需要定宽,如果是上下,显示屏幕宽度,左右继承父层的宽度
            submenuWidth = option.width > 0 ? option.width : relative ? winWidth : option.width;

            //初始化二级菜单的宽度及隐藏状态
            if (parseFloat(submenuWidth) > 0) {
                $submenu.width(submenuWidth);
            }

            var className = option.showArrow ? position[direction]["arrowPosition"] + ' ' + position[direction]["menuPosition"] : position[direction]["menuPosition"];
            // 修正菜单左边位置
            fixmenu(className, position[direction]["left"]);

            //设置已经选择的二级菜单
            var $active = $submenu.find(option.targetHandle + ".active").eq(0);
            var index = $active.index();

            if (index > -1) {
                active(index);
            }

            if (!hasEventInit) {
                bind(option);
            }

            return this;
        }

        function bind(option) {

            // 一级菜单
            var controlMenu = function controlMenu(e) {

                if ($(this).hasClass('disabled')) {
                    return;
                }
                var isActive = $(this).hasClass('active');

                //隐藏所有二级菜单;
                hideAll();
                if (isActive) {
                    hide();
                } else {
                    show();
                }
                // 阻止冒泡才不会导致 body 触发关闭事件,这样也会导致外部绑定事件不能从父层绑定
                e.stopPropagation();
            };

            // 二级菜单
            var controlSubmenu = function controlSubmenu(e) {

                var val = $(this).attr("value") || "",
                    title = $.trim($(this).text());

                //是否修改选中以后的文本值
                var change = $id.attr("change") != undefined ? $id.attr("change") : option.change;

                //显示选中的状态
                if (option.showActive) {
                    $(this).addClass("active").siblings().removeClass('active');
                }

                value.call(this, val);

                //是否改变文本值
                if (change == true) {

                    text.call(this, title);
                }

                //隐藏菜单
                param.autoClose && hide();
                e.target = this;
                option.callback && option.callback.call(module, e);

                // 导致btn控件无法跳转页面
                param.stopPropagation && e.stopPropagation();
            };

            //一级菜单
            $menu.on('click.bui', controlMenu);

            // 二级菜单
            $id.on('click.bui', option.targetHandle, controlSubmenu);

            var hidedropdown = function hidedropdown(e) {
                hideAll();
                e.stopPropagation();
            };
            param.autoClose && $("body").off("click.bui").on("click.bui", ":not(.bui-dropdown)", hidedropdown);

            hasEventInit = true;
        }

        //修正菜单
        function fixmenu(classname, value) {

            $submenu.addClass(classname);
            if (relative) {
                $submenu.css({
                    left: value
                });
            }
        }

        /**
         * 设置或者获取值
         *  @method value
         *  @param {string} [text] [设置的值]
         *  @example 
            
            //设置值
            uiDropdown.value("10");
              //获取值
            var val = uiDropdown.value();
                
         */
        function value(text) {

            if (typeof text === "undefined") {

                var value = selectVal || $menu.attr("value");
                return value;
            } else {
                selectVal = text;
                $menu.attr("value", text);
            }

            // 如果文本值不修改,那修改value也会触发change事件
            if (!param.change) {
                trigger.call(this, "change");
            }
        }
        /**
         * 设置某一个二级菜单的值
         *  @method active
         *  @since 1.3.0
         *  @param {number} [index] [第几个二级菜单]
         *  @example 
            
            //设置值
            uiDropdown.active(1);
           */
        function active(index) {
            index = parseInt(index);
            //设置已经选择的二级菜单
            var $active = $submenu.find(param.targetHandle).eq(index);

            if ($active.length > 0) {
                var title = $.trim($active.text()),
                    val = $active.attr("value") || "";
                //设置并且隐藏菜单
                text(title);
                value(val);

                param.showActive && $active.addClass("active").siblings().removeClass("active");
            }
            return this;
        }

        /**
         * 设置或者获取文本
         *  @method text
         *  @param {string} [text] [设置文本]
         *  @example 
            
            //设置文本
            uiDropdown.text("广东省");
              //获取文本
            var val = uiDropdown.text();
                
         */
        function text(text) {
            var val = val || "";

            if (typeof text === "undefined") {

                var value = $.trim($menu.text());
                return value;
            } else {

                var $span1 = $menu.children(param.handleChildren);
                if ($span1) {
                    $span1.text(text);
                } else {
                    $menu.text(text);
                }

                trigger.call(this, "change");
            }
            return this;
        }

        /**
         * 隐藏二级菜单
         *  @method hide
         *  @example 
            
            //隐藏二级菜单
            uiDropdown.hide();
                
         */
        function hide() {
            $menu.removeClass("active");
            $submenu.css("display", "none");

            trigger.call(this, "hide");
            return this;
        }
        /**
         * 显示二级菜单
         *  @method show
         *  @example 
            
            //显示二级菜单
            uiDropdown.show();
                
         */
        function show() {
            $menu.addClass("active");
            $submenu.css("display", "block");
            trigger.call(this, "show");
            return this;
        }

        /**
        * 隐藏所有二级菜单
        *  @method hideAll
        *  @example 
           
           //显示二级菜单
           uiDropdown.hideAll();
               
        */
        function hideAll() {
            $(".bui-dropdown > .bui-btn").removeClass("active");
            $(".bui-dropdown > .bui-list").css("display", "none");

            trigger.call(this, "hide");
            return this;
        }

        function template(data) {
            var html = '';
            html += '<ul class="bui-list">';
            data.map(function (el, index) {
                html += '<li class="bui-btn" value="' + el.value + '">' + el.name + '</li>';
            });
            html += '</ul>';

            return html;
        }

        /**
         * 阻止触发
         *  @method disabled
         *  @chainable
         *  @since 1.4
         *  @example 
            
            uiDropdown.disabled();
                
         */
        function disabled() {
            var $handleItem = $menu;

            $handleItem && $handleItem.addClass("disabled");
            return this;
        }

        /**
         * 允许触发
         *  @method enabled
         *  @chainable
         *  @since 1.4
         *  @example 
            
            uiDropdown.enabled();
                
         */
        function enabled() {
            var $handleItem = $menu;

            $handleItem && $handleItem.removeClass("disabled");
            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiDropdown.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($id) {
                $id.off("click.bui");
                bool && $id.remove();
            }
            if ($menu) {
                $menu.off("click.bui");
                bool && $menu.remove();
            }

            $("body").off("click.bui");

            off("show");
            off("hide");
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiDropdownWidget = uiDropdown.widget();
            
                
         */
        function widget(name) {
            var control = {};
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
            var option = uiDropdown.option();
              //获取某个参数
            var id = uiDropdown.option( "id" );
              //修改一个参数
            uiDropdown.option( "width",200 );
              //修改多个参数
            uiDropdown.option( {"width":200} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show" | "hide" | "change" [文本值改变的时候] ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiDropdown.on("show",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show" | "hide" | "change" [文本值改变的时候] ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiDropdown.off("show");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }
        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    "use strict";
    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>折叠菜单</h2>
     *     <p>折叠菜单初始化时尽量使用ID单独初始化,它不止可以用于dl,dt 这样的结构,还可以用在panel以及自定义的结构中,更多例子参考modules/accordion_panel.html</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.accordion.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     *     {{#crossLink "bui.accordion/show"}}{{/crossLink}}: 展开第几个 <br>
     *     {{#crossLink "bui.accordion/hide"}}{{/crossLink}}: 隐藏第几个 <br>
     *     {{#crossLink "bui.accordion/showFirst"}}{{/crossLink}}: 所有折叠菜单显示第一个<br>
     *     {{#crossLink "bui.accordion/showAll"}}{{/crossLink}}: 所有折叠菜单全部展开 <br>
     *     {{#crossLink "bui.accordion/hideAll"}}{{/crossLink}}: 所有折叠菜单全部隐藏 <br>
     *     {{#crossLink "bui.accordion/option"}}{{/crossLink}}: 获取设置参数 <br>
     *     {{#crossLink "bui.accordion/widget"}}{{/crossLink}}: 获取依赖的控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.accordion.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-accordion_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class accordion
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [控件id]  
     *  @param {string} [option.handle] [点击的区域]  
     *  @param {number} [option.height] [父层高度,0则自适应]  
     *  @param {string} [option.target] [要显示隐藏的目标]  
     *  @param {number} [option.targetHeight] [目标自适应高度还是限制高度]  
     *  @param {boolean} [option.single] [ false(显示多个) || true(一次只折叠一个) ] 
     *  @param {function} [option.callback] [ 点击按钮的回调 ]  
     *  @example
     * 
     *   html:
     *
            <dl id="accordion">
                <dt class="bui-btn">折叠菜单</dt>
                <dd>
                    折叠菜单的内容
                </dd>
            </dl>
     *      
     *   js: 
     *   
            // 初始化
            var uiAccordion = bui.accordion({ 
                id: "#accordion"
              });
      
            // 展开第一个
            uiAccordion.showFirst();
     *
     */

    ui.accordion = function (option) {

        var config = {
            id: "",
            handle: "dt",
            target: "dd",
            height: 0,
            targetHeight: 0,
            // keeptop: true, 
            single: false,
            callback: null
            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            showFirst: showFirst,
            showAll: showAll,
            hideAll: hideAll,
            disabled: disabled,
            enabled: enabled,
            destroy: destroy,
            show: show,
            hide: hide,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.accordion, option);

        var $id = null,
            id,
            el,
            hasEventInit = false,
            winWidth,
            winHeight,
            handlers = {},
            $handle,
            $target;

        //执行初始化
        init(param);

        //初始化
        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);
            // 屏幕的宽度
            winWidth = window.viewport.width() || document.documentElement.clientWidth;
            winHeight = window.viewport.height() || document.documentElement.clientHeight;

            //支持样式选择器
            $id = ui.obj(option.id) || ui.obj('.' + ui.prefix('accordion'));

            //option获取新参数使用
            param = module.config = option;

            //dt
            $handle = option.handle.indexOf("#") > -1 ? ui.obj(option.handle) : $id.children(option.handle);
            //dd
            $target = option.target.indexOf("#") > -1 ? ui.obj(option.target) : $id.children(option.target);

            //初始化显示
            display(option);

            if (!hasEventInit) {
                //绑定事件
                bind(option);
            }

            return this;
        }

        //初始化显示,例如高度,例如是否一次显示一个,还是多个
        function display(option) {

            // 清除掉之前的点击状态
            $handle.removeClass("active");
            $target.css("display", "none");

            //初始化固定高度
            if (parseFloat(option.targetHeight) > 0) {
                $target.height(option.targetHeight);
            }
            //初始化父层高度
            if (parseFloat(option.height) > 0) {
                $id.height(option.height);
            }
        }
        //绑定事件
        function bind(option) {

            var controlTarget = function controlTarget(e) {
                e.target = this;
                // 如果有disabled样式,则不执行callback
                if ($(this).hasClass("disabled") || $(this).attr("href")) {
                    return;
                }
                toggle.call(this, e, option);

                option.callback && option.callback.call(module, e);
                // 加上属性判断,不然会导致外层的链接被阻止跳转
                !$(this).attr("href") && e.stopPropagation();
            };
            if (option.handle.indexOf("#") > -1) {

                $handle.on("click.bui", controlTarget);
            } else {
                $id.off("click.bui").on("click.bui", option.handle, controlTarget);
            }

            // if( option.keeptop ){
            //     $("main").on("scroll",ui.unit.debounce(keepTop,100))
            // }

            // // 保持在顶部
            // function keepTop(e) {
            //     var scrollObj = this;

            //     if( $handle.hasClass("active") ){
            //         var $handleActive = $handle.filter(".active");
            //         var scrollTopFirst = $handleActive.scrollTop();
            //         $handleActive.each(function (i,item) {
            //             scrollTop = this.offsetTop || 0;
            //             var itemHeight = this.height;

            //             if( scrollObj.scrollTop > scrollTopFirst ){
            //                 $(this).addClass("bui-fixed");
            //             }else {
            //                 console.log(scrollTop)
            //                 $(this).removeClass("bui-fixed");
            //             }

            //         })
            //     }

            // }

            hasEventInit = true;
        }

        /**
         * 阻止触发
         *  @method disabled
         *  @chainable
         *  @since 1.4
         *  @param {number} [index] [阻止第几个,从0开始算起]
         *  @example 
            
            uiAccordion.disabled(1);
                
         */
        function disabled(index) {
            var $handleItem;
            if (typeof index === "number") {
                $handleItem = $handle.eq(index);
            } else {
                $handleItem = $handle;
            }

            $handleItem && $handleItem.addClass("disabled");
            return this;
        }

        /**
         * 允许触发
         *  @method enabled
         *  @chainable
         *  @since 1.4
         *  @param {number} [index] [阻止第几个,从0开始算起]
         *  @example 
            
            uiAccordion.enabled(1);
                
         */
        function enabled(index) {
            var $handleItem;
            if (typeof index === "number") {
                $handleItem = $handle.eq(index);
            } else {
                $handleItem = $handle;
            }

            $handleItem && $handleItem.removeClass("disabled");
            return this;
        }

        //切换器
        function toggle(e, option) {
            var $this = $(this),
                isActive = $this.hasClass('active'),
                index = $handle.index(this),
                target = option.target.indexOf("#") > -1 ? ui.obj(option.target) : $this.next(option.target);

            //默认展开多个
            if (!option.single) {
                if (isActive) {
                    // hide(index);
                    $this.removeClass('active');
                    target.css("display", "none");

                    trigger.call(module, "hide", e);
                } else {
                    $this.addClass('active');
                    target.css("display", "block");
                    trigger.call(module, "show", e);
                }
            } else {

                //一次只展开一个
                if (isActive) {
                    // hide(index);
                    $this.removeClass('active');
                    target.css("display", "none");
                    trigger.call(module, "hide", e);
                } else {
                    hideAll();
                    // show(index);
                    $this.addClass('active');
                    target.css("display", "block");
                    trigger.call(module, "show", e);
                }
            }
        }

        /**
         * 显示第几个面板 这个需要绑定ID单独显示
         *  @method show
         *  @chainable
         *  @param {number} [index] [显示第几个,从0开始算起]
         *  @example 
            
            //显示第几个
            uiAccordion.show(1);
                
         */
        function show(index) {
            var index = Number(index) || 0;
            var $handleCurrent = $handle.eq(index).length ? $handle.eq(index) : $handle;
            var $targetCurrent = $target.eq(index).length ? $target.eq(index) : $handleCurrent.next(param.target);

            $handleCurrent.addClass('active');
            $targetCurrent.css("display", "block");

            trigger.call(this, "show", { target: $handle[index] });
            return this;
        }

        /**
         * 关闭第几个面板 这个需要绑定ID单独显示
         *  @method hide
         *  @chainable
         *  @param {number} [index] [关闭第几个,从0开始算起]
         *  @example 
            
            //显示第几个
            uiAccordion.hide(1);
                
         */
        function hide(index) {
            var index = Number(index) || 0;
            var $handleCurrent = $handle.eq(index).length ? $handle.eq(index) : $handle;
            var $targetCurrent = $target.eq(index).length ? $target.eq(index) : $handleCurrent.next(param.target);

            $handleCurrent.removeClass('active');
            $targetCurrent.css("display", "none");

            trigger.call(this, "hide", { target: $handle[index] });
            return this;
        }

        /**
         * 所有折叠菜单显示第一个
         *  @method showFirst
         *  @chainable
         *  @example 
            
            //显示第几个
            uiAccordion.showFirst();
                
         */
        function showFirst() {
            if ($id.length > 1) {
                $id.each(function (index, el) {
                    showIndex(0, el);
                });
            } else {
                showIndex(0);
            }

            trigger.call(this, "show", { target: $handle[0] });
            return this;
        }

        function showIndex(index, parents) {
            var index = index || 0,
                $parent = parents ? $(parents) : $id;
            $parent.children(param.handle).eq(index).addClass('active').next(param.target).css("display", "block");
        }

        /**
         * 显示所有隐藏的菜单
         *  @method showAll
         *  @chainable
         *  @example 
            
            //显示第几个
            uiAccordion.showAll();
                
         */
        function showAll() {

            $handle.each(function (i, item) {

                $(item).addClass('active').next(param.target).css("display", "block");
            });

            trigger.call(this, "showall", { target: $handle });
            return this;
        }

        /**
         * 隐藏所有展开的菜单
         *  @method hideAll
         *  @chainable
         *  @example 
            
            //隐藏第几个
            uiAccordion.hideAll();
                
         */
        function hideAll() {

            $handle.each(function (i, item) {

                $(item).removeClass('active').next(param.target).css("display", "none");
            });

            trigger.call(this, "hideall", { target: $handle });
            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiAccordion.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;
            if ($id) {
                $id.off("click.bui");
                $id.remove();
                $id = null;
            }

            off("hide");
            off("show");
        }

        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiAccordionWidget = uiAccordion.widget();
            
                
         */
        function widget(name) {
            var control = {};
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
            var option = uiAccordion.option();
              //获取某个参数
            var id = uiAccordion.option( "id" );
              //修改一个参数
            uiAccordion.option( "height",200 );
              //修改多个参数
            uiAccordion.option( {"height":200} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
         * 为控件绑定事件 
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show"(显示目标时) | "hide"(隐藏目标时)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiAccordion.on("show",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件 
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show"(显示目标时) | "hide"(隐藏目标时)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiAccordion.off("show");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
            "use strict";
            /**
             * <div class="oui-fluid">
             *   <div class="span8">
             *     <h2>星级评分</h2>
             *     <p>支持一颗星,支持半颗星, 调用show方法的时候,星星可以是按百分比显示. </p>
             *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.rating.html" target="_blank">demo</a></h3>
             *     <h3>方法说明:</h3>
             * {{#crossLink "bui.rating/show"}}{{/crossLink}}: 展示评分的星星值,支持百分比 <br>
             * {{#crossLink "bui.rating/value"}}{{/crossLink}}: 不传参则获取,传参则设置 <br>
             * {{#crossLink "bui.rating/disabled"}}{{/crossLink}}: 更改为展示星星 <br>
             * {{#crossLink "bui.rating/option"}}{{/crossLink}}: 获取设置参数 <br>
             * {{#crossLink "bui.rating/widget"}}{{/crossLink}}: 获取依赖控件 <br>
             *   </div>
             *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.rating.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-rating_low.gif" alt="控件预览"/></a></div>
             * </div>
             *  @namespace bui
             *  @class rating
             *  @constructor 
             *  @param {object} option  
             *  @param {string} option.id [控件id]    
             *  @param {string} [option.handle] [点击的区域,属于循环的那部分]  
             *  @param {boolean} [option.half] [是否支持半颗星]  
             *  @param {number} [option.stars] [显示多少颗星星]
             *  @param {number} [option.value] [初始化多少颗星星]
             *  @param {number} [option.show] [展示多少颗星星比如 3.6 最后一颗星星会转换成60%]
             *  @param {boolean} [option.disabled] [是否只读]
             *  @param {boolean} [option.render] [ true | false 默认true,这样无需填写复杂的结构]
             *  @param {function} [option.callback] [ 点击按钮的回调 ]  
             *  @example
             * 
             *   html:
             *
                    <div id="rating" class="bui-rating"></div>
             *      
             *   js: 
             *   
                    // 初始化
                    var uiRating = bui.rating({
                                id:'#rating'
                            });
                    //获取值
                    uiRating.value(); 
             *
             */

            ui.rating = function (option) {

                        // 新增静态渲染,支持多个
                        var config = {
                                    id: "",
                                    handle: ".bui-rating-cell",
                                    fullClassName: "bui-rating-cell-full",
                                    halfClassName: "bui-rating-cell-half",
                                    half: false,
                                    stars: 5,
                                    value: 0,
                                    disabled: false,
                                    render: true,
                                    callback: null
                        };
                        //方法
                        var module = {
                                    handle: {},
                                    on: on,
                                    off: off,
                                    disabled: disabled,
                                    show: show,
                                    value: value,
                                    destroy: destroy,
                                    widget: widget,
                                    option: options,
                                    config: param,
                                    init: init
                        };
                        //用于option方法的设置参数
                        var param = module.config = $.extend(true, {}, config, ui.config.rating, option);

                        var $id,
                            el,
                            fullClass,
                            halfClass,
                            val,
                            hasEventInit = false,
                            $handle;

                        //初始化
                        init(param);

                        /**
                         * 初始化方法,用于重新初始化结构,事件只初始化一次
                         *  @method init
                         *  @param {object} [option] [参数控件本身]
                         *  @chainable
                         */
                        function init(opt) {
                                    var option = $.extend(true, param, opt);

                                    if (option.id) {
                                                $id = ui.obj(option.id);
                                    } else {
                                                ui.hint("rating id不能为空");
                                                return;
                                    }

                                    //option获取新参数使用
                                    param = module.config = option;

                                    fullClass = option.fullClassName;
                                    halfClass = option.halfClassName;

                                    //初始化
                                    display(option);

                                    if (!hasEventInit) {
                                                //绑定点击事件
                                                bind(option);
                                    }

                                    return this;
                        }

                        function template(option) {

                                    var guid = ui.guid();
                                    var html = "",
                                        i = 0,
                                        length = option.stars;

                                    for (i = 0; i < length; i++) {
                                                html += '<div class="bui-rating-cell" ></div>';
                                    }

                                    return html;
                        }

                        function showTemplate(num) {

                                    var html = "",
                                        num = String(num) || String(val),
                                        percent,
                                        i = 0,
                                        length = param.stars;

                                    var groupNum = [];
                                    groupNum = num.indexOf(".") > -1 ? num.split(".") : [num, 0];

                                    var intValue = parseInt(groupNum[0]);
                                    percent = groupNum[1] / 10 * 100 + "%";

                                    for (i = 0; i < length; i++) {

                                                if (i < intValue) {

                                                            html += '<div class="bui-rating-cell" ><div class="bui-rating-cell-full" style="width:100%;">&nbsp;</div></div>';
                                                }
                                                if (i == intValue) {

                                                            html += '<div class="bui-rating-cell" ><div class="bui-rating-cell-full" style="width:' + percent + ';">&nbsp;</div></div>';
                                                }
                                                if (i > intValue) {
                                                            html += '<div class="bui-rating-cell" ><div class="bui-rating-cell-full" style="width:0;">&nbsp;</div></div>';
                                                }
                                    }

                                    return html;
                        }

                        //绑定事件
                        function bind(option) {

                                    if (!option.disabled) {

                                                //是整数还是浮点数
                                                var click = String(option.value).indexOf(".") > -1 ? 1 : 0;

                                                $id.on("click.bui", option.handle, function (e) {

                                                            var index = $(this).index();
                                                            var num = 0;
                                                            //是否支持一半
                                                            if (option.half) {
                                                                        var classname = click % 2 == 0 ? halfClass : fullClass;
                                                                        num = click % 2 == 0 ? index + 0.5 : index + 1;
                                                            } else {
                                                                        num = index + 1;
                                                            }

                                                            //添加星星
                                                            rating(num);
                                                            //设置点击以后的值
                                                            value(num);

                                                            //累计点击了多少次
                                                            click++;

                                                            option.callback && option.callback.call(module, e);

                                                            e.stopPropagation();
                                                });
                                    }

                                    hasEventInit = true;
                        }

                        //初始化显示的状态
                        function display(option) {

                                    if (option.render) {
                                                var html = template(option);

                                                $id.html(html);

                                                $handle = $id.children(option.handle);
                                    } else {
                                                $handle = $id.children(option.handle);
                                    }

                                    //rating( option.value );
                                    // if( !option.disabled ){

                                    value(option.value);
                                    // }else{
                                    //  show(option.value);
                                    // }
                        }

                        //新增星星
                        function rating(index) {

                                    //是否有小数点
                                    var indexs = [];
                                    index = String(index);

                                    if (param.half && index.indexOf(".") > -1) {
                                                indexs = index.split('.');
                                    } else {
                                                indexs.push(index);
                                    }

                                    //移除所有星星
                                    $handle.removeClass(fullClass).removeClass(halfClass);

                                    $handle.each(function (i, item) {
                                                //如果长度1未则是整数
                                                if (indexs.length == 1 && i < indexs[0]) {
                                                            $(item).addClass(fullClass);
                                                } else if (indexs.length == 2) {

                                                            if (i < indexs[0]) {
                                                                        $(item).addClass(fullClass);
                                                            }

                                                            if (i == indexs[0]) {
                                                                        $(item).addClass(halfClass);
                                                            }
                                                }
                                    });
                        }

                        /**
                        * 设置星星的值
                        *  @method value
                        *  @param {string} [num] [设置值]
                        *  @example 
                           
                           //设置值
                           uiRating.value(3);
                             //获取值
                           var val = uiRating.value();
                               
                        */
                        function value(num) {

                                    if (num) {

                                                $id.attr("value", num);

                                                rating(num);
                                                val = num;

                                                trigger.call(module, "change", num);
                                    } else {
                                                val = $id.attr("value");
                                    }

                                    return val;
                        }

                        /**
                        * 展示评分的星星值,只读,支持星星的百分比展示
                        *  @method show
                        *  @chainable
                        *  @param {string} [num] [设置值]
                        *  @example 
                           
                           //设置值
                           uiRating.show(3);
                               
                        */
                        function show(num) {

                                    var html = showTemplate(num);

                                    $id.attr("value", num).html(html);

                                    val = num;
                        }
                        /**
                         * 禁止评分
                         *  @method disabled
                         *  @chainable
                         *  @example 
                            
                            //禁止评分
                            uiRating.disabled();
                                
                         */
                        function disabled(bool) {

                                    var bool = bool == false ? false : true;
                                    if (bool) {

                                                $id.off("click.bui", param.handle);

                                                trigger.call(module, "disabled");
                                    } else {

                                                undisabled();
                                    }

                                    return this;
                        }
                        /**
                         * 允许评分
                         *  @method undisabled
                         *  @chainable
                         *  @example 
                            
                            //允许评分
                            uiRating.undisabled();
                                
                         */
                        function undisabled(bool) {

                                    param.disabled = false;
                                    bind();

                                    trigger.call(module, "undisabled");

                                    return this;
                        }

                        /**
                         * [销毁控件]
                         *  @method destroy
                         *  @since 1.4.2
                         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
                         *  @example 
                            
                            //销毁
                            uiRating.destroy();
                            
                         */
                        function destroy(bool) {
                                    var bool = bool == true ? true : false;

                                    if ($id) {
                                                $id.off("click.bui");
                                                bool && $id.remove();
                                    }

                                    off("change");
                        }
                        /**
                         * 获取依赖的控件
                         *  @method widget
                         *  @param {string} [name] [ 依赖控件名 ]
                         *  @example 
                            
                            //获取依赖控件
                            var uiRatingWidget = uiRating.widget();
                            
                                
                         */
                        function widget(name) {
                                    var control = {};
                                    return ui.widget.call(control, name);
                        }
                        /**
                         * 获取设置参数
                         *  @method option
                         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
                         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
                         *  @chainable
                         *  @example 
                            
                            
                            //获取所有参数
                             //获取所有参数
                            var option = uiRating.option();
                              //获取某个参数
                            var id = uiRating.option( "id" );
                              //修改一个参数
                            uiRating.option( "half",false );
                              //修改多个参数
                            uiRating.option( {"half":false} );
                                
                         */
                        function options(key, value) {

                                    return ui.option.call(module, key, value);
                        } /**
                          * 为控件绑定事件
                          *  @event on
                          *  @since 1.3.0
                          *  @param {string} [type] [ 事件类型: "change" ]
                          *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
                          *  @example 
                             
                             uiRating.on("show",function () {
                                 // 点击的菜单
                                 console.log(this);
                             });
                             
                                 
                          */
                        function on(type, callback) {
                                    ui.on.apply(module, arguments);
                                    return this;
                        }

                        /**
                         * 为控件取消绑定事件
                         *  @event off
                         *  @since 1.3.0
                         *  @param {string} [type] [ 事件类型: "change"  ]
                         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
                         *  @example 
                            
                            uiRating.off("show");
                            
                                
                         */
                        function off(type, callback) {
                                    ui.off.apply(module, arguments);
                                    return this;
                        }
                        /*
                         * 触发自定义事件
                         */
                        function trigger(type) {
                                    //点击事件本身,或者为空,避免循环引用
                                    module.self = this == window || this == module ? null : this;

                                    ui.trigger.apply(module, arguments);
                        }
                        return module;
            };

            return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */
(function (ui, $) {
    "use strict";

    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>弹出菜单</h2>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.actionsheet.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.actionsheet/hide"}}{{/crossLink}}: 隐藏二级菜单 <br>
     * {{#crossLink "bui.actionsheet/show"}}{{/crossLink}}: 显示二级菜单 <br>
     * {{#crossLink "bui.actionsheet/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.actionsheet/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.actionsheet.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-actionsheet_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class actionsheet
     *  @constructor 
     *  @param {object} option  
     *  @param {array}  option.buttons [ 有多少个按钮,是一个数组,例如:[{ name:"分享到微博",value:"weibo" }],还可以有className,自定义每个按钮的样式 ]  
     *  @param {string} [option.trigger] [ 触发按钮的id ]  
     *  @param {string} [option.handle] [ 点击上面的按钮 ]  
     *  @param {string} [option.position] [ 位置 bottom || top ]   
     *  @param {string|object} [option.appendTo] [ 1.4.3新增 默认:"body",添加到哪里去,主要配合单页使用 ]   
     *  @param {number} [option.width] [ 0 为自适应 ]  
     *  @param {boolean} [option.mask] [ 是否显示遮罩 ]  
     *  @param {number} [option.opacity] [ 遮罩的透明度 默认:0.3 ]  
     *  @param {string} [option.cancelText] [ 取消的文本, 为空则不显示 ]  
     *  @param {function} [option.callback] [ 点击按钮的回调 ]  
     *  @example
     * 
     *   html:
     *
            <div id="btnOpen" class="bui-btn">actionsheet</div>
     *      
     *   js: 
     *   
            // 初始化
            var uiActionsheet = bui.actionsheet({
                trigger: "#btnOpen",
                buttons: [{ name:"分享到微博",value:"weibo" },{ name:"分享到微信",value:"weixin" }],
                callback: function (e) {
                    
                    var val = $(e.target).attr("value");
                      console.log(val);
                    if( val == "cancel"){
                        this.hide();
                    }
                }
            })
     *
     *
     */

    ui.actionsheet = function (option) {

        //默认配置
        var config = {
            appendTo: ".bui-page",
            trigger: "",
            handle: ".bui-btn",
            position: "bottom",
            effect: "fadeInUp",
            width: 0,
            mask: true,
            opacity: 0.6,
            buttons: [],
            cancelText: "取消",
            onMask: null,
            callback: null

            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            disabled: disabled,
            enabled: enabled,
            hide: hide,
            show: show,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(false, {}, config, ui.config.actionsheet, option);

        var id,
            uiDialog,
            $handle,
            $trigger,
            gid,
            hasEventInit = false,
            $id;

        //执行初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {

            var option = $.extend(true, param, opt);
            //option.appendTo = option.appendTo //|| (ui.hasRouter ? router.currentPage() || "body" : "body");


            $trigger = ui.obj(option.trigger);
            //option获取新参数使用
            param = module.config = option;

            gid = ui.guid();

            var html = template(option.buttons);

            ui.obj(option.appendTo).append(html);

            //对话框初始化
            uiDialog = ui.dialog({
                id: gid,
                position: option.position,
                mask: option.mask,
                effect: option.effect,
                opacity: option.opacity,
                onMask: function onMask() {
                    hide();
                    option.onMask && option.onMask();
                }
            });

            $id = uiDialog.$el();
            $handle = $id.find(option.handle);

            if (!hasEventInit) {
                bind();
            }

            return this;
        }

        // 事件绑定
        function bind() {
            var _self = this;
            var controlHandle = function controlHandle(e) {
                e.target = this;
                param.callback && param.callback.call(module, e, module);
                // 触发select事件
                trigger.call(module, "click", e);
            };
            var controlTrigger = function controlTrigger(e) {
                if ($(this).hasClass("disabled")) {
                    return;
                }

                show.call(this);
            };

            $id && $id.on("click.bui", param.handle, controlHandle);

            $trigger && $trigger.on("click.bui", controlTrigger);

            hasEventInit = true;
        }

        //按钮模板生成器
        function template(data) {

            var width = parseFloat(param.width);
            var cssStyle = width > 0 ? 'width:' + width + 'px;left:50%;right:0;margin-left:-' + width / 2 + 'px;' : '';

            var html = '';
            if (data && data.length) {
                html += '<div id="' + gid + '" class="bui-actionsheet" style="' + cssStyle + '">';
                html += '    <ul class="bui-list">';
                html += templateButton(data);
                html += '    </ul>';
                param.cancelText ? html += '    <div class="bui-btn" value="cancel">' + param.cancelText + '</div>' : '';
                html += '</div>';
            }

            return html;
        }

        function templateButton(data) {
            var html = '';
            $.each(data, function (i, item) {
                html += '        <li class="bui-btn ' + (item.className || '') + '" value="' + (item.value || '') + '">' + (item.name || "") + '</li>';
            });
            return html;
        }
        /**
         * 隐藏菜单
         *  @method hide
         *  @example 
            
            //隐藏菜单
            uiActionsheet.hide();
                
         */
        function hide(callback) {
            var _self = this;
            trigger.call(module, "hidebefore");

            uiDialog.isOpen() && uiDialog.close(function (e) {
                callback && callback.call(module, e);
                trigger.call(module, "hide", e);
            });

            return this;
        }
        /**
         * 显示菜单
         *  @method show
         *  @example 
            
            //显示菜单
            uiActionsheet.show();
                
         */
        function show(callback) {
            var _self = this;
            trigger.call(module, "showbefore");
            !uiDialog.isOpen() && uiDialog.open(function () {
                callback && callback.call(module);
                trigger.call(module, "show");
            });

            return this;
        }
        /**
         * 阻止触发
         *  @method disabled
         *  @chainable
         *  @since 1.4
         *  @example 
            
            uiActionsheet.disabled();
                
         */
        function disabled(index) {
            var $handleItem = $trigger;

            $handleItem && $handleItem.addClass("disabled");
            return this;
        }

        /**
         * 允许触发
         *  @method enabled
         *  @chainable
         *  @since 1.4
         *  @example 
            
            uiActionsheet.enabled();
                
         */
        function enabled() {
            var $handleItem = $trigger;

            $handleItem && $handleItem.removeClass("disabled");
            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiActionsheet.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($trigger) {
                $trigger.off("click.bui");
            }

            off("hide");
            off("show");

            uiDialog && uiDialog.destroy(bool);
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiActionsheetWidget = uiActionsheet.widget();
            
                
         */
        function widget(name) {
            var control = { dialog: uiDialog };
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
            var option = uiActionsheet.option();
              //获取某个参数
            var id = uiActionsheet.option( "trigger" );
              //修改一个参数
            uiActionsheet.option( "width",200 );
              //修改多个参数
            uiActionsheet.option( {"width":200} );
                
         */
        function options(key, value) {
            //修改data参数,不需要重新初始化
            if (key == "buttons" && typeof value !== "undefined") {

                return modifyData(key, value);
            } else {
                return ui.option.call(module, key, value);
            }
        }

        //动态修改参数,无需重新初始化控件
        function modifyData(key, value) {
            if (value && ui.typeof(value) === "array") {
                var btnHtml = templateButton(value);
                ui.obj(gid).find(".bui-list").html(btnHtml);
            }
        }
        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show"(显示菜单时) | "hide"(隐藏菜单时)   ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiActionsheet.on("show",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }
        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "show"(显示菜单时) | "hide"(隐藏菜单时)   ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiActionsheet.off("show");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }

        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>数字增减条</h2>
     *     <p>支持静态初始化,常用于购物车</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.number.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.number/prev"}}{{/crossLink}}: 执行减少操作 <br>
     * {{#crossLink "bui.number/next"}}{{/crossLink}}: 执行增加操作 <br>
     * {{#crossLink "bui.number/value"}}{{/crossLink}}: 不传参则获取,传参则设置 <br>
     * {{#crossLink "bui.number/disabled"}}{{/crossLink}}: 禁止输入修改 <br>
     * {{#crossLink "bui.number/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.number/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.number.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-number_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class number
     *  @constructor 
     *  @param {object} option  
     *  @param {string} [option.id] [控件id, 不传则全部初始化,可以通过查找input的值设置.]  
     *  @param {number} [option.min] [最小值, 属性的 data-min 会优先]  
     *  @param {number} [option.max] [最大值, 属性的 data-max 会优先, 默认:100 ]  
     *  @param {number} [option.step] [一次增加多少]  
     *  @param {string} [option.value] [初始值]  
     *  @param {string} [option.name] [某一组的名称]  
     *  @param {boolean} [option.disabled] [ 是否可以输入修改 false | true ]  
     *  @param {boolean} [option.render] [ 是否动态填充, true | false  ]  
     *  @param {function} [option.onInput] [ 1.4.3新增 输入数值的时候的实时校验处理 ]  
     *  @param {function} [option.onChange] [ 1.5新增 改变的时候触发,初始值的时候不触发 ]  
     *  @param {function} [option.inited] [ 1.5新增 初始化以后触发 ]  
     *  @param {function} [option.callback] [ 点击按钮的回调 ]  
     *  @example
     * 
     *   html:
     *
            <div id="number" class="bui-number"></div>
     *      
     *   js: 
     *   
            // 初始化
            var uiNumber = bui.number({
                            id:'#number'
                });
                //获取值
                uiNumber.value(); 
     *
     *
     */
    ui.number = function (option) {

        //默认配置
        var config = {
            id: null,
            min: 0,
            max: 100,
            step: 1,
            value: 1,
            disabled: false,
            render: true,
            tips: false,
            autocheck: true,
            name: "",
            prev: ".bui-number-prev",
            input: "input",
            next: ".bui-number-next",
            onInput: null,
            beforeInit: null,
            inited: null,
            onChange: null,
            callback: null

            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            $el: selector,
            disabled: disabled,
            value: getValue,
            values: getValues,
            prev: prev,
            next: next,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.number, option);

        var id,
            max,
            min,
            step,

        //控件自定义模板可以自由绑定想增加或者减少的按钮名称
        $prev,
            $next,
            $input,
            hasEventInit = false,
            isDestroy = false,
            $id;

        param.beforeInit && param.beforeInit.call(module);
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);
            isDestroy = false;

            max = option.max;
            min = option.min;
            step = option.step;

            if (option.id) {
                $id = ui.obj(option.id);
            } else {
                $id = ui.obj(".bui-number");
            }

            //option获取新参数使用
            param = module.config = option;

            //render = true,就会动态创建模板
            if (option.render) {
                render(option);
            }

            $prev = $id.children(option.prev);
            $next = $id.children(option.next);
            $input = $id.children(option.input);

            if (!hasEventInit) {
                //绑定按钮事件
                bind(option);
            }

            //禁止修改
            if (option.disabled) {
                $input.attr('disabled', 'disabled');
            }
            //设置初始值
            set(option.value);

            option.inited && option.inited.call(module, { target: $input, value: option.value });

            return this;
        }

        //模板
        function template(option) {

            var html = '';
            html += '    <div class="bui-number-prev"><i class="icon-minus"></i></div>';
            html += '    <input type="text" name="' + option.name + '" value="' + option.value + '"/>';
            html += '    <div class="bui-number-next"><i class="icon-plus"></i></div>';

            return html;
        }

        //渲染
        function render(option) {

            var tpl = template(option);

            $id.html(tpl);

            return this;
        }

        // 返回控件自身的选择器
        function selector(id) {
            return ui.selector.call($id, id);
        }

        //绑定事件
        function bind(option) {
            //检测输入的值是否有效
            option.onInput && $id.off('input', option.input).on('input', option.input, ui.unit.debounce(function (e) {
                var val = $(this).val();

                // if( /^[0-9]*$/i.test(val) ){
                //     set.call(this, val );
                // }
                e.value = val;
                option.onInput && option.onInput.call(module, e);
                e.stopPropagation();
            }, 400));
            //检测输入的值是否有效
            $id.off('change', option.input).on('change', option.input, function (e) {
                var val = option.autocheck && isNaN(parseInt($(this).val(), 10)) ? 0 : parseInt($(this).val(), 10);

                if (/^[0-9]*$/i.test(val)) {
                    set.call(this, val);
                }
                e.value = val;
                // option.onChange && option.onChange.call(module,e);
                e.stopPropagation();
            });

            //点击减少
            $id.off('click.bui', option.prev).on('click.bui', option.prev, function (e) {
                var input = $(this).next(param.input);

                e.value = input.val();
                prev.call(input, e);
                option.callback && option.callback.call(module, e, module);

                e.preventDefault();
                e.stopPropagation();
            });

            //点击增加
            $id.off('click.bui', option.next).on('click.bui', option.next, function (e) {
                var input = $(this).prev(param.input);

                e.value = input.val();
                next.call(input, e);
                option.callback && option.callback.call(module, e, module);

                e.preventDefault();
                e.stopPropagation();
            });

            hasEventInit = true;

            return this;
        }

        //获取值
        function get() {
            var $inputs = this == module ? $input : $(this);

            var value = parseInt($inputs.val(), 10);

            return value;
        }

        //设置值
        function set(num) {
            var $inputs = this == module ? $input : $(this);

            Array.prototype.slice.call($inputs).forEach(function (item, i) {
                var max = item.parentElement.getAttribute("data-max") || param.max;
                var min = item.parentElement.getAttribute("data-min") || param.min;

                var value = param.autocheck ? checkValue(num, min, max) : num;
                item.value = value;

                var target = this == module ? $input : item;
                // 输入的时候才触发
                trigger.call(module, "change", { target: item, value: num });
                param.onChange && param.onChange.call(module, { target: item, value: num });
            });

            return this;
        }

        function checkValue(num, mins, maxs) {
            var value = num || 0;

            if (value > maxs) {
                value = maxs;
            }

            if (value < mins) {
                value = mins;
            }

            if (value && value >= mins && value <= maxs) {
                value = value;
            }

            return value;
        }

        /**
         * 设置或者获取值
         *  @method value
         *  @chainable
         *  @param {string} [num] [设置值]
         *  @example 
            
            //设置值
            uiNumber.value("110");
              //获取值
            uiNumber.value();
                
         */
        function getValue(num) {
            var val = 0;
            if (num) {
                set.call(this, num);

                val = num;
            } else {
                val = get.call(this);
            }
            return val;
        }

        /**
         * 获取设置多个值
         *  @method values
         *  @chainable
         *  @param {string} [num] [设置值]
         *  @return {array} [ 返回 [{id:"",value:""}] ]
         *  @example 
              uiNumber.values();
                
         */
        function getValues(val) {

            if (val && ui.typeof(val) === "array") {
                Array.prototype.slice.call($id).forEach(function (item, i) {
                    var name = item.id || item.getAttribute("name") || "";

                    if (name == val[i]["id"]) {

                        // 用于渲染的时候赋值
                        item.querySelector("input").value = val[i]["value"];
                    }
                });
                return this;
            } else {
                var vals = [];
                Array.prototype.slice.call($id).forEach(function (item, i) {
                    var name = item.id || item.getAttribute("name") || "";
                    var val = parseInt(item.querySelector("input").value, 10);

                    vals.push({
                        id: name,
                        value: val
                    });
                });
            }

            return vals;
        }

        /**
         * 禁止输入
         *  @method disabled
         *  @chainable
         *  @param {boolean} [bool] [禁止输入 true | false]
         *  @example 
            
            //获取值
            uiNumber.disabled();
                
         */
        function disabled(bool) {
            var $inputs = this == module ? $input : $(this);

            var bool = bool == false ? false : true;

            if (bool) {

                $inputs.attr('disabled', 'disabled');
            } else {
                $inputs.removeAttr('disabled');
            }
            return this;
        }

        /**
         * 减少值
         *  @method prev
         *  @chainable
         *  @example 
              //减少
            uiNumber.prev();
                
         */
        function prev() {
            var $inputs = this == module ? $input : $(this);

            var data = $inputs.val();
            var num = parseInt(data, 10);
            var total = num -= step;
            set.call(this, total);

            trigger.call(module, "prev", total);

            return this;
        }
        /**
         * 增加值
         *  @method next
         *  @chainable
         *  @example 
              //增加
            uiNumber.next();
                
         */
        function next() {
            var $inputs = this == module ? $input : $(this);

            var data = $inputs.val();
            var num = parseInt(data, 10);
            var total = num += step;

            set.call(this, total);
            trigger.call(module, "next", total);

            return this;
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiNumber.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;
            // param.beforeDestroy && param.beforeDestroy.call(module);
            if ($id) {
                $id.off("click.bui");
                $id.off("input");
                bool && $id.remove();
            }

            off("prev");
            off("next");
            off("change");

            isDestroy = true;

            // param.destroyed && param.destroyed.call(module);
        }
        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiNumberWidget = uiNumber.widget();
            
                
         */
        function widget(name) {
            var control = {};
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiNumber.option();
              //获取某个参数
            var id = uiNumber.option( "id" );
              //修改一个参数
            uiNumber.option( "min",10 );
              //修改多个参数
            uiNumber.option( {"min":10} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }
        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "prev" | "next" | "change" 符合条件时触发改变  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiNumber.on("change",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "prev" | "next" | "change" 符合条件时触发改变   ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiNumber.off("change");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        return module;
    };

    return ui;
})(bui || {}, libs);

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {
    "use strict";
    /**
     * <h3>步骤条 beta</h3>
     * <a href="../../index.html#pages/ui_controls/bui.stepbar.html" target="_blank">demo</a> <br>
     * {{#crossLink "bui.stepbar/value"}}{{/crossLink}}: 设置第几步,跟获取当前在第几步 <br>
     * {{#crossLink "bui.stepbar/prev"}}{{/crossLink}}: 上一步 <br>
     * {{#crossLink "bui.stepbar/next"}}{{/crossLink}}: 下一步 <br>
     * {{#crossLink "bui.stepbar/option"}}{{/crossLink}}: 获取设置参数 <br>
     * {{#crossLink "bui.stepbar/widget"}}{{/crossLink}}: 获取依赖控件 <br>
     *  @namespace bui
     *  @class stepbar
     *  @constructor 
     *  @param {object} option  
     *  @param {string} option.id [控件id]    
     *  @param {array} option.data [ 步骤的内容 例如:[{ title:"",subtitle:"",content:""}] ] 
     *  @param {string} option.data.title [ 步骤的标题  ] 
     *  @param {string} [option.data.subtitle] [ 步骤的子标题  ] 
     *  @param {string} [option.data.content] [ 步骤的内容  ] 
     *  @param {boolean} [option.hasNumber] [1.5.0新增, 默认false(原点中间无数字)|true(原点中间有数字)]  
     *  @param {boolean} [option.lineCenter] [1.5.0新增, 默认false(圆点在线两端)|true(圆点在线中心)]  
     *  @param {string} [option.handle] [点击的区域,属于循环的那部分]  
     *  @param {boolean} [option.click] [允许点击时候修改对应的激活状态]
     *  @param {function} [option.callback] [ 点击按钮的回调 ]  
     *  @example
     * 
     *   html:
     *
            <div id="step" class="bui-stepbar"></div>
     *      
     *   js: 
     *   
            //初始化控件
            var uiStepbar = bui.stepbar({
                id: "#step",
                data: [{
                    title: "预立项申请",
                    subtitle: "2016-04-2 10:30",
                    content: "成功创建申请,已经提交至XX部门经理审批,请耐心等待"
                },{
                    title: "立项审批",
                    subtitle: "2016-04-21 10:30",
                    content: "审批完成,资料递交中"
                }]
            });
              //激活第2步
            uiStepbar.value(1);
     *
     */

    ui.stepbar = function (option) {

        //默认配置
        var config = {
            id: null,
            handle: ".bui-stepbar-cell",
            hasNumber: false,
            lineCenter: false,
            click: true,
            data: [],
            callback: null
            //方法
        };var module = {
            handle: {},
            on: on,
            off: off,
            value: value,
            next: next,
            prev: prev,
            destroy: destroy,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.stepbar, option);

        var id,
            $id,
            nowIndex,
            hasEventInit = false,
            $handle;

        // 初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);

            if (option.id) {
                $id = ui.obj(option.id);
            } else {
                ui.hint("stepbar id不能为空");
                return;
            }

            //option获取新参数使用
            param = module.config = option;

            var tpl = template(option.data);

            if (option.lineCenter) {
                $id.addClass("bui-stepbar-center");
            }
            $id.html(tpl);

            $handle = $id.children();

            if (!hasEventInit) {
                //绑定按钮事件
                bind(option);
            }

            return this;
        }

        //模板
        function template(data) {

            var html = '';

            $.each(data, function (i, item) {
                var number = param.hasNumber ? i + 1 : '';
                var numberClass = param.hasNumber ? 'bui-stepbar-number' : '';
                html += '<div class="bui-stepbar-cell ' + numberClass + '">';
                html += '    <span class="bui-stepbar-dot">' + number + '</span>';
                html += '    <div class="bui-stepbar-text">';
                if (item.title) {

                    html += '        <h3>' + item.title + '</h3>';
                }
                if (item.subtitle) {

                    html += '        <p class="bui-stepbar-time">' + item.subtitle + '</p>';
                }
                if (item.content) {

                    html += '        <p class="bui-stepbar-desc">' + item.content + '</p>';
                }
                html += '    </div>';
                html += '</div>';
            });

            return html;
        }

        //绑定事件
        function bind(option) {

            var controlHandle = function controlHandle(e) {
                if (option.click) {

                    var index = $(this).index();

                    //激活当前步骤
                    value(index);
                }

                option.callback && option.callback.call(module, e, module);
            };

            $id.on("click.bui", option.handle, controlHandle);

            hasEventInit = true;
            return this;
        }

        /**
         * 设置或者获取值
         *  @method value
         *  @param {number} [index] [设置值]
         *  @example 
            
            //设置值
            uiStepbar.value(1);
            
            //获取值
            var val = uiStepbar.value();
                
         */
        function value(index) {

            if (typeof index === "number") {

                if (index >= $handle.length - 1) {
                    index = $handle.length - 1;
                } else if (index < 0) {
                    index = 0;
                } else {
                    index = index;
                }

                $handle.each(function (i, item) {
                    if (i < index) {
                        $(item).removeClass('active').addClass('visited');
                    }
                    if (i == index) {
                        $(item).removeClass('visited').addClass('active');
                    }
                    if (i > index) {
                        $(item).removeClass('visited active');
                    }
                });

                trigger.call(this, "change", index);

                return index;
            } else {

                var index = $id.children(".active").index();

                return index;
            }
        }

        /**
         * 下一步
         *  @method next
         *  @example 
            
            //下一步
            uiStepbar.next();
            
         */
        function next() {

            var val = value() + 1;

            trigger.call(this, "next", val);

            return value(val);
        }
        /**
         * 上一步
         *  @method prev
         *  @example 
            
            //上一步
            uiStepbar.prev();
            
         */
        function prev() {

            var val = value() - 1;

            trigger.call(this, "prev", val);

            return value(val);
        }

        /**
         * [销毁控件]
         *  @method destroy
         *  @since 1.4.2
         *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
         *  @example 
            
            //销毁
            uiStepbar.destroy();
            
         */
        function destroy(bool) {
            var bool = bool == true ? true : false;

            if ($id) {
                $id.off("click.bui");
                bool && $id.remove();
            }

            off("next");
            off("prev");
            off("change");
        }

        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiStepbarWidget = uiStepbar.widget();
            
                
         */
        function widget(name) {
            var control = {};
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
             //获取所有参数
            var option = uiStepbar.option();
              //获取某个参数
            var id = uiStepbar.option( "id" );
              //修改一个参数
            uiStepbar.option( "click",false );
              //修改多个参数
            uiStepbar.option( {"click":false} );
                
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "change"(改变时触发) | "next"(下一步时触发) | "prev"(上一步时触发) ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiStepbar.on("change",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "change"(改变时触发) | "next"(下一步时触发) | "prev"(上一步时触发) ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiStepbar.off("change");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }
        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/*
 * UI控件库 
 * @module UI
 */

/*
 * <h3>picker 选择器</h3>
 *  ======================================================
 *  ************   Picker   ************
 *  *来源: http://framework7.taobao.org/
 *  ======================================================
 *
 */
var Picker = function Picker(params) {
    var p = this;
    var defaults = {
        updateValuesOnTouchmove: false,
        rotateEffect: false,
        momentumRatio: 7,
        freeMode: false
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    p.params = params;
    p.cols = [];
    p.initialized = false;

    function cancelAnimationFrame(id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);else {
            return window.clearTimeout(id);
        }
    }

    function setTransform(jq, transform) {
        for (var i = 0; i < jq.length; i++) {
            var elStyle = jq[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return jq;
    }

    function setTransition(jq, duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < jq.length; i++) {
            var elStyle = jq[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return jq;
    }

    function getTranslate(el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(',').length > 6) {
                curTransform = curTransform.split(', ').map(function (a) {
                    return a.replace(',', '.');
                }).join(', ');
            }
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    }

    // 3D Transforms origin bug, only on safari
    // var originBug = app.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !app.device.android;
    var originBug = function () {
        var ua = navigator.userAgent;
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        var isIos = ipad || ipod || iphone;
        var isAndroid = !!android;
        return isIos || navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0 && !isAndroid;
    }();

    // Value
    p.setValue = function (arrValues, transition) {
        var valueIndex = 0;
        if (p.cols.length === 0) {
            p.value = arrValues;
            p.updateValue(arrValues);
            return;
        }
        for (var i = 0; i < p.cols.length; i++) {
            if (p.cols[i] && !p.cols[i].divider) {
                p.cols[i].setValue(arrValues[valueIndex], transition);
                valueIndex++;
            }
        }
    };
    p.updateValue = function (forceValues) {
        var newValue = forceValues || [];
        var newDisplayValue = [];
        for (var i = 0; i < p.cols.length; i++) {
            if (!p.cols[i].divider) {
                newValue.push(p.cols[i].value);
                newDisplayValue.push(p.cols[i].displayValue);
            }
        }
        if (newValue.indexOf(undefined) >= 0) {
            return;
        }
        p.value = newValue;
        p.displayValue = newDisplayValue;
        if (p.params.onChange) {
            p.params.onChange(p, p.value, p.displayValue);
        }
    };

    // Columns Handlers
    p.initPickerCol = function (colElement, updateItems) {

        var colContainer = $(colElement);
        var colIndex = colContainer.index();
        var col = p.cols[colIndex];
        if (col.divider) return;
        col.container = colContainer;
        col.wrapper = col.container.find('.picker-items-col-wrapper');
        col.items = col.wrapper.find('.picker-item');

        var i, j;
        var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
        col.replaceValues = function (values, displayValues, value) {
            col.destroyEvents();
            col.values = values;
            col.displayValues = displayValues;
            var newItemsHTML = p.columnHTML(col, true);
            col.wrapper.html(newItemsHTML);
            col.items = col.wrapper.find('.picker-item');
            col.calcSize();
            col.setValue(value || col.values[0], 0, true);
            col.initEvents();
        };
        col.calcSize = function () {
            if (p.params.rotateEffect) {
                col.container.removeClass('picker-items-col-absolute');
                if (!col.width) col.container[0].style["width"] = '';
            }
            var colWidth, colHeight;
            colWidth = 0;
            colHeight = col.container[0].offsetHeight;
            wrapperHeight = col.wrapper[0].offsetHeight;
            itemHeight = col.items[0].offsetHeight;
            itemsHeight = itemHeight * col.items.length;
            minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
            maxTranslate = colHeight / 2 - itemHeight / 2;
            if (col.width) {
                colWidth = col.width;
                if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                col.container[0].style["width"] = colWidth;
            }
            if (p.params.rotateEffect) {
                if (!col.width) {
                    col.items.each(function () {
                        var item = $(this);
                        item[0].style['width'] = 'auto';
                        colWidth = Math.max(colWidth, item[0].offsetWidth);
                        item[0].style['width'] = '';
                    });
                    col.container[0].style["width"] = colWidth + 2 + 'px';
                }
                col.container.addClass('picker-items-col-absolute');
            }
        };
        col.calcSize();
        setTransform(col.wrapper, 'translate3d(0,' + maxTranslate + 'px,0)');
        setTransition(col.wrapper, '0ms');

        var activeIndex = 0;
        var animationFrameId;

        // Set Value Function
        // 找到值对应的dom item,滚动该item，然后更新值
        col.setValue = function (newValue, transition, valueCallbacks) {
            if (typeof transition === 'undefined') transition = '';
            var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
            if (typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                newActiveIndex = 0;
            }
            var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
            // Update wrapper
            setTransform(col.wrapper, 'translate3d(0,' + newTranslate + 'px,0)');
            setTransition(col.wrapper, transition + 'ms');

            // Update items
            col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
        };

        col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
            if (typeof translate === 'undefined') {
                translate = getTranslate(col.wrapper[0], 'y');
            }
            if (typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate) / itemHeight);
            if (activeIndex < 0) activeIndex = 0;
            if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
            var previousActiveIndex = col.activeIndex;
            col.wrapper.find('.picker-selected').removeClass('picker-selected');

            setTransition(col.items, transition);

            var selectedItem = col.items.eq(activeIndex).addClass('picker-selected');
            setTransform(selectedItem, '');

            // Set 3D rotate effect
            if (p.params.rotateEffect) {
                var percentage = (translate - (Math.floor((translate - maxTranslate) / itemHeight) * itemHeight + maxTranslate)) / itemHeight;

                col.items.each(function () {
                    var item = $(this);
                    var itemOffsetTop = item.index() * itemHeight;
                    var translateOffset = maxTranslate - translate;
                    var itemOffset = itemOffsetTop - translateOffset;
                    var percentage = itemOffset / itemHeight;

                    var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                    var angle = -18 * percentage;
                    if (angle > 180) angle = 180;
                    if (angle < -180) angle = -180;
                    // Far class
                    if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');else item.removeClass('picker-item-far');
                    // Set transform
                    setTransform(item, 'translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
                });
            }
            if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                // Update values
                col.value = selectedItem.attr('data-picker-value');
                col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                // On change callback
                if (previousActiveIndex != activeIndex) {
                    if (col.onChange) {
                        col.onChange(p, col.value, col.displayValue);
                    }
                    p.updateValue();
                }
            }
        };

        // Update items on init
        if (updateItems) {
            col.updateItems(0, maxTranslate, 0);
        }

        var allowItemClick = true;
        var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;

        function handleTouchStart(evt) {
            if (isMoved || isTouched) return;
            var e = evt.originalEvent || evt;
            e.preventDefault();
            isTouched = true;
            touchStartY = touchCurrentY = e.targetTouches[0].pageY;
            touchStartTime = new Date().getTime();

            allowItemClick = true;
            startTranslate = currentTranslate = getTranslate(col.wrapper[0], 'y');
        }

        function handleTouchMove(evt) {
            if (!isTouched) return;
            var e = evt.originalEvent || evt;
            e.preventDefault();
            allowItemClick = false;
            touchCurrentY = e.targetTouches[0].pageY;
            if (!isMoved) {
                // First move
                cancelAnimationFrame(animationFrameId);
                isMoved = true;
                startTranslate = currentTranslate = getTranslate(col.wrapper[0], 'y');
                setTransition(col.wrapper, '0ms');
            }
            e.preventDefault();

            var diff = touchCurrentY - touchStartY;
            currentTranslate = startTranslate + diff;
            returnTo = undefined;

            // Normalize translate
            if (currentTranslate < minTranslate) {
                currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                returnTo = 'min';
            }
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                returnTo = 'max';
            }
            // Transform wrapper
            setTransform(col.wrapper, 'translate3d(0,' + currentTranslate + 'px,0)');

            // Update items
            col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

            // Calc velocity
            velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
            velocityTime = new Date().getTime();
            prevTranslate = currentTranslate;
        }

        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;
            /*col.wrapper.css({
                'transition-duration': '',
                '-webkit-transition-duration': ''
            });*/
            setTransition(col.wrapper, '');
            if (returnTo) {
                if (returnTo === 'min') {
                    setTransform(col.wrapper, 'translate3d(0,' + minTranslate + 'px,0)');
                } else {
                    setTransform(col.wrapper, 'translate3d(0,' + maxTranslate + 'px,0)');
                }
            }
            touchEndTime = new Date().getTime();
            var velocity, newTranslate;
            if (touchEndTime - touchStartTime > 300) {
                newTranslate = currentTranslate;
            } else {
                velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
            }

            newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

            // Active Index
            var activeIndex = -Math.floor((newTranslate - maxTranslate) / itemHeight);

            // Normalize translate
            if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

            // Transform wrapper
            setTransform(col.wrapper, 'translate3d(0,' + parseInt(newTranslate, 10) + 'px,0)');

            // Update items
            col.updateItems(activeIndex, newTranslate, '', true);

            // Allow click
            setTimeout(function () {
                allowItemClick = true;
            }, 100);
        }

        function handleClick(e) {
            if (!allowItemClick) return;
            cancelAnimationFrame(animationFrameId);
            /*jshint validthis:true */
            var value = $(this).attr('data-picker-value');
            col.setValue(value);
        }

        col.initEvents = function (detach) {
            // pc 兼容
            var isTouchPad = /hp-tablet/gi.test(navigator.appVersion),
                hasTouch = 'ontouchstart' in window && !isTouchPad,
                touchStart = hasTouch ? 'touchstart' : 'mousedown',
                touchMove = hasTouch ? 'touchmove' : 'mousemove',
                touchEnd = hasTouch ? 'touchend' : 'mouseup';

            var method = detach ? 'off' : 'on';
            col.container[method](touchStart, handleTouchStart);
            col.container[method](touchMove, handleTouchMove);
            col.container[method](touchEnd, handleTouchEnd);
            if (touchEnd == 'mouseup') {
                document.documentElement.addEventListener('mouseleave', handleTouchEnd, false);
            }
            col.items[method]('click', handleClick);
        };
        col.destroyEvents = function () {
            col.initEvents(true);
        };

        col.initEvents();
    };

    // HTML Layout
    p.columnHTML = function (col, onlyItems) {
        var columnItemsHTML = '';
        var columnHTML = '';
        if (col.divider) {
            columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
        } else {
            for (var j = 0; j < col.values.length; j++) {
                columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
            }
            columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
        }
        return onlyItems ? columnItemsHTML : columnHTML;
    };
    p.layout = function () {
        var pickerHTML = '';
        var pickerClass = '';
        var i;
        p.cols = [];
        var colsHTML = '';
        for (i = 0; i < p.params.cols.length; i++) {
            var col = p.params.cols[i];
            colsHTML += p.columnHTML(p.params.cols[i]);
            p.cols.push(col);
        }
        pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
        pickerHTML = '<div class="' + pickerClass + '">' +
        /*(p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') +*/
        '<div class="picker-modal-inner picker-items">' + colsHTML + '<div class="picker-center-highlight"></div>' + '</div>' + '</div>';
        p.pickerHTML = pickerHTML;
    };

    p.init = function () {
        if (!p.initialized) {

            // Layout
            p.layout();

            // Store picker instance

            p.container = $(p.pickerHTML);
            p.container.addClass('picker-modal-inline');
            $(p.params.container).html(p.container);
            // Init Events
            p.container.find('.picker-items-col').each(function () {
                var updateItems = true;
                if (!p.initialized && p.params.value || p.initialized && p.value) updateItems = false;
                p.initPickerCol(this, updateItems);
            });
            // Set value
            if (p.value) p.setValue(p.value, 0);else if (p.params.value) {
                p.setValue(p.params.value, 0);
            }
        }

        // Set flag
        p.initialized = true;
    };
    /*
     * 默认自动初始化
     */

    p.init();

    return p;
};
(function (ui, $) {

    ui.picker = function (option) {
        return new Picker(option);
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库
 * @module UI
 */

(function (ui, $) {
    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>日期选择器</h2>
     *     <p>日期必须以2015/8/10 这种格式传才能确保在IOS上正常, 支持动态渲染以及静态渲染, 两种的区别就在于,动态渲染初始化简单, 静态渲染灵活,支持自定义按钮样式,并且支持左右侧滑.</p>
     *     <p>可以同时有左边跟右边菜单,菜单的个数也可以不一样多,留意示例的几种不同效果</p>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.pickerdate.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.pickerdate/value"}}{{/crossLink}}: 设置日期 <br>
     * {{#crossLink "bui.pickerdate/min"}}{{/crossLink}}: 设置最小日期 <br>
     * {{#crossLink "bui.pickerdate/max"}}{{/crossLink}}: 设置最大日期 <br>
     * {{#crossLink "bui.pickerdate/reset"}}{{/crossLink}}: 重新渲染 <br>
     * {{#crossLink "bui.pickerdate/onChange"}}{{/crossLink}}: 日期变更事件回调<br>
     * {{#crossLink "bui.pickerdate/formatValue"}}{{/crossLink}}: 数据格式化方法 <br>
     * {{#crossLink "bui.pickerdate/cols"}}{{/crossLink}}: 设置分栏<br>
     * {{#crossLink "bui.pickerdate/widget"}}{{/crossLink}}: since1.3.0 获取依赖 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.pickerdate.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-pickerdate_low.gif" alt="控件预览"/></a></div>
     * </div>
     *  @namespace bui
     *  @class pickerdate
     *  @constructor 
     *  @param {object}  option
     *  @param {string}  option.id [ 日期生成的容器, 同时需要设置 popup:false ]
     *  @param {boolean}  option.popup [ 是否弹出窗口 默认 true || false ]
     *  @param {boolean}  option.mask [ 是否显示遮罩 默认 true || false ]
     *  @param {array}  option.buttons [ since 1.3.0 如果buttons是一个数组,则底部会增加相应的按钮 格式为 ["确定","取消"] || [{name:"确定",className:"primary"}] ]
     *  @param {string}  option.value [ 初始化第一个日期,日期格式 2015/8/10 9:00 ]
     *  @param {string|Date}  option.min [ 最小日期,日期格式 2015/8/10 9:00 ]
     *  @param {string|Date}  option.max [ 最大日期,日期格式 2015/8/10 9:00 ]
     *  @param {function}  option.formatValue [ since 1.3.0 显示的日期格式, 默认: yyyy-MM-dd hh:mm:ss ]
     *  @param {object}  option.cols [ 分栏 ]
     *  @param {object|"none"}  option.cols.year    [ 不需要某栏,设置为 "none" 格式: { values: [],displayValues:[] } ]
     *  @param {object|"none"}  option.cols.month   [ 不需要某栏,设置为 "none" 格式: { values: [],displayValues:[] } ]
     *  @param {object|"none"}  option.cols.date    [ 不需要某栏,设置为 "none" 格式: { values: [],displayValues:[] } ]
     *  @param {object|"none"}  option.cols.hour    [ 不需要某栏,设置为 "none" 格式: { values: [],displayValues:[] } ]
     *  @param {object|"none"}  option.cols.minute  [ 不需要某栏,设置为 "none" 格式: { values: [],displayValues:[] } ]
     *  @param {object|"none"}  option.cols.second  [ 不需要某栏,设置为 "none" 格式: { values: [],displayValues:[] } ]
     *  @param {string|object} [option.appendTo] [ 1.4.3新增 默认:"body",添加到哪里去,主要配合单页使用 ]   
     *  @param {boolean} option.rotateEffect [ 是否开启3D效果,默认:false ]
     *  @param {function} option.onChange [ 回调 ]
     *  @param {function} option.callback [ 点击确定的回调 ]
     *
     *  @example
     *
     *  // 1. 无底部按钮初始化
     
            var input = $("#datepicker_input");
            var uiPickerdate = bui.pickerdate({
                handle:"#datepicker_input",
                value: '2015/8/10 9:00',
                min: '2014/4/5 9:00',
                max: '2016/4/5 10:00',
                onChange: function(value) {
                    input.val(value);
                }
            });
    
    
        // 2. 带底部按钮的初始化
    
            var datePrevVal;
            var input = $("#datepicker_input");
            var uiPickerdate = bui.pickerdate({
                // id: "#datepicker_contanier",
                handle:"#datepicker_input",
                value: '2015/8/10 9:00',
                onChange: function(value) {
                    input.val(value);
                },
                // 如果需要按钮,需要自己写callback
                buttons: ["取消","确定"],
                callback: function (e) {
                    // 取消返回上一个值
                    if( $(e.target).text().trim() == "取消"){
                        uiPickerdate.value(datePrevVal);
                    }else{
                        datePrevVal = uiPickerdate.value();
                    }
                }
            });
            
            // 获取上一个值
            datePrevVal = uiPickerdate.value();
    
    
     *
     */

    ui.pickerdate = function () {
        function transformTime(d) {
            if (d && d.constructor == Date) {
                return d;
            }
            if (d && typeof d == 'string') {
                /* 方法 一 */
                // 在Chrome和Safari中,存在当值为'2017-9'或'2017/09'时,new Date(value)会返回非法值,
                // 顾在统一使用斜杠/格式的时候,还须为时间值补充日期
                d = d.replace(/-/img, '/').replace(/^(\d+\/\d+?)($|\s)/, function ($0, $1) {
                    return $1 + '/1';
                });

                // 修复只有时间的时候无法格式化问题
                if (d.indexOf("/") < 0) {
                    var date = new Date();
                    d = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate() + " " + d;
                }

                /* 方法二 */
                // d = d.split(/-|\/|\s|:/);
                // d = Date.apply(d);

                return new Date(d);
            }
            if (typeof d == 'number') {
                return new Date(d);
            }
            return new Date();
        }

        function getMinTime(min, max) {
            var now = new Date(),
                min,
                max;
            if (now.getTime() < min.getTime()) {
                return min;
            } else if (now.getTime() > max.getTime()) {
                return max;
            } else {
                return now;
            }
        }

        function Datepicker(option) {
            var guid = ui.guid(),

            //上一个日期
            datePrevVal;
            var config = {
                id: guid,
                height: 260,
                popup: true,
                mask: true,
                position: "bottom",
                effect: "fadeInUp",
                appendTo: "",
                rotateEffect: false,
                buttons: [{
                    name: "取消",
                    className: ""
                }, {
                    name: "确定",
                    className: "primary-reverse"
                }],
                onMask: function onMask() {
                    uiDialog && uiDialog.close();
                },
                callback: null

                // var _config = {
                //     popup : true
                // }
                // var opt = $.extend(true,{},_config,option);
            };var dp = this,
                voidFunc = function voidFunc() {},
                opt_handle,
                opt_minDate,
                opt_maxDate,
                opt_container,
                opt_onChange,
                opt_formatValue,
                columns,
                dateCol,
                timeCol,
                curValue,
                prevValue,
                uiDialog = null;
            var opt = $.extend(true, {}, config, option);
            opt.appendTo = opt.appendTo || (ui.hasRouter ? router.currentPage() || "body" : "body");

            // 操作按钮取消的时候,不修改原本的值
            opt.callback = function (e) {
                // 点击以后的回调,如果不需要默认的操作,则return false;
                var bool = option.callback && option.callback.call(dp, e);
                // 返回false 则不操作
                if (bool == true || typeof bool == "undefined") {
                    // 取消返回上一个值
                    if ($(e.target).text().trim() == "取消" || $(e.target).text().trim() == "cancel" || $(e.target).text().trim() == "关闭") {
                        try {
                            var dd = new Date(datePrevVal);
                            dp.value(dd);
                        } catch (e) {}
                    } else {
                        datePrevVal = dp.value();
                    }
                }
            };
            var indexOfCol = {};
            var _formateDateOrder = ["FullYear", "Month", "Date"],
                _formateTimeOrder = ["Hours", "Minutes", "Seconds"],
                _formateOrderMap = {
                "FullYear": "year",
                "Month": "month",
                "Date": "date",
                "Hours": "hour",
                "Minutes": "minute",
                "Seconds": "second"
            },
                formateOrder = [];

            var hasReset = false;

            function getPickerDate(cols) {
                var d = new Date('1970/1/1');
                formateOrder.forEach(function (type, i) {
                    d["set" + type](cols[indexOfCol[type]].value - (type == 'Month' ? 1 : 0));
                });
                return d;
            }

            function dateToArray(date) {
                var d = transformTime(date);
                return formateOrder.map(function (type, i) {
                    return d["get" + type]() + (type == 'Month' ? 1 : 0);
                });
            }

            this.config = {};
            this.option = function () {};

            /**
             * 设置分栏
             *  @method cols
             *  @param {object} cols [ {} ]
             *  @param {object} cols.year [ 'none' || 年份  ]
             *  @param {array}  cols.year.values [ 年份的值 ]
             *  @param {array}  cols.year.displayValues [ 年份的值对应的文本 ]
             *  @param {object} cols.month [ 'none' || 月份  ]
             *  @param {array}  cols.month.values [ 月份的值 ]
             *  @param {array}  cols.month.displayValues [ 月份的值对应的文本 ]
             *  @param {object} cols.date [ 'none' || 日  ]
             *  @param {array}  cols.date.values [ 日 ]
             *  @param {array}  cols.date.displayValues [ 日对应的文本 ]
             *  @param {object} cols.hour [ 'none' || 时  ]
             *  @param {array}  cols.hour.values [ 时 ]
             *  @param {array}  cols.hour.displayValues [ 时对应的文本 ]
             *  @param {object} cols.minute [ 'none' || 分  ]
             *  @param {array}  cols.minute.values [ 分 ]
             *  @param {array}  cols.minute.displayValues [ 分对应的文本 ]
             *  @param {object} cols.second [ 'none' || 秒  ]
             *  @param {array}  cols.second.values [ 秒 ]
             *  @param {array}  cols.second.displayValues [ 秒对应的文本 ]
             *  @example 
                
                //设置分栏
                uiPickerdate.cols({
                    year: {
                        values: [2013, 2014, 2015],
                    },
                    hour: {
                        values: [8, 9, 10, 11, 13, 14, 15, 16, 17]
                    },
                    minute: {
                        values: [0, 30],
                        displayValues: ['00', '30']
                    },
                    second: 'none'
                });
                    
             */
            this.cols = function (cols) {
                cols = cols || {};
                var dateCol = [];
                timeCol = [];
                columns = [];
                indexOfCol = {};
                formateOrder = [];
                _formateDateOrder.forEach(function (type, i) {
                    if (cols[_formateOrderMap[type]] !== 'none') {
                        formateOrder.push(type);
                        dateCol.push(type);
                    }
                });

                _formateTimeOrder.forEach(function (type, i) {
                    if (cols[_formateOrderMap[type]] !== 'none') {
                        formateOrder.push(type);
                        timeCol.push(type);
                    }
                });

                // format
                dateCol.forEach(function (type, i) {
                    indexOfCol[type] = columns.length;
                    columns.push(createColumn[type](cols[_formateOrderMap[type]]));
                });

                timeCol.forEach(function (type, i) {
                    if (i == 0 && dateCol.length != 0) {
                        columns.push(createColumn["Space"]());
                    } else {
                        columns.push(createColumn["Divider"]());
                    }
                    // bug fixed first line :
                    if (dateCol.length == 0) {
                        columns[0]["content"] = "";
                    }

                    indexOfCol[type] = columns.length;

                    columns.push(createColumn[type](cols[_formateOrderMap[type]]));
                });

                if (dp.picker) {

                    dp.picker.params.cols = columns;
                    dp.picker.initialized = false;
                    dp.picker.init();
                }

                hasReset = false;

                return this;
            };
            this.id = function (container) {
                if (container && !opt_container) {
                    opt_container = container;
                }
            };
            /**
             * 重新渲染
             *  @method reset
             *  @example 
                
                //设置某个日期
                uiPickedate.reset();
                    
             */
            this.reset = function () {
                if (dp.picker) {
                    dp.picker.initialized = false;
                    dp.picker.init();
                }

                return this;
            };

            /**
             * 设置最小日期
             *  @method min
             *  @param {string} [min] [ 默认最小日期:'1960/01/01 00:00:00' ]
             *  @example 
                
                //设置最小日期
                uiPickedate.min('1960/01/01 00:00:00');
                    
             */
            this.min = function (min) {
                opt_minDate = transformTime(min || opt.min || '1960/01/01 00:00:00');
                return this;
            };

            /**
             * 设置最大日期
             *  @method max
             *  @param {string} [max] [ 默认最大日期:'2030/01/01 00:00:00' ]
             *  @example 
                
                //设置最大日期
                uiPickedate.max('2030/01/01 00:00:00');
                    
             */
            this.max = function (max) {
                opt_maxDate = transformTime(max || opt.max || '2022/01/01 00:00:00');
                return this;
            };

            /**
             * 设置某个日期
             *  @method value
             *  @param {string} [date] [ 日期格式:'2030/01/01 00:00:00' ]
             *  @example 
                
                //设置某个日期
                uiPickedate.value('2016/07/01 00:00:00');
                    
             */
            this.value = function (date) {
                if (date) {
                    var d = transformTime(date),
                        arr = dateToArray(d);

                    dp.picker.setValue(arr, 0);

                    return this;
                } else {
                    return opt_formatValue(dp.picker, dp.value, dp.displayValue);
                }
            };

            function _handleClick(argument) {
                if ($(this).hasClass("disabled")) {
                    return;
                }

                uiDialog && !uiDialog.isOpen() && uiDialog.open(function () {});
            }
            this.handle = function (handle) {
                if (handle && opt_handle !== handle) {
                    var hd = ui.obj(opt_handle);
                    if (hd) {
                        hd.off('click', _handleClick);
                    }
                    hd = ui.obj(handle);
                    if (hd) {
                        hd.on("click", _handleClick);
                    }
                    _handleClick.hasOpen = false;
                    opt_handle = handle;
                }
                return this;
            };

            /**
             * 格式化后回调
             *  @method formatValue
             *  @param {string} [str] [ "yyyy-MM-dd hh:00:00" ]
             *  @example 
                
                //设置某个日期
                uiPickedate.formatValue("yyyy-MM-dd hh:00:00");
                    
             */
            var fM = {
                y: function y(d, l) {
                    return d.getFullYear().toString().slice(-l);
                },
                M: function M(d, l) {
                    var s = l > 1 ? '0' : '';
                    return (s + (d.getMonth() + 1)).slice(-2);
                },
                d: function d(_d, l) {
                    var s = l > 1 ? '0' : '';
                    return (s + _d.getDate()).slice(-2);
                },
                h: function h(d, l) {
                    var s = l > 1 ? '0' : '';
                    return (s + d.getHours()).slice(-2);
                },
                m: function m(d, l) {
                    var s = l > 1 ? '0' : '';
                    return (s + d.getMinutes()).slice(-2);
                },
                s: function s(d, l) {
                    var s = l > 1 ? '0' : '';
                    return (s + d.getSeconds()).slice(-2);
                }
            };
            this.formatValue = function (formatStr) {
                opt_formatValue = function opt_formatValue(picker, values, displayValues) {
                    var date = getPickerDate(picker.cols);

                    return formatStr.replace(/y+|M+|d+|h+|m+|s+/g, function (type) {
                        return fM[type[0]](date, type.length);
                    });
                };
                if (dp.picker) {
                    dp.picker.updateValue();
                }

                hasReset = false;

                return this;
            };

            /**
             * 日期改变的回调
             *  @method onChange
             *  @param {function} [callback] [ 日期改变实时监听回调 ]
             *  @example 
                
                //设置某个日期
                uiPickedate.onChange(function(value) {
                    // body...
                });
                    
             */
            this.onChange = function (callback) {
                opt_onChange = callback || voidFunc;

                trigger.call(this, "change", curValue);

                return this;
            };

            this.popup = function (option) {

                if (opt.popup && !uiDialog) {

                    var dialogHtml = '<div id="' + guid + '" class="bui-dialog" >';
                    dialogHtml += '<div class="bui-dialog-main"><div id="' + guid + '-picker' + '"></div></div>';
                    if (opt.buttons && opt.buttons.length) {
                        dialogHtml += '<div class="bui-dialog-foot bui-box">';
                        $.each(opt.buttons, function (i, el) {
                            var className = (typeof el === 'undefined' ? 'undefined' : _typeof(el)) == "object" && "className" in el ? ' ' + el.className : "";
                            var name = (typeof el === 'undefined' ? 'undefined' : _typeof(el)) == "object" && "name" in el ? el.name : el;
                            dialogHtml += '<div class="span1"><div class="bui-btn' + className + '">' + name + '</div></div>';
                        });
                        dialogHtml += '</div>';
                    }
                    dialogHtml += '</div>';

                    var dialog = $(opt.appendTo).append(dialogHtml);
                    opt_container = ui.obj(guid + '-picker');

                    // uiDialog = ui.dialog(opt);
                }

                return this;
            };

            /*
             * picker options
             */
            var opt_change = function opt_change(picker, type, nextType) {
                var date = getPickerDate(picker.cols),
                    min = opt_minDate['get' + type](),
                    max = opt_maxDate['get' + type](),
                    datetime = date.getTime(),
                    mintime = opt_minDate.getTime(),
                    maxtime = opt_maxDate.getTime();
                if (datetime < mintime && date['get' + type]() < min) {
                    if (type == 'Month') {
                        min += 1;
                    }
                    picker.cols[indexOfCol[type]].setValue(min);
                    return;
                } else if (datetime > maxtime && date['get' + type]() > max) {
                    if (type == 'Month') {
                        max += 1;
                    }
                    picker.cols[indexOfCol[type]].setValue(max);
                    return;
                }
                if (nextType && (datetime < mintime || datetime > maxtime)) {
                    picker.cols[indexOfCol[nextType]].onChange(picker);
                }
            };
            var createColumn = {};
            // FullYear
            createColumn["FullYear"] = function (colYear) {
                colYear = colYear || {
                    values: function () {
                        var arr = [];
                        var min = opt_minDate.getFullYear(),
                            max = opt_maxDate.getFullYear();
                        for (var i = min; i <= max; i++) {
                            arr.push(i);
                        }
                        return arr;
                    }()
                };
                return {
                    values: colYear.values,
                    displayValues: colYear.displayValues,
                    onChange: function onChange(picker, value, displayValue) {
                        opt_change(picker, 'FullYear', !!indexOfCol['Month'] ? 'Month' : '');
                    }
                };
            };
            // Month
            createColumn["Month"] = function (colMonth) {
                colMonth = colMonth || {
                    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    displayValues: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                };
                return {
                    values: colMonth.values,
                    displayValues: colMonth.displayValues,
                    textAlign: 'right',
                    onChange: function onChange(picker, value, displayValue) {
                        var daysInMonth = new Date(picker.cols[indexOfCol['FullYear']].value, parseInt(picker.cols[indexOfCol['Month']].value), 0).getDate(),
                            arr = [];
                        for (var i = 1; i <= daysInMonth; i++) {
                            arr.push(i);
                        }
                        var dateCol = picker.cols[indexOfCol["Date"]];
                        if (dateCol && dateCol.replaceValues) {
                            dateCol.replaceValues(arr, null, dateCol.value < daysInMonth ? dateCol.value : daysInMonth);
                        }
                        opt_change(picker, 'Month', !!indexOfCol['Date'] ? 'Date' : '');
                    }
                };
            };
            // Date
            createColumn["Date"] = function (colDate) {
                colDate = colDate || {
                    values: function () {
                        var lengthOfDaysInMonth = 31,
                            arr = [];
                        do {
                            arr.unshift(lengthOfDaysInMonth);
                        } while (lengthOfDaysInMonth--);
                        return arr;
                    }(),
                    displayValues: function () {
                        var lengthOfDaysInMonth = 31,
                            arr = [];
                        do {
                            arr.unshift(lengthOfDaysInMonth + "天");
                        } while (lengthOfDaysInMonth--);
                        return arr;
                    }()
                };
                return {
                    values: colDate.values,
                    displayValues: colDate.displayValues,
                    onChange: function onChange(picker, value, displayValue) {
                        opt_change(picker, 'Date', !!indexOfCol['Hours'] ? 'Hours' : '');
                    }
                };
            };
            // Space divider
            createColumn["Space"] = function () {
                return {
                    divider: true,
                    content: '  '
                };
            };
            // Hours
            createColumn["Hours"] = function (colHours) {
                colHours = colHours || function () {
                    var values = [],
                        displayValues = [];
                    for (var i = 0; i < 24; i++) {
                        values.push(i);
                        displayValues.push(('0' + i).slice(-2));
                    }
                    return {
                        values: values,
                        displayValues: displayValues
                    };
                }();
                return {
                    values: colHours.values,
                    displayValues: colHours.displayValues,
                    onChange: function onChange(picker, value, displayValue) {
                        opt_change(picker, 'Hours', !!indexOfCol['Minutes'] ? 'Minutes' : '');
                    }
                };
            };
            // Divider
            createColumn["Divider"] = function () {
                return {
                    divider: true,
                    textAlign: 'center',
                    content: ':'
                };
            };
            // Minutes
            createColumn["Minutes"] = function (colMin) {
                colMin = colMin || function () {
                    var values = [],
                        displayValues = [];
                    for (var i = 0; i < 60; i++) {
                        values.push(i);
                        displayValues.push(('0' + i).slice(-2));
                    }
                    return {
                        values: values,
                        displayValues: displayValues
                    };
                }();
                return {
                    values: colMin.values,
                    displayValues: colMin.displayValues,
                    onChange: function onChange(picker, value, displayValue) {
                        opt_change(picker, 'Minutes', !!indexOfCol['Seconds'] ? 'Seconds' : '');
                    }
                };
            };
            // Seconds
            createColumn["Seconds"] = function (colSec) {
                colSec = colSec || function () {
                    var values = [],
                        displayValues = [];
                    for (var i = 0; i < 60; i++) {
                        values.push(i);
                        displayValues.push(('0' + i).slice(-2));
                    }
                    return {
                        values: values,
                        displayValues: displayValues
                    };
                }();
                return {
                    values: colSec.values,
                    displayValues: colSec.displayValues,
                    onChange: function onChange(picker, value, displayValue) {
                        opt_change(picker, 'Seconds');
                    }
                };
            };
            /*
             * init
             */
            dp.min(opt.min);
            dp.max(opt.max);
            dp.cols(opt.cols);
            dp.onChange(opt.onChange);
            dp.formatValue(opt.formatValue || 'yyyy-MM-dd hh:mm:ss');
            dp.id(opt.id);
            dp.handle(opt.handle);
            // 生成弹窗模式日期结构
            dp.popup(opt);
            //初始化对话框
            dp.picker = ui.picker({
                container: opt_container,
                rotateEffect: opt.rotateEffect,
                value: dateToArray(opt.value ? transformTime(opt.value) : getMinTime(opt_minDate, opt_maxDate)),
                onChange: function onChange(picker, values, displayValues) {
                    var value = opt_formatValue(picker, values, displayValues);
                    if (curValue == value) {
                        return;
                    }
                    curValue = value;
                    opt_onChange(value);
                    trigger.call(this, "change", value);
                },
                cols: columns
            });
            // 初始化弹窗模式
            if (opt.popup && !uiDialog) {
                uiDialog = ui.dialog(opt);

                uiDialog && uiDialog.on("open", function () {
                    // 打开前获取设置前的值
                    datePrevVal = opt_formatValue(dp.picker, dp.value, dp.displayValue);
                    if (dp.picker) {
                        dp.picker.initialized = false;
                        dp.picker.init();
                    }
                    trigger.call(this, "show");
                });
                uiDialog && uiDialog.on("close", function () {

                    trigger.call(this, "hide");
                });
            }

            /**
             * 阻止触发
             *  @method disabled
             *  @chainable
             *  @since 1.4
             *  @example 
                
                uiPickerdate.disabled();
                    
             */
            this.disabled = function () {

                var $handleItem = ui.obj(opt_handle);

                $handleItem && $handleItem.addClass("disabled");
                return this;
            };

            /**
             * 允许触发
             *  @method enabled
             *  @chainable
             *  @since 1.4
             *  @example 
                
                uiPickerdate.enabled();
                    
             */
            this.enabled = function () {
                var $handleItem = ui.obj(opt_handle);

                $handleItem && $handleItem.removeClass("disabled");
                return this;
            };

            /**
             * [销毁控件]
             *  @method destroy
             *  @since 1.4.2
             *  @param {boolean} [bool] [ 默认: false 销毁部分 | true 销毁全部   ]
             *  @example 
                
                //销毁
                uiPickerdate.destroy();
                
             */
            this.destroy = function (bool) {
                var bool = bool == true ? true : false;

                this.off("show");
                this.off("hide");
                this.off("change");

                uiDialog && uiDialog.destroy(bool);

                dp = null;
            };
            /**
             * 获取依赖的控件
             *  @method widget
             *  @param {string} [name] [ 依赖控件名 dialog ]
             *  @example 
                
                //获取依赖控件
                var uiPickerdateWidget = uiPickerdate.widget();
                
                    
             */
            this.widget = function (name) {
                var control = {
                    dialog: uiDialog || {}
                };
                return ui.widget.call(control, name);
            };

            /**
             * 为控件绑定事件
             *  @event on
             *  @since 1.3.0
             *  @param {string} [type] [ 事件类型: "change"(日期改变的时候) | "show"(日期展示的时候)| "hide"(日期隐藏的时候) ]
             *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
             *  @example 
                
                uiPickerdate.on("show",function () {
                    // 点击的菜单
                    console.log(this);
                });
                
                    
             */
            this.on = function (type, callback) {
                ui.on.apply(dp, arguments);
                return this;
            };

            /**
             * 为控件取消绑定事件
             *  @event off
             *  @since 1.3.0
             *  @param {string} [type] [ 事件类型: "change"(日期改变的时候) | "show"(日期展示的时候)| "hide"(日期隐藏的时候) ]
             *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
             *  @example 
                
                uiPickerdate.off("show");
                
                    
             */
            this.off = function (type, callback) {
                ui.off.apply(dp, arguments);
                return this;
            };
            /*
             * 触发自定义事件
             */
            function trigger(type) {
                //点击事件本身,或者为空,避免循环引用
                dp.self = this == window || this == dp ? null : this;

                ui.trigger.apply(dp, arguments);
            }
        }

        return function (opt) {
            return new Datepicker(opt);
        };
    }();

    return ui;
})(window.bui || {}, window.libs);

/**
 * UI控件库 
 * @module UI
 */
(function (ui, $) {
    "use strict";

    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>级联选择</h2>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.levelselect.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     * {{#crossLink "bui.select/show"}}{{/crossLink}}: 选中第几个数据 <br>
     * {{#crossLink "bui.select/hide"}}{{/crossLink}}: 获取或者设置值 <br>
     * {{#crossLink "bui.select/value"}}{{/crossLink}}: 获取或者设置文本 <br>
     *   </div>
     *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.levelselect.html" target="_blank"></a></div>
     * </div>
     *  @namespace bui
     *  @class levelselect
     *  @constructor 
     *  @param {object} option  
     *  @param {array} [option.data] [渲染的二维数据]  
     *  @param {string|object} [option.appendTo] [渲染到哪里去]  
     *  @param {string} [option.trigger] [触发弹出框的按钮样式名,层级有多少,这个样式就有多少个]  
     *  @param {object} [option.field] [1.4.5新增 默认,{ name: "n", data: ["c","a"] }] 
     *  @param {string} [option.field.name] [ 数据的文本字段 ]   
     *  @param {array} [option.field.data] [ 支持多个不同字段 ]   
     *  @param {string} [option.title] [弹出层的标题]   
     *  @param {string} [option.placeholder] [按钮的提示文本]   
     *  @param {array} [option.value] [初始化选中的文本 例如:["广东","广州市","天河区"]]   
     *  @param {boolean} [option.popup] [ 是否弹出, 为true 下面效果才会有效 ]  
     *  @param {boolean} [option.autoClose] [ 点击最后一个是否关闭 ]  
     *  @param {number} [option.height] [ 弹出的高度默认300]  
     *  @param {boolean} [option.mask] [ true | false 是否显示遮罩]  
     *  @param {boolean} [option.showValue] [ true | false 是否在弹出层显示选中值 ]  
     *  @param {boolean} [option.fullscreen] [ false | true 是否全屏]  
     *  @param {string} [option.effect] [出现的效果,更多参考{{#crossLink "bui.toggle"}}{{/crossLink}}]  
     *  @param {string} [option.position] [ 显示的位置 top | bottom | center  ]  
     *  @param {string|object} [option.appendTo] [ 默认:"" ]   
     *  @example
     
        html:
        <div class="bui-box">
            <!-- .selected-val 跟你层级个数保持一致 -->
            <div class="selected-val"></div>
            <div class="selected-val"></div>
            <div class="selected-val"></div>
        </div>
      
       * js:
        // http://www.easybui.com/demo/json/citys.js
          // 普通初始化
        var citySelect = bui.levelselect({
            data: citys,
            title: "所在地区",
            trigger: ".selected-val",
            level: 3,
            field:{
                name: "n",
                data: ["c","a"],
            }
        })
          // 设置值
        var citySelect2 = bui.levelselect({
            data: citys,
            title: "所在地区",
            trigger: ".selected-vals",
            level: 3,
            field:{
                name: "n",
                data: ["c","a"],
            },
            value: ["广东","广州市","天河区"]
        })
     * 
     *
     */

    ui.levelselect = function (opt) {
        var config = {
            popup: true,
            data: [],
            height: 300,
            appendTo: "",
            title: "所在地区",
            trigger: null,
            placeholder: "请选择",
            level: 3,
            visibleNum: 2,
            scrollNum: 1,
            log: false,
            mask: true,
            autoClose: true,
            fullscreen: false,
            position: "bottom",
            effect: "fadeInUp",
            showValue: true,
            onMask: null,
            value: [],
            onChange: null,
            onInited: null,
            field: {
                name: "n",
                icon: "icon",
                image: "image",
                value: "",
                data: ["c", "a"]
            }
        };

        var param = $.extend(true, {}, config, opt);

        var chineseCities = [];
        var gid = bui.guid(),
            // dialog id
        gidSlide = gid + "-slide",
            // slide id
        $dialog = null,
            $slide = null,
            slideHeight = 0,
            selectValue = [],
            uiSlideCity = null,
            selectDistance = [],
            // 选择控件
        selectDom = [],
            // 选择控件对应的选择器
        selectValDom = [],
            // 选择控件对应的值选择器
        triggers = [],
            // 选择控件对应的值选择器
        uiDialogCity = null;

        var module = {
            init: init,
            show: show,
            hide: hide,
            value: value,
            to: to,
            prev: prev,
            next: next,
            on: on,
            off: off,
            trigger: trigger
        };

        opt.appendTo = opt.appendTo || (ui.hasRouter ? router.currentPage() || "body" : "body");
        var $parent = opt.id ? $(opt.id) : $(opt.appendTo);

        var firstInit = true;

        // 初始化声明
        function init(opt) {

            var levelHtml = '';
            if (opt.popup) {
                levelHtml = templeDialog(opt);
                $parent.append(levelHtml);

                // 对话框
                uiDialogCity = bui.dialog({
                    id: gid,
                    height: opt.height,
                    mask: opt.mask,
                    scroll: false,
                    autoClose: opt.autoClose,
                    fullscreen: opt.fullscreen,
                    position: opt.position,
                    effect: opt.effect,
                    onMask: opt.onMask
                });

                $dialog = ui.obj(gid);
            } else {
                levelHtml = templeSlide(opt);
                $parent.append(levelHtml);

                $dialog = ui.objId(gid);
            }

            // 初始化焦点图
            $slide = ui.objId(gidSlide);

            var n = 0;
            for (n = 0; n < opt.level; n++) {

                (function (i) {
                    // 选中后的值选择器
                    selectValDom[i] = $(".select-level-val-" + i, $dialog);
                    selectDom[i] = $(".select-level-" + i, $slide);

                    opt.trigger && (triggers[i] = $(opt.trigger).eq(i));
                    // select 控件
                    selectDistance[i] = bui.select({
                        id: selectDom[i],
                        type: "select",
                        direction: "right",
                        field: {
                            name: opt.field.name,
                            icon: opt.field.icon,
                            image: opt.field.image,
                            value: opt.field.value || opt.field.name
                        },
                        popup: false,
                        data: [],
                        onChange: opt.onChange
                    });

                    selectValDom[i].on("click", function () {
                        $(this).addClass("active").siblings().removeClass("active");

                        uiSlideCity.prev();
                    });

                    // select 更改的时候触发
                    selectDistance[i] && selectDistance[i].on("change", function (e) {
                        opt.log && console.log("change", i);

                        var index = selectDistance[i].index() || 0;
                        var value = selectDistance[i].value() || 0;
                        var name = selectDistance[i].text() || selectDistance[i].value();

                        // 选中的值
                        selectValue[i] = { name: name, value: value, index: index };

                        // 设置值

                        var fieldData = [];
                        var levelData = [];
                        if (typeof opt.field.data === "string") {
                            fieldData = chineseCities[i][index][opt.field.data] || chineseCities[i][index];
                        } else if (opt.field.data && ui.typeof(opt.field.data) === "array") {
                            opt.field.data.forEach(function (item, n) {
                                levelData.push(chineseCities[i][index][opt.field.data[n]]);
                            });

                            // 支持4级
                            fieldData = levelData[0] || levelData[1] || levelData[2] || levelData[3] || levelData[4] || levelData[5] || levelData[6];
                        }

                        // 激活第一个城市
                        chineseCities[i + 1] = fieldData;
                        selectDistance[i + 1] && selectDistance[i + 1].option("data", chineseCities[i + 1]);
                        selectDistance[i + 2] && selectDistance[i + 2].option("data", ['']);
                        // 增加激活样式
                        selectDom[i] && selectDom[i].find('.bui-btn').removeClass("active");
                        $(e.target).parents(".bui-btn").addClass("active");

                        selectNavIndex(i);

                        // 设置值
                        selectValDom[i] && selectValDom[i].text(name);
                        selectValDom[i + 1] && selectValDom[i + 1].text(opt.placeholder);
                        selectValDom[i + 2] && selectValDom[i + 2].text('');

                        // 设置关联的trigger
                        triggers[i] && triggers[i].text(name);
                        triggers[i + 1] && triggers[i + 1].text(opt.placeholder);
                        triggers[i + 2] && triggers[i + 2].text('');

                        // 上下文
                        e.context = { trigger: triggers[i], selector: selectValDom[i], index: i, select: selectDistance[i], data: chineseCities[i]
                            // e.target = this;
                            // 触发change
                        };trigger.call(module, "change", e);

                        if (i == opt.level - 1) {

                            trigger.call(module, "lastchange", e);
                        }

                        // 如果不是打开状态,不需要控制当前slide的位置
                        if (opt.popup && !uiDialogCity.isOpen()) {
                            return;
                        }
                        // 最后一个
                        if (i == opt.level - 1) {
                            opt.log && console.log("close");
                            opt.autoClose && uiDialogCity.close();
                        } else if (i % opt.visibleNum == 1) {
                            opt.log && console.log("next");
                            uiSlideCity.next();
                        }
                    });
                })(n);
            }

            // 绑定事件
            bind(opt);

            if (opt.popup && uiDialogCity) {
                // 监听打开的状态
                uiDialogCity.on("open", function (argument) {
                    slideHeight = opt.height - $dialog.find(".select-value").height() - $dialog.children(".bui-dialog-head").height();

                    slideInit(opt);
                });
            } else {
                slideHeight = opt.height;
                slideInit(opt);
            }

            // 一级设置文本
            selectValDom[0] && selectValDom[0].text(opt.placeholder);
            triggers[0] && triggers[0].text(opt.placeholder);

            //省份数据
            chineseCities[0] = opt.data;
            selectDistance[0].option("data", chineseCities[0]);

            // 在初始化数据以后赋值
            opt.value && value(opt.value);
            opt.onInited && opt.onInited(opt.value);
            // 激活第一个数据
            // selectDistance[0].active(0);
            // console.log(selectDistance[0].text());
            firstInit = false;
        }

        /**
         * 跳转到第几层 ,1.5 新增
         *  @method to
         *  @chainable
         *  @example 
            
            //跳转
            citySelect.to(1);
                
         */
        function to(index, transition) {
            uiSlideCity && uiSlideCity.to(index, transition);
            return this;
        }

        /**
         * 上一个,1.5 新增
         *  @method prev
         *  @chainable
         *  @example 
            
            //上一个
            citySelect.prev();
                
         */
        function prev() {
            uiSlideCity && uiSlideCity.prev();
            return this;
        }
        /**
         * 下一个,1.5 新增
         *  @method next
         *  @chainable
         *  @example 
            
            //下一个
            citySelect.next();
                
         */
        function next() {
            uiSlideCity && uiSlideCity.next();
            return this;
        }

        /**
         * 显示窗口
         *  @method show
         *  @chainable
         *  @example 
            
            //显示菜单
            citySelect.show();
                
         */
        function show() {
            uiDialogCity && uiDialogCity.open();
            trigger.call(this, "show");
        }
        /**
         * 隐藏窗口
         *  @method hide
         *  @chainable
         *  @example 
            
            //显示菜单
            citySelect.hide();
                
         */
        function hide() {
            uiDialogCity && uiDialogCity.close();
            trigger.call(this, "hide");
        }

        function slideInit(opt) {
            if (uiSlideCity) {
                return;
            }
            // 初始化slide
            uiSlideCity = bui.tab({
                id: gidSlide,
                height: slideHeight,
                scroll: true,
                zoom: false,
                visibleNum: opt.visibleNum,
                scrollNum: opt.scrollNum
            }).lock();

            uiSlideCity.on("to", function (index) {
                selectNavIndex(index);
            });
        }
        // 绑定事件
        function bind(opt) {}

        /**
         * 隐藏窗口
         *  @method value
         *  @chainable
         *  @example 
            
            //取值
            var value = citySelect.value();
              // 返回 [{name:"广东",value:"广州市",index:"0"}]
              //设置值
            citySelect.value(["广东","广州市","天河区"]);
              citySelect.value([{value:"广东"},{value:"广州市"},{value:"天河区"}]);
                
         */
        function value(vals) {
            if (typeof vals === "undefined") {
                return selectValue;
            } else {
                // 在初始化数据以后赋值
                if (vals && ui.typeof(vals) === "array") {
                    vals.forEach(function (item, i) {
                        if (typeof item === "string") {
                            selectDistance[i].value(item);
                        } else if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
                            selectDistance[i].text(item.name);
                            selectDistance[i].value(item.value);
                        }
                    });
                } else {
                    ui.showLog("参数是一个数组类型");
                }
            }
        }

        // 激活导航
        function selectNavIndex(index) {
            $(".select-value div", $dialog).removeClass("active");
            $(".select-value div", $dialog).eq(index).addClass("active");
        }

        // dialog
        function templeDialog(opt) {

            var html = '',
                slide = '',
                i = 0;
            html += '<div id="' + gid + '" class="bui-dialog bui-levelselect" style="display:none;">';
            html += '    <div class="bui-dialog-head">' + opt.title + '</div>';
            html += '    <div class="bui-dialog-main">';
            html += templeSlide(opt);
            html += '    </div>';
            html += '    <div class="bui-dialog-close"><i class="icon-close"></i></div>';
            html += '</div>';

            return html;
        }

        function templeSlide(opt) {
            var html = '',
                i = 0;

            // 没有弹窗
            if (!opt.popup) {
                html += '<div id="' + gid + '" class="bui-levelselect">';
            }
            // 显示选中的值
            if (opt.showValue) {
                html += '    <div class="bui-box select-value">';
                for (i = 0; i < opt.level; i++) {
                    html += '        <div class="select-level-val-' + i + '"></div>';
                }
                html += '    </div>';
            }
            html += '<div id="' + gidSlide + '" class="bui-tab bui-levelselect-tab">';
            html += '    <div class="bui-tab-main">';
            html += '        <ul>';
            // 遍历层级
            for (i = 0; i < opt.level; i++) {
                html += '            <li>';
                html += '                <div class="select-level-' + i + '"></div>';
                html += '            </li>';
            }
            html += '        </ul>';
            html += '    </div>';
            html += '</div>';
            // 没有弹窗
            if (!opt.popup) {

                html += '</div>';
            }
            return html;
        }

        // 初始化
        init(param);

        /**
         * 为控件绑定事件
         *  @event on
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "change"(点击选择框改变的时候触发) | "lastchange"(点击最后一个层级的时候,触发)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            citySelect.on("change",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @since 1.3.0
         *  @param {string} [type] [ 事件类型: "change"(点击选择框改变的时候触发) | "lastchange"(点击最后一个层级的时候,触发)  ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            citySelect.off("change");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }

        /**
         * 获取依赖的控件
         *  @method widget
         *  @since 1.4.2
         *  @param {string} [name] [ 依赖控件名 dialog, slide, select ]
         *  @example 
            
            //获取依赖控件
            var citySelectWidget = citySelect.widget();
            
                
         */
        

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

var bui_tab = createCommonjsModule(function (module) {
  /**
   * UI控件库 
   * @module UI
   */

  (function (ui, $) {
    /**
       * <div class="oui-fluid">
       *   <div class="span8">
       *     <h2>Tab控件</h2>
       *     <p>Tab控件基于bui.slide制作,对参数要了解得更多一点,可以用来制作: <a href="../../index.html#pages/ui_controls/bui.tab.html" target="_blank">TAB选项卡</a>,全屏相册,上下滑屏,过滤筛选,层级选择器,滚动公告,等等</p>
       *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.tab.html" target="_blank">demo</a></h3>
       *   </div>
       *   <div class="span4"><a href="../../index.html#pages/ui_controls/bui.tab.html" target="_blank"><img src="http://www.easybui.com/static/images/controls/bui-tab_low.gif" alt="控件预览"/></a></div>
       * </div>
       *  @namespace bui
       *  @class tab
       *  @since 1.5.0
       *  @extends bui.slide
       *  @constructor 
       *  @param {object} option  
       *  @param {string} option.id [控件id]  
       *  @param {string} [option.menu] [ 默认".bui-tab-head ul" (循环元素的父级), 如果控制菜单要独立,可以使用id选择器]  
       *  @param {string} [option.children] [ 默认".bui-tab-main ul" (循环元素的父级), 如果控制内容要独立,可以使用id选择器, tab嵌套必须使用id ]  
       *  @param {string} [option.stopHandle] [ 1.4.2新增,样式名,默认为空,支持多个样式名,以逗号间隔. 当这个值等于tab里面的某个样式,不触发滑动,一般用于事件冲突,比方 input[type=range] 无法滑动的时候 ]  
       *  @param {number} [option.width] [0 为默认屏幕宽度]   
       *  @param {number} [option.height] [0 为默认屏幕高度,会计算剩余的高度]  
       *  @param {number} [option.index] [ 默认:0 ,第一次加载第几个 ]  
       *  @param {string} [option.direction] [ 水平滑动还是纵向滑动 默认: x | y ]  
       *  @param {string} [option.alignClassName] [ since 1.3.4 默认是"",全屏默认是:"bui-box-center", 每个li的盒子对齐样式名,主要用于全屏时的内容对齐,自带几种对齐方式 左:bui-box-align-left 水平中:bui-box-align-right 右:bui-box-align-center 上:bui-box-align-top 垂直中:bui-box-align-middle 下:bui-box-align-bottom  ]  
       *  @param {boolean} [option.swipe] [ 是否允许侧滑,默认允许 true | false ]  
       *  @param {boolean} [option.animate] [ 点击菜单跳转到某个位置是否采用动画 默认: true | false ] 
       *  @param {boolean} [option.scroll] [ 是否允许垂直滚动 false | true , 如果单独需要滚动 可以给滑动的li的属性加上 data-scroll=true ]  
       *  @param {boolean} [option.autoheight] [ 1.4.3新增, 自动高度,由内容撑开 默认:false | true ]   
       *  @param {number} [option.visibleNum] [ 1.4.5新增, 可视个数,默认为1 ]  
       *  @param {number} [option.scrollNum] [ 1.4.5新增, 一次滚动个数,默认为1 ]  
       *  @param {number} [option.distance] [ 默认40, 拖拽大于distance才会生效,配合delay可以防止tab又有上下其它事件 ]  
       *  @param {function} [option.callback] [ 点击的回调 1.3.0 以后不再推荐,自行绑定就可 ] 
       *  @param {boolean} [option.autoload] [ 1.4新增 默认: false | true 远程加载菜单按钮上的 href 地址, 如果点击的按钮有disabled属性或者样式,则不跳转]  
       *  @example
       *   html:
       *
              <div id="tab" class="bui-tab">
                <div class="bui-tab-head">
                  <ul >
                    <li>Tab1</li>
                  </ul>
                </div>
                <div id="tabmain" class="bui-tab-main">
                  <ul>
                    <li>
                      <img src="images/placeholder-list.png" alt="占位图">
                    </li>
                  </ul>
                </div>
              </div>
       *      
       *   js: 
       *   
              // 初始化
              var uitab = bui.tab({
                          id:"#tab"
                        })
       *
       *
       */
    ui.tab = function (option) {
      var config = {
        id: "",
        menu: ".bui-tab-head > ul",
        children: ".bui-tab-main > ul",
        header: "header",
        footer: "footer",
        item: "li",
        prev: ".bui-tab-prev",
        next: ".bui-tab-next",
        alignClassName: "",
        stopHandle: "",
        width: 0,
        height: 0,
        zoom: false,
        swipe: true,
        animate: true,
        bufferEffect: false,
        visibleNum: 1,
        scrollNum: 1,
        distance: 40,
        direction: "x",
        autoplay: false,
        autoheight: false,
        scroll: true,
        index: 0,
        fullscreen: false,
        autopage: false,
        autoload: false,
        async: true, // 如果改为同步, 会导致"load"事件监听第一次不触发   
        callback: null,
        onStart: null,
        onMove: null,
        onEnd: null
      };
      //用于option方法的设置参数
      var param = module.config = $.extend(true, {}, config, ui.config.slide, option);

      var uiSlide = ui.slide(param);

      return uiSlide;
    };

    return ui;
  })(window.bui || {}, window.libs);
});

/**
 * UI控件库 
 * @module UI
 */

(function (ui, $) {

    /**
     * <div class="oui-fluid">
     *   <div class="span8">
     *     <h2>输入框交互</h2>
     *     <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.input.html" target="_blank">demo</a></h3>
     *     <h3>方法说明:</h3>
     *     {{#crossLink "bui.input/value"}}{{/crossLink}}: 获取值 <br>
     *   </div>
     *   <div class="span4"></div>
     * </div>
     *  @namespace bui
     *  @class input
     *  @constructor 
     *  @since 1.5.0 
     *  @param  {object} option [description]
     *  @param  {string} option.id [事件的父级]
     *  @param  {string} [option.target] [目标是input]
     *  @param  {string} [option.iconClass] [图标样式名,默认:".icon-remove"]
     *  @param  {boolean} [option.showIcon] [是否显示图标,会影响到callback回调, 默认: true(显示图标)|false(隐藏图标)]
     *  @param  {boolean} [option.showLength] [是否显示长度,结合maxLength参数, 默认: false(隐藏长度)|true(显示长度)]
     *  @param  {number} [option.maxLength] [输入的长度, 0不限制 ,默认:0 ]
     *  @param  {function} [option.onInput] [输入的回调]
     *  @param  {function} [option.onBlur] [离开的回调, 必须返回 true 的时候, value方法才能拿到值. 如果 return fasle, 则value 方法拿不到值,用于校验]
     *  @param  {function} [option.onFocus] [聚焦的回调]
     *  @param  {function} [option.callback] [点击图标的回调]
     *  @example
     * 
     * html: 
      
        <div class="bui-input password-input">
            <input id="password" type="password" placeholder="密码">
        </div>
         js: 
          var uiInput = bui.input({
            id: ".password-input",
            callback: function (e) {
                // 点击删除按钮清空
                $("#password").val('');
                $(e.target).hide();
            }
        })
            
     *
     */
    ui.input = function (option) {

        var config = {
            id: "",
            target: "input,textarea",
            event: "input",
            iconClass: ".icon-remove",
            showIcon: true,
            showLength: false,
            maxLength: 0,
            onInput: null,
            onBlur: null,
            onFocus: null,
            callback: null

            //方法
        };var module = {
            handle: {},
            empty: empty,
            value: value,
            toggleType: toggleType,
            on: on,
            off: off,
            widget: widget,
            option: options,
            config: param,
            init: init
        };
        //用于option方法的设置参数
        var param = module.config = $.extend(true, {}, config, ui.config.searchbar, option);

        var $id,
            id,
            keywordCache,
            hasEventInit = false,
            valCache,
            $input,
            iconClass,
            $valLength,
            $target;

        //执行初始化
        init(param);

        /**
         * 初始化方法,用于重新初始化结构,事件只初始化一次
         *  @method init
         *  @param {object} [option] [参数控件本身]
         *  @chainable
         */
        function init(opt) {
            var option = $.extend(true, param, opt);

            //option获取新参数使用
            param = module.config = option;

            if (option.id == "" || option.id === null) {
                return;
            }

            //验证id
            $id = ui.obj(option.id);

            $target = $id.find(option.target);

            $input = $target.eq(0);

            iconClass = ui.unit.startWithClass(option.iconClass) ? option.iconClass : '.' + option.iconClass;

            if (!hasEventInit) {
                //绑定事件
                bind(option);

                if (option.showLength) {

                    var html = templateLength(option);
                    $id.append(html);
                }
                option.maxLength > 0 && $target.attr("maxlength", option.maxLength);
            }

            return this;
        }

        function bind(option) {
            // 输入框监听延迟执行
            $target.on(option.event, bui.unit.debounce(function (e) {
                var val = this.value,
                    $parent = $(this).parent(),
                    $btnRemove = $parent.find(iconClass);

                valCache = val;

                if (val.length > 0 && option.showIcon) {

                    if ($btnRemove && $btnRemove.length) {
                        $btnRemove.css("display", "block");
                    } else {

                        $parent.append('<i class="' + iconClass.substr(1) + '"></i>');
                        $btnRemove = $target.find(iconClass);
                    }
                } else {
                    $btnRemove && $btnRemove.css("display", "none");
                }

                if (option.showLength) {
                    $valLength = $parent.find("em");
                    $valLength.text(val.length);
                }

                option.onInput && option.onInput.call(module, e);

                trigger.call(module, "input", e);
            }, 100));

            $target.on("focus", function (e) {

                var val = this.value;

                valCache = val;

                $input = $(this);

                if (option.showIcon) {

                    $id.find(iconClass).css("display", "none");
                    val && $(this).next().css("display", "block");
                }

                option.onFocus && option.onFocus.call(module, e);

                trigger.call(module, "focus", e);
            });

            $target.on("blur", function (e) {

                var isRight = option.onBlur && option.onBlur.call(module, e);
                // 如果有 onBlur 回调,则必须返回true 才会有值
                if (isRight == true || isRight === null) {
                    valCache = this.value;
                } else {
                    valCache = '';
                }
                trigger.call(module, "blur", e);
            });

            // 图标点击事件
            option.showIcon && $id.on("click", iconClass, function (e) {

                option.callback && option.callback.call(module, e);

                trigger.call(module, "click", e);
            });

            hasEventInit = true;

            return this;
        }

        function templateLength(option) {
            var $parent = $input.parent();

            var html = '<span class="bui-input-length"><em>0</em>/' + option.maxLength + '</span>';
            return html;
        }

        /**
         * 获取并设置值, 只能单个操作
         *  @method value
         *  @example 
            
            var val = uiInput.value();
                
         */
        function value(val) {

            if (typeof val !== "undefined") {
                $input.val(val);

                return this;
            }

            return valCache;
        }

        /**
         * 清空值
         *  @method epmty
         *  @example 
            
            uiInput.epmty();
                
         */
        function empty() {

            $input.val('');
            $input.next().css("display", "none");

            param.showLength && $valLength.text(0);

            return this;
        }

        /**
         * 切换text跟password, 用于密码的展示
         *  @method toggleType
         *  @example 
            
            uiInput.toggleType();
                
         */
        function toggleType() {

            // 点击删除按钮清空
            var type = $input.attr("type");
            if (type == "text") {
                $input.attr('type', "password");
            } else {
                $input.attr('type', "text");
            }

            return this;
        }

        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 ]
         *  @example 
            
            //获取依赖控件
            var uiInputWidget = uiInput.widget();
            
                
         */
        function widget(name) {
            var control = {};
            return ui.widget.call(control, name);
        }
        /**
         * 获取设置参数
         *  @method option
         *  @param { string | object } [key] [ 不传则获取所有参数, 类型为string,没有第2个参数则获取某个参数 ]
         *  @param { string | number | boolean | function } [value] [ 设置参数的时候要传,设置多个参数不用传,获取参数的时候也不用传 ]
         *  @chainable
         *  @example 
            
            
            //获取所有参数
            var option = uiInput.option();
              //获取某个参数
            var id = uiInput.option( "id" );
                  
         */
        function options(key, value) {

            return ui.option.call(module, key, value);
        }

        /**
         * 为控件绑定事件
         *  @event on
         *  @param {string} [type] [ 事件类型: "click"(搜索时触发) | "focus"(移除关键字时触发) | "input"(每次输入时触发) ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiInput.on("input",function () {
                // 点击的菜单
                console.log(this);
            });
            
                
         */
        function on(type, callback) {
            ui.on.apply(module, arguments);
            return this;
        }

        /**
         * 为控件取消绑定事件
         *  @event off
         *  @param {string} [type] [ 事件类型: "click"(搜索时触发) | "focus"(移除关键字时触发) | "input"(每次输入时触发) ]
         *  @param {function} [callback] [ 绑定的事件, this 为当前点击的菜单 ]
         *  @example 
            
            uiInput.off("input");
            
                
         */
        function off(type, callback) {
            ui.off.apply(module, arguments);
            return this;
        }
        /*
         * 触发自定义事件
         */
        function trigger(type) {
            //点击事件本身,或者为空,避免循环引用
            module.self = this == window || this == module ? null : this;

            ui.trigger.apply(module, arguments);
        }
        return module;
    };

    return ui;
})(bui || {}, libs);

// ui

/**
 * <h3>原生方法库</h3> 
 * 原生方法库是采用原生及普通方法的一个混合,便于在debug中随时切换
 * <h5>数据交互</h5>
 * {{#crossLink "bui.ajax"}}{{/crossLink}}: 数据请求 <br>
 * {{#crossLink "bui.upload"}}{{/crossLink}}: 上传文件 <br>
 * {{#crossLink "bui.download"}}{{/crossLink}}: 下载文件 <br>
 * {{#crossLink "bui.file"}}{{/crossLink}}: 文件管理 <br>
 * {{#crossLink "bui.fileselect"}}{{/crossLink}}: 文件选择 <br>
 * <h5>页面交互</h5>
 * {{#crossLink "bui.load"}}{{/crossLink}}: 页面跳转及传参 <br>
 * {{#crossLink "bui.getPageParams"}}{{/crossLink}}: 页面获取参数 <br>
 * {{#crossLink "bui.back"}}{{/crossLink}}: 页面后退 <br>
 * {{#crossLink "bui.refresh"}}{{/crossLink}}: 页面刷新 <br>
 * 
 * @module Native
 */
(function (ui, $) {

    /**
     * 数据请求, $.ajax 跟 app.ajax 有的参数, bui.ajax 都有, 这里只列了简单的几个参数.
     *  <h3>预览地址: <a href="../../index.html#pages/ui_method/bui.ajax.html" target="_blank">demo</a></h3>
     * @namespace  bui
     * @class  ajax
     * @constructor 
     * @param {object} option 
     *   @param {string} option.url [请求的地址]
     *   @param {object} option.data [传输的数据对象 {} 不能是数组,原生不支持]
     *   @param {string} [option.method] [传输的方法 GET | POST]
     *   @param {object} [option.headers] [通过header传输的参数  {} ]
     *   @param {boolean} [option.async] [true 是异步 | false 是同步 ]
     *   @param {string} [option.dataType] [默认 json | jsonp | script | xml | html | text]
     *   @param {string} [option.contentType] [默认 'text/html;charset=UTF-8' | 'application/x-www-form-urlencoded'(表单) | 'multipart/form-data'(表单里有file文件) | 'application/json'(后端要用@requestbody接收) ]'
     *   @param {number} [option.timeout] [超出这个时间则认为请求失败]
     *   @param {boolean} [option.needJsonString] [1.4.6新增,默认 true|false. true时当contentType="application/json"并且data是对象的话,会尝试把数据转换为string. ]
     * @example
     *     bui.ajax({
     *         url: "",
     *         data: {}
     *     }).then(function(res){
     *         console.log(res)
     *     },function(res,status){
     *         console.log(status);
               // status = "timeout" || "error" || "abort", "parsererror"
     *     })
     * 
     */
    ui.ajax = function (option) {

        //延时处理
        var def = $.Deferred(),
            ajaxHandle = null;
        var config = {
            data: {},
            method: "GET",
            dataType: "json",
            timeout: 60000,
            headers: {},
            processData: true,
            mimeType: "none",
            cache: false,
            async: true,
            needJsonString: true,
            contentType: "",
            localData: null,
            native: true

            //用于option方法的设置参数
        };var params = $.extend(true, {}, config, ui.config.ajax, option);
        var paramsSuccess = params.success,
            paramsFail = params.fail || params.error;
        // 如果没传contentType 就根据不同的请求给予默认的参数值
        if (params.contentType === "" && params.method == "GET") {
            params.contentType = "text/html;charset=UTF-8";
        } else if (params.contentType === "" && params.method == "POST") {
            params.contentType = "application/x-www-form-urlencoded";
        } else {
            params.contentType = params.contentType;
        }

        // 尝试转换为字符串, contentType = "application/json" 才能接收
        if (params.contentType == "application/json" && ui.typeof(params.data) === "object" && params.needJsonString) {
            try {
                params.data = JSON.stringify(params.data);
            } catch (e) {
                params.data = params.data;
            }
        }
        if (!params.url) {
            ui.showLog("url不能为空", "bui.ajax");
            return def;
        }
        // 部分接口同时支持 https: http:
        // if( params.url.indexOf("//") === 0){
        //     ui.showLog("url格式需要以http://或者https://开头","bui.ajax");
        //     return def;
        // }

        //中断请求
        def.abort = function () {
            ajaxHandle && ajaxHandle.abort();
        };

        // 本地数据
        if (params.localData) {
            paramsSuccess && paramsSuccess(params.localData, 200);
            def.resolve(params.localData, 200);
            return def;
        }
        // 为true时,是web平台
        if (params.native && ui.isWebapp || !params.native && !ui.isWebapp) {
            webAjax(params);
        } else {
            // 如果没有原生版本,使用webajax,一般打包后可以跨域
            if (typeof ui.native.ajax === "undefined") {
                webAjax(params);
                return def;
            }
            def = ui.native.ajax && ui.native.ajax(params) || def;
        }

        // web 请求
        function webAjax(params) {

            var successCallback = function successCallback(res, status, xhr) {
                var obj;
                if (typeof res == 'string' && params.dataType == "json") {
                    try {
                        obj = JSON.parse(res);
                    } catch (e) {
                        obj = res;
                    }
                } else {
                    obj = res || {};
                }
                paramsSuccess && paramsSuccess(obj, status, xhr);
                def.resolve(obj, status, xhr);
            };
            var failCallback = function failCallback(res, status, xhr) {
                // status: "timeout", "error", "abort", "parsererror"
                var obj;
                if (typeof res == 'string' && params.dataType == "json") {
                    try {
                        obj = JSON.parse(res);
                    } catch (e) {
                        obj = res;
                    }
                } else {
                    obj = res || {};
                }
                paramsFail && paramsFail(obj, status, xhr);
                def.reject(obj, status, xhr);
            };

            params.success = successCallback;
            params.error = failCallback;
            // 兼容原本的type参数
            var type = params.type && params.type.toUpperCase();
            params.type = type || params.method.toUpperCase();

            // 普通web请求
            ajaxHandle = $.ajax(params);
        }

        return def;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * @module Native
 */
(function (ui, $) {

    /**
     * 页面跳转可以传参 获取参数请看 {{#crossLink "bui.getPageParams"}}{{/crossLink}} 方法
     *  <h3>预览地址: <a href="../../index.html#pages/ui_method/bui.load.html" target="_blank">demo</a></h3>
     * @namespace  bui
     * @class  load
     * @constructor 
     * @param {object} option 
     *   @param {string} option.url [请求的地址]
     *   @param {object} option.param [传过去另外页面的参数]
     *   @param {boolean} option.replace [替换当前url (1.3.0 新增),不新增历史记录]
     *   @param {boolean} option.reload [1.4.2新增,默认:false, 重新加载,如果单页应用要跳转到单页应用,则需要这个选项为true]
     *   @param {boolean} option.iframe [1.4.2新增,默认:false, 单页支持iframe加载,其它开发方式无效]
     * @example
     *     // 执行页面跳转
     *     bui.load({ 
     *         url: "",
     *         param:{}
     *     })
     * 
     */
    ui.load = function (option) {

        var config = {
            url: "",
            param: {},
            reload: false,
            replace: false,
            native: true
        };

        var params = $.extend(true, {}, config, ui.config.load, option),
            newurl;
        var url = params.url;
        if (!params.url) {
            ui.showLog("url 不能为空!", "bui.load:web");
            return;
        }

        // 使用外部打开
        if (url.indexOf("tel:") >= 0 || url.indexOf("mailto:") >= 0 || url.indexOf("sms:") >= 0) {
            ui.unit.openExtral(url);
            return;
        }

        try {
            params.param = typeof params.param === "string" && JSON.parse(params.param) || params.param || {};
        } catch (e) {
            ui.showLog("param 参数值必须是一个{}对象", "bui.load:web");
            return;
        }

        // 取消手机的键盘,防止键盘占位
        document.activeElement.blur();

        // 生成一个新的url地址
        newurl = ui.setUrlParams(params.url, params.param);

        // 重新加载,跟是否单页无关, 用于单页应用跟单页应用之间的跳转
        if (params.reload && ui.isWebapp) {
            window.location.href = newurl;
            return;
        } else if (params.reload && !ui.isWebapp) {
            // 原生跳转
            ui.native.load && ui.native.load(params);
            return;
        }
        // 采用替换的方式
        if (params.replace && !("load" in window.router)) {
            window.location.replace(newurl);
            return;
        }

        // 优先使用单页,然后才是根据平台切换
        if ("load" in window.router) {
            window.router.load(params);
        } else if (params.native && ui.isWebapp || !params.native && !ui.isWebapp) {
            window.location.href = newurl;
        } else {
            // 原生跳转
            ui.native.load && ui.native.load(params);
        }
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * @module Native
 */
(function (ui, $) {

    /**
     * 获取页面参数,配合 {{#crossLink "bui.load"}}{{/crossLink}} 使用,需要在回调里面获取执行.
     *  <h3>预览地址: <a href="../../index.html#pages/ui_method/bui.getPageParams.html" target="_blank">demo</a></h3>
     * @namespace  bui
     * @class  getPageParams
     * @constructor 
     * @param {function} callback 数据都在回调里面
     * @example
     *
     *     
     *     // 推荐: 1.3.1以上 参数需要在回调里面获取
     *     var uiParams = bui.getPageParams();
     *     uiParams.done(function(result){
     *         var urlparam = result;
     *          console.log(urlparam) 
     *     })
     *     
     *     // 1.3.1以下 参数需要在回调里面获取
     *     bui.getPageParams(function(result){
     *         var urlparam = result;
     *
     *          console.log(urlparam)
     *     });
     * 
     */
    ui.getPageParams = function (option) {
        //延时处理
        var def = $.Deferred();

        var config = {
            callback: null,
            native: true
        };

        option = option || {};
        var params = $.extend(true, {}, config, ui.config.getPageParams);
        if (typeof option === "function") {
            params.callback = option;
        } else if (option && ui.typeof(option) === "object") {
            params = $.extend(true, {}, config, ui.config.getPageParams, option);
        }

        // 优先使用单页,然后才是根据平台切换
        if ("getPageParams" in window.router) {
            var par = window.router.getPageParams && window.router.getPageParams();
            params.callback && params.callback(par);
            def.resolve(par);
        } else if (params.native && ui.isWebapp || !params.native && !ui.isWebapp) {
            //pc不能在后退以后执行操作
            var param = ui.getUrlParams();
            params.callback && params.callback(param);
            def.resolve(param);
        } else {
            // 采用原生获取参数的方式
            def = ui.native.getPageParams && ui.native.getPageParams(params) || def;
        }

        return def;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * @module Native
 */
(function (ui, $) {

    /**
     * ## 后退方法
     * 后退方法的回调,只在bui.isWebapp=false才会触发,会根据平台使用不同的后退方法
     * @namespace  bui
     * @class  back
     * @constructor 
     * @param {object} [option] 
     * @param {number} [option.index] [默认:-1 后退的层次, 原生不支持后退多层]
     * @param {function} [option.callback] [后退以后触发]
     * @param {string} [option.name] [1.4.1新增,后退到指定模块,单页开发才有效]
     * @example
      
     * 例子1:
     *    bui.back();
     *
     * 例子2: 
     *    // 后退两层
     *    bui.back({ index:-2 })
     * 
     */
    ui.back = function (opt) {

        var config = {
            index: -1,
            name: "",
            delay: true,
            native: true,
            callback: null
        };

        var params;
        if (typeof opt === "function") {
            config.callback = opt;
            params = $.extend(true, {}, config, ui.config.back);
        } else if (opt && ui.typeof(opt) === "object") {
            params = $.extend(true, {}, config, ui.config.back, opt);
        } else {
            params = $.extend(true, {}, config, ui.config.back);
        }

        // 优先使用单页,然后才是根据平台切换
        if ("back" in window.router) {
            // 如果配置是同步历史记录,由历史记录来操作
            if (window.router.config.syncHistory) {
                // 后退到最后一页
                var routerHistory = router.getHistory(),
                    lastLen = routerHistory.length - 1;

                // 支持指定后退到哪个模块,如果有多个模块相同,则取就近
                if (params.name) {
                    // var nameIndex = ui.array.index(params.name,routerHistory,"pid");
                    // params.index = nameIndex > 0 ? -(routerHistory.length-nameIndex-1) : -1;
                    var nameIndex = ui.array.indexs(params.name, routerHistory, "pid");
                    var nameLen = nameIndex.length;

                    // 有多个同模块则采用就近模块
                    if (nameLen) {
                        params.index = -(routerHistory.length - nameIndex[nameLen - 1] - 1);
                    } else {
                        params.index = -1;
                    }
                }
                if (Math.abs(params.index) > lastLen) {
                    params.index = -lastLen;
                }
                if (routerHistory.length > 1) {
                    cacheBack();
                }
            } else {
                // 单页后退
                window.router.back && window.router.back(params);
            }
        } else if (params.native && ui.isWebapp || !params.native && !ui.isWebapp) {
            // 后退不刷新
            cacheBack();
        } else {
            // 采用原生后退
            ui.native.back && ui.native.back(params);
        }

        var timeout;
        function cacheBack() {

            if (params.index === -1) {
                window.history.back();
            } else {
                window.history.go(params.index);
            }

            // 延时执行,因为页面切换有动画200毫秒的延迟,正常不使用bui.refresh则不需要延迟.
            if (timeout) {
                try {
                    clearTimeout(timeout);
                } catch (e) {}
            }
            // 单页后退刷新的时候,使用历史记录,需要延迟才能保持跟一致
            if (params.delay && params.callback) {
                timeout = setTimeout(function () {
                    params.callback();
                }, 500);
            } else {
                params.callback && params.callback();
            }
        }
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * @module Native
 */
(function (ui, $) {

    /**
     * 刷新页面
     * @namespace  bui
     * @class  refresh
     * @constructor 
     * @example
     *     bui.refresh();
     * 
     */
    ui.refresh = function (option) {

        var config = {
            native: true
        };
        var params = $.extend(true, {}, config, ui.config.refresh, option);

        // 优先使用单页,然后才是根据平台切换
        if ("refresh" in window.router) {
            window.router.refresh();
        } else if (params.native && ui.isWebapp || !params.native && !ui.isWebapp) {
            window.location.reload(true);
        } else {
            // 采用原生刷新
            ui.native.refresh && ui.native.refresh();
        }
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * @module Native
 */
(function (ui, $) {

    /**
     * 打开第三方应用
     * @namespace  bui
     * @class  run
     * @param {object} option 
     * @param {string} option.id [应用的id,如果是"http://"则打开浏览器]
     * @param {object} option.data [启动参数(bingotouch)]
     * @param {string} option.name [应用名称(dcloud)]
     * @param {function} option.onFail [失败回调(dcloud)]
     * @constructor 
     * @example
     *     bui.run({id: "http://www.easybui.com/demo/api/"});
     * 
     */
    ui.run = function (option) {
        var params = {};
        var config = {
            id: "",
            name: "",
            data: null,
            onFail: null,
            native: true
        };
        if (typeof option === "string") {
            params.id = option;
        } else if (option && ui.typeof(option) === "object") {
            params = $.extend(true, {}, config, ui.config.run, option);
        }
        var sid = String(params.id);

        if (params.native && ui.isWebapp || !ui.isWebapp && !params.native) {
            if (sid.indexOf("http://") > -1 || sid.indexOf("https://") > -1) {
                var newurl = ui.setUrlParams(params.id, params.data);
                if (ui.platform.isIos()) {
                    window.location.href = newurl;
                    return;
                }
                // 安卓或chrome
                var open_link = window.open('', '_blank') || window.open('', '_newtab');
                open_link.location.href = newurl;
            }
        } else {
            ui.native.run && ui.native.run(params);
        }
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * @module Native
 */
(function (ui, $) {

    /** 
     * <h3>选择文件</h3>
     *  <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.fileselect.html" target="_blank">demo</a></h3>
     * <p>选择文件</p>
     * {{#crossLink "bui.fileselect/add"}}{{/crossLink}}: 添加文件 <br>
     * {{#crossLink "bui.fileselect/remove"}}{{/crossLink}}: 移除添加的文件 <br>
     * {{#crossLink "bui.fileselect/clear"}}{{/crossLink}}: 清除所有添加的文件 <br>
     * {{#crossLink "bui.fileselect/data"}}{{/crossLink}}: 获取添加的数据 <br>
     * {{#crossLink "bui.fileselect/value"}}{{/crossLink}}: 获取上传的文件值 <br>
     * {{#crossLink "bui.fileselect/toBase64"}}{{/crossLink}}: 把获取到的本地图片转换成base64位 <br>
     *  @namespace bui
     *  @class fileselect
     *  @constructor 
     *  @param {object} option  
     *  @param {boolean} [option.quality] [ 图片的质量, 默认 0.8 ]  
     *  @param {boolean} [option.width] [ 图片的宽度, 默认 800, 原生是在上传前压缩成800宽度,web是在显示的时候显示为800宽度,需要后台自己压缩 ]  
     *  @param {boolean} [option.native] [ 是否采用原生方法,在debug=false也能独立使用 ]  
     *  @param {string} [option.mediaType] [ 文件的类型, 原生只支持图片上传  picture | video | allmedia ]  
     *  @param {string} [option.from] [ 1.4.7新增, 默认 "" 从相册选 | "camera" 相机拍照 | "camcorder" 录像, 需要配合 mediaType  参数 ]  
     *  @example
     *      
     *   js: 
     *
            // 1. 初始化, 这里如果有 onSuccess,onFail 则为公共处理方法,添加只需要 uiFileSelect.add();
            var uiFileSelect = bui.fileselect();  
            
            // 2. 调用 添加文件方法
            uiFileSelect.add({
                onSuccess: function(files){
                    // 展示本地图片
                    var url = window.URL.createObjectURL(files[0]);
                    document.querySelector('img').src = window.URL.createObjectURL(url);
                      // 展示base64本地图片
                    // this.toBase64({
                    //     onSuccess: function (url) {
                    //         document.querySelector('img').src = url;
                       
                    //     }
                    // });
                },
                onFail: null
            })
       *
     */
    ui.fileselect = function (option) {
        var config = {
            native: true,
            appendTo: "",
            quality: 0.8,
            from: "camera",
            width: 800,
            height: 800,
            mediaType: "picture" // picture | video | allmedia
        };

        var options = $.extend(true, {}, config, ui.config.fileselect, option);

        var module = {
            add: add,
            remove: remove,
            clear: clear,
            value: value,
            data: data,
            toBase64: toBase64,
            init: init
        };

        var uploadData = null,

        // 图片的质量参数,通过add方法获取
        base64Param = null,

        // 每次初始化清空缓存数据
        fileData = [],
            webapp = options.native && ui.isWebapp || !options.native && !ui.isWebapp,
            guid,
            $btnFile,
            mediaType = "*",
            uiFileselect;

        // 初始化
        init(options);

        //选择器初始化
        function init(opt) {
            var option = $.extend(true, options, opt);
            options.appendTo = option.appendTo || (ui.hasRouter ? router.currentPage() || "body" : "body");

            switch (option.mediaType) {
                case "allmedeia":
                    mediaType = "*";
                    break;
                case "picture":
                    mediaType = "image/*";
                    break;
                case "image":
                    mediaType = "image/*";
                    break;
                case "video":
                    mediaType = "video/*";
                    break;
                case "audio":
                    mediaType = "audio/*";
                    break;
                default:
                    mediaType = option.mediaType;
                    break;
            }
            fileData = [];
            // fileData 拿到的数据, webapp 的时候, name 为文件名, 安卓为 resize.jpg, ios 为自动生成 tmp/001.jpg 之类的
            if (webapp) {
                // web 添加图片初始化
                renderInputFile();
            } else {
                uiFileselect = ui.native.fileselect && ui.native.fileselect(opt, { module: module }) || {};
            }

            return this;
        }

        /**
         * 添加文件, 参数的配置全部针对原生选择
         *  @method add
         *  @param {object} [option] [对象]
         *  @param {number} [option.quality] [图片质量,默认0.8]
         *  @param {number} [option.width] [图片宽度,默认800, targetWidth和targetHeight设置为undefined 则添加原图]
         *  @param {number} [option.height] [图片高度,默认800, targetWidth和targetHeight设置为undefined 则添加原图]
         *  @param {string} [option.mediaType] [ 文件的类型, 原生只支持图片上传  picture | video | allmedia ]  
         *  @param {string} [option.from] [ 图片来源, 默认来自 "picture"(相册) | camera(相机)  ]
         *  @param {string} [option.destinationType] [ file (返回路径值) | data (返回base64位值) ]
         *  @param {function} [option.onSuccess] [ 成功的回调 ]
         *  @param {function} [option.onFail] [ 失败的回调 ]
         *  @chainable
         *  @example 
         *
            uiFileSelect.add({
                onSuccess: function(file){
                    // this 指向uiFileSelect
                    // console.log(this)
                }
            })
           */
        function add(param) {

            uploadData = null;
            var _self = this;

            var params = $.extend(true, options, param);

            // 转换图片的质量
            base64Param = params;

            if (webapp) {
                if (param.from) {
                    if (param.from === "picture" || param.from === "photo" || param.from === "savephoto") {
                        $btnFile.removeAttr("capture");
                    } else {
                        $btnFile.attr("capture", param.from);
                    }
                } else {
                    $btnFile.removeAttr("capture");
                }
                $btnFile.off("change").on("change", function () {

                    var files = this.files;

                    if (files.length < 1) {
                        params.onFail && params.onFail.call(_self, files, fileData);

                        return;
                    }
                    if (files.length > 1) {
                        ui.showLog("一次只能选一张图片", "bui.fileselect:web");
                    }

                    // 缓存数据后面再上传
                    uploadData = files[0];
                    try {
                        //如果名称不相同,则缓存数据
                        if (!ui.array.compare(files[0].name, fileData, "name")) {
                            var item = {
                                name: files[0].name,
                                data: files[0],
                                type: files[0].type,
                                size: files[0].size
                            };
                            fileData.push(item);
                        }
                    } catch (e) {
                        ui.showLog(e, "bui.fileselect:web");
                    }
                    params.onSuccess && params.onSuccess.call(_self, files, fileData);
                });

                // // 引入fastclick $.trigger 在ios下无效
                if (ui.platform.isIos() && typeof FastClick === "function") {
                    // ios 触发 change 
                    $btnFile[0].dispatchEvent(new Event('click'));
                } else {
                    // pc 安卓触发
                    $btnFile.trigger("click");
                }
            } else {
                uiFileselect.add.bind(_self)(params);
            }

            return this;
        }

        /**
         * 把选择的图片文件转换成base64地址,可以直接展示在页面上
         *  @method toBase64
         *  @param {object} [option] []
         *  @param {string} [option.data] [ 通过文件选择  ]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
         *  
         *  
            // 展示本地图片
            uiFileSelect.toBase64({
                onSuccess: function (imgurl) {
                    $("#id").append('<img src="'+imgurl+'" />')
                }
            });
                
         */
        function toBase64(param) {

            var param = param || {},
                data = param.data || uploadData,
                onSuccess = param.onSuccess || function () {},
                onFail = param.onFail || function () {};
            // web展示
            if (webapp) {

                try {
                    // 多图片处理
                    // for (var i = 0, f; f = data[i]; i++) {
                    //   // 只允许图片进行转换
                    //   if (!f.type.match('image.*')) {
                    //     continue;
                    //   }

                    //   // 转成base64
                    //   (function (file) {
                    //       readDataUrl(file)
                    //   })(f)

                    // }
                    readDataUrl(data);
                } catch (e) {}
            } else {

                uiFileselect.toBase64(param);
            }

            // 转换成base64
            function readDataUrl(file) {
                var reader = new FileReader();
                reader.onloadend = function (evt) {
                    // 图片压缩
                    var img = new Image(),
                        hasLoad = false,
                        width = base64Param.width || 800,
                        //宽度
                    quality = base64Param.quality || 0.8,
                        //质量
                    canvas = document.createElement("canvas"),
                        drawer = canvas.getContext("2d");
                    img.src = this.result;
                    img.onload = function () {

                        if (!hasLoad) {
                            canvas.width = width;
                            // 等比高度
                            canvas.height = width * (img.height / img.width);
                            drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
                            img.src = canvas.toDataURL("image/jpeg", quality);
                            // onSuccess && onSuccess.call(module,evt.target.result,file)

                            // 压缩成功以后的回调
                            onSuccess && onSuccess.call(module, img.src, file);

                            hasLoad = true;
                            return;
                        }
                    };
                    // evt.target.result 对象只能通过回调传出
                    // onSuccess && onSuccess.call(module,evt.target.result,file)
                };
                reader.readAsDataURL(file);
            }

            // 转换成二进制
            return this;
        }

        //渲染web的添加input 隐藏
        function renderInputFile() {
            if ($btnFile == undefined) {

                guid = bui.guid();
                var from = options.from ? 'capture="' + options.from + '"' : '';
                // display:none 有可能会导致部分手机无法触发选择图片功能
                var html = '<input type="file" accept="' + mediaType + '" name="uploadFiles" id="' + guid + '" ' + from + ' style="display:none"/>';
                $(options.appendTo).append(html);

                $btnFile = $("#" + guid) || $('input[name="uploadFiles"]');
            }
        }

        /**
         * 删除选择的文件, 安卓选择后的文件名自动更改为 resize.jpg 
         *  @method remove
         *  @param {string} name [ 要删除的图片名字带后缀名 ]
         *  @param {string} [key] [ 图片名字在哪个字段, 默认是 "name"]
         *  @chainable
         *  @example 
         *
            uiFileSelect.remove("resize.jpg");
           */
        function remove(name, key) {
            var key = key || "name";

            if (webapp) {
                if (typeof name == "string") {
                    ui.array.remove(name, fileData, key);
                    // 删除某个选择文件后需要修改上传的文件值为新的最后一条数据;
                    var lastData = fileData.length ? fileData[fileData.length - 1]["data"] : null;
                    uploadData = lastData;
                    return fileData;
                }
            } else {

                fileData = uiFileselect.remove(name, key);

                return fileData;
            }

            return this;
        }

        /**
         * 清空所有选择的文件
         *  @method clear
         *  @example 
         *
            uiFileSelect.clear();
           */
        function clear() {

            fileData = [];
            uploadData = null;

            if (webapp) {} else {
                uiFileselect.clear();
            }

            return fileData;
        }

        /**
         * 获取所有选择的文件, 原生默认只返回最后一个选择的文件
         *  @method data
         *  @example 
         *
            var data = uiFileSelect.data();
            // 返回 [{ name: "base64.jpg", data: null, type: "jpg" }]
            // 其中 data为要上传的文件值
           */
        function data() {

            if (webapp) {
                fileData = fileData;
            } else {
                fileData = uiFileselect.data();
            }
            return fileData;
        }

        /**
         * 获取最后选择的文件
         *  @method value
         *  @example 
         *
            var value = uiFileSelect.value();
            // 返回值 value为要上传的文件值, web上传跟原生上传得到的值不一样
           */
        function value() {
            if (webapp) {
                uploadData = uploadData;
            } else {
                uploadData = uiFileselect.value();
            }
            return uploadData;
        }

        return module;
    };

    return ui;
})(bui || {}, libs);

/**
 * @module Native
 */
(function (ui, $) {
    /**
     * <h3>文件管理,主要用于对下载文件的管理,安卓适用,web不支持</h3>
     *  <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.file.html" target="_blank">demo</a></h3>
     * <p>所有文件及文件夹的操作都基于根应用文件夹</p>
     * {{#crossLink "bui.file/getFolder"}}{{/crossLink}}: 获取创建文件夹 <br>
     * {{#crossLink "bui.file/removeFolder"}}{{/crossLink}}: 删除文件夹包含里面的所有文件 <br>
     * {{#crossLink "bui.file/getFile"}}{{/crossLink}}: 获取创建文件 <br>
     * {{#crossLink "bui.file/removeFile"}}{{/crossLink}}: 删除单个文件 <br>
     * {{#crossLink "bui.file/getFileName"}}{{/crossLink}}: 返回路径的文件名 <br>
     * {{#crossLink "bui.file/open"}}{{/crossLink}}: 打开文件 <br>
     *  @namespace bui
     *  @class file
     *  @constructor 
     *  @param {object} [option]  
     *  @param {boolean} [option.native] [ 默认true 由debug状态决定 false则强制采用web方式 ]  
     *  @param {number} [option.size] [ 默认10 M存储的大小, WEB存储需要]  
     *  @example
     *      
     *   js: 
     *   
            var uiFile = bui.file();
            
            // 创建 download 文件夹下的 bui.docx 文件
            uiFile.getFile({
                folderName: "download",
                fileName: "bui.docx",
                onSuccess: function (aa) {
                    bui.alert(aa)
                },
                onFail: function (err) {
                    bui.alert(err)
                }
            })
     *
     */
    ui.file = function (option) {
        //默认配置
        var config = {
            size: 10, // web 需要设置存储的大小
            native: true

            //方法
        };var module = {
            getFolder: getFolder,
            removeFolder: removeFolder,
            getFile: getFile,
            getFileName: getFileName,
            removeFile: removeFile,
            toBase64: toBase64,
            open: open,
            init: init
        };
        //用于option方法的设置参数
        var options = module.config = $.extend(true, {}, config, ui.config.file, option);

        var id,
            guid,
            $id,
            appID,
            defaultFolder,
            storageType = "PERSISTENT",
            //options.temporary ? "TEMPORARY" : "PERSISTENT" ,
        system,
            _fileSystem,
            _fileFolder,
            storageSize,
            uiFileSelect,
            uiNativeFile,
            fileEntryCache,
            fileData = [],
            floderData = "",

        // 是否使用web的请求方式
        webapp = options.native && ui.isWebapp || !options.native && !ui.isWebapp;

        init(options);

        //初始化
        function init(param) {

            // 引用fileselect控件
            uiFileSelect = ui.fileselect(param);
            // 文件系统准备完毕
            _fileSystem = readyFileSystem(param);

            //创建应用唯一ID的根文件夹,所有文件的操作都基于这个目录,避免sd卡混乱
            _fileFolder = getFolder({
                root: true,
                create: true
            });

            return this;
        }

        // 文件系统准备完毕
        function readyFileSystem(param) {
            var _fileDef = $.Deferred();

            if (webapp) {
                // 值支持pc chrome 
                defaultFolder = "bui.app";
                system = window;
                storageSize = parseInt(options.size) * 1024 * 1024;
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

                navigator.webkitPersistentStorage && navigator.webkitPersistentStorage.requestQuota(storageSize, function (grantedBytes) {
                    window.requestFileSystem(window.PERSISTENT, grantedBytes, function (fileSystem) {
                        _fileDef.resolve(fileSystem);
                    }, errorHandler);
                });

                // 获取存储的剩余大小
                // navigator.webkitPersistentStorage && navigator.webkitPersistentStorage.queryUsageAndQuota(function (usage, quota) {
                //         console.log('PERSISTENT: ' + usage + '/' + quota + ' - ' + usage / quota + '%');
                //     }
                // );
            } else {
                uiNativeFile = ui.native.file && ui.native.file(param, { fileselect: uiFileSelect, module: module }) || {};
            }

            // 出错信息
            function errorHandler(e) {
                var msg = '';
                try {

                    switch (e.code) {
                        case FileError.QUOTA_EXCEEDED_ERR:
                            msg = 'QUOTA_EXCEEDED_ERR';
                            break;
                        case FileError.NOT_FOUND_ERR:
                            msg = 'NOT_FOUND_ERR';
                            break;
                        case FileError.SECURITY_ERR:
                            msg = 'SECURITY_ERR';
                            break;
                        case FileError.INVALID_MODIFICATION_ERR:
                            msg = 'INVALID_MODIFICATION_ERR';
                            break;
                        case FileError.INVALID_STATE_ERR:
                            msg = 'INVALID_STATE_ERR';
                            break;
                        default:
                            msg = 'Unknown Error';
                            break;
                    }
                } catch (e) {}
                var data = {
                    msg: msg
                };

                _fileDef.reject(data);
            }

            return _fileDef;
        }

        // 对文件系统自由操作
        function getFolder(param) {

            var config = {
                folderName: defaultFolder,
                root: false,
                create: false,
                msg: "",
                param: { create: false, exclusive: false },
                onSuccess: null,
                onFail: null
            };

            var params = $.extend({}, config, param),

            // 动作
            action = "";

            if (params.create) {
                action = "创建 ";
                params.param.create = true;
            } else {
                action = "获取 ";
                params.param.create = false;
            }

            if (webapp) {

                // 转换标准文件名才能创建成功
                var name = checkPath(params.folderName);

                if (params.root) {
                    name = name;
                } else {
                    name = defaultFolder + "/" + name;
                }
                //文件系统准备完毕
                _fileSystem.done(function (fileSystem) {

                    //创建文件夹
                    fileSystem.root.getDirectory(name, params.param, function (folder) {

                        params.onSuccess && params.onSuccess.call(module, folder, fileSystem);
                    }, function (e) {
                        var data = {
                            msg: action + name + " 文件夹失败"
                        };
                        params.onFail && params.onFail.call(module, data);
                    });
                }).fail(function (e) {

                    var data = {
                        msg: "文件系统还没准备好."
                    };
                    params.onFail && params.onFail.call(module, data);
                });
            } else {
                uiNativeFile.getFolder(params);
            }

            return this;
        }

        //返回标准路径
        function checkPath(names) {
            var name;
            // 如果传的参数带有 './' or '/' 则忽略
            if (names[0] == '.' || names[0] == '/' || names[0] == ' ') {
                name = names.slice(1);
                return checkPath(name);
            }
            // 返回正确的名称
            if (names[0] != '.' && names[0] != '/' && names[0] != ' ') {
                return names;
            }
        }
        /**
         * 获取文件名
         *  @method getFileName
         *  @param {string} name [ url地址, 例如: file:开头,http开头  ]
         *  @example 
         *
            var name = uiFile.getFileName("file://bui.debug/bui.jpg?id=abcd");
            // name = bui.jpg 
           */
        function getFileName(names) {
            var name;
            // 获取文件名
            if (names && names.indexOf("/") > -1) {
                name = names.slice(names.lastIndexOf("/") + 1, names.indexOf("?") > -1 ? names.indexOf("?") : undefined);
                return name;
            } else {
                return names;
            }
        }

        /**
         * 获取文件或者创建文件
         *  @method getFile
         *  @param {object} [option] []
         *  @param {string} [option.fileName] [ 文件名称 需要带后缀名  ]
         *  @param {string} [option.folderName] [ 文件夹名称, 创建子文件夹 download/image  ]
         *  @param {boolean} [option.create] [是否创建文件 默认 false | true ]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
            uiFile.getFile({
                fileName: "bui.docx",
                folderName: "download",
                onSuccess: function(){
                    // this 指向 uiFile
                    console.log(this);
                } 
            })
           */
        function getFile(param) {
            var config = {
                fileName: "",
                folderName: "",
                root: false,
                create: false,
                param: { create: false, exclusive: false },
                onSuccess: null,
                onFail: null
            };

            var params = $.extend({}, config, param),

            // 动作
            action = "";

            if (params.create) {
                action = "创建 ";
                params.param.create = true;
            } else {
                action = "获取 ";
                params.param.create = false;
            }

            // 如果没有传名称,自动跳出
            if (!params.fileName || params.fileName.indexOf(".") < 0) {
                params.onFail && params.onFail();
                return;
            }

            if (webapp) {

                // 转换标准文件名才能创建成功
                var name = getFileName(params.fileName);
                //文件系统准备完毕
                getFolder({
                    root: params.root,
                    folderName: params.folderName,
                    create: true,
                    onSuccess: function onSuccess(folder, fileSystem) {

                        // 文件默认都创建在默认文件夹下,防止文件混乱
                        var fileName = folder.name == defaultFolder ? folder.name + "/" + name : defaultFolder + "/" + folder.name + "/" + name;

                        // 创建文件或者获取文件
                        fileSystem.root.getFile(fileName, params.param, function (fileEntry) {
                            // fileEntry.isFile === true  
                            // fileEntry.name == 'log.txt'  
                            // fileEntry.fullPath == '/log.txt' ;
                            // 
                            fileEntryCache = fileEntry;
                            params.onSuccess && params.onSuccess.call(module, fileEntry, fileSystem);
                        }, function (e) {
                            var data = {
                                msg: action + name + " 文件失败"
                            };
                            params.onFail && params.onFail.call(module, data);
                        });
                    },
                    onFail: function onFail(err) {
                        params.onFail && params.onFail(err);
                    }
                });
            } else {
                uiNativeFile.getFile(params);
            }

            return this;
        }

        /**
         * 删除文件夹及里面所有文件,谨慎使用
         *  @method removeFolder
         *  @param {object} [option] []
         *  @param {string} [option.folderName] [ 文件夹名称  ]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
            // 会包含文件夹所有的文件, 谨慎使用
            uiFile.removeFolder({
                folderName: "download"
            })
           */
        function removeFolder(param) {

            var config = {
                folderName: "",
                root: false,
                create: false,
                param: { create: false }
            };
            var params = $.extend(true, {}, param);

            if (webapp) {
                getFolder({
                    root: params.root,
                    folderName: params.folderName,
                    create: params.create,
                    onSuccess: function onSuccess(folder, fileSystem) {

                        folder.removeRecursively(function () {
                            params.onSuccess && params.onSuccess.call(module, folder, fileSystem);
                        }, function (err) {
                            var data = {
                                msg: "删除 " + params.folderName + " 文件失败"
                            };
                            params.onFail && params.onFail.call(module, data, folder);
                        });
                    },
                    onFail: function onFail(err) {
                        var data = {
                            msg: "删除 " + params.folderName + " 文件失败"
                        };
                        params.onFail && params.onFail.call(module, data);
                    }
                });
            } else {
                uiNativeFile.removeFolder(params);
            }

            return this;
        }
        /**
         * 删除文件,谨慎使用
         *  @method removeFile
         *  @param {object} [option] []
         *  @param {string} [option.fileName] [ 文件名称,  ]
         *  @param {string} [option.folderName] [ 哪个文件夹下的文件  ]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
            // 会包含文件夹所有的文件, 谨慎使用
            uiFile.removeFile({
                fileName: "bui.docx",
                folderName: "download"
            })
           */
        function removeFile(param) {
            var config = {
                fileName: "",
                folderName: "",
                root: false,
                create: false
            };
            var params = $.extend(true, {}, param);

            if (webapp) {
                getFile({
                    root: params.root,
                    create: params.create,
                    folderName: params.folderName,
                    fileName: params.fileName,
                    onSuccess: function onSuccess(files, fileEntry) {
                        files.remove(function () {
                            params.onSuccess && params.onSuccess.call(module, files, fileEntry);
                        }, function (err) {
                            var data = {
                                msg: "删除 " + params.fileName + " 文件失败"
                            };
                            params.onFail && params.onFail.call(module, data, files);
                        });
                    },
                    onFail: function onFail(err) {
                        var data = {
                            msg: "删除 " + params.fileName + " 文件失败"
                        };
                        params.onFail && params.onFail.call(module, data);
                    }
                });
            } else {
                uiNativeFile.removeFile(params);
            }

            return this;
        }

        /**
         * 本地程序打开文件, web不支持
         *  @method open
         *  @param {object} [option] []
         *  @param {string} [option.url] [ 文件路径,一般是通过getFile得到的路径  ]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
            uiFile.open({
                url: "file://",
                onSuccess: function(url){
                    // 文件的地址
                    console.log(url)
                }
            })
           */
        function open(param) {

            var params = param || {};

            if (!params.url) {
                return;
            }
            var name = getFileName(params.url);

            if (webapp) {

                ui.showLog("web暂不支持open方法", "bui.file.open:web");
            } else {

                uiNativeFile.open(params);
            }

            return this;
        }

        /**
         * 把选择的图片文件转换成base64地址,可以直接展示在页面上
         *  @method toBase64
         *  @param {object} [option] []
         *  @param {string} [option.data] [ 通过getFile得到的文件  ]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
            uiFile.toBase64({
                data: "file:///", //本地图片路径
                onSuccess: function (imgurl) {
                    $("#id").append('<img src="'+imgurl+'" />')
                }
            });
           */
        function toBase64(param) {

            uiFileSelect.toBase64(param);
            return this;
        }

        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 fileselect ]
         *  @example 
            
            //获取依赖控件
            var uiFileSelect = uiFile.widget("fileselect");
            
            //使用uifileselect的方法
            uiFileSelect.add({
                onSuccess: function(data){
                    console.log(data);
                }
            });
                
         */
        

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * @module Native
 */
(function (ui, $) {

    /**
     * <h3>单文件上传,支持webapp跟安卓,ios,依赖于fileselect控件</h3>
     *  <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.upload.html" target="_blank">demo</a></h3>
     * <p>选择,上传图片,只支持单个文件上传</p>
     * {{#crossLink "bui.upload/add"}}{{/crossLink}}: 添加文件 <br>
     * {{#crossLink "bui.upload/remove"}}{{/crossLink}}: 移除添加的文件 <br>
     * {{#crossLink "bui.upload/clear"}}{{/crossLink}}: 清除所有添加的文件 <br>
     * {{#crossLink "bui.upload/data"}}{{/crossLink}}: 获取添加的数据 <br>
     * {{#crossLink "bui.upload/start"}}{{/crossLink}}: 上传文件 <br>
     * {{#crossLink "bui.upload/stop"}}{{/crossLink}}: 停止上传 <br>
     * {{#crossLink "bui.upload/toBase64"}}{{/crossLink}}: 把路径转换成base64位图片地址 <br>
     * {{#crossLink "bui.upload/widget"}}{{/crossLink}}: 获取依赖的控件 <br>
     *  @namespace bui
     *  @class upload
     *  @constructor 
     *  @param {object} [option]
     *  @param {string} [option.url] [ 上传的地址 ]  
     *  @param {object} [option.data] [ 要上传的对象, data初始化的时候有值会直接上传, 使用 h5 的formdata 上传 ]  
     *  @param {string} [option.fileKey] [ 默认: file , 后端需要接收这个字段进行保存 ]  
     *  @param {number} [option.timeout] [ 触发timeout的时间默认60000 ]  
     *  @param {string} [option.mediaType] [ 1.4.7新增, 文件的类型, 原生只支持图片上传,webapp部分机型不支持 默认: picture | allmedia  | video | audio ]  
     *  @param {string} [option.from] [ 1.4.7新增, 默认 "" 从相册选 | "camera" 相机拍照 | "camcorder" 录像, 需要配合 mediaType  参数 ]  
     *  @param {boolean} [option.showProgress] [ 是否显示进度条 默认true  ]  
     *  @param {boolean} [option.native] [ 默认true 由debug状态决定 false则强制采用web方式 ]  
     *  @param {function} [option.onProgress] [ 自定义进度条回调,接收百分比值 ]  
     *  @param {function} [option.onSuccess] [ 成功的回调 ]  
     *  @param {boolean} [option.autoClose] [ 1.5新增, 是否允许关闭进度条 ]  
     *  @param {function} [option.onMask] [ 1.5新增, 点击默认进度条的回调,默认停止上传并关闭显示 ]  
     *  @param {function} [option.onFail] [ 失败的回调 ]  
     *  @example
     *      
     *   js: 
     *
            // 1. 初始化 这里如果传url初始化,则url作为公共上传地址,start不再需要传url
            var uiUpload = bui.upload({
                url: "http://"
            });  
            
            // 2. 选择文件
            uiUpload.add({
                onSuccess: function(file){
                    // 展示本地图片
                    var url = window.URL.createObjectURL(files[0]);
                    document.querySelector('img').src = window.URL.createObjectURL(url);
                      // 展示base64本地图片
                    // this.toBase64({
                    //     onSuccess: function (url) {
                    //         document.querySelector('img').src = url;
                       
                    //     }
                    // });
                    // 3. 上传文件 选择以后直接上传到服务器
                    // uiUpload.start({
                    //     onSuccess:function(data){
                    //         // 成功
                    //     },
                    //     onFail: function(res,status){
                    //         // 失败 status = "timeout" || "error" || "abort", "parsererror"
                    //     }
                    // });
                }
            })
              // 3. 也可以选择后再单独上传
            uiUpload.start({
                data: null
            }) 
     *
     */
    ui.upload = function (option) {
        var config = {
            url: "",
            data: null,
            headers: {},
            showProgress: true,
            timeout: 60000,
            native: true,
            contentType: false,
            processData: false,
            autoClose: true,
            method: "POST",
            fileKey: "file",
            mediaType: "picture", // picture | video | audio | allmedia
            from: "picture",
            onProgress: null,
            onMask: function onMask() {
                stop();
            },
            onSuccess: null,
            onFail: null
        };

        var options = $.extend(true, {}, config, ui.config.upload, option);

        var module = {
            init: init,
            add: add,
            remove: remove,
            clear: clear,
            data: data,
            start: start,
            stop: stop,
            toBase64: toBase64,
            widget: widget
        };

        var uiLoading,
            uiSelect,
            uiAjax,
            uiNativeUpload,

        //fileData 是一个对象 document.getElementById('fileToUpload').files
        fileData,
            uploadUrl,

        // 是否显示进度条
        showProgress = options.showProgress,

        //对进度条单独处理
        onProgress = options.onProgress,
            webapp = options.native && ui.isWebapp || !options.native && !ui.isWebapp,
            id,
            guid,
            $btnFile,
            progressPercent;

        // 初始化
        init(options);

        function init(opt) {

            // 实例化进度条
            uiLoading = ui.loading({
                // display: "block",
                display: "block",
                width: 30,
                height: 30,
                opacity: 0,
                autoClose: opt.autoClose,
                callback: opt.onMask
            });
            // 实例化选择器
            uiSelect = ui.fileselect({
                native: opt.native,
                from: opt.from,
                mediaType: opt.mediaType
            });

            if (webapp) {} else {
                uiNativeUpload = ui.native.upload && ui.native.upload(opt, { loading: uiLoading, fileselect: uiSelect, module: module }) || {};
            }
            if (!opt.data) {
                return this;
            }

            //上传
            start(opt);

            return this;
        }

        /**
         * 添加文件, 参数的配置全部针对原生选择
         *  @method add
         *  @param {object} [option] [图片质量,默认40]
         *  @param {number} [option.quality] [图片质量,默认40]
         *  @param {number} [option.width] [图片宽度,默认800, targetWidth和targetHeight设置为undefined 则添加原图]
         *  @param {number} [option.height] [图片高度,默认800, targetWidth和targetHeight设置为undefined 则添加原图]
         *  @param {string} [option.mediaType] [ 文件的类型, 原生只支持图片上传  picture | video | allmedia ]  
         *  @param {string} [option.from] [ 1.4.7新增, 默认 "" 从相册选 | "camera" 相机拍照 | "camcorder" 录像, 需要配合 mediaType  参数 原生: 默认来自 photo(相册) | camera(相机) | savephoto(来自保存的相册) ]
         *  @param {string} [option.destinationType] [ file (返回路径值) | data (返回base64位值) ]
         *  @param {function} [option.onSuccess] [ 成功的回调 ]
         *  @param {function} [option.onFail] [ 失败的回调 ]
         *  @chainable
         *  @example 
         *
            uiUpload.add({
                onSuccess: function(file){
                    // console.log(this)
                }
            })
           */
        function add(param) {
            // 修改this指向upload
            var addFile = uiSelect.add.bind(module);

            addFile(param);

            return this;
        }

        /**
         * 删除最后选择的文件
         *  @method remove
         *  @chainable
         *  @example 
         *
            uiUpload.remove();
           */
        function remove(name, key) {
            var uploadData = data();
            var length = uploadData.length;
            if (length) {
                uiSelect.remove(uploadData[length - 1]["name"], key);
            }

            return this;
        }

        /**
         * 清空所有选择的文件
         *  @method clear
         *  @chainable
         *  @example 
         *
            uiUpload.clear();
           */
        function clear() {

            uiSelect.clear();
            return this;
        }
        /**
         * 把选择的图片文件转换成base64地址,可以直接展示在页面上
         *  @method toBase64
         *  @param {object} [option] []
         *  @param {string} [option.data] [ 通过文件选择的返回值,如果不传data,值来自于通过add添加的最后一个文件  ]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
            uiUpload.toBase64({
                onSuccess: function (imgurl) {
                    $("#id").append('<img src="'+imgurl+'" />')
                }
            });
           */
        function toBase64(param) {

            uiSelect.toBase64(param);
            return this;
        }
        /**
         * 获取所有选择的文件, 原生默认只返回最后一个选择的文件
         *  @method data
         *  @example 
         *
            var data = uiUpload.data();
            // 返回 [{ name: "base64.jpg", data: null, type: "jpg" }]
            // 其中 data为要上传的文件值
           */
        function data() {
            return uiSelect.data();
        }

        /**
         * 开始上传
         *  @method start
         *  @param {object} [option] [参数同初始化一样,在初始化时配置,则是公共的, data不传则获取最后一次选择]
         *  @chainable
         *  @example 
         *
            uiUpload.start({
                data: null,
                onSuccess: function (res) {
                    // 成功
                },
                onFail: function (res,status) {
                    // 失败 status = "timeout" || "error" || "abort", "parsererror"
                }
            })
           */
        function start(param) {

            var params = $.extend(true, {}, options, param);

            uploadUrl = params.url;

            // 获取文件
            fileData = uiSelect.value();

            showProgress = params.showProgress;

            if (!fileData) {
                return;
            }

            showProgress && uiLoading.show();

            if (webapp) {
                var datas = params.data;
                var fd = new FormData();
                fd.append(params.fileKey, fileData);
                // 用户新增的参数
                for (var key in datas) {
                    fd.append(key, datas[key]);
                }

                params.data = fd;

                // web上传
                webAjax(params);
            } else {

                // 原生的上传
                uiNativeUpload.start(params);
            }

            return this;
        }

        /**
         * 停止上传
         *  @method stop
         *  @chainable
         *  @example 
         *
            uiUpload.stop()
           */
        function stop(callback) {
            if (webapp) {
                uiLoading && uiLoading.stop();
                uiAjax && uiAjax.abort();

                callback && callback.call(module, uiLoading, uiAjax);
            } else {
                // 原生的上传
                uiNativeUpload.stop(callback);
            }

            return this;
        }

        // web上传
        function webAjax(param) {

            // 重置参数
            // param.cache = false;
            // 必须false才会避开jQuery对 formdata 的默认处理   
            // param.contentType = false;
            // 必须false才会自动加上正确的Content-Type 
            // param.processData = false;
            // param.method = "POST";

            var onSuccess = param.onSuccess;
            var onFail = param.onFail;

            uiAjax = $.ajax({
                url: uploadUrl,
                type: param.method,
                data: param.data,
                cache: param.cache,
                headers: param.headers,
                contentType: param.contentType, //不可缺
                processData: param.processData, //不可缺
                timeout: param.timeout,
                xhr: function xhr() {
                    var xhr = $.ajaxSettings.xhr();

                    // 处理上传的进度
                    if (uploadProgress && xhr.upload) {
                        xhr.upload.addEventListener("progress", uploadProgress, false);
                        return xhr;
                    }
                },
                success: function success(result) {
                    stopLoading();
                    onSuccess && onSuccess.call(module, result);
                },
                error: function error(result, status) {
                    stopLoading();
                    onFail && onFail.call(module, result, status);
                }
            });

            return this;
        }

        // web 上传进度
        function uploadProgress(evt) {
            //安卓4.3以下不支持
            window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

            // 防止掉帧
            window.requestAnimationFrame(function () {
                if (evt.lengthComputable) {

                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    progressPercent = percentComplete.toString() + '%';

                    if (percentComplete < 100) {
                        startLoading(progressPercent);
                    } else {
                        stopLoading();
                    }
                    // 原生进度
                    // navigator.notification.progressValue(Math.round(( progressEvt.loaded / progressEvt.total ) * 100));

                    onProgress && onProgress.call(module, progressPercent);
                }
            });
        }

        // 开启进度
        function startLoading(percent) {
            uiLoading && uiLoading.show({
                text: percent
            });

            return this;
        }

        // 关闭进度
        function stopLoading() {
            uiLoading && uiLoading.stop();

            return this;
        }

        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 loading ]
         *  @example 
            
            //获取依赖控件
            var uiLoading = uiUpload.widget("loading");
            
            //使用uiLoading的方法
            uiLoading.start();
                
         */
        function widget(name) {
            var control = { loading: uiLoading, fileselect: uiSelect, ajax: uiAjax };
            return ui.widget.call(control, name);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * @module Native
 */
(function (ui, $) {
    /**
     * <h3>下载控件, 支持安卓下载图片, web不支持</h3>
     * <h3>预览地址: <a href="../../index.html#pages/ui_controls/bui.download.html" target="_blank">demo</a></h3>
     * <p>下载文件在本地,web不支持</p>
     * {{#crossLink "bui.download/getFile"}}{{/crossLink}}: 获取文件,获取不到则下载文件 <br>
     * {{#crossLink "bui.download/start"}}{{/crossLink}}: 下载文件 <br>
     * {{#crossLink "bui.download/stop"}}{{/crossLink}}: 停止下载 <br>
     * {{#crossLink "bui.download/toBase64"}}{{/crossLink}}: 下载的图片转换成可以插入页面的图片 <br>
     * {{#crossLink "bui.download/widget"}}{{/crossLink}}: 获取依赖的控件 <br>
     *  @namespace bui
     *  @class download
     *  @constructor 
     *  @param {object} option  
     *  @param {string} [option.url] [ 下载的地址 ]  
     *  @param {object} [option.data] [ 请求下载需要传的参数 ]  
     *  @param {number} [option.timeout] [ 触发timeout的时间默认60000 ] 
     *  @param {string} [option.folderName] [ 文件夹名称,默认是download ] 
     *  @param {boolean} [option.showProgress] [ 是否显示进度条 默认true  ]  
     *  @param {boolean} [option.native] [ 默认true 由debug状态决定 false则强制采用web方式 ]  
     *  @param {function} [option.onProgress] [ 自定义进度条回调,接收百分比值 ]  
     *  @param {function} [option.onSuccess] [ 成功的回调 ]  
     *  @param {function} [option.onFail] [ 失败的回调 ]  
     *  @example
     *      
     *   js: 
     *
            // 1. 初始化 这里如果传url初始化,则马上下载
            var uidownload = bui.download();  
            
            // 2. 开始下载
            uiUpload.start({
                data: null
            }) 
     *
     */
    ui.download = function (option) {
        var config = {
            url: "",
            data: {},
            headers: {},
            method: "GET",
            showProgress: true,
            timeout: 60000,
            fileName: "",
            folderName: "download",
            native: true,
            onProgress: null,
            onSuccess: null,
            onFail: null

            //方法
        };var module = {
            getFile: getFile,
            start: start,
            stop: stop,
            toBase64: toBase64,
            init: init,
            widget: widget
        };

        //用于option方法的设置参数
        var options = module.config = $.extend(true, {}, config, ui.config.download, option);

        var uiAjax,
            uiFile,
            uiNativeDownload,
            webapp = options.native && ui.isWebapp || !options.native && !ui.isWebapp,
            targetUrl,
            targetEncodeUrl,
            folderPath,
            filePath,
            showProgress = options.showProgress,
            onProgress = options.onProgress,
            _onFail = options.onFail,
            progressPercent;

        var uiLoading;

        // 初始化
        init(options);

        //初始化
        function init(option) {

            //引用loading控件
            uiLoading = ui.loading({
                // display: "block",
                display: "block",
                width: 30,
                height: 30,
                opacity: 0,
                callback: function callback() {
                    stop();
                }
            });

            //引用file控件
            uiFile = ui.file({
                native: option.native
            });
            // 为true时,是web平台
            if (webapp) {
                webDownload(option);
            } else {
                // 原生下载
                uiNativeDownload = ui.native.download && ui.native.download(option, { file: uiFile, loading: uiLoading, module: module }) || {};
            }

            function webDownload(option) {
                // 获取文件夹
                uiFile.getFolder({
                    folderName: option.folderName,
                    create: false,
                    onSuccess: function onSuccess(folder, file) {
                        //文件夹路径
                        folderPath = folder.fullPath;
                    },
                    onFail: function onFail(err) {
                        // 创建文件夹
                        uiFile.getFolder({
                            folderName: option.folderName,
                            create: true,
                            onSuccess: function onSuccess(folder, file) {
                                //文件夹路径
                                folderPath = folder.fullPath;
                            },
                            onFail: function onFail(err) {
                                _onFail && _onFail.call(module, err);
                            }
                        });
                    }
                });

                if (!option.url) {
                    // onFail && onFail(err);
                    return;
                }

                //开始下载
                start(option);
            }
            return this;
        }

        /**
         * 开始下载
         *  @method start
         *  @param {object} [option] [参数同初始化一样,查看最顶部的参数]
         *  @chainable
         *  @example 
         *
            uiDownload.start({
                url: "http://"
            })
           */
        function start(param) {

            var params = $.extend(true, {}, options, param);

            targetUrl = params.url;
            targetEncodeUrl = encodeURI(targetUrl);

            onProgress = params.onProgress;
            showProgress = params.showProgress;

            showProgress && uiLoading.show({
                text: "0%"
            });

            //文件存储路径
            filePath = folderPath + "/" + (param.fileName || uiFile.getFileName(targetUrl));

            if (webapp) {

                // stopLoading();

                // ui.hint("暂不支持web下载")
                // onFail && onFail.call(module);

                // return;
                // web下载
                // 重置参数
                params.cache = false;
                params.contentType = false;
                params.processData = false;

                uiAjax = $.ajax({
                    url: targetEncodeUrl,
                    type: params.method,
                    data: params.data,
                    cache: params.cache,
                    headers: params.headers,
                    contentType: params.contentType, //不可缺
                    processData: params.processData, //不可缺
                    timeout: params.timeout,
                    xhr: function xhr() {
                        var xhr = $.ajaxSettings.xhr();

                        // 处理下载的进度
                        if (onprogress && xhr) {
                            xhr.addEventListener("progress", onprogress, false);
                            return xhr;
                        }
                    },
                    success: function success(result) {

                        var name = param.fileName || uiFile.getFileName(params.url);

                        // 获取本地文件,如果找不到则下载
                        uiFile.getFile({
                            fileName: name,
                            folderName: params.folderName,
                            create: true,
                            onSuccess: function onSuccess(file, entry) {
                                // console.log(file.toURL())
                                params.onSuccess && params.onSuccess.call(module, file.fullPath, entry);
                            }
                        });
                        // onSuccess && onSuccess.call(module,result);
                    },
                    fail: function fail(result) {
                        stopLoading();

                        params.onFail && params.onFail.call(module, result);
                    }
                });
            } else {

                uiNativeDownload.start(params);
            }
        }

        /**
         * 获取下载的文件,如果没有则重新下载
         *  @method getFile
         *  @param {object} option [参数同初始化一样]
         *  @param {string} [option.url] [下载地址]
         *  @param {string} [option.folderName] [保存的文件夹, 默认download文件夹,可以不用传]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
            uiDownload.getFile({
                url: "http://",
                onSuccess: function (url,file) {
                    console.log(url);
                }
            })
           */
        function getFile(param) {

            var params = $.extend(true, { autoDown: true }, options, param);

            var name = param.fileName || uiFile.getFileName(params.url);

            // 获取本地文件,如果找不到则下载
            uiFile.getFile({
                fileName: name,
                folderName: params.folderName,
                onSuccess: function onSuccess(file, entry) {

                    params.onSuccess && params.onSuccess.call(module, file.fullPath, file, entry);
                },
                onFail: function onFail(err) {

                    //开始下载
                    params.autoDown = start(params);
                }
            });
        }

        /**
         * 停止下载
         *  @method stop
         *  @chainable
         *  @example 
         *
            uiDownload.stop()
           */
        function stop(callback) {

            if (webapp) {
                stopLoading();
                uiAjax && uiAjax.abort();
            } else {
                uiNativeDownload.stop();
            }
            callback && callback.call(module, uiLoading, uiAjax);
        }

        // web 下载进度
        function onprogress(evt) {

            //安卓4.3以下不支持
            window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

            // 防止掉帧
            window.requestAnimationFrame(function () {
                if (evt.lengthComputable) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    progressPercent = percentComplete.toString() + '%';

                    if (percentComplete < 100) {
                        startLoading(progressPercent);
                    } else {
                        stopLoading();
                    }

                    onProgress && onProgress.call(module, progressPercent);
                }
            });
        }

        // 开启进度
        function startLoading(percent) {
            showProgress && uiLoading && uiLoading.show({
                text: percent
            });
        }

        // 关闭进度
        function stopLoading() {
            showProgress && uiLoading && uiLoading.stop();
        }

        /**
         * 把选择的图片文件转换成base64地址,可以直接展示在页面上
         *  @method toBase64
         *  @param {object} option 
         *  @param {string} [option.data] [ 通过getFile得到的文件  ]
         *  @param {function} [option.onSuccess] [成功的回调]
         *  @param {function} [option.onFail] [失败的回调]
         *  @chainable
         *  @example 
         *
            uiDownload.toBase64({
                data: "file:///", //本地图片路径
                onSuccess: function (imgurl) {
                    $("#id").append('<img src="'+imgurl+'" />')
                }
            });
           */
        function toBase64(param) {

            uiFile.toBase64(param);
            return this;
        }

        /**
         * 获取依赖的控件
         *  @method widget
         *  @param {string} [name] [ 依赖控件名 loading ]
         *  @example 
            
            //获取依赖控件
            var uiLoading = uiFile.widget("loading");
            
            //使用uiLoading的方法
            uiLoading.start();
                
         */
        function widget(name) {
            var control = { loading: uiLoading, file: uiFile, ajax: uiAjax };
            return ui.widget.call(control, name);
        }

        return module;
    };

    return ui;
})(window.bui || {}, window.libs);

/**
 * 核心 
 * @module Core
 */

(function (ui, $) {
    ui.currentPlatform = "webapp";

    /**
     * <p>ready 用于原生接口的调用,必须放在这里面才能使用. </p>
     * <p>跟 pageinit 全局事件的区别是: bui.on("pageinit",callback) 用于UI控件的初始化,这样可以保证在手机浏览器跟打包的APP保持一致的UI加载.
     * <p>使用bui.on监听页面事件,类型有 "pagebefore"(dom加载完成,但bui未初始化) | "pageinit"(dom加载完成,bui已经初始化) | "pageready"(dom+原生接口都已经准备完毕) | "onload"(图片及脚本等资源加载完毕,较慢) </p>
     * @namespace  bui
     * @class  ready
     * @constructor 
     * @param  {[function]} callback [回调]
     * @example
     *
         
         //方法1: web跟原生方法的使用,随着 bui.isWebapp 的切换,在这里才能保持一致.
         bui.ready(function(){
             //原生的方法都必须在ready里面执行.
         })
        
           //方法2: 监听控件初始化,用于UI类控件的初始化,在这里初始化UI控件会更快,但原生方法必须放在bui.ready
         bui.on("pageinit",function () {
            console.log("pageinit")
         })
     *
     */

    ui.ready = function (callback) {
        // 用于切换平台, 兼容旧版 bui.debug
        ui.isWebapp = typeof ui.isWebapp === "undefined" ? ui.debug : ui.isWebapp;

        //延时处理
        var def = $.Deferred();

        //默认是调试模式, false为原生模式
        if (ui.isWebapp) {
            $(document).ready(function () {
                callback && callback();
                ui.trigger.call(ui, "pageready");
                def.resolve();
            });
        } else {
            if (typeof ui.native.ready === "undefined") {
                ui.showLog("当前bui.js为webapp版本,不支持原生方法,请更换bui.js为对应平台版本");
                return def;
            }
            def = ui.native.ready && ui.native.ready(callback) || def;
        }

        return def;
    };

    return ui;
})(window.bui || {}, window.libs);

// web Native模块

/**
 * 核心 
 * @module Core
 */

(function (ui, $) {

  /**
   * init 页面初始化,动态计算main高度 默认已经执行,可以通过bui.config.init.auto = false; 修改为不执行.
   * @namespace  bui
   * @class  init
   * @since 1.3.4
   * @param {object|number} [option] 
   * @param {string} [option.id] [初始化的页面ID, 默认: ".bui-page"]
   * @param {number} [option.height] [初始化一个固定高度,会自动减去header,footer得到main的值]
   * @param {string} [option.header] [默认: header 标签, 可以是 "#id"或者".classname"]
   * @param {string} [option.main] [默认: main 标签, 可以是 "#id"或者".classname"]
   * @param {string} [option.footer] [默认: footer 标签, 可以是 "#id"或者".classname"]
   * @return {number} [返回main的高度]
   * 
   * @constructor 
   * @example
   *
   * 方法一: 根据页面高度初始化高度
   * 
       bui.init();
  
   * 方法二: 传固定高度计算main的高度
   * 
       bui.init(500);
  
   * 方法三: 每个页面都有独立的id
   * 
       bui.init({
          id: "#page"
       })
   *
   * 方法四: 选择器不再是 header,main,footer 时可以通过对象修改
   * 
       bui.init({
          header: "#header",
          main: "#main",
          footer: "#footer"
       })
   *
   */
  ui.init = function (option) {
    var config = {
      id: ".bui-page",
      height: 0,
      header: "header",
      main: "main",
      footer: "footer"
    };
    var options;
    if (ui.typeof(option) == "object") {
      options = $.extend({}, config, ui.config.init, option);
    } else {
      var opt = {};
      opt.height = option;
      options = $.extend({}, config, opt);
    }
    var obj = function obj(name) {
      return document.querySelectorAll(name) || document.getElementsByTagName(name)[0] || document.getElementById(name);
    };

    var winHei = options.height || document.documentElement.clientHeight; //浏览器当前窗口可视区域宽度

    if (ui.obj(options.main).length < 1) {
      return;
    }

    try {
      var $id = ui.obj(options.id);
      var headerObj = options.header.indexOf("#") > -1 ? ui.obj(options.header)[0] : $id.children(options.header)[0];
      var footerObj = options.footer.indexOf("#") > -1 ? ui.obj(options.footer)[0] : $id.children(options.footer)[0];
      var mainObj = options.main.indexOf("#") > -1 ? ui.obj(options.main) : $id.children(options.main);
      var headHeight = headerObj ? headerObj.offsetHeight : 0;
      var footHeight = footerObj ? footerObj.offsetHeight : 0;

      // + 1 由于用rem缩放,在手机端会有大概1px的误差 三星 s5
      var mainHeight = winHei - headHeight - footHeight;

      mainObj.height(mainHeight);
      // mainObj && ( mainObj.style.height = mainHeight + 'px' );
    } catch (e) {
      ui.showLog(e, "bui.init");
    }
    return mainHeight;
  };

  // 初始化模块加载器
  window.loader = ui.loader();
  ui.define = loader.define;
  ui.require = loader.require;
  ui.map = loader.map;
  ui.import = loader.import;
  ui.checkLoad = loader.checkLoad;
  ui.checkDefine = loader.checkDefine;

  // 触发统一的onload 事件
  if (window.addEventListener) {
    window.addEventListener('load', function (argument) {
      ui.trigger.call(ui, "onload");
    }, false);
  } else {
    window.attachEvent('onload', function (argument) {
      ui.trigger.call(ui, "onload");
    });
  }
  $(document).ready(function () {

    // 用于切换平台, 兼容旧版 bui.debug
    ui.isWebapp = typeof ui.isWebapp === "undefined" ? ui.debug : ui.isWebapp;

    ui.trigger.call(ui, "pagebefore");

    //viewport初始化
    if (ui.platform.isWindow() || ui.platform.isMac()) {
      //针对PC处理
      window.viewport = ui.viewport(40);
    } else {
      window.viewport = ui.viewport();
    }

    //初始化main高度
    ui.config.init.auto && ui.init();

    // 终端加快点击插件
    if (typeof FastClick === "function") {

      FastClick.attach(document.body);
    }

    ui.trigger.call(ui, "pageinit");
  });

  try {
    // 捕获物理按键home,back显示隐藏
    var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : "";

    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    var onVisibilityChange = function onVisibilityChange(e) {
      if (!document[hiddenProperty]) {
        // console.log('页面显示');
        ui.trigger.call(ui, "pageshow", e);
      } else {
        // console.log('页面隐藏')
        ui.trigger.call(ui, "pagehide", e);
      }
    };
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
  } catch (e) {}

  try {
    //UC浏览器关闭默认手势事件
    navigator.control.gesture(false);
    //关闭UC长按弹出菜单
    navigator.control.longpressMenu(false);
  } catch (e) {}

  return ui;
})(window.bui || {}, window.libs);

// es6 transform es5
// import 'babel-polyfill';
// core 
//method
//animate
// ui
// web Native模块
// init

})));
