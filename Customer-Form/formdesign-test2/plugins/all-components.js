function getPinyin(e){
    var val=e.sender.getValue();
    getPy('name',val);
    triggerBtn();
}
$(function () {
    var tdText = {
        "label":'',
        "name":''
    };
    /*表单模板加载*/
    $(".toobar_left").on("click",".toobar_li_ul>li",function () {
        var thisTag= $(this).prop("nodeName");
        var  plugins =  $(this).find("a").attr("plugin");
        if(!plugins) return;
        var components_btn = $("#components-btn");
        components_btn.attr("plugins",plugins);
        $("#moduleBoxs").html("");

        var sElment =   templateView.body.getElementsByClassName("moduleCheck");//获取所有的带有moduleCheck的标签；
        for (var i = 0;i<sElment.length ;i++){//删除moduleCheck名字；
            UE.dom.domUtils.removeClasses( sElment[i], "moduleCheck" );
        }

        //页面加载完成后绑定事件；
        newPageEvent();

        if (tdText.name != ""){
            var str = tdText.label;
            var vals = stripscript(str);
            var tdName = makePy(vals);
            var names = tdName[0].toLowerCase();
            tdText.name = names;
        }
        function stripscript(s) {//过滤特殊字符；
            var pattern = new RegExp("[`~!@#$^&*()=|{}%':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        }
        //调用绑定事件，放在最后面；
        var thisTagName = thisTag.toLowerCase();
        moduleRegister(plugins,thisTagName,tdText)
    });

    /*点击组件*/
    templateView.addListener("click",function () {
        var focusNode1 = templateView.selection.getStart();
      //  tabSelect(focusNode1);//tab容器切换；
        var plugins = focusNode1.getAttribute('plugins');
        var thisClass = focusNode1.getAttribute('class');
        //当点击的是table里面的td的时候；
        if(focusNode1.tagName.toLowerCase() == "td" ){
            var thisSibling = focusNode1.previousElementSibling;
            if (thisSibling){
                tdText.label = thisSibling.innerText.trim();
                tdText.name = thisSibling.innerText.trim();
            }
            else {
                tdText.label =  "" ;
                tdText.name =  "" ;
            }
        }
        //由于编辑器默认会给空框里面自动填<br/>;所有很多时候点击td其实是点击在<br/>上；
        if (focusNode1.tagName.toLowerCase() == "br" && focusNode1.parentNode.tagName.toLowerCase() =="td" ){
            var parent_td = focusNode1.parentNode;
            var preTd =  parent_td.previousElementSibling ;
            if (preTd){
                tdText.label = preTd.innerText.trim();
                tdText.name = preTd.innerText.trim();
            }
            else {
                tdText.label =  "" ;
                tdText.name =  "" ;
            }
        }

        var focusNode;
        var sElment =   templateView.body.getElementsByClassName("moduleCheck");//获取所有的带有moduleCheck的标签；
        if(sElment.length > 0 ){//清空右侧编辑；
            $("#moduleBoxs").empty();
        }
        for (var i = 0;i<sElment.length ;i++){//删除moduleCheck名字；
            UE.dom.domUtils.removeClasses( sElment[i], "moduleCheck" );
        }
        if(!thisClass){thisClass = "" };
        if (thisClass =="areafixed" || thisClass =="form-module"){ ;}
        else {
            if(!plugins && thisClass.indexOf("rxGrid") < 0 ) {
                return;
            }
        }

        if (thisClass == "form-module"){//表单模板。数据设置在当前获取的组件的父级上，则得到当前鼠标点击的组件的父级元素；
            var node = templateView.selection.getStart();
            focusNode = node.parentNode;
            plugins = "mini-customtable"
        }
        else if(thisClass == "areafixed"){
            var node = templateView.selection.getStart();
            focusNode = node.parentNode;
            plugins = "mini-area";
        }else if(thisClass.indexOf("rxGrid") >-1 || plugins=="rxGrid"){//为子表时；
            var node = templateView.selection.getStart();
            var thisHtml_s = baidu.editor.dom.domUtils.findParents(node);
            for (var i = 0 ;i<thisHtml_s.length;i++){
                var rxName = thisHtml_s[i].getAttribute("class");
                if (rxName == null || rxName == undefined || rxName == "") continue;
                if (rxName.indexOf("rx-grid")> -1){
                    var focusNode = thisHtml_s[i];
                    break;
                }
            }
        }else if(plugins == "miniImg"){//上传图片；
            var node = templateView.selection.getStart();
            focusNode = node.previousElementSibling;
        }
        else if(plugins == "dataList" || thisClass.indexOf("miniListFixed") > -1){//为数据列表时；
            var node = templateView.selection.getStart();
            focusNode = node.parentNode;
            plugins = "mini-list";
        }else if( plugins == "miniWindow"){
            var node = templateView.selection.getStart();
            focusNode = node.parentNode.parentNode.parentNode;
            plugins = "mini-window";
        }
        else if( plugins == "shadeDiv" || thisClass.indexOf("shadeDiv")>-1){
            var node = templateView.selection.getStart();
            focusNode = node.parentNode;
            focusNode = focusNode.getElementsByClassName("mini-tabs")[0];
            plugins = "mini-tabs";
        }
        else {//得到当前鼠标点击的组件；
            focusNode = templateView.selection.getStart();
        }
        //设置选中样式（鼠标点击红框）；
        if(plugins == "rxGrid" || thisClass.indexOf("rxGrid") >-1 ){//子表的情况；
            plugins = "rx-grid";
            setSelectCss(plugins);
        }else if( plugins == "miniImg" ){
            plugins = "mini-img";
            setSelectCss(plugins);
        }else {
            setSelectCss(plugins);
        }
        var obj = {};
        var len = focusNode.attributes.length;
        for(var i=0;i<len;i++){
            var propertys =  focusNode.attributes[i];
            var localName = propertys.localName;
            var value = propertys.value;
            obj[localName] = value;
        }
        var components_btn = $("#components-btn");
        components_btn.attr("plugins",plugins);
        var  controlPanel=$.ajax({url:__rootPath+"/scripts/ueditor/form-design/config/d_" + plugins  + ".jsp",
            dataType:"html",
            success:function(result){
               /* var el=tabControl.getTabBodyEl(tabPanel);
                $(el).html(result);*/
                $("#moduleBoxs").html(result);
                mini.parse();
                hederTitle(plugins);//设置右边头部文字；
                switch (plugins) {
                    case "mini-customtable"://表单模板;
                        setDatas(plugins,obj);
                        formModule(obj);
                        break;
                    case "mini-tabs"://Tab容器;
                        setDatas(plugins,obj);
                        //回填表格数据；
                        setTabGrid(obj);
                        //存储编辑前的数据；
                        saveTabData(templateView);
                        break;
                    case "mini-textbox"://文本;
                        setDatas(plugins,obj);
                        textBox(obj);
                        textValue(obj);
                        break;
                    case "mini-condition-div":
                        setDatas(plugins,obj);
                        conitionDiv(obj);
                        conditionBox(templateView);
                        break;
                    case "mini-radiobuttonlist":
                        setDatas(plugins,obj);
                        var thisGrid = mini.get('radiobutton_props');
                        setGridData(obj,thisGrid);
                        //定义一个事件触发按钮的单选事件；
                        var thisId = "adiobuttonfrom";
                        valueSelect(obj,thisId);
                        //设置-值来源-里面的数据；
                        setValueSourceData(obj);
                        //父控件；
                        judgeForm(templateView);
                        break;
                    case "mini-checkboxlist":
                        setDatas(plugins,obj);
                        var thisGrid = mini.get('checkboxlistProps');
                        setGridData(obj,thisGrid);
                        //定义一个事件触发按钮的单选事件；
                        var thisId = "checkboxlistfrom";
                        valueSelect(obj,thisId);
                        //设置-值来源-里面的数据；
                        setVuleCheckBoxList(obj);
                        //父控件；
                        judgeForm(templateView);
                        break;
                    case "mini-checkbox":
                        setDatas(plugins,obj);
                        if ( obj.label && obj.name ){//当有字段，名称的时候进来自动保存一下；
                            triggerBtn();
                        }
                        break;
                    case "mini-combobox"://下拉框
                        setDatas(plugins,obj);
                        setEditObj(templateView,focusNode1);
                        var thisGrid = mini.get('comboboxGrid');
                        setGridData(obj,thisGrid);
                        //定义一个事件触发按钮的单选事件；
                        var thisId = "comboboxfrom";
                        valueSelect(obj,thisId);
                        //设置-值来源-里面的数据；
                        setValueCombo(obj);
                        //父控件；
                        judgeForm(templateView);
                        break;
                    case "mini-treeselect"://下拉树
                        setDatas(plugins,obj);
                        //定义一个事件触发按钮的单选事件；
                        var thisId = "treeselectfrom";
                        valueSelect(obj,thisId);
                        setTreeData(obj);
                        //设置-值来源-里面的数据；
                        setValueTree(obj);
                        break;
                    case "mini-area"://地址控件
                        setDatas(plugins,obj);
                        break;
                    case "rx-grid"://子表控件
                        setDatas(plugins,obj);
                        //把数据导入表格；
                        setTemplate(templateView);
                        var headeGrid = mini.get('rxGirdHeder');
                        var buttonGrid = mini.get('rxGridButtonGrid');
                        gridData(obj,headeGrid,buttonGrid);
                        //获取并保存子表设置好了的数据；
                        var rxGridHtml =  templateView.body.getElementsByClassName("moduleCheck")[0];
                        setSaveData(rxGridHtml);
                        //子表数据编辑模式按钮触发；
                        dataButton(obj);
                        //选中时给《显示字段》填值；
                        setSelectGridValues(obj);
                        //获取点击时，表格数据；
                        gainGridData();
                        break;
                    case "mini-textboxlist"://文本盒子；
                        setDatas(plugins,obj);
                        //把数据导入表格；
                        var boxGrid = mini.get('defaultGrid');
                        setGridData(obj,boxGrid);
                        //设置url框可编辑，不可编辑；
                        setUrlEdit(obj);
                        break;
                    case "mini-user"://用户选择；
                        setDatas(plugins,obj);
                        //把数据导入表格；
                        setUser(obj);
                        if ( obj.label &&obj.name ){//当有字段，名称的时候进来自动保存一下；
                            $("#components-btn").trigger("click");
                        }
                        break;
                    case "mini-group"://用户组选择；
                        setDatas(plugins,obj);
                        //把数据导入表格；该方法放在d_mini-group.jsp中；
                        setGroup(obj);
                        if ( obj.label &&obj.name ){//当有字段，名称的时候进来自动保存一下；
                            $("#components-btn").trigger("click");
                        }
                        break;
                    case "mini-dep"://部门选择器；
                        setDatas(plugins,obj);
                        //根据数据使下拉框隐藏显示；
                        setDep(obj);
                        if ( obj.label &&obj.name ){//当有字段，名称的时候进来自动保存一下；
                            $("#components-btn").trigger("click");
                        }
                        break;
                    case "mini-button"://自定义按钮；；
                        setDatas(plugins,obj);
                        btnInitMetadata(templateView);
                        customMiniButton(obj,templateView);
                        break;
                    case "mini-nodeopinion"://；
                        setDatas(plugins,obj);
                        break;
                    case "mini-contextonly"://；
                        setDatas(plugins,obj);
                        setSelectValue(obj);
                        break;
                    case "mini-list"://数据列表；
                        setMiniSelect(plugins,obj,focusNode);
                        console.info(templateView);

                        var content=formContainer.aryForm.join("");
                        console.info(content);

                        getMetaDataByContents(content);
                        setListId(obj);
                        break;
                    case "mini-datepicker"://日期；
                        setDatas(plugins,obj);
                        //设置 -相对日期-选择控件时显示；
                        relativeDataPink(obj);
                        miniDatePockerControl(focusNode1);
                        comparison(obj);
                        break;
                    case "mini-buttonedit"://编辑按钮；
                        setDatas(plugins,obj);
                        //自定义对话框；
                        buttonEditInitMetadata(templateView);
                        customDialogBox(obj);
                        buttonInitDialogs(obj);
                        break;
                    case "mini-hidden"://隐藏域；
                        setDatas(plugins,obj);
                       //为数字类型时显示精度；
                        var typeVal = obj.datatype ;
                        if(typeVal == "number"){
                            $("#precisionBox").show();
                        }else {
                            $("#precisionBox").hide();
                        }
                        break;
                    case "mini-img"://图片上传；
                        setDatas(plugins,obj);
                        if ( obj.label &&obj.name ){//当有字段，名称的时候进来自动保存一下；
                            $("#components-btn").trigger("click");
                        }
                        break;
                    case "upload-panel"://上传控件；
                        setDatas(plugins,obj);
                        if ( obj.label && obj.name ){//当有字段，名称的时候进来自动保存一下；
                            $("#components-btn").trigger("click");
                        }
                        break;
                    case "mini-window"://；
                        setDatas(plugins,obj);
                        break;
                    case "mini-viewword"://word模板
                        setDatas(plugins,obj);
                        break;
                    case "mini-office"://office控件
                        setDatas(plugins,obj);
                        var docTypeHtml = mini.get("docType");
                        docTypeHtml.setValue(obj.doctype);
                        break;
                    default:
                        setDatas(plugins,obj);
                }
            },
            async:false
        });
        //页面加载完成后绑定事件；
        newPageEvent();
    });
    //编辑按钮；
    function customDialogBox(obj) {
        var btn =obj.ckselfdlg;
        if (btn == "true"){
            $("#customDialogBox").show();
        }else {
            $("#customDialogBox").hide();
        }
    }
    function buttonInitDialogs(formData){
        //设置其返回的字段绑定
        mini.get('dialogalias').setText(formData.dialogname);
        var gridRtn=mini.get("returnFields");
        var gridInput=mini.get("gridInput");
        var objs = formData['data-options'];
        var codes = decodeHtml(formData['data-options']);
        var dataOptions=mini.decode(codes);
        var binding=dataOptions.binding;

        if(!binding) return;
        var returnFields = binding.returnFields;
        if(returnFields){
            gridRtn.setData(returnFields);
            mini.get("valueField").setData(returnFields);
            mini.get("textField").setData(returnFields);
        }
        if(binding.gridInput){
            gridInput.setData(binding.gridInput);
        }
    }
     function decodeHtml(s){
         var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;
         var HTML_DECODE = {
             "&amp;" : "&",
             "&quot;": "\"",
         };
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(REGX_HTML_DECODE,
                function($0, $1){
                    var c = HTML_DECODE[$0];
                    if(c == undefined){
                        // Maybe is Entity Number
                        if(!isNaN($1)){
                            c = String.fromCharCode(($1 == 160) ? 32:$1);
                        }else{
                            c = $0;
                        }
                    }
                    return c;
                });
    };

    //文本盒子 设置url是否可编辑；
    function setUrlEdit(obj){
        var value = obj.isurl;
        if(value=='false'){
            mini.get("jsonUrl_textBoxList").setEnabled(false);
        }
        else{
            mini.get("jsonUrl_textBoxList").setEnabled(true);

        }
    }

    //formModule;表单模板；
    function formModule(obj) {

        //一对一子表显隐；
        mini.get("subOneToOne").setChecked(false);
        $("#spanSubTableName").hide();
        if (obj.subonetoone == "true"){
           mini.get("subOneToOne").setChecked(true);
           $("#spanSubTableName").show();
        }
    }

    /*设置 组件里面的表格数据*/
    function setGridData(obj,thisGrid) {
        thisGrid.setData(mini.decode(obj.data));
    }
    //子表表格数据；
    function gridData(obj,headeGrid,buttonGrid) {
        var thisHtml =  templateView.body.getElementsByClassName("moduleCheck")[0];
        var div_container = thisHtml.getElementsByClassName("button-container")[0];
        var thisHtmlChild = thisHtml.getElementsByTagName("table")[0];
        var theads = thisHtml.getElementsByTagName("thead")[0];
        var tbodys = thisHtml.getElementsByTagName("tbody")[0];
        var theads_tr = theads.children[0];
        var tbodys_tr = tbodys.children[0];
        var header_ths =  theads_tr.children;
        var headersData = [];
        for (var i = 0 ; i < header_ths.length ; i++){
            var _this = header_ths[i];
            var key = thPropertys(_this,"header");
            if (key && key != "zdl") {//表格数据；
                var name = _this.innerHTML;
                var requires = thPropertys(_this,"requires");
                var width = thPropertys(_this,"width");
                var editcontrol = thPropertys(_this,"editcontrol");
                var vtype = thPropertys(_this,"vtype");
                var vtype_name = thPropertys(_this,"vtype_name");
                var cellstyle = thPropertys(_this,"cellstyle");
                var displayfield = thPropertys(_this,"displayfield");
                var datatype = thPropertys(_this,"datatype");
                var editcontrol_name = thPropertys(_this,"editcontrol_name");
                var format = thPropertys(_this,"format");
                if(width==undefined){ width=100;}
                if(datatype=='undefined'){ datatype=''; }
                if(requires==undefined){ requires='false'; }
                if(vtype == null ){  vtype = '';}
                if (vtype_name == null ) { vtype_name = '';}
                var s = {
                    "key":key,
                    "name":name,
                    "requires":requires,
                    "width":width,
                    "format":format,
                    "editcontrol":editcontrol,
                    "vtype":vtype,
                    "vtype_name":vtype_name,
                    "cellstyle":cellstyle,
                    "displayfield":displayfield,
                    "datatype":datatype,
                    "editcontrol_name":editcontrol_name
                };
                headersData.push(s);
            }
        }
        headeGrid.setData(headersData);
        function thPropertys(a,b){
            var _this = a ;
            var name = b ;
            var prop = _this.getAttribute(name);
            return prop;
        }
        var buttonData=[];
        if(div_container) {
            var toolBtns = div_container.children;
            if (toolBtns.length > 0) {
                for (var btn = 0; btn < toolBtns.length; btn++) {
                    var obj = toolBtns[btn];
                    var type = obj.getAttribute("type");
                    var setting = "";
                    if (type == "undefined" || type == undefined) {
                        type = "";
                    }
                    else {
                        if (type == "common") {//普通按钮则是点击属性
                            setting = obj.getAttribute("onclick");
                        } else if (type == "import") {//导入按钮则是data-options属性
                            setting = obj.getAttribute("data-options");
                        }
                        else if (type == "custombtn") {
                            setting = obj.getAttribute("data-options");
                            if(setting){
                                var s = JSON.parse(setting);
                                var  dialogname = s.binding["dialogname"];
                                var  dialogalias = s.binding["dialogalias"];
                                var formData = {
                                    "dialogalias":dialogalias,
                                    "dialogname":dialogname,
                                    "seltype":s.binding["seltype"],
                                    "table":s.binding["gridName"],
                                    "uniquefield":s.binding["uniquefield"]
                                }
                                var btnGridInput = s.binding["gridInput"];
                                var btnReturnFields = s.binding["returnFields"];
                                var setting ={};
                                setting.formData = formData;
                                setting.btnGridInput = btnGridInput;
                                setting.btnReturnFields = btnReturnFields;
                            }else {
                                return;
                            }
                        }
                    }
                    var text = obj.innerText;
                    if (type == "custombtn"){
                        var btnData = {"setting": setting, "type": type, "text": text,"settingname":dialogname};
                    } else if(type == "import"){
                        if(setting){
                            var btnData = {"setting": setting, "type": type, "text": text,"settingname":"已配置"};
                        }else {
                            var btnData = {"setting": setting, "type": type, "text": text,"settingname":""};
                        }

                    }
                    else {
                        var btnData = {"setting": setting, "type": type, "text": text};
                    }
                    buttonData.push(btnData);
                }
                buttonGrid.setData(buttonData);
            }
        }
     /*   headeGrid.setData(mini.decode(obj.headedata));
        buttonGrid.setData(mini.decode(obj.buttondata));*/
    }
    //子表数据编辑模式按钮触发；
    function dataButton(obj) {
        var thisVal = obj.edittype;
        $(".windowBox").hide();
        if (thisVal == "openwindow") {
            $("#editWindowTemplate").show();
        }else if (thisVal == "editform"){
            $("#popupForm").show();
        }
    }
    //子表启用树形 显示字段；
    function setSelectGridValues(obj) {
        var data  = obj.headedata ;
        var treegrid = obj.treegrid ;
        var treecolumn = mini.get("treecolumn");
        var gridTreeBoxs = $("#gridTreeBoxs");
        if ( treegrid == "true" ){
            treecolumn.setData(mini.decode(data));
            gridTreeBoxs.show();
        }else {
            gridTreeBoxs.hide();
        }
    }

    /*点击UEditor里面的组件触发 "值来源-选中"*/
    function valueSelect(obj,thisId) {
        var val = obj.from;
        var thisParent = $("#"+thisId).parents(".divBox");
        if (thisId == "treeselectfrom" && val == "custom"){
            val = "sql";
        };
        cutBox(val,thisParent)
    }

    /*下拉树*/
    function setTreeData(obj){
        if (obj.sql != ""){
            var sqlText = mini.get("sql");
            sqlText.setText(obj.sqltext)
            var text=mini.get("sql_textfield");
            var value=mini.get("sql_valuefield");
            var parent=mini.get("sql_parentfield");
            text.setEnabled(true);   //设置下拉控件为可用状态
            value.setEnabled(true);
            parent.setEnabled(true);
        }
    }
    //删除控件；
    $("#components-del").click(function () {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        if( window.confirm('确认删除该控件吗？') ) {
            baidu.editor.dom.domUtils.remove(thisHtml,false);
            $("#moduleBoxs").empty();
        }
    });
    //页面加载完成后绑定事件；右侧编辑栏所有事件写在这里面；
    /*确定按钮*/
    $("#components-btn").click(function () {
           var plugins =  $(this).attr("plugins").trim();
           var form = new mini.Form("#"+plugins+"-form");
           var data = form.getData();
           if ( plugins =="mini-customtable" ){//表单模板 ；
               moduleRegister(plugins,"",data);
               hɪntBox();
           }else if( plugins =="mini-list" ){ //数据列表;
              var listId = data.listId;

               if (listId != "" ) {
                   moduleRegister(plugins,"",data);
                   hɪntBox();
              }else {
                   hɪntBox("保存失败,请选择列表！");
               }
           }
           else if( plugins =="mini-iframe"){//内窗控件；
               var _src = data.src;
               if (_src != "" ) {
                   moduleRegister(plugins,"",data);
                   hɪntBox();
               }else {
                   hɪntBox("保存失败,设置url！");
               }
           }else if( plugins == "mini-viewword"){
               var alias = data.alias;
               if (alias != "" ) {
                   moduleRegister(plugins,"",data);
                   hɪntBox();
               }else {
                   hɪntBox("保存失败,请选择Word模板！");
               }
           }else if( plugins == "mini-ueditor"){//富文本；
               var oLabel = data.label;
               var oName = data.name;
               var length = data.length;
               if (oLabel != "" && oName != ""){
                   if (checkPy(oName)) {
                       if (length != "" ) {
                           moduleRegister(plugins,"",data);
                           hɪntBox();
                       }else {
                           hɪntBox("保存失败,数据长度必填！");
                       }
                   }
                   else {
                       hɪntBox("保存失败,请检查字段备注跟标识!");
                   }
               } else {
                   hɪntBox("保存失败,请检查字段备注跟标识!");
               }
           }
           else {//其他有label name属性的；
               var oLabel = data.label;
               var oName = data.name;
               if (oLabel != "" && oName != ""){
                   if (checkPy(oName)) {
                       moduleRegister(plugins,"",data);
                       hɪntBox();
                   }
                   else {
                       hɪntBox("保存失败,请检查字段备注跟标识!");
                   }
               } else {
                   hɪntBox("保存失败,请检查字段备注跟标识!");
               }
           }
            if (data.required){//如果没有required属性，不触发；
                var changeNode = templateView.body.getElementsByClassName("moduleCheck")[0];
                var rxGrids = templateView.body.getElementsByClassName("rx-grid");
                for (var i = 0 ;i < rxGrids.length ;i++){
                    if (rxGrids[i].contains(changeNode)){//判断当前选中的组件是否包含在子表里面；
                        var gridTable = rxGrids[i].getElementsByTagName("table")[0];
                        var gridThead =  gridTable.getElementsByTagName("thead")[0];
                        var gridTh = gridThead.children[0].children;
                        var tdParent = changeNode.parentNode.parentNode;
                        var tds = tdParent.children;
                        for(var s = 0 ;s<tds.length;s++){
                            if(tds[s].children[0] == changeNode ){
                                var idx = s ;
                                break;
                            }
                        }
                        var isGrid = true;//包含在子表里面返回ture;
                    }
                    else {
                        var isGrid = false;//不包含在子表里面返回false;
                    }
                }

                if(!isGrid){//不在子表里面；
                    var parNode = changeNode.parentNode;
                    var _tr = parNode.parentNode;
                    var _trChildren = _tr.children;

                    for (var t = 0;t<_trChildren.length;t++){
                        if (_trChildren[t] ==  parNode ){
                            var _index = t;
                            break
                        }
                    }
                    if(_index < 1){//当是第一个的时候，跳出函数；
                        return;
                    }
                    var prev = _trChildren[_index - 1];
                    if(data.required =="true"){
                        var _signName = prev.getAttribute("class");
                        var ss =  prev.innerHTML;
                        if(!_signName || _signName.indexOf("mySign") < 0){
                            if(parNode.tagName.toLowerCase() == "td" && prev && prev.tagName.toLowerCase() == "td" && ss != "<br>" ){
                                prev.classList.add("mySign");
                            }
                        }
                    }else {
                        var _signName = prev.getAttribute("class");
                        if(_signName && _signName.indexOf("mySign") > -1){
                            prev.classList.remove("mySign");
                        }
                    }

                }else {//在子表里面；

                    if(data.required =="true"){
                        gridTh[idx].classList.add("mySign");
                    }else {
                        gridTh[idx].classList.remove("mySign");
                    }

                }

            }

            if (plugins == "rx-grid"){
                var nodeChecks = templateView.body.getElementsByClassName("moduleCheck")[0];
                var theadBox = nodeChecks.getElementsByTagName("thead")[0];
                var _th = theadBox.getElementsByTagName("th");
                for (var s= 0 ;s<_th.length ;s++){
                    var requires = _th[s].getAttribute("requires");
                    if (requires) {
                        if (requires == "true"){
                            _th[s].classList.add("mySign");
                        } else {
                            _th[s].classList.remove("mySign");
                        }
                    }
                }
            }

    });
    newPageEvent();
    function newPageEvent() {
        /*逻辑设置开关*/
            /*开*/
        $(".setBtn").click(function () {
            var thisId = $(this).attr("id");
            var idName = thisId+"-fixedBox";
            $("#"+idName).stop().toggleClass("toggleBox");
        })
            /*关*/
        $(".closefixedBox").click(function () {
            $(this).parents(".fixedBox").removeClass("toggleBox");
            triggerBtn();
        });
    }//newPageEvent  -end;

    //保存提示框；
    function hɪntBox(text) {
        var _text;
        _text = text;
        var style;
        style = "color:red;border:1px solid red;";
        if (_text == undefined || _text == "") {
            _text = "数据保存成功！";
            style = "color:green;border:1px solid green;";
        }
        var abc = false;
        if (abc == false ){
            var fixed = document.getElementById("massgeFixed");
            fixed.innerText = _text ;
            fixed.style.cssText += ";" + style ;
            fixed.classList.add("massgeFixed");
            var tim = setTimeout(function () {
                fixed.classList.remove("massgeFixed");
                abc = true ;
            },2000)
        }
    }

    /*文本
    数据类型，
    值来源
    -*/
    function textValue(obj) {//数据类型;
        var val = obj.datatype;
        var objLength=$("#strings");
        var objMinNum=$("#numbers");
        objLength.hide();
        objMinNum.hide();
        switch(val){
            case "varchar":
                objLength.show();
                break;
            case "number":
                objMinNum.show();
                break;
        }
    }

    function textBox(obj) {//值来源；
        var id=obj.from;
        $("#formScripts").css("display","none");
        $("#formSequence").css("display","none");
        if(id=='sequence'){
            $("#formSequence").css("display","block");
            mini.get("scripts").setValue("");
            var sequence = mini.get("textBox_sequence");
            var seqVal=sequence.getValue();
            if( seqVal=='' ) return;
            $.ajax({
                type:"post",
                url:__rootPath+ "/sys/core/sysSeqId/getNameById.do",
                data:{id:sequence.getValue()},
                success:function(result){
                    if( typeof result !='string') return;
                    sequence.setText(result);
                }
            });
        }else if(id=='scripts'){
            mini.get("textBox_sequence").setValue("");
            $("#formScripts").css("display","block");
        }
    }



    /*点击编辑器内的 某个组件设置右边编辑栏的参数*/
    function setDatas(plugins,obj) {
        var form=new mini.Form("#"+ plugins+ "-form");
        if ( plugins == "mini-nodeopinion" ){//当为审批意见的时候；
            var arr = [];
            arr = obj.name.split("FORM_OPINION_");
            obj.name = arr[1];
        }
        //回填数据；
        form.setData(obj);

        if(obj.solutionname){//关联流程<选择方案>
            var solution=mini.get("solution");
            solution.setValue(obj.solution);
            solution.setText(obj.solutionname);
        }
    }

    /*用户选择设置 设置下拉数据*/
    function setUser(obj){
        var grouplevel = mini.get('grouplevel');
        var groupid = mini.get('groupid');

        var orgId = mini.get('orgId');
        var dimShow = $("#dimShow");
        //初始维度
        var initDim = mini.get('initDim').getValue();
        var initDimText = mini.get('initDim').getText();
        //初始等级
        var initRankLevel = mini.get('initRankLevel').getValue();
        var initRankLevelText = mini.get('initRankLevel').getText();

        for (var key in obj ){
            if (key == "data-options"){
                var val=mini.decode(obj[key]);
                mini.get('initRankLevel').setValue(val.initrankLevel);
                mini.get('initRankLevel').setText(val.initrankleveltext);
                mini.get('initDim').setValue(val.initdim);
                mini.get('initDim').setText(val.initdimtext);
            }
        }

        if(obj.refconfig=="specific"){
            groupid.setValue(obj.dimid);
            groupid.setText(obj.dimname);
            var levelValue = obj.refconfig;
            orgShowHide(levelValue);
        }
        if(obj.refconfig=="level"){
            grouplevel.setValue(obj.dimlevel);
            var levelValue = obj.refconfig;
            orgShowHide(levelValue);
        }

        if(obj.orgconfig=="selOrg"){
            orgId.setValue(obj.groupid);
            orgId.setText(obj.orgname);
            var levelValue = obj.orgconfig;
            showHide(levelValue);
            mini.get('initDim').setValue(1);
        }else if(obj.orgconfig =="curOrg"){
            var levelValue = obj.orgconfig;
            mini.get('initDim').setValue(1);
            showHide(levelValue);
        }else{
            dimShow.show();
        }

        function orgShowHide(levelValue) {
            $("#selectInst").hide();
            $("#assginInst").hide();
            //级别
            if('level'== levelValue){
                $("#selectInst").show();
            }else if('specific' == levelValue){		//指定部门
                $("#assginInst").show();
            }
        }

        function showHide(levelValue) {
            $("#scope").hide();
            //级别
            if(levelValue == "curOrg"){
                $('#assginUser').hide();
                mini.get('initDim').setValue(1);
            }else if(levelValue == "selOrg"){
                $('#assginUser').show();
                mini.get('initDim').setValue(1);
            }else{
                $("#scope").show();
                $('#orgSpan').hide();
            }
        }
    }



    /*部门选择 根据数据使下拉框隐藏，显示*/
    function setDep(obj) {
        var single = mini.get('singledep');
        var groupid = mini.get('groupiddep');
        var grouplevel = mini.get('groupleveldep');
        var ops = obj["data-options"];
        if ( ops != "{}"){
            for (var key in obj){
                if (key == "data-options"){
                    var val= mini.decode(obj["data-options"]);
                    single.setValue(val.single);
                    if(val.config.type){

                        var configType = val.config.type;
                        mini.get('refconfigdep').setValue(val.config.type);
                        if(configType=='specific') {
                            groupid.setValue(val.config.groupid);
                            groupid.setText(val.config.groupidtext);

                        };
                        if(configType=='level'){
                            grouplevel.setValue(val.config.level);
                        }
                    }
                }
            }
        }
        show(obj);
        function show(obj){
            var levelValue = obj.refconfig;
            $("#groupidBox").hide();
            $("#grouplevelBox").hide();
            if(levelValue == 'level'){
                $("#grouplevelBox").show();
            }else if(levelValue == 'specific'){		//指定组织
                $("#groupidBox").show();
            }
        }

    }

    /*上下文控件*/
    function setSelectValue(obj){
        var selects = mini.get("constant_item");
        var val = obj["constantitem"];
        if (val == "[PLEASECHOSE]") {
            selects.setText("请选择...");
        }else {
            selects.setValue(val);
        }
    }


    //日期；
    function  relativeDataPink(obj) {
        var val = obj.from;
        if(val=='control'){
            $("#dateControl").show();
        }else{
            $("#dateControl").hide();
        }
    }
    /*组件注册*/
    function moduleRegister(plugins,thisTagName,data) {
        hederTitle(plugins);
        switch (plugins) {
            case "mini-customtable"://表单模板
                miniCustomtable(plugins,thisTagName,data);
                break;
            case "mini-div"://DIV容器
                miniDiv(plugins,thisTagName,data);
                break;
            case "mini-condition-div"://条件容器
                miniConitionDiv(plugins,thisTagName,data);
                break;
            case "mini-tabs"://Tab容器
                miniTabs(plugins,thisTagName,data);
                break;
            case "mini-textbox"://文本
                miniTextbox(plugins,thisTagName,data);
                break;
            case "mini-textarea"://多行文本；
                miniTextarea(plugins,thisTagName,data);
                break;
            case "mini-checkbox"://复选框；
                miniCheckbox(plugins,thisTagName,data);
                break;
            case "mini-radiobuttonlist"://单选按钮；
                miniRadiobuttonlist(plugins,thisTagName,data);
                break;
            case "mini-checkboxlist"://复选框按钮；
                miniCheckboxlist(plugins,thisTagName,data);
                break;
            case "mini-combobox"://下拉框；
                miniCombobox(plugins,thisTagName,data);
                break;
            case "mini-treeselect"://下拉树；
                miniTreeselect(plugins,thisTagName,data);
                break;
            case "mini-area"://地址控件；
                miniArea(plugins,thisTagName,data);
                break;
            case "mini-spinner"://数字；
                miniSpinner(plugins,thisTagName,data);
                break;
            case "mini-datepicker"://日期；
                miniDatepicker(plugins,thisTagName,data);
                break;
            case "mini-month"://月份；
                miniMonth(plugins,thisTagName,data);
                break;
            case "mini-time"://时间；
                miniTime(plugins,thisTagName,data);
                break;
            case "mini-ueditor"://富文本；
                miniUeditor(plugins,thisTagName,data);
                break;
            case "upload-panel"://上传控件；
                uploadPanel(plugins,thisTagName,data);
                break;
            case "mini-img"://图片上传；
                miniImg(plugins,thisTagName,data);
                break;
            case "mini-hidden"://隐藏域；
                miniHidden(plugins,thisTagName,data);
                break;
            case "mini-buttonedit"://编辑按钮；
                miniButtonedit(plugins,thisTagName,data);
                break;
            case "rx-grid"://子表；
                rxGrid(plugins,thisTagName,data);
                break;
            case "mini-list"://数据列表；
                miniList(plugins,thisTagName,data);
                break;
            case "mini-textboxlist"://文本盒子；
                miniTextboxlist(plugins,thisTagName,data);
                break;
            case "mini-checkhilist"://审批历史；
                miniCheckhilist(plugins,thisTagName,data);
                break;
            case "mini-relatedsolution"://关联流程；
                miniRelatedsolution(plugins,thisTagName,data);
                break;
            case "mini-user"://用户选择；
                miniUser(plugins,thisTagName,data);
                break;
            case "mini-group"://用户组选择；
                miniGroup(plugins,thisTagName,data);
                break;
            case "mini-dep"://部门选择；
                miniDep(plugins,thisTagName,data);
                break;
            case "mini-button"://自定义按钮；
                miniButton(plugins,thisTagName,data);
                break;
            case "mini-nodeopinion"://审批意见；
                miniNodeopinion(plugins,thisTagName,data);
                break;
            case "mini-office"://office控件；
                miniOffice(plugins,thisTagName,data);
                break;
            case "mini-iframe"://内窗控件；
                miniIframe(plugins,thisTagName,data);
                break;
            case "mini-viewword"://word模板；
                miniViewword(plugins,thisTagName,data);
                break;
            case "mini-contextonly"://上下文控件；
                miniContextonly(plugins,thisTagName,data);
                break;
            case "mini-window"://；
                miniWindow(plugins,thisTagName,data);
                break;
            case "rx-signature"://签名
                rxSignature(plugins,thisTagName,data);
                break;
            case "mini-horizontal"://A4横屏盒子
                miniHorizontal(plugins,thisTagName,data);
                break;
            case "mini-vertical"://A4竖屏盒子
                miniVertical(plugins,thisTagName,data);
                break;
            case "mini-line"://分隔线；
                miniLine(plugins,thisTagName,data);
                break;
            default:alert("对不起该组件没有注册！")
        }
    }

    function hederTitle(plugins) {
        var hederTitle =  $("#hederTitle");
        switch (plugins) {
            case "mini-customtable"://表单模板
                hederTitle.text("表单模板");
                break;
            case "mini-div"://DIV容器
                hederTitle.text("DIV容器");
                break;
            case "mini-condition-div"://条件容器
                hederTitle.text("条件容器");
                break;
            case "mini-tabs"://Tab容器
                hederTitle.text("Tab容器");
                break;
            case "mini-textbox"://文本
                hederTitle.text("文本");
                break;
            case "mini-textarea"://多行文本；
                hederTitle.text("多行文本");
                break;
            case "mini-checkbox"://复选框；
                hederTitle.text("复选框");
                break;
            case "mini-radiobuttonlist"://单选按钮；
                hederTitle.text("单选按钮");
                break;
            case "mini-checkboxlist"://复选框按钮；
                hederTitle.text("复选框按钮");
                break;
            case "mini-combobox"://下拉框；
                hederTitle.text("下拉框");
                break;
            case "mini-treeselect"://下拉树；
                hederTitle.text("下拉树");
                break;
            case "mini-area"://地址控件；
                hederTitle.text("地址控件");
                break;
            case "mini-spinner"://数字；
                hederTitle.text("数字");
                break;
            case "mini-datepicker"://日期；
                hederTitle.text("日期");
                break;
            case "mini-month"://月份；
                hederTitle.text("月份");
                break;
            case "mini-time"://时间；
                hederTitle.text("时间");
                break;
            case "mini-ueditor"://富文本；
                hederTitle.text("富文本");
                break;
            case "upload-panel"://上传控件；
                hederTitle.text("上传控件");
                break;
            case "mini-img"://图片上传；
                hederTitle.text("图片上传");
                break;
            case "mini-hidden"://隐藏域；
                hederTitle.text("隐藏域");
                break;
            case "mini-buttonedit"://编辑按钮；
                hederTitle.text("编辑按钮");
                break;
            case "rx-grid"://子表；
                hederTitle.text("子表");
                break;
            case "mini-list"://数据列表；
                hederTitle.text("数据列表");
                break;
            case "mini-textboxlist"://文本盒子；
                hederTitle.text("文本盒子");
                break;
            case "mini-checkhilist"://审批历史；
                hederTitle.text("审批历史");
                break;
            case "mini-relatedsolution"://关联流程；
                hederTitle.text("关联流程");
                break;
            case "mini-user"://用户选择；
                hederTitle.text("用户选择");
                break;
            case "mini-group"://用户组选择；
                hederTitle.text("用户组选择");
                break;
            case "mini-dep"://部门选择；
                hederTitle.text("部门选择");
                break;
            case "mini-button"://自定义按钮；
                hederTitle.text("自定义按钮");
                break;
            case "mini-nodeopinion"://审批意见；
                hederTitle.text("审批意见");
                break;
            case "mini-office"://office控件；
                hederTitle.text("office控件");
                break;
            case "mini-iframe"://内窗控件；
                hederTitle.text("内窗控件");
                break;
            case "mini-viewword"://word模板；
                hederTitle.text("word模板");
                break;
            case "mini-contextonly"://上下文控件；
                hederTitle.text("上下文控件");
                break;
            case "mini-window"://子表弹窗二列模板；
                hederTitle.text("子表弹窗二列模板");
                break;
            case "rx-signature"://签名；
                hederTitle.text("签名");
                break;

            default:return;
        }
    }
    
    //设置选中样式;
    function  setSelectCss(plugins) {
        var node = templateView.selection.getStart();
        switch (plugins) {
            case "mini-customtable"://表单模板；
                setCss_parent(node);
                break;
            case "mini-area":
                setCss_parent2(node);
                break;
            case "mini-img":
                setCss_parent2(node);
                break;
            case "mini-tabs":
                setCss_parent2(node);
                break;
            case "mini-list":
                setCss_parent2(node);
                break;
            case "rx-grid":
                rx_grid(node);
                break;
            case "mini-window":
                setCss_parent3(node);
                break;
            default:
                setCss_this(node);
        }
    }
    function setCss_this(node) {
        var names = UE.dom.domUtils.hasClass( node, "moduleCheck" );
        if (!names){
            UE.dom.domUtils.addClass( node, "moduleCheck" );//给当前选中的组件加一个名字；
        }
    }
    function setCss_parent(node) {
        var parentHtml = baidu.editor.dom.domUtils.findParentByTagName(node,"div",true);
        var names = UE.dom.domUtils.hasClass( parentHtml, "moduleCheck" );
        if (!names){
            UE.dom.domUtils.addClass( parentHtml, "moduleCheck" );//给当前选中的组件父级div加一个名字；
        }
    }
    function setCss_parent2(node) {
        var parentHtml = node.parentNode;
        var names = UE.dom.domUtils.hasClass( parentHtml, "moduleCheck" );
        if (!names){
            UE.dom.domUtils.addClass( parentHtml, "moduleCheck" );//给当前选中的组件父级div加一个名字；
        }
    }
    function setCss_parent3(node) {
        var parentHtml = node.parentNode.parentNode.parentNode;
        var names = UE.dom.domUtils.hasClass( parentHtml, "moduleCheck" );
        if (!names){
            UE.dom.domUtils.addClass( parentHtml, "moduleCheck" );//给当前选中的组件父级div加一个名字；
        }
    }
    function rx_grid(node) {
        var thisHtml_s = baidu.editor.dom.domUtils.findParents(node);
        for (var i = 0 ;i<thisHtml_s.length;i++){
            var name = thisHtml_s[i].getAttribute("class");
            if (name == null || name == undefined || name == "") continue;
            if (name.indexOf("rx-grid")> -1){
                var thisHtml = thisHtml_s[i];
                break;
            }
        }
        var names = UE.dom.domUtils.hasClass(thisHtml, "moduleCheck" );
        if (!names){
            UE.dom.domUtils.addClass( thisHtml, "moduleCheck" );//给当前选中的组件父级div加一个名字；
        }
    }
});

function changeMinMaxWidth(){
    var mwidth=mini.get('mwidth');
    var wunit=mini.get('wunit');
    if(wunit.getValue()=='%'){
        mwidth.setMinValue(0);
        mwidth.setMaxValue(100);
    }else{
        mwidth.setMinValue(0);
        mwidth.setMaxValue(1200);
    }
    triggerBtn();
}

function changeMinMaxHeight(){
    var mheight=mini.get('mheight');
    var hunit=mini.get('hunit');
    if(hunit.getValue()=='%'){
        mheight.setMinValue(0);
        mheight.setMaxValue(100);
    }else{
        mheight.setMinValue(0);
        mheight.setMaxValue(1200);
    }
    triggerBtn();
}
/*tab容器grid数据回填*/
function setTabGrid(obj) {
    var grid = mini.get("tabGrid");
    var data = obj["headergrids"];
    data = data.replace(new RegExp('&quot;', "g"), "\"");
    grid.setData(mini.decode(data));
}

