<template>
  <div>
    <el-form ref="generateForm" 
      class="preview_formOutter"
      :class="{'preview_formOutter_nolabel':data.config.labelWidth==0}"
      label-suffix=":"
      :size="data.config.size"
      :model="models" :rules="rules" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      <template v-for="item in data.list">

        <template v-if="item.type == 'grid'">
          <el-row
            :key="item.key"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align"
            :style="{'margin-top':item.options.mat+'px'}"
          >
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              

              <template v-for="citem in col.list" >
                <el-form-item v-if="citem.type=='blank'" :prop="citem.model" :key="citem.key" :class="{'borderRed':data.config.borderColor=='red','borderBlack':data.config.borderColor=='black','borderNode':data.config.borderColor=='noneColor'}">
                  <slot :name="citem.model" :model="models"></slot>
                </el-form-item>

                <!-- <div v-else-if="citem.type=='sign_two'" class="sign_two">
                  <div class="sign_two_top">
                    <el-form-item :prop="citem.model" :key="citem.key" :class="{'borderRed':data.config.borderColor=='red','borderBlack':data.config.borderColor=='black','borderNode':data.config.borderColor=='noneColor'}">
                      <slot :name="citem.model" :model="models"></slot>
                    </el-form-item>
                  </div>
                  <div class="sign_two_bom">
                    <el-form-item :prop="citem.model" :key="citem.key" :class="{'borderRed':data.config.borderColor=='red','borderBlack':data.config.borderColor=='black','borderNode':data.config.borderColor=='noneColor'}">
                      <slot :name="citem.model" :model="models"></slot>
                    </el-form-item>
                  </div>
                </div> -->

                <genetate-form-item v-else 
                  :key="citem.key" 
                  :models.sync="models" 
                  :remote="remote" 
                  :rules="rules" 
                  :widget="citem"
                  :commonConfig="data.config"
                  @input-change="onInputChange">
                </genetate-form-item>
              </template>
            </el-col>
          </el-row>
        </template>

        <template v-else-if="item.type == 'blank'">
          <el-form-item :prop="item.model" :key="item.key" :class="{'borderRed':data.config.borderColor=='red','borderBlack':data.config.borderColor=='black','borderNode':data.config.borderColor=='noneColor'}">
            <slot :name="item.model" :model="models"></slot>
          </el-form-item>
        </template>

        <template v-else>
          <genetate-form-item 
            :key="item.key" 
            :models.sync="models" 
            :rules="rules" 
            :widget="item"
            :commonConfig="data.config"
            @input-change="onInputChange"
            :remote="remote">
          </genetate-form-item>
        </template>
        
      </template>
    </el-form>
  </div>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'
import {loadJs} from '../util/index.js'

export default {
  name: 'fm-generate-form',
  components: {
    GenetateFormItem
  },
  props: ['data', 'remote', 'value', 'insite'],
  data () {
    return {
      models: {},
      rules: {}
    }
  },
  created () {
    console.log(this.data);
    this.generateModle(this.data.list)
  },
  mounted () {
  },
  methods: {
    generateModle (genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list)
          })
        } else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            if (genList[i].type === 'blank') {
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : []))
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue
            }      
          }
          
          if (this.rules[genList[i].model]) {
            
            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: eval(item.pattern)}
              } else {
                return {...item}
              }
            })]
          } else {
            
            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: eval(item.pattern)}
              } else {
                return {...item}
              }
            })]
          }      
        }
      }
    },
    getData () {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error(this.$t('fm.message.validError')).message)
          }
        })
      })
    },
    reset () {
      this.$refs.generateForm.resetFields()
    },
    onInputChange (value, field) {
      this.$emit('on-change', field, value, this.models)
    },
    refresh () {
      
    }
  },
  watch: {
    data: {
      deep: true,
      handler (val) {
        this.generateModle(val.list)
      }
    },
    value: {
      deep: true,
      handler (val) {
        console.log(JSON.stringify(val))
        this.models = {...this.models, ...val}
      }
    }
  }
}
</script>

<style lang="scss">
// @import '../styles/cover.scss';
.preview_formOutter{
  &.preview_formOutter_nolabel{
    .el-form-item{
      .el-form-item__content{
        border-left:0;
      }
    }
  }
  // .el-row{
  //   border-left:1px solid #ccc;
  //   border-bottom:1px solid #ccc;
  //   border-right:1px solid #ccc;
  //   &:first-child{
  //     border-top:1px solid #ccc;
  //   }
  //   &:last-child{
  //     margin-bottom:18px;
  //   }
  // }
  // .el-col{
  //   &:not(:first-child){
  //     border-left:1px solid #ccc;
  //   }
  //   padding:10px;
  //   .el-form-item{
  //     margin-bottom:0;
  //   }
  // }

  .el-row{
    .el-col{
      &:not(:first-child){
        .el-form-item{
          border-left:0;
        }
      }
    }
  }


  .el-form--label-left .el-form-item__label {
    text-align: left;
  }
  .el-form-item{
    // border:1px solid red;
    margin-bottom:0;
    .el-form-item__content{
      // border-left:1px solid red;
    }
  }
}
.sign_two{
  height:100%;
  .sign_two_top{
    height:50%;
  }
}
</style>
