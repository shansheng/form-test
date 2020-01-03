<template>
  <div class="widget-form-container">
    <div v-if="data.list.length == 0" class="form-empty">{{$t('fm.description.containerEmpty')}}</div>
    <el-form :size="data.config.size" label-suffix=":" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      
      <draggable class="" 
        v-model="data.list" 
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >

        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <template v-if="element.type == 'grid'">
                <el-row class="widget-col widget-view" v-if="element && element.key" :key="element.key" 
                  type="flex"
                  :class="{active: selectWidget.key == element.key}"
                  :gutter="element.options.gutter ? element.options.gutter : 0"
                  :justify="element.options.justify"
                  :align="element.options.align"
                  @click.native="handleSelectWidget(index)">
                  <el-col v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                      <draggable
                        style="height:100%;"
                        v-model="col.list"
                        :no-transition-on-drag="true"
                        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                        @end="handleMoveEnd"
                        @add="handleWidgetColAdd($event, element, colIndex)"
                      >
                        <transition-group name="fade" tag="div" class="widget-col-list" :key="colIndex">
                          <div v-for="(el, i) in col.list" :key="i" class="vertical-grid-cont">
                            <div class="vertical-grid" v-if="el.type=='vertical'" :class="{active: selectWidget.key == el.key}" @click.stop="handleSelectVertical(index,colIndex,i)">
                              <!-- <div class="vertical-grid-item" v-for="(v,vi) in el.queue" :style="{height:100/el.queue.length+'%'}">vertical</div> -->
                                <div class="vertical-grid-item" v-for="(v,vi) in el.queue" :style="{height:100/el.queue.length+'%'}">
                                <!-- <div class="vertical-grid-item" v-for="(v,vi) in el.queue"> -->
                                  <draggable
                                    v-model="v.list"
                                    :no-transition-on-drag="true"
                                    v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                                    @add="handleWidgetQueueAdd($event, el, vi)"
                                  >
                                    <transition-group name="fade" tag="div" class="widget-queue-list" :key="vi">
                                      <widget-form-item 
                                        v-for="(vl,vli) in v.list"
                                        :key="vl.key"
                                        v-if="vl.key"
                                        :element="vl" 
                                        :select.sync="selectWidget" 
                                        :index="vli" 
                                        :data="v"
                                        :commonConfig="data.config"
                                        :labelWidth="data.config.labelWidth"
                                        :alignType="data.config.labelPosition"
                                      >
                                      </widget-form-item>
                                    </transition-group>
                                  </draggable>
                                </div>

                                <div class="widget-view-action widget-col-action" v-if="selectWidget.key == el.key">
                                  <i class="iconfont icon-trash" @click.stop="handleVerticalDelete(index,colIndex,i)"></i>
                                </div>

                                <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == el.key">
                                  <i class="iconfont icon-drag drag-widget"></i>
                                </div>
                            </div>

                            <widget-form-item 
                              :key="el.key"
                              v-else-if="el.key"
                              :element="el" 
                              :select.sync="selectWidget" 
                              :index="i" 
                              :data="col"
                              :commonConfig="data.config"
                              :labelWidth="data.config.labelWidth"
                              :alignType="data.config.labelPosition"
                            >
                            </widget-form-item>

                            <!-- <widget-form-item 
                              v-for="(el, i) in col.list"
                              :key="el.key"
                              v-if="el.key"
                              :element="el" 
                              :select.sync="selectWidget" 
                              :index="i" 
                              :data="col"
                              :commonConfig="data.config"
                              :labelWidth="data.config.labelWidth"
                              :alignType="data.config.labelPosition"
                            >
                            </widget-form-item> -->
                          </div>
                        </transition-group>
                      </draggable>
                  </el-col>
                  <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
                    <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
                  </div>

                  <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
                    <i class="iconfont icon-drag drag-widget"></i>
                  </div>
                </el-row>
            </template>

            <template v-else>
              <widget-form-item v-if="element && element.key" :key="element.key" :element="element" :select.sync="selectWidget" :index="index" :data="data" :labelWidth="data.config.labelWidth" :alignType="data.config.labelPosition" :commonConfig="data.config"></widget-form-item>
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'

