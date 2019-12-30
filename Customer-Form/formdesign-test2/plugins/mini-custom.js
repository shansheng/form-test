ParamsJson={is_Template_loaded:false,editor_js_loaded:false,related_Template_loaded:false};

/**
 * 加载模版。
 */
function includeFormTemplate(){
    if(ParamsJson.is_Template_loaded) return;
    var url=__rootPath +"/scripts/customer/template.html";
    var fileContent=$.getFile(url);
    var jqTemplate=$("#formTemplate");
    if(jqTemplate.length==0){
        $("body").append(fileContent);
        ParamsJson.is_Template_loaded=true;
    }
}
var baiduTemplate;
if(typeof(baidu)!="undefined"){
	//设置左分隔符为 <#
	baidu.template.LEFT_DELIMITER='<#';
	//设置右分隔符为 #>
	//设置右分隔符为 #>
	baidu.template.RIGHT_DELIMITER='#>';
	
	baiduTemplate=baidu.template;
}

if (!window.UserControl) window.UserControl = {};


/**
 * 附件控件
 * <div id="file1" name="file1" class="upload-panel" isone="false" sizelimit="50"
 style="width:auto;" isDown="false" isPrint="false" readOnly="true"
 value=''></div>
 获取数据：
 mini.get("file1").getValue();
 设置数据：
 var val=[{"fileId":"1","fileName":"a.doc","totalBytes":22016},{"fileId":"2","fileName":"1.png","totalBytes":130476}];
 mini.get("file1").setValue(val);

 isDown:是否允许下载
 isPrint:是否显示打印
 readOnly:是否只读
 */
UserControl.UploadPanel = function () {
    UserControl.UploadPanel.superclass.constructor.call(this);
    this.initComponents();
    this.bindEvents()
}

mini.extend(UserControl.UploadPanel, mini.Panel, {
    uiCls: 'upload-panel',
    formField:true,
    files:{},
    readOnly:false,
    required:false,
    initComponents: function () {
        //加载模版到页面。
        includeFormTemplate();
        var html="<a name='upload' class='mini-button'>上传</a>" +
            "<a name='clean' class='mini-button' >清空</a>";

        this.clearData();

        this.set({
            showHeader:false,
            showToolbar:true,
            showFooter:false,
            toolbar:html
        });
    },

    bindEvents: function () {
        this.uploadBtn = mini.getByName('upload', this);
        this.cleanBtn = mini.getByName('clean',this);
        var self_ = this;



        this.uploadBtn.on('click', function (e) {
            var gridRow=getGridByEditor(self_);
            _UploadDialogShowFile({
                files:self_.files[self_._id],
                from:'SELF',
                types:self_.fileType,
                single:false,
                onlyOne:self_.isone,
                sizelimit:self_.sizelimit,
                length:self_.length,
                showMgr:false,
                callback:function(files){
                    self_.setUploadFile(files,gridRow);
                }
            });
        });
        this.cleanBtn.on('click', function (e) {
            self_.cleanFile();
        });

    },
    set: function (kv) {
        var value = kv.value;
        delete kv.value;
        UserControl.UploadPanel.superclass.set.call(this,kv);
        if (!mini.isNull(value)) {
            this.setValue(value);
        }
    },
    /**
     * 返回数据。
     */
    getValue: function () {
        var tmp=this.getFiles();
        if(tmp.length==0) return "";
        return mini.encode(tmp);
    },

    /**
     * 转换文件
     */
    convertFile:function(upFile){

        var obj={fileId:upFile.fileId,fileName:upFile.fileName,totalBytes:upFile.totalBytes};
        return obj;
    },
    /**
     * 设置上传文件。
     */
    setUploadFile:function(upFiles,gridRow){
        var tmpfiles=this.getFiles();
        //tmpfiles.length = 0;
        for(var i=0;i<upFiles.length;i++){
            var upFile=upFiles[i];
            var file=this.convertFile(upFile);
            var fileName=file.fileName;
            if(!this.isFileExist(fileName)){
                tmpfiles.push(file);
            }
        }
        //在子表中的修复。
        if(gridRow){
            var grid=gridRow.grid;
            var row=gridRow.row;
            var obj={};
            obj[this.name]=this.getValue();
            grid.updateRow(row,obj);
        }


        this.displayFile();
    },


    /**
     * 显示文件。
     */
    displayFile:function(){

        this.getBodyEl().innerHTML="";
        var html=this.getHtmls();
        this.set({
            body:html
        });
        this.bindRemove();


    },
    /**
     * 处理单个文件删除。
     */
    bindRemove:function(){
        var parent=$(this.el);
        var buttons=$(".removeFile", parent);
        var self_=this;
        for(var i=0;i<buttons.length;i++){
            var btn=$(buttons[i]);
            btn.bind("click",function(e){
                var el=$(e.currentTarget);
                var parentLi=$(e.currentTarget).closest("tr");
                var liId = parentLi.attr("id");
                var fileId=liId.replace("li_","");
                var files=self_.getFiles();
                for(var j=0;j<files.length;j++){
                    if(fileId==files[j].fileId){
                        files.splice(j,1);
                    }
                }
                //加载。
                self_.displayFile();
            })

        }
    },
    /**
     * 判断文件是否存在。
     */
    isFileExist:function(fileName){
        var tmpfiles=this.getFiles();
        for(var j=0;j<tmpfiles.length;j++){
            if(fileName==tmpfiles[j].fileName){
                return true;
            }
        }
        return false;
    },
    /**
     * 清除数据。
     */
    clearData:function(){
        this.files[this.uid]=[];
    },
    /**
     * 设置数据。
     */
    setData:function(val){
        this.files[this.uid]=val;
    },
    /**
     * 获取这个控件的数据。
     */
    getFiles:function(){
        var tmp=this.files[this.uid];
        return tmp;
    },
    /**
     * 清除文件
     */
    cleanFile:function(){
        this.clearData();
        var body=this.getBodyEl();
        body.innerHTML="";
    },
    /**
     * 返回HTML
     */
    getHtmls:function(){
        var tmpfiles=this.getFiles();
        if(!tmpfiles || tmpfiles.length==0) return "";
        var write=!this.readOnly;
        var data={"list":tmpfiles,isDown:this.isDown,isPrint:this.isPrint,
            ctxPath:__rootPath,write:write,enableOpenOffice:_enable_openOffice};
        var html=baiduTemplate('uploadFile',data);
        return html;
    },
    setIsDown: function (value) {
        this.isDown=value;
    },
    setIsPrint: function (value) {
        this.isPrint=value;
    },
    setIsone: function (value) {
        this.isone=value;
    },
    setSizelimit:function (value) {
        this.sizelimit=value;
    },
    setFileType:function (value) {
        this.fileType=value;
    },
    /**
     * 是否只读。
     */
    setReadOnly: function (value) {
        this.readOnly=value;
        if(!value) return;
        this.displayFile();

        this.set({
            showHeader:false,
            showFooter:false,
            showToolbar:false,
            toolbar:""
        })
    },
    /**
     * 设置数据。
     */
    setValue:function(val){
        if(!val) val="[]";
        if((typeof val)=="string"){
            this.setData(mini.decode(val));
        }
        else{
            this.setData(val);
        }
        this.displayFile();
    },
    getAttrs: function (el) {
        var attrs = UserControl.UploadPanel.superclass.getAttrs.call(this, el);
        mini._ParseBool(el, attrs,
            ["isPrint","isDown","readOnly","isone"]
        );
        mini._ParseString(el, attrs,
            ["sizelimit","fileType","value","length"]
        );
        return attrs;
    }
});

