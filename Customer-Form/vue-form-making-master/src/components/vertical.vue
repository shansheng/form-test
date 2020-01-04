<template>
    <div class="vertical-grid" :class="{active: selectVertical.key == data.list[index].key}" @click.stop="handleSelectVertical(index)">
        <div class="vertical-grid-item" v-for="(v,vi) in data.list[index].queue" :key="vi" :style="{height:100/data.list[index].queue.length+'%'}">
            <draggable
            v-model="v.list"
            :no-transition-on-drag="true"
            v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
            @add="handleWidgetQueueAdd($event, vi)"
            >
            <transition-group name="fade" tag="div" class="widget-queue-list" :key="vi">
                <widget-form-item 
                    v-for="(vl,vli) in v.list"
                    :key="vl.key"
                    v-if="vl.key"
                    :element="vl" 
                    :select.sync="selectVertical" 
                    :index="vli" 
                    :data="v"
                    :commonConfig.sync="config"
                >
                </widget-form-item>
            </transition-group>
            </draggable>
        </div>

        <div class="widget-view-action widget-col-action" v-if="selectVertical.key == data.list[index].key">
            <i class="iconfont icon-trash" @click.stop="handleVerticalDelete(index)"></i>
        </div>

        <div class="widget-view-drag widget-col-drag" v-if="selectVertical.key == data.list[index].key">
            <i class="iconfont icon-drag drag-widget"></i>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'
export default {
    data(){
        return{
            selectVertical:this.select,
            config:this.commonConfig
        }
    },
    components: {
        Draggable,
        WidgetFormItem
    },
    props:['data','select','commonConfig','index'],
    mounted(){
        console.log(this.data)
    },
    methods:{
        handleSelectVertical(index){
            console.log('handleSelectVertical');
            this.selectVertical = this.data.list[index]
        },
        //竖向栅格布局-添加
        handleWidgetQueueAdd($event, colIndex){
            let i=this.index;
            let row=this.data.list[i];
            console.log('queueadd', $event, row, colIndex)
            const newIndex = $event.newIndex
            const oldIndex = $event.oldIndex
            const item = $event.item

            // 防止布局元素的嵌套拖拽
            // if (item.className.indexOf('data-grid') >= 0) {
            //   console.log('if')
            //   console.log(item.tagName === 'DIV')

            //   // 如果是列表中拖拽的元素需要还原到原来位置
            //   item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.queue[colIndex].list[newIndex])

            //   row.queue[colIndex].list.splice(newIndex, 1)

            //   return false
            // }
            console.log(row.queue[colIndex].list[newIndex])

            console.log('from', item)

            const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)

            this.$set(row.queue[colIndex].list, newIndex, {
                ...row.queue[colIndex].list[newIndex],
                options: {
                ...row.queue[colIndex].list[newIndex].options,
                remoteFunc: 'func_' + key
                },
                key,
                // 绑定键值
                model: row.queue[colIndex].list[newIndex].type + '_' + key,
                rules: []
            })

            if (row.queue[colIndex].list[newIndex].type === 'radio' || row.queue[colIndex].list[newIndex].type === 'checkbox' || row.queue[colIndex].list[newIndex].type === 'select') {
                this.$set(row.queue[colIndex].list, newIndex, {
                    ...row.queue[colIndex].list[newIndex],
                    options: {
                        ...row.queue[colIndex].list[newIndex].options,
                        options: row.queue[colIndex].list[newIndex].options.options.map(item => ({
                        ...item
                        }))
                    }
                })
            }
            

            this.selectVertical = row.queue[colIndex].list[newIndex]
        },
        //竖向栅格布局删除
        handleVerticalDelete (i) {
            if (this.data.list.length - 1 === i) {
                if (i === 0) {
                this.selectVertical = {}
                } else {
                this.selectVertical = this.data.list[i - 1]
                }
            } else {
                this.selectVertical = this.data.list[i + 1]
            }

            this.$nextTick(() => {
                console.log(this.data.list);
                this.data.list.splice(i, 1);
            })
        }
    },
    watch: {
        select (val) {
            this.selectVertical = val
        },
        selectVertical: {
            handler (val) {
                this.$emit('update:select', val)
            },
            deep: true
        }
    }
}
</script>
