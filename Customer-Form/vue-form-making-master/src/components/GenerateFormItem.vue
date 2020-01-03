<template>
  <div class="generate_form_item">

    <!-- :style="{'margin-top':widget.options.mat+'px'}" -->
    <el-form-item 
      :prop="widget.model"
      :style="{'padding-left':widget.options.titleWidth>0 ? Number(Number(widget.options.titleWidth)+Number(widget.options.titlepad)*2)+'px' :''}"
      :class="{'gen_item_nolabel':widget.no_label,'gen_item_nobor':widget.no_bor,'borderRed':commonConfig.borderColor=='red','borderBlack':commonConfig.borderColor=='black','borderNode':commonConfig.borderColor=='noneColor','signH':widget.type == 'sign','bort':widget.options.bort,'titleWidth':widget.options.titleWidth>0}"
    >
    
      <div class="el_form_custom" :class="{'el_form_sign':widget.type=='sign'}">
        <span class="el_form_label" :style="{width:widget.options.titleWidth>0 ? widget.options.titleWidth+'px' : commonConfig.labelWidth+'px',padding:'0 '+widget.options.titlepad+'px',left:widget.options.titleWidth>0 ? '-'+Number(Number(widget.options.titleWidth)+Number(widget.options.titlepad)*2)+'px' :'-'+commonConfig.labelWidth+'px'}" v-if="widget.custom_label">
          <i class="el_title" :class="{'textcen':commonConfig.labelPosition=='center','textlf':commonConfig.labelPosition=='left','textrg':commonConfig.labelPosition=='right','redColor':widget.options.labelColor=='red','blackColor':widget.options.labelColor=='black'}">{{widget.name}}</i>
        </span>

        <template v-if="widget.type == 'title'">
          <el-input 
            :type="widget.options.dataType"
            v-model="dataModel"
            :disabled="widget.options.disabled"
            :placeholder="widget.options.placeholder"
            :style="{width: widget.options.width,height:widget.options.height+'px','font-size':widget.options.fontSize+'px'}"
            :class="{'custom_h':widget.options.height,'textlf':widget.options.alignTxt=='left','textcen':widget.options.alignTxt=='center','textrg':widget.options.alignTxt=='right','redColor':widget.options.contColor=='red','blackColor':widget.options.contColor=='black'}"
          ></el-input>
        </template>

        <template v-if="widget.type == 'sign'">
          <div class="sign_com" @click="dialogSign = true">
            <div 
              :style="{'min-height':widget.options.height>0 ? widget.options.height+'px':'100px'}"
              class="sign_cont"
              :class="{'redColor':widget.options.contColor=='red','blackColor':widget.options.contColor=='black'}"
            >
              <div class="sign_item" v-for="(item,index) in signList" :key="index">
                <div>{{item.cont}}</div>
                <div class="sign_cur">{{item.sign_cur}}</div>
                <div class="sign_time">{{item.time}}</div>
              </div>
            </div>
          </div>  
        </template>

        <!-- <template v-else-if="widget.type == 'sign_two'">
          <div class=""></div>
          <div class="sign_com" @click="dialogSign = true">
            <div 
              :style="{'min-height':widget.options.height>0 ? widget.options.height+'px':'100px'}"
              class="sign_cont"
              :class="{'redColor':widget.options.contColor=='red','blackColor':widget.options.contColor=='black'}"
            >
              <div class="sign_item" v-for="(item,index) in signList" :key="index">
                <div>{{item.cont}}</div>
                <div class="sign_cur">{{item.sign_cur}}</div>
                <div class="sign_time">{{item.time}}</div>
              </div>
            </div>
          </div>  
        </template> -->


        <template v-if="widget.type == 'input'" >
          <el-input 
            v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
            :type="widget.options.dataType"
            v-model.number="dataModel"
            :placeholder="widget.options.placeholder"
            :style="{width: widget.options.width}"
            :disabled="widget.options.disabled"
          ></el-input>
          <el-input 
            v-else
            :type="widget.options.dataType"
            v-model="dataModel"
            :disabled="widget.options.disabled"
            :placeholder="widget.options.placeholder"
            :style="{width: widget.options.width}"
          ></el-input>
        </template>

        <template v-if="widget.type == 'textarea'">
          <el-input type="textarea" :rows="5"
            v-model="dataModel"
            :disabled="widget.options.disabled"
            :placeholder="widget.options.placeholder"
            :style="{width: widget.options.width}"
          ></el-input>
        </template>

        <template v-if="widget.type == 'number'">
          <el-input-number 
            v-model="dataModel" 
            :style="{width: widget.options.width}"
            :step="widget.options.step"
            controls-position="right"
            :disabled="widget.options.disabled"
          ></el-input-number>
        </template>

        <template v-if="widget.type == 'radio'">
          <el-radio-group v-model="dataModel"
            :style="{width: widget.options.width}"
            :disabled="widget.options.disabled"
          >
            <el-radio
              :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
              :label="item.value" v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index"
            >
              <template v-if="widget.options.remote">{{item.label}}</template>
              <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
            </el-radio>
          </el-radio-group>
        </template>

        <template v-if="widget.type == 'checkbox'">
          <el-checkbox-group v-model="dataModel"
            :style="{width: widget.options.width}"
            :disabled="widget.options.disabled"
          >
            <el-checkbox
              
              :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
              :label="item.value" v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index"
            >
              <template v-if="widget.options.remote">{{item.label}}</template>
              <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
            </el-checkbox>
          </el-checkbox-group>
        </template>

        <template v-if="widget.type == 'time'">
          <el-time-picker 
            v-model="dataModel"
            :is-range="widget.options.isRange"
            :placeholder="widget.options.placeholder"
            :start-placeholder="widget.options.startPlaceholder"
            :end-placeholder="widget.options.endPlaceholder"
            :readonly="widget.options.readonly"
            :disabled="widget.options.disabled"
            :editable="widget.options.editable"
            :clearable="widget.options.clearable"
            :arrowControl="widget.options.arrowControl"
            :value-format="widget.options.format"
            :style="{width: widget.options.width}"
          >
          </el-time-picker>
        </template>

        <template v-if="widget.type=='date'">
          <el-date-picker
            v-model="dataModel"
            :type="widget.options.type"
            :placeholder="widget.options.placeholder"
            :start-placeholder="widget.options.startPlaceholder"
            :end-placeholder="widget.options.endPlaceholder"
            :readonly="widget.options.readonly"
            :disabled="widget.options.disabled"
            :editable="widget.options.editable"
            :clearable="widget.options.clearable"
            :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
            :format="widget.options.format"
            :style="{width: widget.options.width}"
          >
          </el-date-picker>
        </template>

        <template v-if="widget.type =='rate'">
          <el-rate v-model="dataModel"
            :max="widget.options.max"
            :disabled="widget.options.disabled"
            :allow-half="widget.options.allowHalf"
          ></el-rate>
        </template>

        <template v-if="widget.type == 'color'">
          <el-color-picker 
            v-model="dataModel"
            :disabled="widget.options.disabled"
            :show-alpha="widget.options.showAlpha"
          ></el-color-picker>
        </template>

        <template v-if="widget.type == 'select'">
          <el-select
            v-model="dataModel"
            :disabled="widget.options.disabled"
            :multiple="widget.options.multiple"
            :clearable="widget.options.clearable"
            :placeholder="widget.options.placeholder"
            :style="{width: widget.options.width}"
            :filterable="widget.options.filterable"
          >
            <el-option v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option>
          </el-select>
        </template>

        <template v-if="widget.type == 'select_two'">
          <div :class="{'borderRed':commonConfig.borderColor=='red','borderBlack':commonConfig.borderColor=='black','borderNode':commonConfig.borderColor=='noneColor','bort':widget.options.bort}">
            <div 
              class="bor_bom"
              :class="{'textcen':commonConfig.labelPosition=='center','textlf':commonConfig.labelPosition=='left','textrg':commonConfig.labelPosition=='right','redColor':widget.options.labelColor=='red','blackColor':widget.options.labelColor=='black'}"
            >{{widget.name}}</div>
            <el-select
              v-model="dataModel"
              :disabled="widget.options.disabled"
              :multiple="widget.options.multiple"
              :clearable="widget.options.clearable"
              :placeholder="widget.options.placeholder"
              :style="{width: widget.options.width}"
              :filterable="widget.options.filterable"
              :class="{'textcen':commonConfig.labelPosition=='center','textlf':commonConfig.labelPosition=='left','textrg':commonConfig.labelPosition=='right','redColor':widget.options.contColor=='red','blackColor':widget.options.contColor=='black'}"
            >
              <el-option v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option>
            </el-select>
          </div>
          
        </template>

        <template v-if="widget.type=='switch'">
          <el-switch
            v-model="dataModel"
            :disabled="widget.options.disabled"
          >
          </el-switch>
        </template>

        <template v-if="widget.type=='slider'">
          <el-slider 
            v-model="dataModel"
            :min="widget.options.min"
            :max="widget.options.max"
            :disabled="widget.options.disabled"
            :step="widget.options.step"
            :show-input="widget.options.showInput"
            :range="widget.options.range"
            :style="{width: widget.options.width}"
          ></el-slider>
        </template>

        <template v-if="widget.type=='imgupload'">
          <fm-upload
            v-model="dataModel"
            :disabled="widget.options.disabled"
            :style="{'width': widget.options.width}"
            :width="widget.options.size.width"
            :height="widget.options.size.height"
            :token="widget.options.token"
            :domain="widget.options.domain"
            :multiple="widget.options.multiple"
            :length="widget.options.length"
            :is-qiniu="widget.options.isQiniu"
            :is-delete="widget.options.isDelete"
            :min="widget.options.min"
            :is-edit="widget.options.isEdit"
            :action="widget.options.action"
          >
          </fm-upload>
        </template>

        <template v-if="widget.type == 'editor'">
          <vue-editor
            v-model="dataModel"
            :style="{width: widget.options.width}"
          >
          </vue-editor>
        </template>

        <template v-if="widget.type == 'cascader'">
          <el-cascader
            v-model="dataModel"
            :disabled="widget.options.disabled"
            :clearable="widget.options.clearable"
            :placeholder="widget.options.placeholder"
            :style="{width: widget.options.width}"
            :options="widget.options.remoteOptions"
          >

          </el-cascader>
        </template>

        <template v-if="widget.type == 'text'">
          <span>{{dataModel}}</span>
        </template>
      </div>
    </el-form-item>

    <!-- 签名 -->
    <el-dialog title="审批" :visible.sync="dialogSign" :append-to-body="true" width="300px">
      <el-form ref="signForm" :model="signForm" :rules="signRule" label-width="100px">
        <el-form-item label="审批内容" prop="signCont">
          <el-input v-model="signForm.signCont" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSign = false">取 消</el-button>
        <el-button type="primary" @click="signSure('signForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  

  