mini.regClass(UserControl.UploadPanel, "uploadPanelControl");


/**
 * 用户选择控件。
 * <input id="file1" name="file1" class="mini-user"
 *       style="width:auto;"  readOnly="true" single="true"
 *  value='' />
 *
 *  属性：
 *  single ：是否单选
 *
 */
UserControl.MiniUser = function () {

    UserControl.MiniUser.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MiniUser, mini.ButtonEdit, {
    uiCls: 'mini-user',

    single: true,
    initComponents: function () {
        this.setShowClose(true);
        var el=this.getEl();
        el.className="mini-buttonedit icon-user-button";
    },
    bindEvents: function () {
        this.on('buttonclick', _UserButtonClick);
        this.on('valuechanged', function(e){
            var btn=e.sender;
            var value =btn.value;
            var maxLength = btn.maxLength;
            if(value && maxLength && value.length>maxLength){
                btn.setIsValid(false);
                btn.setText("");
                btn.setValue("");
                mini.alert("所选用户值长度【"+value.length+"】大于控件长度【"+maxLength+"】");
            }
        });
        this.on("closeclick",_ClearButtonEdit );
    },
    setSingle: function (value) {
        this.single=value;
    },
    setRefconfig: function (value) {
        this.refconfig=value;
    },
    getAttrs: function (el) {
        var attrs = UserControl.MiniUser.superclass.getAttrs.call(this, el);
        mini._ParseBool(el, attrs,["single"]);
        mini._ParseString(el, attrs,["refconfig","dimid","dimname","dimlevel","orgconfig","groupid"]);
        return attrs;
    }
});



mini.regClass(UserControl.MiniUser, "userControl");




/**
 * 用户控件选择按钮点击事件
 *
 * @param e
 */
function _UserButtonClick(e){
    var userSel=e.sender;
    var single=userSel.single;
    var name=userSel.name;
    var text_name=name +"_name";
    var refconfig = userSel.refconfig;
    var dimid = userSel.dimid;
    var dimname = userSel.dimname;
    var dimlevel = userSel.dimlevel;
    var orgconfig = userSel.orgconfig;
    var orgid = userSel.groupid;
    var orgname = userSel.orgname;
    var initDim = userSel.initDim;
    var initRankLevel = userSel.initRankLevel;
    var ids=userSel.getValue();
    var names=userSel.getText();

    var aryUser=[];
    if(ids){
        var aryIds=ids.split(",");
        var aryNames=names.split(",");

        for(var i=0;i<aryIds.length;i++){
            var userObj={};
            userObj.userId=aryIds[i];
            userObj.fullname=aryNames[i];
            aryUser.push(userObj);
        }
    }

    var gridRow=getGridByEditor(userSel);

    var flag=single || single=="true"?true:false;
    var showDimId = true;
    var conf={single:flag,users:aryUser,callback:function(data){
            var val="";
            var text="";
            if(flag){
                val=data.userId;
                text=data.fullname;
            }else{
                var uIds=[];
                var uNames=[];
                for(var i=0;i<data.length;i++){
                    uIds.push(data[i].userId);
                    uNames.push(data[i].fullname);
                }
                val=uIds.join(",");
                text=uNames.join(",");
            }
            userSel.setValue(val);
            userSel.setText(text);
            userSel.doValueChanged();
            if(gridRow){
                var grid=gridRow.grid;
                var obj={};
                obj[name]=val;
                obj[text_name]=text;
                //grid.updateRow ( gridRow.row, obj );
                //更新行
                updateRowExt(grid,gridRow.row,obj);
            }
        }};
    if(refconfig || orgconfig || initDim){
        conf.refconfig = refconfig;
        conf.orgconfig = orgconfig;
        if(conf.refconfig=="level"){
            var level = mini.getByName(dimlevel);
            if(level){
                conf.instlevel = level.getValue();
            }
        }
        conf.instid = dimid;
        conf.instname = dimname;
        conf.orgid = orgid;
        conf.orgname = orgname;
        conf.initDim = initDim;
        conf.initRankLevel = initRankLevel;
        showDimId = false;
    }
    conf.showDimId=showDimId;

    _UserDialog(conf);
}

/**
 * 用户组选择控件。
 * <div id="group" name="group" class="mini-group"
 style="width:auto;" single="true" showDim="true" ></div>
 single:是否为单选
 showDim: 是否显示维度。
 dimId: 维度ID
 */
UserControl.MiniGroup = function () {
    UserControl.MiniGroup.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MiniGroup, mini.ButtonEdit, {
    uiCls: 'mini-group',
    single: true,
    initComponents: function () {
        this.setShowClose(true);
        var el=this.getEl();
        //el.className="mini-buttonedit icon-group-button";
    },
    showDim:false,
    dimId:"",
    bindEvents: function () {
        this.on('buttonclick', _GroupButtonClick);
        this.on('valuechanged', function(e){
            var btn=e.sender;
            var value =btn.value;
            var maxLength = btn.maxLength;
            if(value && maxLength && value.length>maxLength){
                btn.setIsValid(false);
                btn.setText("");
                btn.setValue("");
                mini.alert("所选用户组值长度【"+value.length+"】大于控件长度【"+maxLength+"】");
            }
        });
        this.on("closeclick",_ClearButtonEdit);
    },
    setSingle: function (value) {
        this.single=value;
    },
    setShowDim:function(val){
        this.showDim=val;
    },
    getShowDim:function(){
        return this.showDim;
    },
    setDimId:function(val){
        this.dimId=val;
    },
    getAttrs: function (el) {
        var attrs = UserControl.MiniGroup.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,["dimId"]);
        mini._ParseBool(el, attrs, ["single","showDim"]);
        return attrs;
    }
});

