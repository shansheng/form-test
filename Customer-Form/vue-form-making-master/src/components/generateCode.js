function findRemoteFunc (list, funcList, tokenFuncList, blankList,titleList,select_twoList) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].type == 'grid') {
      list[i].columns.forEach(item => {
        findRemoteFunc(item.list, funcList, tokenFuncList, blankList,titleList,select_twoList)
      })
    } else {
      if (list[i].type == 'blank') {
        if (list[i].model) {
          blankList.push({
            name: list[i].model,
            label: list[i].name
          })
        }
      } else if (list[i].type == 'imgupload') {
        if (list[i].options.tokenFunc) {
          tokenFuncList.push({
            func: list[i].options.tokenFunc,
            label: list[i].name,
            model: list[i].model
          })
        }
      }else if (list[i].type == 'title') {
        if (list[i].model) {
          titleList.push(list[i])
        }
      }else if (list[i].type == 'select_two') {
        if (list[i].model) {
          select_twoList.push(list[i])
        }
      } else {
        if (list[i].options.remote && list[i].options.remoteFunc) {
          funcList.push({
            func: list[i].options.remoteFunc,
            label: list[i].name,
            model: list[i].model
          })
        }
      }
    }
  }
}

export default function (data) {

  const funcList = []
  const tokenFuncList = []
  const blankList = []
  const titleList = []
  const select_twoList = []

  findRemoteFunc(JSON.parse(data).list, funcList, tokenFuncList, blankList,titleList,select_twoList)

  let funcTemplate = ''
  let blankTemplate = ''
  let titleTemplate = ''
  let select_twoTemplate = ''

  for(let i = 0; i < funcList.length; i++) {
    funcTemplate += `
            ${funcList[i].func} (resolve) {
              ${funcList[i].label} ${funcList[i].model}
              // Call callback function once get the data from remote server
              resolve(data)
            },
    `
  }

  for(let i = 0; i < tokenFuncList.length; i++) {
    funcTemplate += `
            ${tokenFuncList[i].func} (resolve) {
              ${tokenFuncList[i].label} ${tokenFuncList[i].model}
              // Call callback function once get the token
              resolve(token)
            },
    `
  }

  for (let i = 0; i < blankList.length; i++) {
    blankTemplate += `
        <template slot="${blankList[i].name}" slot-scope="scope">
          <!-- ${blankList[i].label} -->
          <!-- use v-model="scope.model.${blankList[i].name}" to bind data -->
        </template>
    `
  }

  for(let i = 0; i < titleList.length; i++) {
    titleTemplate += `
      <template slot="${titleList[i].name}" slot-scope="scope">
        ${titleList[i].type} 
        <input v-model="scope.model.${titleList[i].model}/>
        <!-- use v-model="scope.model.${titleList[i].name}" to bind data -->
      </template>
    `
  }
  console.log(titleList)
  console.log(titleTemplate)

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <link rel="stylesheet" href="https://unpkg.com/form-making/dist/FormMaking.css">
  </head>
  <body>
    <div id="app">
      <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
        ${titleTemplate}
      </fm-generate-form>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    <script src="https://unpkg.com/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <script src="https://unpkg.com/form-making/dist/FormMaking.umd.js"></script>
    <script>
      import FmGenerateForm from './GenerateForm'
      new Vue({
        el: '#app',
        data: {
          jsonData: ${data},
          editData: {},
          remoteFuncs: {
            ${funcTemplate}
          }
        },
        components:{
          FmGenerateForm
        },
        methods: {
          handleSubmit () {
            this.$refs.generateForm.getData().then(data => {
              // data check success
              // data - form data
            }).catch(e => {
              // data check failed
            })
          }
        }
      })
    </script>
  </body>
  </html>`
}