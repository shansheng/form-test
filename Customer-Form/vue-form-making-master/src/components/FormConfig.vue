<template>
  <div class="form-config-container">
    <el-form label-position="top">
      <el-form-item :label="$t('fm.config.form.labelPosition.title')">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">{{$t('fm.config.form.labelPosition.left')}}</el-radio-button>
          <el-radio-button label="right">{{$t('fm.config.form.labelPosition.right')}}</el-radio-button>
          <!-- <el-radio-button label="top">{{$t('fm.config.form.labelPosition.top')}}</el-radio-button> -->
          <el-radio-button label="center">{{$t('fm.config.form.labelPosition.center')}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.borderColor.title')">
        <el-radio-group v-model="data.borderColor" @change="change">
          <el-radio-button label="red">{{$t('fm.config.form.borderColor.red')}}</el-radio-button>
          <el-radio-button label="black">{{$t('fm.config.form.borderColor.black')}}</el-radio-button>
          <el-radio-button label="noneColor">{{$t('fm.config.form.borderColor.noneColor')}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.labelWidth')">
        <el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></el-input-number>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.size')">
        <el-radio-group v-model="data.size">
          <el-radio-button label="medium">medium</el-radio-button>
          <el-radio-button label="small">small</el-radio-button>
          <el-radio-button label="mini">mini</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['data'],
  methods:{
    change(){
      console.log(this.data.borderColor);
    }
  }
}
</script>