mini.regClass(UserControl.MiniGroup, "groupControl");


/**
 * 下拉框
 */
UserControl.MiniCombobox=function () {
    UserControl.MiniCombobox.superclass.constructor.call(this);
    this.bindEvents();
}

mini.extend(UserControl.MiniCombobox, mini.ComboBox,{
    uiCls: 'mini-rxcombobox',
    bindEvents: function () {
        this.on('beforeshowpopup', function(e){
            var btn=e.sender;
            if(btn.sql && btn.sql.customQueryCombobox){
                var self=this;
                self.handMainQueryToSql(e.source);
            }
        });
    },
    handMainQueryToSql:function(ctl){
        var customQuerys=ctl.sql.customQueryCombobox;
        /**没有父节点
         * 1、如果所有参数绑定类型都是脚本，则马上执行查询
         * 2、如果不是所有参数的绑定类型是脚本，这设置为值改变时执行
         */
            //参数
        var gridInputs=customQuerys.gridInput;

        //参数分类
        var mappingParams=[];
        var mappingParamsObj={};
        var scriptParams=[];
        for(var j=0;j<gridInputs.length;j++){
            var gridInput =gridInputs[j];
            if("mapping" ==gridInput.mode){
                var gridName =gridInput.bindVal.split("_name")[0];
                if(mappingParams.length==0 || mappingParams.indexOf(gridName)==-1){
                    mappingParams.push(gridInput.bindVal);
                    var gredNameList =[];
                    gredNameList.push(gridInput);
                    mappingParamsObj[gridName]=gredNameList;
                }else {
                    var gredNameList =[];
                    for(var key in mappingParamsObj){
                        if(gridName ==key){
                            gredNameList=mappingParamsObj[key];
                            break;
                        }
                    }
                    gredNameList.push(gridInput);
                    mappingParamsObj[gridName]=gredNameList;
                }
            }else {
                scriptParams.push(gridInput);
            }
        }
        this.executeQueryToSql(customQuerys,mappingParamsObj,scriptParams,ctl);
    },
    /**
     * 执行自定义查询。
     */
    executeQueryToSql:function(query,mappingParamsObj,scriptParams,ctl){
        var customQuery=query.customquery;
        //构建输入参数
        var params={};
        var table=query.table;
        for(var i=0;i<scriptParams.length;i++){
            var input=scriptParams[i];
            var name=input.name;
            var bindVal=input.bindVal;
            var func = new Function(bindVal);
            var val=func();
            params[name]=val;
        }
        for(var key in mappingParamsObj){
            var inputList=mappingParamsObj[key];
            for(var j=0;j<inputList.length;j++){
                var input=inputList[j];
                var mode=input.mode;
                var name=input.name;
                var bindVal=input.bindVal;

                if(bindVal.indexOf("_name")>-1){
                    var bindValName =bindVal.split("_name")[0];
                    var val=mini.getByName(bindValName).getText();
                    params[name]=val;
                }else {
                    var val=mini.getByName(bindVal).getValue();
                    params[name]=val;
                }
            }
        }
        var self=this;
        //执行自定义查询
        doQuery(customQuery, params,function(data){
            var aryData=data.data;
            if(table=="main"){
                var obj={};
                if(aryData.length>0){
                    obj=aryData[0];
                };
                ctl.setData(aryData);
            }
        })
    },
    getAttrs: function (el) {
        var attrs = UserControl.MiniCombobox.superclass.getAttrs.call(this, el);
        return attrs;
    }
});
mini.regClass(UserControl.MiniCombobox, "combobox");

/**
 * 用户组选择按钮点击事件
 *
 * @param e
 */
function _GroupButtonClick(e){
    var groupSel=e.sender;
    var single=groupSel.single;

    var gridRow=getGridByEditor(groupSel);
    var name=groupSel.name;
    var text_name=name +"_name";

    var showDim=groupSel.showDim;

    var dimId=groupSel.dimId;
    var callback=function(groups){
        var val="";
        var text="";
        if(single ){
            val=groups.groupId;
            text=groups.name;
        }else{
            var uIds=[];
            var uNames=[];
            for(var i=0;i<groups.length;i++){
                uIds.push(groups[i].groupId);
                uNames.push(groups[i].name);
            }
            val=uIds.join(",");
            text=uNames.join(",");
        }
        groupSel.setValue(val);
        groupSel.setText(text);
        groupSel.doValueChanged();
        if(gridRow){
            var grid=gridRow.grid;
            var obj={};
            obj[name]=val;
            obj[text_name]=text;
            //更新行
            updateRowExt(grid,gridRow.row,obj);
        }
    };

    if(showDim){
        _GroupDlg(single,callback);
    }else{
        _GroupSingleDim(single,dimId,callback);
    }
}

/**
 * 部门选择控件。
 * <div id="group" name="group" class="mini-dep"
 style="width:auto;" single="true" ></div>
 single:是否为单选按钮。

 */
UserControl.MiniDepartMent = function () {

    UserControl.MiniDepartMent.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MiniDepartMent, mini.ButtonEdit, {
    uiCls: 'mini-dep',
    single: true,
    initComponents: function () {
        this.setShowClose(true);
        var el=this.getEl();
        el.className="mini-buttonedit icon-dep-button";
    },
    bindEvents: function () {
        this.on('buttonclick', _DepButtonClick);
        this.on('valuechanged', function(e){
            var btn=e.sender;
            var value =btn.value;
            var maxLength = btn.maxLength;
            if(value && maxLength && value.length>maxLength){
                btn.setIsValid(false);
                btn.setText("");
                btn.setValue("");
                mini.alert("所选部门值长度【"+value.length+"】大于控件长度【"+maxLength+"】");
            }
        });
        this.on("closeclick",_ClearButtonEdit);
    },
    setSingle: function (value) {
        this.single=value;
    },

    getAttrs: function (el) {
        var attrs = UserControl.MiniDepartMent.superclass.getAttrs.call(this, el);
        mini._ParseBool(el, attrs, ["single"]);
        return attrs;
    }
});

mini.regClass(UserControl.MiniDepartMent, "depControl");

/**
 * 部门按钮的点击事件
 *
 * @param e
 */
