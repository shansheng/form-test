export const basicComponents = [
  {
    type: 'title',
    icon: 'icon-input',
    no_label:true,//没有标题
    no_bor:true,//没有边框
    options: {
      width: '100%',
      height:'67',
      // mat:'',//上边距
      bort:true,//是否有上边框
      alignTxt:'center',//内容对齐方式
      contColor:'red',//内容颜色
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '请输入大标题',
      disabled: false,
      fontSize:'40',
    }
  },
  {
    type: 'sign',
    icon: 'icon-input',
    custom_label:true,//自定义标题
    options: {
      titleWidth: '',//标题宽度
      titlepad:'',//标题左右留白
      width: '100%',
      height:'220',
      // mat:'',//上边距
      bort:true,//是否有上边框
      alignTxt:'center',//内容对齐方式
      labelColor:'red',//标题颜色
      contColor:'black',//内容颜色
      borderColor:'red',//边框颜色
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false,
      fontSize:'16'
    }
  },
  {
    type: 'sign_two',
    icon: 'icon-input',
    custom_label:true,//自定义标题
    options: {
      titleWidth: '',//标题宽度
      titlepad:'',//标题左右留白
      width: '100%',
      height:'220',
      // mat:'',//上边距
      bort:true,//是否有上边框
      alignTxt:'center',//内容对齐方式
      labelColor:'red',//标题颜色
      contColor:'black',//内容颜色
      borderColor:'red',//边框颜色
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false,
      fontSize:'16',
      list:[
        {
          name:'审批上下1',
          val:{}
        },
        {
          name:'审批上下2',
          val:{}
        }
      ]
    }
  },
  {
    type: 'input',
    icon: 'icon-input',
    custom_label:true,//自定义标题
    options: {
      width: '100%',
      // mat:'',//上边距
      bort:true,//是否有上边框
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false,
    }
  },
  {
    type: 'textarea',
    icon: 'icon-diy-com-textarea',
    custom_label:true,//自定义标题
    options: {
      width: '100%',
      bort:true,//是否有上边框
      defaultValue: '',
      required: false,
      disabled: false,
      pattern: '',
      placeholder: ''
    }
  },
  {
    type: 'number',
    icon: 'icon-number',
    options: {
      width: '',
      bort:true,//是否有上边框
      required: false,
      defaultValue: 0,
      min: '',
      max: '',
      step: 1,
      disabled: false,
      controlsPosition: ''
    }
  },
  {
    type: 'radio',
    icon: 'icon-radio-active',
    options: {
      inline: false,
      bort:true,//是否有上边框
      defaultValue: '',
      showLabel: false,
      options: [
        {
          value: 'Option 1',
          label: 'Option 1'
        },
        {
          value: 'Option 2',
          label: 'Option 2'
        },
        {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      disabled: false,
    }
  },
  {
    type: 'checkbox',
    icon: 'icon-check-box',
    options: {
      inline: false,
      bort:true,//是否有上边框
      defaultValue: [],
      showLabel: false,
      options: [
        {
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        },
        {
          value: 'Option 3'
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      disabled: false,
    }
  },
  {
    type: 'time',
    icon: 'icon-time',
    options: {
      defaultValue: '21:19:56',
      bort:true,//是否有上边框
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      isRange: false,
      arrowControl: true,
      format: 'HH:mm:ss',
      required: false,
      width: '',
    }
  },
  {
    type: 'date',
    icon: 'icon-date',
    options: {
      defaultValue: '',
      bort:true,//是否有上边框
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      timestamp: false,
      required: false,
      width: '',
    }
  },
  {
    type: 'rate',
    icon: 'icon-pingfen1',
    options: {
      defaultValue: null,
      bort:true,//是否有上边框
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false
    }
  },
  {
    type: 'color',
    icon: 'icon-color',
    options: {
      defaultValue: '',
      bort:true,//是否有上边框
      disabled: false,
      showAlpha: false,
      required: false
    }
  },
  {
    type: 'select',
    icon: 'icon-select',
    options: {
      defaultValue: '',
      bort:true,//是否有上边框
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      width: '',
      options: [
        {
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        },{
          value: 'Option 3'
        }
      ],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'select_two',
    icon: 'icon-select',
    no_label:true,
    no_bor:true,
    options: {
      defaultValue: '',
      bort:true,//是否有上边框
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '请选择',
      required: false,
      showLabel: false,
      titleWidth:'',//标题宽度
      width: '100%',//内容宽度
      alignTxt:'center',//内容对齐方式
      labelColor:'red',//标题颜色
      contColor:'red',//内容颜色
      borderColor:'red',//边框颜色
      options: [
        {
          value: '紧急'
        },
        {
          value: '一般'
        },{
          value: '不紧急'
        }
      ],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'switch',
    icon: 'icon-switch',
    options: {
      defaultValue: false,
      bort:true,//是否有上边框
      required: false,
      disabled: false,
    }
  },
  {
    type: 'slider',
    icon: 'icon-slider',
    options: {
      defaultValue: 0,
      bort:true,//是否有上边框
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: ''
    }
  },
  {
    type: 'text',
    icon: 'icon-wenzishezhi-',
    options: {
      defaultValue: 'This is a text',
      bort:true,//是否有上边框
      customClass: '',
    }
  },
  // {
  //   type: 'head',
  //   icon: 'icon-wenzishezhi-',
  //   options: {
  //     defaultValue: 'This is a text',
  //     bort:true,//是否有上边框
  //     customClass: '',
  //   }
  // }
]

export const advanceComponents = [
  {
    type: 'blank',
    icon: 'icon-zidingyishuju',
    options: {
      defaultType: 'String'
    }
  },
  {
    type: 'imgupload',
    icon: 'icon-tupian',
    options: {
      defaultValue: [],
      size: {
        width: 100,
        height: 100,
      },
      width: '',
      tokenFunc: 'funcGetToken',
      token: '',
      domain: 'http://pfp81ptt6.bkt.clouddn.com/',
      disabled: false,
      length: 8,
      multiple: false,
      isQiniu: false,
      isDelete: false,
      min: 0,
      isEdit: false,
      action: 'https://jsonplaceholder.typicode.com/photos/'
    }
  },
  {
    type: 'editor',
    icon: 'icon-fuwenbenkuang',
    options: {
      defaultValue: '',
      width: ''
    }
  },
  {
    type: 'cascader',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  }
]

export const layoutComponents = [
  {
    type: 'grid',
    icon: 'icon-grid-',
    columns: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
      mat:'',//上边距
    }
  },
  {
    type: 'vertical',
    icon: 'icon-grid-',
    queue: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
      mat:'',//上边距
    }
  }
]