</template>

<script>
import FmUpload from './Upload'

export default {
  // props: ['widget', 'models', 'rules', 'remote','labelWidth','alignType','commonConfig'],
  props: ['widget', 'models', 'rules', 'remote','commonConfig'],
  components: {
    FmUpload
  },
  data () {
    return {
      dataModel: this.models[this.widget.model],
      dialogSign:false,//审批
      sign_cur:'王晓宇',//当前操作人
      signForm: {
        signCont:''
      },
      signRule: {
        signCont: [
          { required: true, message: '请输入审批', trigger: 'blur' }
        ]
      },
      signList:[
        // {
        //   cont:'',
        //   sign_cur:'',
        //   time:''
        // }
      ]
    }
  },
  created () {
    // console.log(this.commonConfig)
    // console.log(this.widget)
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.widget.options.remoteOptions = data.map(item => {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: item[this.widget.options.props.children]
          }
        })
      })
    }

    if (this.widget.type === 'imgupload' && this.widget.options.isQiniu) {
      this.remote[this.widget.options.tokenFunc]((data) => {
        this.widget.options.token = data
      })
    }
  },
  methods: {
    //审批
    signSure(formName){
      let vm=this;
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!');
          vm.signList.push({
            cont:vm.signForm.signCont,
            sign_cur:vm.sign_cur,
            time:new Date().getTime()
          })
          vm.dialogSign=false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler (val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
        this.$emit('input-change', val, this.widget.model)
      }
    },
    models: {
      deep: true,
      handler (val) {
        this.dataModel = val[this.widget.model]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el_form_custom{
  position:relative;
  .el_form_label{
    position:absolute;
    top:0;
    bottom:0;
    height:100%;
    display:inline-block;
    .el_title{
      position:absolute;
      top:50%;
      // width:100%;
      display:block;
      transform:translateY(-50%);
      font-style:normal;
    }
  }
}
.gen_item_nolabel{
  /deep/ .el-form-item__content{
    margin-left:0 !important;
    border-left:0 !important;
  }
  .el_form_custom{
    /deep/ .el-select{
      width:100%;
    }
  }
}

.gen_item_nobor{
  border:0 !important;
  /deep/ .el-input__inner{
    border:0;
  }
}

.custom_h{
  /deep/ .el-input__inner{
    height:100%;
  }
}
.sign_com{
  .sign_cont{
    min-height:100px;
    cursor: pointer;
    padding:5px;
    overflow:hidden;
    .sign_item{
      margin-bottom:10px;
      line-height:20px;
      .sign_cur,.sign_time{
        padding-left:50px;
      }
    }
  }
}

//标题宽度
.titleWidth{
  /deep/ .el-form-item__content{
    margin-left:0 !important;
  }
}



</style>