function _DepButtonClick(e){
    var depSel=e.sender;
    var single=depSel.single;
    var config=depSel.config || {};

    var gridRow=getGridByEditor(depSel);
    var name=depSel.name;
    var text_name=name +"_name";

    var callback=function(rtn){
        var val="";
        var text="";
        if(single){
            val=rtn.groupId;
            text=rtn.name;
        }else{
            var uIds=[];
            var uNames=[];
            for(var i=0;i<rtn.length;i++){
                uIds.push(rtn[i].groupId);
                uNames.push(rtn[i].name);
            }
            val=uIds.join(",");
            text=uNames.join(",");
        }
        depSel.setValue(val);
        depSel.setText(text);
        depSel.doValueChanged();
        if(gridRow){
            var grid=gridRow.grid;
            var obj={};
            obj[name]=val;
            obj[text_name]=text;
            grid.updateRow ( gridRow.row, obj );
        }

    };
    //回调。
    config.callback=callback;
    config.single=single;

    var groups=[];
    var ids=depSel.getValue();
    var names=depSel.getText();
    if(ids){
        var aryIds=ids.split(",");
        var aryNames=names.split(",");
        for(var i=0;i<aryIds.length;i++){
            var o={};
            o.groupId=aryIds[i];
            o.name=aryNames[i];
            groups.push(o);
        }
    }
    config.groups=groups;


    _DepDialog(config);
}

/**
 * 富文本框。
 * <div id="group" name="group" class="mini-ueditor"
 *       style="width:auto;" readOnly="true" >初始值设置</div>
 * 属性：
 * readOnly：是否只读
 *
 */
UserControl.MiniUEditor = function () {

    UserControl.MiniUEditor.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MiniUEditor, mini.Panel, {
    uiCls: 'mini-ueditor',
    formField:true,
    editor:null,
    readOnly:false,
    value:"",
    initComponents: function () {
        var el=this.getEl();
        var body=this.getBodyEl();
        body.id=this.uid +"_body";
        this.set({
            showHeader:false,
            showToolbar:false,
            showFooter:false
        });

        //加载UEDITOR.JS。
        if(!ParamsJson.editor_js_loaded){
            var aryUrl=[
                __rootPath+"/scripts/ueditor/ueditor-form.config.js" ,
                __rootPath+"/scripts/ueditor/ueditor.all.min.js",
                __rootPath+"/scripts/ueditor/lang/zh-cn/zh-cn.js" ];
            $.getScripts({urls: aryUrl });
            ParamsJson.editor_js_loaded=true;
        }
        this.loadEditor();
    },
    /**
     * 加载编辑器。
     */
    loadEditor:function(){
        var id=this.uid +"_body";
        var self=this;




        setTimeout(function(){

            var bodyEl=self.getBodyEl();

            var val=bodyEl.innerHTML;
            if(self.readOnly){
                var height=22;
                $("#" + id).html(val);
                var ary=$(self.getBodyEl()).children();
                for(var i=0;i<ary.length;i++){
                    height+=$(ary[i]).height();
                }
                $("#" + id).parents(".mini-ueditor").attr("style","height:"+height+"px;");
            }
            else{
                var bodyEl=self.getBodyEl();
                var	parent=$(bodyEl).closest(".mini-panel");


                var width=parent.width();
                var height=parent.height();
                var val=bodyEl.innerHTML;

                $(".mini-ueditor").parent('td').addClass('mini-ueditor-td');

                var	td=$(bodyEl).closest(".mini-ueditor-td");
                if(td.attr("width")){
                    width=td.attr("width");
                }
                $(bodyEl).css("overflow","hidden");
                bodyEl.innerHTML="";
                self.editor= UE.getEditor(id);
                self.editor.addListener("ready", function () {

                    if(self.value){
                        val=self.value;
                    }

                    //调整编辑器高度
                    var editor=$(".edui-editor",parent);
                    var toolBar=$(".edui-editor-toolbarbox",parent);
                    var iframe=$(".edui-editor-iframeholder",parent);
                    var toolBarHeight= 70;

                    editor.width(width-8);
                    editor.height(height - 6);
                    iframe.width(width-8);
                    iframe.height(height-toolBarHeight-70);
                    self.editor.setContent(val);
                });
            }

            self.doLayout();
        },200);
    },

    setReadOnly:function(val){
        this.readOnly=val;
    },
    setValue:function(val){
        this.value=val;
    },
    getValue:function(){
        if(!this.readOnly){
            this.value= this.editor.getContent();
        }
        return this.value;
    },

    bindEvents: function () {
    },
    getAttrs: function (el) {
        var attrs = UserControl.MiniUEditor.superclass.getAttrs.call(this, el);
        mini._ParseBool(el, attrs,["readOnly"]);
        return attrs;
    }

});

mini.regClass(UserControl.MiniUEditor, "mini-editor");

/**
 * 图片控件。
 * <div id="group" name="group" class="mini-img"   style="width:auto;" value="图片ID" >初始值设置</div>
 * 属性：
 * value：{imgtype:'upload',val:""}
 *    imgtype:
 *    upload: 上传
 *    url:直接填写URL
 * readOnly： 只读
 */
UserControl.MiniImg = function () {

    UserControl.MiniImg.superclass.constructor.call(this);

    this.initComponents();
}