export default {
  components: {
    Draggable,
    WidgetFormItem
  },
  props: ['data', 'select'],
  data () {
    return {
      selectWidget: this.select
    }
  },
  mounted () {
    console.log(this.data)
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    handleMoveEnd ({newIndex, oldIndex}) {
      console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget (index) {
      console.log(index, '#####')
      this.selectWidget = this.data.list[index]
    },
    handleSelectVertical(index,colIndex,i){
      this.selectWidget = this.data.list[index].columns[colIndex].list[i]
    },
    handleWidgetAdd (evt) {
      // console.log('add', evt)
      // console.log('end', evt)
      const newIndex = evt.newIndex
      const to = evt.to
      // console.log(to)
      // console.log(this.data)

      
      //为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].type + '_' + key,
        rules: []
      })
      // console.log(this.data.list);

      if (this.data.list[newIndex].type === 'radio' || this.data.list[newIndex].type === 'checkbox' || this.data.list[newIndex].type === 'select') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
      }

      if (this.data.list[newIndex].type === 'grid') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns: this.data.list[newIndex].columns.map(item => ({...item}))
        })
      }

      this.selectWidget = this.data.list[newIndex]
    },
    //栅格布局--添加
    handleWidgetColAdd ($event, row, colIndex) {
      console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item
      console.log(row.columns[colIndex].list[newIndex])
      console.log(this.data.list);

      // 防止布局元素的嵌套拖拽
      // if (item.className.indexOf('data-grid') >= 0) {
      //   console.log('if')
      //   console.log(item.tagName === 'DIV')

      //   // 如果是列表中拖拽的元素需要还原到原来位置
      //   item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex])

      //   row.columns[colIndex].list.splice(newIndex, 1)

      //   return false
      // }

      console.log('from', item)

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)

      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: row.columns[colIndex].list[newIndex].type + '_' + key,
        rules: []
      })

      if (row.columns[colIndex].list[newIndex].type === 'radio' || row.columns[colIndex].list[newIndex].type === 'checkbox' || row.columns[colIndex].list[newIndex].type === 'select') {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            options: row.columns[colIndex].list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
      }

      this.selectWidget = row.columns[colIndex].list[newIndex]
    },
    //竖向栅格布局-添加
    handleWidgetQueueAdd($event, row, colIndex){
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
      console.log(row.queue[colIndex].list[newIndex])

      this.selectWidget = row.queue[colIndex].list[newIndex]
    },
    //栅格布局删除
    handleWidgetDelete (index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    },
    //竖向栅格布局删除
    handleVerticalDelete (index,colIndex,i) {
      if (this.data.list[index].columns[colIndex].list.length - 1 === i) {
        if (i === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index].columns[colIndex].list[i - 1]
        }
      } else {
        this.selectWidget = this.data.list[index].columns[colIndex].list[i + 1]
      }

      this.$nextTick(() => {
        console.log(this.data.list)
        console.log(this.data.list[index].columns[colIndex].list)
        console.log(i)
        let List=this.data.list[index].columns[colIndex].list;
        List.splice(i, 1);
        console.log(List)
        this.data.list[index].columns[colIndex].list=[...List]
        // console.log(this.data.list[index].columns[colIndex].list)
      })
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .widget-form-container{
    /deep/ .el-form--label-center .el-form-item__label{
      text-align:center;
    }
    .el-form-item__label{
      padding:0;
    }
    // .el-form{
    //   .widget-form-list{
    //     .el-form-item{
    //       padding-bottom:0;
    //       border:1px solid red;
    //     }
    //   }
    // }
    .vertical-grid-cont{
      padding:5px;
      .vertical-grid{
        height:100%;
        padding:2px;
        border:1px green dashed; 
        .vertical-grid-item{
          border-bottom:1px green dashed; 
          &:last-child{
            border-bottom:0; 
          }
          .widget-queue-list{
            min-height:40px;
          }
        }
      }
    }
    
  }
</style>

