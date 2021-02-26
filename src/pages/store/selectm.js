loader.define(function(require, exports, module) {
    
    var bs = bui.store({
            scope: "page", // 用于区分公共数据及当前数据的唯一值
            data: {
                canAdd: {
                    disabled: true
                },
                canDel: {
                    disabled: true
                },
                selectAChecked: [], // A区选中暂存区
                selectBChecked: [], // B区选中暂存区
                selectA: [
                  { text: 'One', value: 'A', selected: false },
                  { text: 'Two', value: 'B', selected: false },
                  { text: 'Three', value: 'C', selected: false }
                ],
                selectB: [],
            },
            // log: true,
            methods: {
                setStatusA: function (index) {

                    var selectedItem = this.selectA[index],
                        selecteds = this.selectAChecked,
                        // 判断是否唯一
                        indexs = bui.array.index(selecteds,selectedItem.value,"value");

                    // 修改数组选中状态
                    selectedItem.selected=!selectedItem.selected;
                    // 选中暂存区的增加或减少
                    if( indexs > -1 ){
                        // 删除
                        selecteds.$deleteIndex(indexs);
                    } else {
                        var selectedItem2=$.extend(true, {},selectedItem, {selected:false});
                        // 增加
                        selecteds.push(selectedItem2);
                    }

                    // 替换整组数据
                    // this.selectA.$replace(this.selectA)
                    // 修改某一条数据
                    this.selectA.$set(index, selectedItem)
                    
                },
                setStatusB: function (index) {

                    var selectedItem = this.selectB[index],
                        selecteds = this.selectBChecked,
                        // 判断是否唯一
                        indexs = bui.array.index(selecteds,selectedItem.value,"value");

                    // 修改数组选中状态
                    selectedItem.selected=!selectedItem.selected;
                    // 选中暂存区的增加或减少
                    if( indexs > -1 ){
                        // 删除
                        selecteds.$deleteIndex(indexs);
                    } else {
                        var selectedItem2=$.extend(true, {},selectedItem, {selected:false});
                        // 增加
                        selecteds.push(selectedItem2);
                    }

                    // 替换整组数据
                    // this.selectB.$replace(this.selectB)
                    
                    // 修改某一条数据
                    this.selectB.$set(index, selectedItem)
                },
                moveSelectA: function () {

                    if( this.canAdd.disabled ){ return; }

                    // 合并selectB的数据
                    this.selectB.$merge(this.selectAChecked)

                    // 删除多条选中的数据
                    this.selectA.$delete(this.selectAChecked, "value");

                    // 清空暂存区
                    this.selectAChecked.$empty();
                },
                moveSelectB: function () {

                    if( this.canDel.disabled ){ return; }

                    // 合并selectB的数据
                    this.selectA.$merge(this.selectBChecked)

                    // 删除选中的数据
                    this.selectB.$delete(this.selectBChecked, "value");

                    // 清空暂存区
                    this.selectBChecked.$empty();
                },
            },
            watch: {
                selectAChecked: function (data) {
                    // 修改添加按钮状态
                    this.canAdd.disabled = !data.length;
                },
                selectBChecked: function (data) {
                    // 修改删除按钮状态
                    this.canDel.disabled = !data.length;
                }
            },
            computed: {},
            templates: {
                // 联动的示例,增加了事件绑定
                tplSelectA: function (data,target,targetChecked) {

                    var html ='';
                    data.forEach(function (item,i) {
                        var active=item.selected? "active":""
                        
                        // $index 为内置的动态索引, i 不一定等于 $index
                        html +=`<li b-click='page.setStatusA($index)' class="bui-btn ${active}">${item.text}</li>`;
                    })
                    return html;
                },
                // 联动的示例,增加了事件绑定
                tplSelectB: function (data) {

                    var html ='';
                    data.forEach(function (item,i) {
                        var active=item.selected? "active":""
                        // $index 为内置的动态索引, i 不一定等于 $index
                        html +=`<li b-click='page.setStatusB($index)' class="bui-btn ${active}">${item.text}</li>`;
                    })
                    return html;
                }
            },
            mounted: function () {
                // 加载后执行
            }
        })

})