mini.extend(UserControl.MiniImg, mini.Panel, {
    uiCls: 'mini-img',
    formField:true,
    readOnly:false,
    imgtype:"upload",
    files:{},
    value:"",
    initComponents: function () {
        //加载模版到页面。
        includeFormTemplate();
        var html="<a name='upload' class='mini-button'>上传</a>" +
            "<a name='clean' class='mini-button'>清空</a>";

        this.clearData();
        this.set({
            showHeader:false,
            showToolbar:true,
            showFooter:false,
            width:"100%",
            minWidth:"600px"
        });
    },

    bindEvents: function () {
        var self_ = this;
        /*if(self_.isone){

        }else {
        }*/

        this.uploadBtn = mini.getByName('upload', this);
        this.cleanBtn = mini.getByName('clean',this);

        this.uploadBtn.on('click', function (e) {
            var gridRow=getGridByEditor(self_);
            var isone =false;
            var height=600;
            if(self_.isone){
                isone =true;
                height=200;
            }
            if(self_.imgtype=="url"){
                var tmpfiles=self_.getFiles();
                if(isone && tmpfiles.length>0){
                    mini.alert("单一图片控件，只允许设置一个url!");
                    return
                }
                _OpenWindow({
                    url:__rootPath+'/scripts/ueditor/dialogs/custom/imgurl.jsp?isone='+isone,
                    height:height,
                    width:500,
                    title:"填写图片路径",
                    ondestroy:function(action){
                        if(action!='ok')return;
                        var iframe = this.getIFrameEl();
                        //获取选中、编辑的结果
                        var urls = iframe.contentWindow.getUrl();
                        if(isone && urls){
                            self_.setImgUrl(urls);
                            return;
                        }
                        if(!isone && urls && urls.length>0){
                            self_.setImgUrls(urls);
                            return;
                        }
                    }
                });
            }else{
                _UploadDialogShowFile({
                    files:self_.files[self_.id],
                    from:'SELF',
                    types:self_.fileType,
                    single:isone,
                    onlyOne:self_.isone,
                    sizelimit:self_.sizelimit,
                    length:self_.length,
                    showMgr:false,
                    callback:function(files){
                        self_.setUploadFile(files,gridRow);
                    }
                });
            }
        });
        this.cleanBtn.on('click', function (e) {
            self_.cleanFile();
        });
    },
    setImgUrl:function(url){
        if(this.urlNum){
            this.urlNum++;
        }else {
            this.urlNum=1;
        }
        if(url.indexOf("thumb=true&")>-1){
            url =url.replace("thumb=true&","");
        }
        var file ={
            fileId:this.urlNum,
            fileName:url,
            url:url,
            type:"url"
        }
        var tmpfiles=this.getFiles();

        var fileName=file.fileName;
        if(!this.isFileExist(fileName)){
            tmpfiles.push(file);
        }
        this.displayFile();
    },
    setImgUrls:function(urls){
        for(var i=0;i<urls.length;i++){
            var url =urls[i];
            if(this.urlNum){
                this.urlNum++;
            }else {
                this.urlNum=1;
            }
            if(url.indexOf("thumb=true&")>-1){
                url =url.replace("thumb=true&","");
            }
            var file ={
                fileId:this.urlNum,
                fileName:url,
                url:url,
                type:"url"
            }
            var tmpfiles=this.getFiles();

            var fileName=file.fileName;
            if(!this.isFileExist(fileName)){
                tmpfiles.push(file);
            }
        }
        this.displayFile();
    },
    showBigImg:function(showData){
        var url=__rootPath+'/scripts/customer/imgShow.jsp';
        _OpenWindow({
            iconCls:'icon-group-dialog',
            url:url,
            height:600,
            width:1000,
            title:"图片预览",
            onload:function(){
                var iframe = this.getIFrameEl().contentWindow;
                iframe.setdata(showData);
            }
        });
    },
    set: function (kv) {
        var value = kv.value;
        delete kv.value;
        UserControl.UploadPanel.superclass.set.call(this,kv);
        if (!mini.isNull(value)) {
            this.setValue(value);
        }
    },
    setImgtype:function(val){
        if(val=="url"){
            var body=this.getBodyEl();
            var bodyContainer=$(body);
            var showBigPic=$(".showBigPic",bodyContainer);
            showBigPic.remove();
        }
        this.imgtype=val;
    },
    /**
     * 返回数据。
     */
    getValue: function () {
        var tmp=this.getFiles();
        if(tmp.length==0) return "";
        return mini.encode(tmp);
    },

    /**
     * 转换文件
     */
    convertFile:function(upFile){

        var obj={fileId:upFile.fileId,fileName:upFile.fileName,totalBytes:upFile.totalBytes};
        return obj;
    },
    /**
     * 设置上传文件。
     */
    setUploadFile:function(upFiles,gridRow){
        var tmpfiles=this.getFiles();
        for(var i=0;i<upFiles.length;i++){
            var upFile=upFiles[i];
            var file=this.convertFile(upFile);
            var fileName=file.fileName;
            if(!this.isFileExist(fileName)){
                tmpfiles.push(file);
            }
        }
        //在子表中的修复。
        if(gridRow){
            var grid=gridRow.grid;
            var row=gridRow.row;
            var obj={};
            obj[this.name]=this.getValue();
            grid.updateRow(row,obj);
        }

        this.displayFile();
    },

    /**
     * 显示文件。
     */
    displayFile:function(){
        this.getBodyEl().innerHTML="";
        var htmlObj =this.getHtmls();
        var html=htmlObj.html;
        this.set({
            body:html
        });
        /*this.vieviwImg(htmlObj.imgListId);*/
        this.bindRemove();
    },
    /**
     * 处理图片轮播
     */
    vieviwImg:function (imgListId) {
        var selectImgBox =$('#selectImgBox');
        var tmpfiles=this.getFiles();
        if(this.imgtype=="url"){
            for(var i=0;i<tmpfiles.length;i++){
                var imgUrl =tmpfiles[i].url;
                var imgId =tmpfiles[i].fileId;
                if(imgUrl.startWith("http")){
                    var imgObj =$('<img  id="'+imgId+'" src="'+imgUrl+'" alt="">');
                    selectImgBox.append(imgObj);
                }else{
                    var imgObj =$('<img  id="'+imgId+'" src="'+__rootPath+imgUrl+'" alt="">');
                    selectImgBox.append(imgObj);
                }
            }
        }else {
            for(var i=0;i<tmpfiles.length;i++){
                var imgObj =$('<img id="'+tmpfiles[i].fileId+'" src="'+__rootPath+'/sys/core/file/previewImage.do?fileId='+tmpfiles[i].fileId+'" alt="">');
                selectImgBox.append(imgObj);
            }
        }
        //第一个;
        $(".selectImgBox").selectimg({imgID:0,readOnly:this.readOnly});
    },
    /**
     * 处理单个文件删除。
     */
    bindRemove:function(){
        var parent=$(this.el);
        var btnLookPicBtns =$(".btnLookPic", parent);
        var self_=this;
        //打开预览
        for(var i=0;i<btnLookPicBtns.length;i++){
            var btn=$(btnLookPicBtns[i]);
            btn.bind('click',function(e){
                var url=__rootPath+'/scripts/customer/swipers/swipers.jsp?readOnly='+self_.readOnly;
                _OpenWindow({
                    iconCls:'icon-group-dialog',
                    url:url,
                    height:600,
                    width:726,
                    title:"图片预览",
                    onload:function(){
                        var iframe = this.getIFrameEl().contentWindow;
                        var showData={
                            type:"file",
                            fileIds:[]
                        };
                        var tmpfiles=self_.getFiles();

                        if(self_.imgtype=="url"){
                            showData.type="url"
                        }
                        showData.fileIds=tmpfiles;
                        iframe.setdata(showData);
                    },
                    ondestroy:function(action) {
                        var iframe = this.getIFrameEl();
                        var showData = iframe.contentWindow.getDatas();
                        self_.clearData();

                        var fileList =showData.fileIds;
                        if(fileList && fileList.length>0){
                            var tmpfiles=self_.getFiles();
                            for(var i=0;i<fileList.length;i++){
                                tmpfiles.push(fileList[i]);
                            }
                        }
                        self_.displayFile();
                    }
                });
            });
        }
    },
    getImgUrlByFileId:function(fileId){
        var tmpfiles=this.getFiles();
        for(var j=0;j<tmpfiles.length;j++){
            if(fileId==tmpfiles[j].fileId){
                return tmpfiles[j].url;
            }
        }
        return "";
    },
    /**
     * 判断文件是否存在。
     */
    isFileExist:function(fileName){
        var tmpfiles=this.getFiles();
        for(var j=0;j<tmpfiles.length;j++){
            if(fileName==tmpfiles[j].fileName){
                return true;
            }
        }
        return false;
    },
    /**
     * 清除数据。
     */
    clearData:function(){
        this.files[this.uid]=[];
    },
    /**
     * 设置数据。
     */
    setData:function(val){
        this.files[this.uid]=val;
    },
    /**
     * 获取这个控件的数据。
     */
    getFiles:function(){
        var tmp=this.files[this.uid];
        return tmp;
    },
    /**
     * 清除文件
     */
    cleanFile:function(){
        this.clearData();
        var body=this.getBodyEl();
        body.innerHTML="";
    },
    /**
     * 返回HTML
     */
    getHtmls:function(){
        var tmpfiles=this.getFiles();
        if(!tmpfiles || tmpfiles.length==0) return "";
        var fileObj =tmpfiles[0];

        var showUrl ="";
        if(this.imgtype=="url"){
            var imgUrl =fileObj.url;
            var imgId =fileObj.fileId;
            if(imgUrl.startWith("http")){
                showUrl=imgUrl;
            }else{
                showUrl=__rootPath+imgUrl;
            }
        }else {
            showUrl=__rootPath+'/sys/core/file/previewImage.do?fileId='+fileObj.fileId;
        }
        var showHtml ='<div class="imgBoxs">' +
            '<div class="imgHeaderText">共<span style="color: red;">'+tmpfiles.length+'</span>张图片<span class="btnLookPic">&lt;查看所有图片&gt;</span></div>' +
            '<img style="max-width: 160px;max-height: 120px;" src="'+showUrl+'" alt="">' +
            '</div> ';
        var htmlObj ={
            html:showHtml,
            imgListId:"selectImgBox"
        }
        return htmlObj;
    },

    setIsDown: function (value) {
        this.isDown=value;
    },
    setIsPrint: function (value) {
        this.isPrint=value;
    },
    setIsone: function (value) {
        this.isone=value;
    },
    setImgstype: function (value) {
        this.imgsType=value;
    },
    setSizelimit:function (value) {
        this.sizelimit=value;
    },
    setFileType:function (value) {
        this.fileType=value;
    },
    /**
     * 是否只读。
     */
    setReadOnly: function (value) {
        this.readOnly=value;
        if(!value) return;
        this.displayFile();

        this.set({
            showHeader:false,
            showFooter:false,
            showToolbar:false,
            toolbar:""
        })
    },
    /**
     * 设置数据。
     */
    setValue:function(val){
        if(!val) val="[]";
        if((typeof val)=="string"){
            this.setData(mini.decode(val));
        }
        else{
            this.setData(val);
        }
        this.displayFile();
    },
    getAttrs: function (el) {
        var attrs = UserControl.UploadPanel.superclass.getAttrs.call(this, el);
        mini._ParseBool(el, attrs,
            ["isPrint","isDown","readOnly","isone"]
        );
        mini._ParseString(el, attrs,
            ["sizelimit","fileType","value","imgtype","imgsType"]
        );
        this.setImgtype(this.imgsType);

        this.set({
            isone:attrs.isone,
            imgtype:attrs.imgtype,
            imgsType:attrs.imgsType
        });
        var html="<a name='upload' class='mini-button' iconCls='icon-upload' >上传</a>" +
            "<a name='clean' class='mini-button' iconCls='icon-clear' >清空</a>";
        this.set({
            toolbar:html
        });
        this.bindEvents();
        return attrs;
    }
});

mini.regClass(UserControl.MiniImg, "imgControl");


/**
 * 月份控件。
 */
UserControl.MiniMonth = function () {

    UserControl.MiniMonth.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MiniMonth, mini.MonthPicker, {
    uiCls: 'mini-month',
    initComponents: function () {
    },
    bindEvents: function () {

    }

});

mini.regClass(UserControl.MiniMonth, "monthControl");


/**
 * 时间控件
 */
UserControl.MiniTime = function () {

    UserControl.MiniTime.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MiniTime, mini.TimeSpinner, {
    uiCls: 'mini-time',
    initComponents: function () {
    },
    bindEvents: function () {
    }

});

mini.regClass(UserControl.MiniTime, "timeControl");


UserControl.MiniForm = function () {

    UserControl.MiniForm.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MiniForm, mini.Panel, {
    uiCls: 'mini-form',
    formField:true,
    value:"",
    initComponents: function () {
    },
    bindEvents: function () {
    },
    getValue:function(){
        var body=this.getBodyEl();
        var obj={};
        $("input",$(body)).each(function(){
            var o=$(this);
            obj[o.attr("name")]=o.val();
        })
        return JSON.stringify(obj);
    },
    setValue:function(val){
        if(!val) return;
        this.value=val;
    }


});

mini.regClass(UserControl.MiniForm, "formControl");


/**
 * <input name="solution" class="mini-relatedsolution"
 * plugins="mini-relatedsolution" label="solution" solutionname="一个流程"
 * solution="2400000012319374" chooseitem="single" mwidth="0" wunit="px" mheight="0" hunit="%" style=""/>
 */
UserControl.MiniRelatedSolution = function () {

    UserControl.MiniRelatedSolution.superclass.constructor.call(this);
    this.initComponents();
    this.bindEvents();
}



mini.extend(UserControl.MiniRelatedSolution, mini.Panel, {
    uiCls: 'mini-relatedsolution',
    formField:true,
    files:{},
    readOnly:false,
    required:false,
    initComponents: function () {
        //加载模版到页面。
        //if(ParamsJson.related_Template_loaded) return;
        var url=__rootPath +"/scripts/customer/relatedSolutionPanelTemplate.html";
        var fileContent=$.getFile(url);
        var jqTemplate=$("#relatedSolutionTemplate");
        if(jqTemplate.length==0){
            $("body").append(fileContent);
            ParamsJson.related_Template_loaded=true;
        }

        var html="<a name='relatedInstance' class='mini-button'  >选择实例</a>" +
            "<a name='clean' class='mini-button'  >清空</a>";

        this.clearData();

        this.set({
            showHeader:false,
            showToolbar:true,
            showFooter:false,
            toolbar:html
        });
    },

    bindEvents: function () {
        this.relatedInstanceBtn = mini.getByName('relatedInstance', this);
        this.cleanBtn = mini.getByName('clean',this);
        var that = this;

        this.relatedInstanceBtn.on('click', function (e) {
            _RelatedSolutionButtonClick(that,{callback:function(insts){
                    that.setInstance(insts);
                }});
        });
        this.cleanBtn.on('click', function (e) {
            that.cleanInst();
        });

    },
    /**
     * 返回数据。
     */
    getValue: function () {
        var tmp=this.getInsts();
        if(tmp.length==0) return "";
        return mini.encode(tmp);
    },

    /**
     * 转换成实例对象
     */
    convertInstance:function(inst){

        var obj={instId:inst.instId,subject:inst.subject};
        return obj;
    },
    /**
     * 设置实例。
     */
    setInstance:function(upFiles){
        var tmpfiles=this.getInsts();
        for(var i=0;i<upFiles.length;i++){
            var upFile=upFiles[i];
            var file=this.convertInstance(upFile);
            var subject=file.subject;
            if(!this.isInstExist(subject )){
                tmpfiles.push(file);
            }
        }
        this.displayInst();
    },


    /**
     * 显示实例。
     */
    displayInst:function(){
        this.getBodyEl().innerHTML="";
        var html=this.getHtmls();
        this.set({
            body:html
        });
        this.bindRemove();


    },
    /**
     * 处理单个实例删除。
     */
    bindRemove:function(){
        var buttons=mini.getsbyName("removeInstance", this);
        var self_=this;
        for(var i=0;i<buttons.length;i++){
            var btn=buttons[i];
            btn.on('click', function (e) {
                var btnObj=e.sender;
                var el=btnObj.el;
                var parentLi=$(el).closest("li");
                var instId=parentLi.attr("id").replace("li_","");
                var files=self_.getInsts();
                for(var j=0;j<files.length;j++){
                    if(instId==files[j].instId){
                        files.splice(j,1);
                    }
                }
                //加载。
                self_.displayInst();
            });
        }
    },
    /**
     * 判断实例是否已经选择。
     */
    isInstExist:function(fileName){
        var tmpfiles=this.getInsts();
        for(var j=0;j<tmpfiles.length;j++){
            if(fileName==tmpfiles[j].fileName){
                return true;
            }
        }
        return false;
    },
    /**
     * 清除数据。
     */
    clearData:function(){
        this.files[this.uid]=[];
    },
    /**
     * 设置数据。
     */
    setData:function(val){
        this.files[this.uid]=val;
    },
    /**
     * 获取这个控件的数据。
     */
    getInsts:function(){
        var tmp=this.files[this.uid];
        return tmp;
    },
    setReadOnly: function (value) {
        this.readOnly=value;
        if(!value) return;
        this.displayInst();

        this.set({
            showHeader:false,
            showFooter:false,
            showToolbar:false,
            toolbar:""
        })
    },
    /**
     * 清除所有实例
     */
    cleanInst:function(){
        this.clearData();
        var body=this.getBodyEl();
        body.innerHTML="";
    },
    /**
     * 返回HTML
     */
    getHtmls:function(){
        var tmpfiles=this.getInsts();
        var write=!this.readOnly;

        var data={"list":tmpfiles,ctxPath:__rootPath,write:write};

        var html=baiduTemplate('relatedInstanceScript',data);
        return html;
    },
    /**
     * 设置数据。
     */
    setValue:function(val){
        if(!val) val="[]";
        if((typeof val)=="string"){
            this.setData(mini.decode(val));
        }
        else{
            this.setData(val);
        }
        this.displayInst();
    },
    setSingle: function (value) {
        this.single=value;
    },
    getAttrs: function (el) {
        var attrs = UserControl.MiniRelatedSolution.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,["chooseitem","solution"]);
        return attrs;
    }
});

mini.regClass(UserControl.MiniRelatedSolution, "relatedSolutionControl");



/**
 * office 控件用法：
 * <div class="mini-office"   style="height:600px;width:100%"
 readonly="false" name="office"  value="{type:'docx',id:'2400000001241017'}" ></div>
 * readonly:是否只读
 * value:{type:'docx',id:'文档ID'}
 * version:是否支持版本
 * rights:"newDoc,open,save,print,printSetting,saveMark,noSaveMark,clearMark"
 *
 */

/**
 * 设置选中的office控件。
 */
var _currentOfficeController=null;

if (!window.UserControl) window.UserControl = {};
/**
 * office控件
 */
UserControl.OfficeControl = function () {
    UserControl.OfficeControl.superclass.constructor.call(this);
    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.OfficeControl, mini.Panel, {
    uiCls: 'mini-office',
    formField:true,
    readonly:false,
    doctype:"docx",
    officeId:"",
    officeName:"",
    value: "",
    currentObj:null,
    version:true,
    initComponents: function () {
        this.set({
            showHeader:false,
            showToolbar:false,
            showFooter:false
        });

        this.setHeight(34);
    },
    bindEvents: function () {

    },
    bindHtml:function(){
        var name="office_" + this.name;
        var html="";
        if(!this.readonly){
            html="<input id=\""+name  +"\" class=\"mini-buttonedit icon-office-button\" width='100%' allowInput='false' style='height: 34px;' />";
        }
        else{
            html="<a href='javascript:;' id='"+ name +"' >"+ this.officeName +"</a>";
        }

        this.set({
            body:html
        });
        if(!this.readonly){
            this.currentObj=mini.get(name);
            this.currentObj.setText(this.officeName);
            this.currentObj.setShowClose(true);
            this.currentObj.setValue(this.value);
            this.currentObj.officeCtl=this;

            this.currentObj.on("buttonclick",this.openDoc);
            this.currentObj.on("closeclick",function (e) {
                var btn=e.sender;
                var obj=btn.officeCtl;
                obj.value="";
                obj.officeId="";
                obj.officeName="";
                btn.setText("");
                btn.setValue("");
            });
        }
        else{
            this.currentObj=$("#" +name);
            var self=this;
            this.currentObj.click(function(){
                var conf={};
                if(self.value){
                    var json=JSON.parse(self.value);
                    conf.officeId=json.id;
                    conf.name=json.name;
                    conf.doctype=json.type;
                }
                conf.version=self.version;
                conf.doctype=self.doctype;
                conf.readonly=true;
                openOffice(conf);
            })
        }
    },
    openDoc:function(e){
        var obj=e.sender.officeCtl;

        _currentOfficeController=obj;
        var conf={};
        if(obj.value){
            var json=JSON.parse(obj.value);
            conf.officeId=json.id;
            conf.name=json.name;
            conf.doctype=json.type;
        }
        conf.readonly=false;
        conf.version=obj.version;
        conf.doctype=obj.doctype;

        openOffice(conf);
    },
    setReadonly:function(val){
        this.readonly=val;
    },

    getReadonly:function(){
      return this.readonly;
    },
    setVersion:function(val){
        this.version=val;
    },
    getVersion:function(){
        return this.version;
    },
    updValue:function(val){
        this.setValue(val);
        var name="office_" + this.name;
        if(!this.readonly){
            this.currentObj=mini.get(name);
            this.currentObj.setText(this.officeName);
            this.currentObj.setValue(this.value);
        }
    },
    set:function(kv){
        UserControl.OfficeControl.superclass.set.call(this, kv);
        if(kv.name){
           this.bindHtml();
        }
    },
    setDoctype:function(val){
        this.doctype=val;
    },
    getDoctype:function(){
        return  this.doctype;
    },
    setValue:function(val){
        var json=eval("(" +val +")");
        this.officeId=json.id || "";
        this.doctype=json.type || "docx";
        this.value=val ;
        this.officeName=json.name || "";
    },
    getValue:function(){
        if(!this.officeId) return "";
        return this.value;
    },


    getAttrs: function (el) {
        var attrs = UserControl.OfficeControl.superclass.getAttrs.call(this, el);
        mini._ParseBool(el, attrs,["readonly","version"]);
        mini._ParseString(el, attrs,["value","rights","doctype"]);
        return attrs;
    }
});

mini.regClass(UserControl.OfficeControl, "officeControl");




function openOffice(conf){
    var url= __rootPath +"/scripts/customer/doc.jsp";
    if(conf.officeId){
        url+="?officeId=" + conf.officeId ;
        var readonly=conf.readonly || false;
        url+="&readonly=" + readonly;
        url+="&name=" + encodeURI(conf.name);
    }
    else{
        url+="?tmpid=1";
    }
    var version=conf.version || false;
    url+="&version=" + version;

    var doctype=conf.doctype || "docx";
    url+="&doctype=" + doctype;

    //判断插件是否安装
    var ntkoed=ntkoBrowser.ExtensionInstalled();
    if(ntkoed){
        ntkoBrowser.openWindow(url);
    }else{
        var iTop = ntkoBrowser.NtkoiTop();   //获得窗口的垂直位置;
        var iLeft = ntkoBrowser.NtkoiLeft();        //获得窗口的水平位置;
        window.open(this.url,"","height=200px,width=500px,top="+iTop+"px,left="+iLeft+"px,titlebar=no,toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no");
    }
}


function OnOfficeData_(rtn) {
    var json=JSON.parse(rtn);
    var data=json.data;
    var name=json.name;
    var ary=data.split(",");
    var json=JSON.stringify( {id:ary[0],type:ary[1],name:name});
    _currentOfficeController.updValue(json);
}





/**
 * 打开word。
 */
UserControl.MiniButtonWordPreview = function () {

    UserControl.MiniButtonWordPreview.superclass.constructor.call(this);

    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MiniButtonWordPreview, mini.Button, {
    uiCls: 'mini-viewword',
    alias: "",
    pk:"",
    jsonConfig:"",
    initComponents: function () {
    },
    bindEvents: function () {
        this.on('click', _BtnPreviewWord);
    },
    setJsonConfig:function(value){
        this.jsonConfig=value;
    },
    getJsonConfig:function(){
        return this.jsonConfig;
    },
    setAlias: function (value) {
        this.alias=value;
    },
    setPk: function (value) {
        this.pk=value;
    },
    getPk: function(){
        return this.pk;
    },
    getAttrs: function (el) {
        var attrs = UserControl.MiniButtonWordPreview.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs, ["alias","pk","jsonConfig"]);
        return attrs;
    }
});

mini.regClass(UserControl.MiniButtonWordPreview, "wordControl");

function handPermission(button,cls,control,callback){
	mini.extend(button, control, {
	    uiCls: cls,
	    alias: "",
	    shownoright:true,

	    initComponents: function () {

	    },
	    bindEvents:function(){

	    },
	    setAlias: function (value) {
	        this.alias=value;
	        this.hasPermission();
	    },
	    hasPermission: function () {
	        var url=__rootPath +"/sys/core/public/hasPermsssion.do";
	        var params={alias:this.alias};
	        var self_=this;
	        $.post(url,params,function (result) {
	        	if(!result.success)return;
	        	
	        	callback(self_,result.data);
	        })
	    },
	    getAttrs: function (el) {
	        var attrs = button.superclass.getAttrs.call(this, el);
	        mini._ParseString(el, attrs, ["alias"]);
	        mini._ParseBool(el, attrs,["shownoright"]);
	        return attrs;
	    }
	});
	var ary=cls.split("-");
	cls=ary[0];
	for(var i=1;i<ary.length;i++){
		cls+=ary[i].substring(0,1).toUpperCase() + ary[i].substring(1);
	}
	
	mini.regClass(button, cls);
}

/**
 * 权限按钮。
 * @constructor
 */
UserControl.ButtonPermission = function () {

    UserControl.ButtonPermission.superclass.constructor.call(this);

    this.initComponents();

    this.bindEvents();

}

handPermission(UserControl.ButtonPermission,"btn-permission",mini.Button,function(self_,data){
	if(!data[0].success){
        if(self_.shownoright){
            self_.setEnabled(false);
        }
        else{
            self_.setVisible(false);
        }
    }
});

/**
 * 权限按钮。---菜单按钮
 * @constructor
 */
UserControl.ButtonMenuPermission = function () {

    UserControl.ButtonMenuPermission.superclass.constructor.call(this);

    this.initComponents();

    this.bindEvents();

}

handPermission(UserControl.ButtonMenuPermission,"btn-menu-permission",mini.MenuButton,function(self_,data){
	if(!data[0].success){
        if(self_.shownoright){
            self_.setEnabled(false);
        }
        else{
            self_.setVisible(false);
        }
    }
});

/**
 * 权限按钮。---菜单
 * @constructor
 */
UserControl.MenuPermission = function () {

    UserControl.MenuPermission.superclass.constructor.call(this);

    this.initComponents();

    this.bindEvents();

}

handPermission(UserControl.MenuPermission,"menu-permission",mini.Menu,function(self_,data){
	var items=self_.getItems();
	for(var i=0;i<data.length;i++){
		var obj=data[i];
		if(!obj.success){
        	for(var j=0;j<items.length;j++){
        		if(obj.data==items[j].id){
        			if(self_.shownoright){
        				items[j].setEnabled(false);
                    }
                    else{
                    	items[j].setVisible(false);
                    }
        		}
        	}
        }
	}
});
