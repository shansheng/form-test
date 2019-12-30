/*点击左边组件 给编辑器添加默认控件*/
function defaultModule(moduleName,data) {
    for (var key in data){
        moduleName.setAttribute(key,data[key]);
    }
}
/*点击右边确认按钮给当前选中组件传值*/
function changeModule(thisHtml,data) {
    $.each(data,function(key,value){
        thisHtml.setAttribute(key,data[key]);
    });
    if( data.mwidth == 0 && data.wunit != 0 ){
        var style = "width:initial;height:"+( mheight + hunit );
    }else if( data.mwidth != 0 && data.wunit == 0 ){
        var style = "width:"+( mwidth + wunit )+";height:initial;";
    }else if( data.mwidth == 0 && data.wunit == 0){
        var style = "width:initial;height:initial;";
    }
    else {
        var mwidth = data.mwidth,mheight= data.mheight;
        var wunit = data.wunit,hunit = data.hunit ;
        var style = "width:"+( mwidth + wunit )+";height:"+( mheight + hunit );
    }

    thisHtml.setAttribute("style",style);
}

/*-------------表单模板-----start------*/
function miniCustomtable(plugins,thisTagName,data) {
    var randomNumber = new Date().format("mmss");
    if (thisTagName == "li"){
        var tableDiv = document.createElement("div");
        var table = document.createElement("table");
        var captions = document.createElement("caption")
        var trArr = [];
        for ( var r = 0 ; r<= 4 ; r++){
            var tr = document.createElement("tr");
            for (var i = 0 ;i<4 ;i++) {
                var td = document.createElement("td");
                tr.appendChild(td);
            }
            trArr.push(tr);
        }
        for (var t =0;t< trArr.length ;t++ ){
            table.appendChild(trArr[t]);
        }
        captions.innerText = "标题";
        var data = {
            "class":"table-detail column-four table-align transparent",
            "plugins":"mini-customtable",
            "column":"column-four",
            "row":4,
            "subOneToOne":"false",
            "subTableName":"",
            "comment":"",
            "colorname":"transparent",
        }
        defaultModule(table,data);
        captions.setAttribute("class","form-module");
        table.insertBefore(captions,table.firstChild);
        tableDiv.setAttribute("class","tabelBox");
        tableDiv.setAttribute("plugins","mini-formcustomtable");
        tableDiv.setAttribute("id","form_main"+ randomNumber );
        tableDiv.setAttribute("relationtype","main");
        tableDiv.appendChild(table);
        templateView.execCommand('insertHtml',tableDiv.outerHTML);
    }
    else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        var thisHtm2 = thisHtml.getElementsByClassName("table-detail")[0];//table
        var div = thisHtm2.parentNode;//div
        var tableTbody = thisHtml.getElementsByTagName("tbody")[0];//tbody;
        var trOne = tableTbody.children[0];
        var td_s =  trOne.children;
        var col = "";
        if (td_s.length == 2){
            col = "column-two"
        } if(td_s.length == 4){
            col = "column-four"
        }
        if(td_s.length == 6){
            col = "column-three"
        }
        displayTr(trOne);
        if (col == data.column){
            var tr_s = tableTbody.children;
            var row_s = data.row;
            var newRow =(parseInt(row_s) + 1) -  parseInt(tr_s.length) ;//加一是因为第一行默认隐藏了；
            if (newRow > 0 ){
                createTr(tableTbody,newRow,data);
                setTableElments(data);
            } else if (newRow < 0 ){
                var removeTd =  Math.abs(newRow);
                for (var i =0 ;i < removeTd ;i++){
                    var lastTd = tableTbody.lastChild;
                    tableTbody.removeChild(lastTd);
                }
                $.each(data,function(key,value){
                    thisHtm2.setAttribute(key,data[key]);
                });
            } else {
                setTableElments(data);
            }
        }else {
            var htmls = [];
            var _trs =  tableTbody.children;
            for (var i = 1 ;i<_trs.length  ;i++ ) {
                var _tr = tableTbody.children[i];
                var _tds =  _tr.children;
                for (var k = 0 ; k<_tds.length ;k++){
                    var tdHtml = _tds[k];
                    htmls.push(tdHtml.innerHTML);
                }
            }
            //删除所有行；
            for (var s = _trs.length - 1 ; s >= 0 ;s--){
                tableTbody.removeChild(_trs[s]);
            }
            var rows = data.row + 1;
            createTr(tableTbody,rows,data);
            //；
            var newTr = tableTbody.children;
            var newTd = newTr[0].children;
            var firstTr = newTr[0];
            displayTr(firstTr);
            for (var r = 1 ;r< newTr.length ;r++){
                var tRow = newTr[r];
                var tLou = tRow.children;
                for (var le = 0 ;le< newTd.length ;le++ ) {
                    if (htmls[le] != undefined ){
                        tLou[le].innerHTML = htmls[le];
                    } else {
                        tLou[le].innerHTML = "";
                    }
                }
                htmls.splice(0,3);
            }
            setTableElments(data);
        }
        if (data.subOneToOne == "true" ) {
            var subtablename = data.subtablename;
            var comment = data.comment
            div.setAttribute("id","form_"+ subtablename +  randomNumber );
            div.setAttribute("relationtype","onetoone" );
            div.setAttribute("tablename",subtablename);
            div.setAttribute("comment",comment);
        }
    }
    function setTableElments(data) {
        thisHtm2.setAttribute("class","table-detail table-align "+  data.colorname + " "+ data.column);
        $.each(data,function(key,value){
            thisHtm2.setAttribute(key,data[key]);
        });
    }
    function displayTr(firstTr) {
        firstTr.setAttribute("class","firstRow displayTr")
        firstTr.setAttribute("style","height:0;visibility:hidden;")
    }
    function createTr(tableTbody,rows,data) {
        var trArrs = [];
        var row = rows;
        var columns = data.column;
        for (var rows = 0 ;rows< row ;rows++ ) {
            var trNew = document.createElement("tr");
            if (columns == "column-four") {
                for (var tds = 0 ; tds < 4 ;tds++){
                    var tdNew = document.createElement("td");
                    trNew.appendChild(tdNew);
                }
            }else
            if (columns == "column-two") {
                for (var tds = 0 ; tds < 2 ;tds++){
                    var tdNew = document.createElement("td");
                    trNew.appendChild(tdNew);
                }
            }else
            if (columns == "column-six") {
                for (var tds = 0 ; tds < 6 ;tds++){
                    var tdNew = document.createElement("td");
                    trNew.appendChild(tdNew);
                }
            }
            trArrs.push(trNew)
        }
        for (var trs = 0 ;trs<trArrs.length ;trs++) {
            tableTbody.appendChild(trArrs[trs]);
        }
    }
}
/*-------------表单模板-----end------*/

/*-------------div容器----start------*/
function miniDiv(plugins,thisTagName,data) {
    if (thisTagName == "li"){
        var divBoxs = document.createElement("div");
        var data = {
            "class":"divContainer moduleDivs",
            "plugins":plugins,
            "label":data.label,
            "name":data.name,
            "mwidth":"100",
            "wunit":"%",
            "mheight":"40",
            "hunit":"px",
            "style":"width:100%;height:40px;line-height:40px;"
        }
        defaultModule(divBoxs,data);
        templateView.execCommand('insertHtml',divBoxs.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data)
        thisHtml.setAttribute("name","div_" + data.name )
        thisHtml.classList.remove("onNndefined");
    }

}
/*-------------div容器----end------*/

/*条件容器*/
function  miniConitionDiv(plugins,thisTagName,data) {
    if (thisTagName == "li"){
        var divBoxs = document.createElement("div");
        var data = {
            "class":"div-condition  rxc moduleDivs",
            "plugins":plugins,
            "label":data.label,
            "name":data.name,
            "id":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "fieldjson_jump":[],
            "fieldjson_show":[],
            "style":"width:100%;min-height:34px;"
        }
        defaultModule(divBoxs,data);
        templateView.execCommand('insertHtml',divBoxs.outerHTML);
    }else {
        var this_Html = templateView.body.getElementsByClassName("moduleCheck")[0];
        var grid_jump=mini.get('fieldGrid_jump');
        var grid_show=mini.get('fieldGrid_show');
        var fieldJson_jump=mini.encode(grid_jump.getData());
        var fieldJson_show=mini.encode(grid_show.getData());

        $.each(data,function(key,value){
            this_Html.setAttribute(key,data[key]);
        });
        if( data.mwidth == 0 && data.mheight == 0 ){
            var styles = "";
        }else {
            var styles = "width:"+ data.mwidth + data.wunit + ";min-height:"+ data.mheight + data.hunit;
        }
        this_Html.setAttribute("style",styles);
        this_Html.classList.remove("onNndefined");
        this_Html.setAttribute("fieldJson_jump",fieldJson_jump);
        this_Html.setAttribute("fieldJson_show",fieldJson_show);

    }
}
/*条件容器---点击内容设置grid的内容*/
function conitionDiv(obj) {
    var grid_jump=mini.get('fieldGrid_jump');
    var grid_show=mini.get('fieldGrid_show');
    grid_jump.setData(mini.decode(obj.fieldjson_jump));
    grid_show.setData(mini.decode(obj.fieldjson_show));
}
/*  条件容器  end  */


/*文本*/
function miniTextbox(plugins,thisTagName,data) {
    if (thisTagName == "li"){
        var inpupts = document.createElement("h6");
        var data = {
            "class":"mini-textbox rxc moduleDivs",
            "plugins":plugins,
            "label":data.label,
            "name":data.name,
            "onvalidation":"",
            "datatype":"varchar",
            "length":50,
            "decimal":0,
            "minnum":"",
            "maxnum":"",
            "validrule":"",
            "from":"forminput",
            "required":"false",
            "only_read":"false",
            "allowinput":"true",
            "value":"",
            "format":"",
            "emptytext":"",
            "sequence":"",
            "scripts":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "style":"width:100%;height:34px;"
        }

        /*
            vtype="IDCard;length:50"
        * */
        defaultModule(inpupts,data);
        templateView.execCommand('insertHtml',inpupts.outerHTML);

    }else {
        var this_Html = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(this_Html,data);
        var runningtext =  mini.get("textBox_sequence").getText();
        this_Html.setAttribute("runningtext",runningtext);
        this_Html.setAttribute("vtype",data.validrule);
        this_Html.classList.remove("onNndefined");
        //校验规则；
        for(var key in data){
            var val=data[key];
            if(key=="datatype" ){
                //设置vtype校验函数
                var	vtype=getVType(val,data);
                this_Html.setAttribute('vtype',vtype);
                this_Html.setAttribute('onvalidation','');
            }
            if(key!="vtype"){
                this_Html.setAttribute(key,val);
            }
            if(key=='validrule'&&val.indexOf('onUniqueValidation') > -1){
                this_Html.setAttribute('onvalidation','onUniqueValidation');
                var os = val.split(",");
                var arrData = [];
                for(var i = 0;i<os.length ; i++){
                    if(os[i] != "onUniqueValidation"){
                        arrData.push(os[i]);
                    }
                }
                var valData= arrData.join(',');
                this_Html.setAttribute('vtype',valData);
            }
        }
        function getVType(datatype,formData){
            var vtype=[];
            var length=formData['length'];
            if(datatype=='number'){
                vtype.push('float');
                var minnum=formData['minnum'];
                var maxnum=formData['maxnum'];
                var decimal=formData['decimal'];
                if(minnum){
                    vtype.push('minnum:'+minnum);
                }
                if(maxnum){
                    vtype.push('maxnum:'+maxnum);
                }
                if(decimal){
                    vtype.push('decimal:'+decimal);
                    /* length=length-decimal;	 */
                }
                vtype.push('len:'+length);
            } else if(datatype=='varchar'){
                if(formData['validrule']){
                    vtype.push(formData['validrule']);
                }
                vtype.push('length:'+length);
            }
            return vtype.join(";").toString();
        }
    }
}

/* -------------------------------------------- 文本  end  ---------------------------------------*/

/*多行文本*/
function miniTextarea(plugins,thisTagName,data) {
    if (thisTagName == "li"){
        var inpupts = document.createElement("textarea");
        var data = {
            "class":"mini-textarea rxc moduleDivs",
            "plugins":plugins,
            "label":data.label,
            "name":data.name,
            "datatype":"varchar",
            "length":"200",
            "vtype":"",
            "value":"",
            "minlen":"",
            "allowinput":"true",
            "required":"",
            "emptytext":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"60",
            "hunit":"px",
            "style":"width:100%;height:60px;"
        }
        defaultModule(inpupts,data);
        templateView.execCommand('insertHtml',inpupts.outerHTML);

    }else {
        var this_Html = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(this_Html,data);
        this_Html.classList.remove("onNndefined");
    }
}

/*多行文本end*/

/*复选框*/
function miniCheckbox(plugins,thisTagName,data){
    if (thisTagName == "li"){
        var inpuptCheckBox = document.createElement("h6");
        var data = {
            "class":"mini-checkbox rxc  checkBtnBox moduleDivs",
            "plugins":plugins,
            "label":data.label,
            "name":data.name,
            "type":"checkbox",
            "text":"",
            "length":"50",
            "truevalue":"是",
            "falsevalue":"否",
            "checked":"true"
        }
        defaultModule(inpuptCheckBox,data);
        //   spanBox.appendChild(inpuptCheckBox);
        //  spanBox.appendChild(spanFixed);
        templateView.execCommand('insertHtml',inpuptCheckBox.outerHTML);
    }else {
        var this_Html = templateView.body.getElementsByClassName("moduleCheck")[0];
        var label = data.label;
        $.each(data,function(key,value){
            this_Html.setAttribute(key,data[key]);
        })
        this_Html.classList.remove("onNndefined");
        this_Html.setAttribute("text",label);
    }
}
/*复选框end*/

/*单选按钮*/
function miniRadiobuttonlist(plugins,thisTagName,data){
    if (thisTagName == "li"){
        var inpuptRadio = document.createElement("input");
        var data = {
            "class":"mini-radiobuttonlist  rxc moduleDivs",
            "plugins":plugins,
            "label":data.label,
            "name":data.name,
            "datafield":"data",
            "textname":"",
            "length":"20",
            "from":"self",
            "defaultvalue":"",
            "url":"",
            "url_textfield":"",
            "url_valuefield":"",
            "dickey":"",
            "sql":"",
            "sql_textfield":"",
            "sql_valuefield":"",
            "repeatlayout":"flow",
            "repeatdirection":"horizontal",
            "repeatitems":"5",
            "required":"false",
            "only_read":"false",
            "textfield":"name",
            "valuefield":"key",
            "data":"",
        }
        defaultModule(inpuptRadio,data);
        templateView.execCommand('insertHtml',inpuptRadio.outerHTML);
    }else {
        var this_Html =  templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(this_Html,data);
        this_Html.classList.remove("onNndefined");
        //数据来源判断
        var from =  data.from;
        this_Html.setAttribute("textname",data.name +"_name");
        if(from=='self'){//来自自定义
            var _data = {
                'textfield':'name',
                'valuefield':'key',
                'dickey':'',
                'url':'',
                'url_textfield':'',
                'url_valuefield':'',
                'sql_textfield':'',
                'sql_valuefield':'',
                'sql':''
            };
            for (var key in _data) {
                this_Html.setAttribute(key,_data[key]);
            }
            var radioGrid=mini.get('radiobutton_props');
            var gridData=radioGrid.getData();
            for(var i=0;i<gridData.length;i++){
                var row=gridData[i];
                delete row._id;
                delete row._uid;
                delete row._state;
            }
            this_Html.setAttribute('data',mini.encode(gridData));
        }else if(from=='url'){//来自url
            var _data = {
                'data':'',
                'dickey':'',
                'sql_textfield':'',
                'sql_valuefield':'',
                'sql':'',
                'textfield':data.url_textfield,
                'valuefield':data.url_valuefield
            };
            for (var key in _data) {
                this_Html.setAttribute(key,_data[key]);
            }
        }else if(from=='dic'){//来自数据字典
            var _data = {
                'data':'',
                'url':'',
                'url_textfield':'',
                'url_valuefield':'',
                'sql_textfield':'',
                'sql_valuefield':'',
                'sql':'',
                'textfield':'name',
                'valuefield':'key'
            };
            for (var key in _data) {
                this_Html.setAttribute(key,_data[key]);
            }
        }else if(from=='sql'){   //来自自定义SQL
            var _data = {
                'data':'',
                'url':'',
                'url_textfield':'',
                'url_valuefield':'',
                'dickey':'',
                'datafield':'',
                'textfield':data.sql_textfield,
                'valuefield':data.sql_valuefield
            };
            for (var key in _data) {
                this_Html.setAttribute(key,_data[key]);
            }
        }
    }
}


/*----------------------------------单选按钮end-----------------------------*/

/*复选按钮*/
function miniCheckboxlist(plugins,thisTagName,data){

    if (thisTagName == "li"){
        var inpuptRadio = document.createElement("input");
        var data = {
            "class":"mini-checkboxlist  rxc moduleDivs",
            "plugins":plugins,
            "label":data.label,
            "name":data.name,
            "datafield":"data",
            "length":"20",
            "from":"self",
            "textname":"",
            "dickey":"",
            "url":"",
            "url_textfield":"",
            "url_valuefield":"",
            "sql":"",
            "sql_textfield":"",
            "sql_valuefield":"",
            "repeatlayout":"flow",
            "repeatdirection":"horizontal",
            "repeatitems":"5",
            "required":"false",
            "only_read":"false",
            "textfield":"name",
            "valuefield":"key",
            "value":"",
            "data":"",
        }
        defaultModule(inpuptRadio,data);
        templateView.execCommand('insertHtml',inpuptRadio.outerHTML);
    }else {
        var this_Html =  templateView.body.getElementsByClassName("moduleCheck")[0];
        var checkboxGrid=mini.get('checkboxlistProps');
        changeModule(this_Html,data);
        this_Html.setAttribute("textname",data.name +"_name");
        var _data=mini.encode(checkboxGrid.getData());
        this_Html.setAttribute("data",_data);
        this_Html.classList.remove("onNndefined");

        //数据来源判断
        var from =  data.from;

        if(from=='self'){//来自自定义
            var _data = {
                'textfield':'name',
                'valuefield':'key',
                'dickey':'',
                'url':'',
                'url_textfield':'',
                'url_valuefield':'',
                'sql_textfield':'',
                'sql_valuefield':'',
                'sql':''
            };
            for (var key in _data) {
                this_Html.setAttribute(key,_data[key]);
            }
            var radioGrid=mini.get('checkboxlistProps');
            var gridData=radioGrid.getData();
            for(var i=0;i<gridData.length;i++){
                var row=gridData[i];
                delete row._id;
                delete row._uid;
                delete row._state;
            }
            this_Html.setAttribute('data',mini.encode(gridData));

        }else if(from=='url'){//来自url
            var _data = {
                'data':'',
                'dickey':'',
                'sql_textfield':'',
                'sql_valuefield':'',
                'sql':'',
                'textfield':data.url_textfield,
                'valuefield':data.url_valuefield
            };
            for (var key in _data) {
                this_Html.setAttribute(key,_data[key]);
            }
        }else if(from=='dic'){//来自数据字典
            var _data = {
                'data':'',
                'url':'',
                'url_textfield':'',
                'url_valuefield':'',
                'sql_textfield':'',
                'sql_valuefield':'',
                'sql':'',
                'textfield':'name',
                'valuefield':'key'
            };
            for (var key in _data) {
                this_Html.setAttribute(key,_data[key]);
            }
        }else if(from=='sql'){   //来自自定义SQL
            var _data = {
                'data':'',
                'url':'',
                'url_textfield':'',
                'url_valuefield':'',
                'dickey':'',
                'datafield':'',
                'textfield':data.sql_textfield,
                'valuefield':data.sql_valuefield
            };
            for (var key in _data) {
                this_Html.setAttribute(key,_data[key]);
            }
        }
    }
}


function checkBoxValueSelect(obj) {
    var val = obj.from;
    var thisId = "checkboxlistfrom";
    var thisParent = $("#"+thisId).parents(".divBox");
    cutBox(val,thisParent)
}
/*--------------------------------------------复选按钮end-----------------------------------*/

/*下拉框*/
function miniCombobox(plugins,thisTagName,data) {
    if (thisTagName == "li"){
        var inputComBoBox =  document.createElement("input");
        var data= {
            "class":"mini-rxcombobox   rxc moduleDivs",
            "plugins":"mini-combobox",
            "datafield":"data",
            "label":data.label,
            "name":data.name,
            "textname":"",
            "length":"50",
            "from":"self",
            "mainfield":"no",
            "sql_parent":"",
            "sql_params":"",
            "defaultvalue":"",
            "only_read":"",
            "required":"",
            "allowinput":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "textfield":"name",
            "valuefield":"key",
            "data":"",
            "shownullitem":"true",
            "nullitemtext":"请选择...",
            "emptytext":"请选择...",
            "style":"width:100%;height:34px;"
        }
        defaultModule(inputComBoBox,data);
        templateView.execCommand('insertHtml',inputComBoBox.outerHTML);
    }else
    {
        var comboboxHtml =  templateView.body.getElementsByClassName("moduleCheck")[0];
        var from = data.from;
        if(from=='self'){//来自自定义
            var datas = data;
            delete datas["dickey"];
            delete datas["url"];
            delete datas["url_textfield"];
            delete datas["url_valuefield"];
            delete datas["sql_textfield"];
            delete datas["sql_valuefield"];
            delete datas["sql"];
            changeModule(comboboxHtml,datas);
            comboboxHtml.setAttribute('textfield','name');
            comboboxHtml.setAttribute('valuefield','key');
            var radioGrid=mini.get('comboboxGrid');
            var gridData=radioGrid.getData();
            for(var i=0;i<gridData.length;i++){
                var row=gridData[i];
                delete row._id;
                delete row._uid;
                delete row._state;
            }
            comboboxHtml.setAttribute('data',mini.encode(gridData));
        }else if(from=='url'){//来自url
            var datas = data;
            delete datas["data"];
            delete datas["dickey"];
            delete datas["data-options"];
            delete datas["sql_textfield"];
            delete datas["sql_valuefield"];
            delete datas["sql"];
            changeModule(comboboxHtml,datas);
            comboboxHtml.setAttribute('textfield',datas.url_textfield);
            comboboxHtml.setAttribute('valuefield',datas.url_valuefield);
        }else if(from=='dic'){//来自数据字典
            var datas = data;
            delete datas["data"];
            delete datas["url"];
            delete datas["url_textfield"];
            delete datas["url_valuefield"];
            delete datas["sql_textfield"];
            delete datas["sql_valuefield"];
            delete datas["sql"];
            delete datas["data-options"];
            changeModule(comboboxHtml,datas);
            comboboxHtml.setAttribute('dickey',datas.dickey);
            comboboxHtml.setAttribute('textfield','name');
            comboboxHtml.setAttribute('valuefield','key');
        }else if(from=='sql'){//来自自定义SQL
            var datas = data;
            delete datas["data"];
            delete datas["url"];
            delete datas["url_textfield"];
            delete datas["url_valuefield"];
            delete datas["dickey"];
            changeModule(comboboxHtml,datas);
            comboboxHtml.setAttribute('textfield',datas.sql_textfield);
            comboboxHtml.setAttribute('valuefield',datas.sql_valuefield);

            var sqlParent=datas.sql_parent;
            var json={};
            var jsonSql={};
            json.sql=jsonSql;
            if(sqlParent){
                jsonSql.param=datas.sql_params;
                jsonSql.parent=datas.sql_parent;
                jsonSql.mainfield=datas.mainfield;
                jsonSql.sql=datas.sql;
                comboboxHtml.setAttribute('data-options',mini.encode(json));
            }
            else{
                var gridInput=mini.get("gridInput");
                if(gridInput && gridInput.getData()&& gridInput.getData().length>0){
                    var customQuerys ={
                        customquery:datas.sql,
                        event: "valuechanged",
                        isMain:isMain,
                        name:"customQuery"+datas.name,
                        table: isMain?"main":"sub_"
                    };
                    var gridInputs=gridInput.getData();
                    var gridInput =[];
                    for(var i=0;i<gridInputs.length;i++){
                        var obj =gridInputs[i];
                        var gridInputObj={
                            name:obj.fieldName,
                            comment:obj.comment,
                            mode:obj.mode,
                            modeName:obj.modeName,
                            bindVal:obj.bindVal,
                        };
                        gridInput.push(gridInputObj);
                    }
                    customQuerys.gridInput=gridInput;
                    var gridReturn=[];
                    var sql_textfield ={
                        name:datas.sql_textfield,
                        comment:mini.get('sql_textfield_combo').getText(),
                        mapVal:datas.name,
                        type:"sql_textfield"
                    }
                    gridReturn.push(sql_textfield);
                    var sql_valuefield ={
                        name:datas.sql_valuefield,
                        comment:mini.get('sql_valuefield_combo').getText(),
                        mapVal:datas.name,
                        type:"sql_valuefield"
                    }
                    gridReturn.push(sql_valuefield);
                    customQuerys.gridReturn=gridReturn;
                    jsonSql.customQueryCombobox=customQuerys;
                }
                jsonSql.sql=datas.sql;
                comboboxHtml.setAttribute('data-options',mini.encode(json));
            }

        }
        comboboxHtml.setAttribute("textName",data.name +"_name");
        comboboxHtml.classList.remove("onNndefined");
        var classList=comboboxHtml.getAttribute("class");
        if(classList.indexOf("mini-rxcombobox")==-1){
            classList=classList+" mini-rxcombobox";
            comboboxHtml.setAttribute("class",classList);
        }
        if(classList.indexOf("mini-combobox")>-1){
            var newClassList=classList.split("mini-combobox");
            var newCLass ="";
            for(var i=0;i<newClassList.length;i++){
                newCLass=" "+newClassList[i];
            }
            comboboxHtml.setAttribute("class",newCLass);
        }
    }
}
/*---------------------------下拉框end------------------------------*/
/*下拉树*/
function miniTreeselect(plugins,thisTagName,data){
    if (thisTagName == "li"){
        var inputTree =  document.createElement("input");
        var data = {
            "class":"mini-treeselect  rxc treeSelect moduleDivs",
            "plugins":"mini-treeselect",
            "datafield":"data",
            "label":data.label,
            "name":data.name,
            "textname":"",
            "length":"50",
            "multiselect":"false",
            "from":"url",
            "defaultvalue":"",
            "url":"",
            "url_textfield":"",
            "url_valuefield":"",
            "url_parentfield":"",
            "sql":"",
            "sql_textfield":"",
            "sql_valuefield":"",
            "sql_parentfield":"",
            "required":"false",
            "checkrecursive":"false",
            "allowparentselect":"false",
            "autocheckparent":"false",
            "expandonload":"false",
            "popupwidth":"200",
            "pwunit":"px",
            "popupheight":"300",
            "phunit":"px",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "onbeforenodeselect":"beforenodeselect",
            "showfoldercheckbox":"false",
            "data-options":"",
            "textfield":"",
            "valuefield":"",
            "parentfield":"",
            "style":"width:100%;height:34px;"
        };
        defaultModule(inputTree,data);
        templateView.execCommand('insertHtml',inputTree.outerHTML);
    }else {
        var treeHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(treeHtml,data);
        if (data.from == "url") {
            treeHtml.setAttribute('textfield',data.url_textfield);
            treeHtml.setAttribute('valuefield',data.url_valuefield);
            treeHtml.setAttribute('parentfield',data.url_parentfield);
        }else if(data.from == "custom"){
            treeHtml.setAttribute('textfield',data.sql_textfield);
            treeHtml.setAttribute('valuefield',data.sql_valuefield);
            treeHtml.setAttribute('parentfield',data.sql_parentfield);
        }
        treeHtml.setAttribute("textname",data.name +"_name");
        treeHtml.classList.remove("onNndefined");
        var options={};
        options.allowparentselect = data.allowparentselect;

        var sqlText = mini.get("sql").getText();
        treeHtml.setAttribute("sqltext",sqlText);
        treeHtml.setAttribute("showfoldercheckbox",data.allowparentselect);
        treeHtml.setAttribute("data-options",JSON.stringify(options))

    }
}
/*-----------------------------------下拉树end---------------------*/

/*地址控件*/
function miniArea(plugins,thisTagName,data) {
    var nodeList = [
        {
            "sql": "PROVINCE_LEVEL",
            "data-options": {sql: "PROVINCE_LEVEL"}
        },
        {
            "sql": "CITY_LEVEL",
            "sql_params": "PARENT_CODE_",
            "data-options": {param: "PARENT_CODE_", parent: "", mainfield: "no", sql: "CITY_LEVEL"}
        },
        {
            "sql": "COUNTY_LEVEL",
            "sql_params": "PARENT_CODE_",
            "data-options": {param: "PARENT_CODE_", parent: "", mainfield: "no", sql: "COUNTY_LEVEL"}
        }
    ];
    function addAttrCityAndCount(chidrenNode, type, nodeName) {
        var obj = nodeList[type];
        for (var key in obj) {
            if (key == "data-options") {
                var json = {};
                json.sql = obj[key];
                if (type != 0) {
                    json.sql.parent = nodeName;
                }
                chidrenNode.setAttribute(key, mini.encode(json));
                continue;
            }
            chidrenNode.setAttribute(key, obj[key]);
        }
    }

    function nationwide(htmls,keyNameValue,keyNameValue,areae ){
        if (areae=="provinceo"){
            htmls.setAttribute("name",keyNameValue+"_provinceo");
            htmls.setAttribute("textname",keyNameValue+"_provinceo_name");
            htmls.setAttribute("label",labelValue+"_省");
        }
        if(areae=="city"){

            htmls.setAttribute("name",keyNameValue+"_city");
            htmls.setAttribute("textname",keyNameValue+"_city_name");
            htmls.setAttribute("label",labelValue+"_市");
            htmls.setAttribute("sql_parent",keyNameValue+"_provinceo");
        }
        if(areae=="county"){
            htmls.setAttribute("name",keyNameValue+"_county");
            htmls.setAttribute("textname",keyNameValue+"_county_name");
            htmls.setAttribute("label",labelValue+"_区(县)");
            htmls.setAttribute("sql_parent",keyNameValue+"_city");

        }
    }
    if (thisTagName == "li"){
        //最外边的盒子；
        var areaDiv = document.createElement("div");
        var fixedBox = document.createElement("div");
        fixedBox.classList.add("areafixed")
        areaDiv.appendChild(fixedBox);
        //省；
        var shengText = document.createElement("span");
        shengText.innerText = "省:";
        shengText.className = "areaText" ;

        var shengSpan = document.createElement("div");
        shengSpan.classList.add("shengBox");
        var shengInput = document.createElement("input");
        //市；
        var shiText = document.createElement("span");
        shiText.innerText = "市:";
        shiText.className = "areaText" ;
        var shiSpan = document.createElement("div");
        shiSpan.classList.add("shiBox");
        var shiInput = document.createElement("input");
        //县（区）；
        var xianText = document.createElement("span");
        xianText .innerText = "县:";
        xianText.className = "areaText" ;
        var xianSpan = document.createElement("div");
        xianSpan.classList.add("xianBox");
        var xianInput = document.createElement("input");
        //乡（街道）；
        var xiangText = document.createElement("span");
        xiangText.innerText = "乡(街道):";
        xiangText.className = "areaText xiangAreaText" ;
        var xiangSpan = document.createElement("div");
        xiangSpan.classList.add("xiangBox");
        var xiangInput = document.createElement("input");
        //最外边的盒子的数据；
        var data = {
            "class":"mini-area rxc areaBox moduleDivs",
            "plugins":"mini-area",
            "style":"height:39px;width:100%;",
            "datafield":"",
            "label":data.label,
            "name":data.name,
            "textname":"",
            "required":"false",
            "from":"provinceAndCity",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"39",
            "hunit":"px"
        };
        for(var key in data){
            areaDiv.setAttribute(key,data[key]);
        }
        //省，市，区；
        var addrassObj = {
            "class": "mini-combobox rxc",
            "plugins": "mini-combobox",
            "length": "50",
            "from": "sql",
            "mainfield": "no",
            "sql_textfield": "AREA_NAME_",
            "sql_valuefield": "AREA_CODE_",
            "required": "false",
            "allowinput": "false",
            "mwidth": "0",
            "wunit": "px",
            "mheight": "0",
            "hunit": "px",
            "textfield": "AREA_NAME_",
            "valuefield": "AREA_CODE_",
            "shownullitem": "true",
            "nullitemtext": "请选择...",
            "emptytext": "请选择..."
        };
        //街道；
        var addrassToStrees = {
            "class": "mini-textbox rxc",
            "plugins": "mini-textbox",
            "vtype": "length:120",
            "datatype": "varchar",
            "length": "120",
            "decimal": "0",
            "required": "false",
            "allowinput": "true",
            "from": "forminput",
            "mwidth": "150",
            "wunit": "px",
            "mheight": "0",
            "hunit": "px",
            "emptytext": "请输入..."
        };

        var keyNameValue = "defaultname";
        var labelValue = "defaultnames";
        areaModules();
        function areaModules() {
            //省；
            areaDiv.appendChild(shengText);
            nationwide(shengInput,keyNameValue,keyNameValue,"provinceo");
            shengInput.setAttribute("sql_parent","");
            shengInput.setAttribute("sql_params","");
            addAttrCityAndCount(shengInput, 0, "");
            for (var key in addrassObj){
                shengInput.setAttribute(key,addrassObj[key]);
            }

            shengSpan.appendChild(shengInput);
            areaDiv.appendChild(shengSpan);
            //市；
            areaDiv.appendChild(shiText);
            nationwide(shiInput,keyNameValue,keyNameValue,"city");
            shiInput.setAttribute("name",keyNameValue+"_city");
            shiInput.setAttribute("textname",keyNameValue+"_city_name");
            shiInput.setAttribute("label",labelValue+"_市");
            shiInput.setAttribute("sql_parent",keyNameValue+"_provinceo");
            shiInput.setAttribute("sql","CITY_LEVEL");
            shiInput.setAttribute("sql_params","PARENT_CODE_");
            addAttrCityAndCount(shiInput, 1, keyNameValue + "_provinceo");
            for (var key in addrassObj){
                shiInput.setAttribute(key,addrassObj[key]);
            }
            shiSpan.appendChild(shiInput);
            areaDiv.appendChild(shiSpan);
            //县(区)；
            areaDiv.appendChild(xianText);
            nationwide(xianInput,keyNameValue,keyNameValue,"county");
            xianInput.setAttribute("sql_parent",keyNameValue+"_city");
            addAttrCityAndCount(xianInput, 2, keyNameValue + "_city");
            for (var key in addrassObj){
                xianInput.setAttribute(key,addrassObj[key]);
            }
            xianSpan.appendChild(xianInput);
            areaDiv.appendChild(xianSpan);
        }
        templateView.execCommand('insertHtml',areaDiv.outerHTML);
    }else {
        var keyNameValue = data.name;
        var labelValue = data.label;
        var forms = data.from;
        var _required = data.required;
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];

        var  provinceo = thisHtml.getElementsByClassName("shengBox")[0].children[0];
        var  city = thisHtml.getElementsByClassName("shiBox")[0].children[0];
        var  county = thisHtml.getElementsByClassName("xianBox")[0].children[0];
        nationwide(provinceo,keyNameValue,keyNameValue,"provinceo" );
        nationwide(city,keyNameValue,keyNameValue,"city" );
        nationwide(county,keyNameValue,keyNameValue,"county" );

        addAttrCityAndCount(provinceo, 0, "");
        addAttrCityAndCount(city, 1, keyNameValue + "_provinceo");
        addAttrCityAndCount(county, 2, keyNameValue + "_city");
        if (forms == "provinceAndCity"){
            var child1 = thisHtml.getElementsByClassName("xiangAreaText")[0];
            var child2 = thisHtml.getElementsByClassName("xiangBox")[0];
        }else {
            var childBox = thisHtml.getElementsByClassName("xiangBox")[0];
            if (!childBox){
                var addrassToStrees = {
                    "class": "mini-textbox rxc",
                    "plugins": "mini-textbox",
                    "vtype": "length:120",
                    "datatype": "varchar",
                    "length": "120",
                    "decimal": "0",
                    "required": "false",
                    "allowinput": "true",
                    "from": "forminput",
                    "mwidth": "150",
                    "wunit": "px",
                    "mheight": "0",
                    "hunit": "px",
                    "emptytext": "请输入..."
                };
                //乡（街道）；
                var xiangText = document.createElement("span");
                xiangText.innerText = "乡(街道):";
                xiangText.className = "areaText xiangAreaText" ;
                xiangText.setAttribute("plugins","mini-area");
                var xiangSpan = document.createElement("div");
                xiangSpan.classList.add("xiangBox");
                var xiangInput = document.createElement("input");
                for (var key in addrassToStrees){
                    xiangInput.setAttribute(key,addrassToStrees[key]);
                }
                xiangInput.setAttribute('label', labelValue+ "_街道(详细地址)");
                xiangInput.setAttribute('name', keyNameValue + "_street");
                xiangInput.setAttribute('required', _required);
                xiangSpan.appendChild(xiangInput);
                thisHtml.appendChild(xiangText);
                thisHtml.appendChild(xiangSpan);

            }

        }
        provinceo.setAttribute('required',_required);
        city.setAttribute('required',_required);
        county.setAttribute('required',_required);
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
    }
}
/*---------------------------------地址控件end-------------------------*/

/*数字*/
function miniSpinner(plugins,thisTagName,data){
    if(thisTagName == "li"){
        var spinnerInput = document.createElement("input");
        var data = {
            "class":"mini-spinner rxc moduleDivs",
            "plugins":"mini-spinner",
            "vtype":"rangeLength:10,100",
            "label":data.label,
            "name":data.name,
            "minvalue":"1",
            "maxvalue":"100",
            "increment":"1",
            "required":"false",
            "format":"0.00",
            "allowinput":"false",
            "value":"0",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "datatype":"number",
            "defaultvalue":"",
            "allownull":"true",
            "style":"width:100%;height:34px"
        }
        defaultModule(spinnerInput,data);
        templateView.execCommand('insertHtml',spinnerInput.outerHTML);
    }else {
        var spinnerHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(spinnerHtml,data);
        spinnerHtml.classList.remove("onNndefined");
    }
}
/*---------------------------------数字end-------------------------*/

/*日期*/
function  miniDatepicker(plugins,thisTagName,data) {
    if(thisTagName == "li"){
        var dateInput = document.createElement("input");
        var data ={
            "class":"mini-datepicker rxc moduleDivs",
            "plugins":"mini-datepicker",
            "timeformat":"H:mm:ss",
            "label":data.label,
            "name":data.name,
            "format":"",
            "from":"none",
            "required":"false",
            "showtime":"false",
            "showokbutton":"false",
            "showclearbutton":"false",
            "allowinput":"false",
            "initcurtime":"false",
            "defaultvalue":"",
            "control":"",
            "comparison":"GTE",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "style":"width:100%;height:34px",
            "data-options":"",
        }
        defaultModule(dateInput,data);
        templateView.execCommand('insertHtml',dateInput.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        var s = data;


        changeModule(thisHtml,data);
        var compare = mini.get("compare");
        var comparison = compare.getValue();
        thisHtml.setAttribute("comparison",comparison);

        thisHtml.classList.remove("onNndefined");
        var json=data["data-options"];
        var dateJson=dataPickerGetDateStart();
        if(dateJson){
            var rtnJson={};
            if(json){
                rtnJson=eval("(" +json+")");
            }
            rtnJson["startDate"]=dateJson;
            thisHtml.setAttribute("data-options",JSON.stringify(rtnJson));
        }
    }
}
/*月份*/
function miniMonth(plugins,thisTagName,data){
    if(thisTagName == "li"){
        var monthInput = document.createElement("input");
        var data = {
            "class":"mini-month  rxc moduleDivs",
            "plugins":"mini-month",
            "label":data.label,
            "name":data.name,
            "allowinput":"false",
            "initcurtime":"false",
            "defaultvalue":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "style":"height:34px",
            "format":"yyyy-MM"
        }
        defaultModule(monthInput,data);
        templateView.execCommand('insertHtml',monthInput.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
    }
}
/*----------------------------月份end---------------------------------*/

/*时间*/
function miniTime(plugins,thisTagName,data) {
    if(thisTagName == "li") {
        var timeInput = document.createElement("input");
        var data = {
            "class": "mini-time rxc moduleDivs",
            "plugins": "mini-time",
            "format": "",
            "label":data.label,
            "name":data.name,
            "allowinput": "false",
            "initcurtime": "false",
            "value": "00:00:00",
            "mwidth": "100",
            "wunit": "%",
            "mheight": "34",
            "hunit": "px",
            "style": "width:100%;height:34px",
        }
        defaultModule(timeInput, data);
        templateView.execCommand('insertHtml', timeInput.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
        var val = data["value"];
        val=val.format("hh:mm:ss");
        thisHtml.setAttribute("value",val);
    }
}
/*-------------------------------------时间end-----------------------------*/

/*富文本*/
function  miniUeditor(plugins,thisTagName,data) {
    if(thisTagName == "li") {
        var ueditor = document.createElement("textarea");
        var data = {
            "plugins": "mini-ueditor",
            "class": "mini-ueditor rxc moduleDivs",
            "label":data.label,
            "name":data.name,
            "datatype": "varchar",
            "lengthv": "200",
            "required": "false",
            "mwidth": "100%",
            "wunit": "%",
            "mheight": "300",
            "hunit": "px",
            "length": "200",
            "style": "width:100%;height:300px"
        }
        defaultModule(ueditor, data);
        templateView.execCommand('insertHtml', ueditor.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
    }
}
/*-------------------------------------富文本end-----------------------------*/

/*上传控件*/
function uploadPanel(plugins,thisTagName,data) {
    if (thisTagName == "li"){
        var upload = document.createElement("input");
        var data = {
            "class":"upload-panel rxc moduleDivs",
            "plugins":"upload-panel",
            "style":"width:100%;height:34px;",
            "allowupload":"true",
            "label":data.label,
            "name":data.name,
            "length":"2048",
            "sizelimit":"50",
            "isone":"false",
            "filetype":"",
            "mwidth":"100",
            "wunit":"%",
            /*  "mheight":"34",
              "hunit":"px"*/
        }
        defaultModule(upload, data);
        templateView.execCommand('insertHtml', upload.outerHTML);
    } else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
        if(data.mwidth == 0){
            var style ="width:100%;height:auto;max-width:100%;";
        }else {
            var style ="width:100%;height:auto;max-width:"+ data.mwidth + data.wunit;
        }
        thisHtml.setAttribute("style",style)
    }
}
/*-------------------------------------上传控件end-----------------------------*/

/*图片上传*/
function miniImg(plugins,thisTagName,data){
    if (thisTagName == "li" ){
        var upImg = document.createElement("img");
        var upImgDiv = document.createElement("div");
        var upImgFixedDiv = document.createElement("div");
        upImgDiv.setAttribute("class","upImgDiv");
        upImgFixedDiv.setAttribute("class","upImgFixedDiv");
        upImgFixedDiv.setAttribute("plugins","miniImg");
        var data ={
            "class":"mini-img moduleDivs",
            "src":__rootPath + "/styles/images/upPic.png",
            "plugins":"mini-img",
            "style":"",
            "label":data.label,
            "name":data.name,
            "length":"80",
            "imgtype":"upload",
            "isone":"false",
            "imgstype":"upload",
            "style":"width:64px;height:64px;",
            "fileType":"Image"
        }
        defaultModule(upImg, data);
        upImgDiv.appendChild(upImg);
        upImgDiv.appendChild(upImgFixedDiv);
        templateView.execCommand('insertHtml', upImgDiv.outerHTML);
    } else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        thisHtml = thisHtml.getElementsByTagName("img")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
    }
}
/*-------------------------------------图片上传end-----------------------------*/

/*隐藏域*/
function  miniHidden(plugins,thisTagName,data){
    if (thisTagName == "li" ){
        var hiddenInput = document.createElement("input");
        var data = {
            "class":"mini-hidden rxc moduleDivs",
            "plugins":"mini-hidden",
            "label":data.label,
            "name":data.name,
            "datatype":"varchar",
            "length":"50",
            "decimal":"0",
            "value":"",
            "intscriptvalue":""
        }
        defaultModule(hiddenInput, data);
        templateView.execCommand('insertHtml', hiddenInput.outerHTML);
    } else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
    }
}
/*-------------------------------------隐藏域end-----------------------------*/

/*编辑按钮*/
function  miniButtonedit(plugins,thisTagName,data){
    if (thisTagName == "li" ){
        var buttoneditInput = document.createElement("input");
        var data = {
            "class":"mini-buttonedit rxc moduleDivs",
            "plugins":"mini-buttonedit",
            "data-options":"",
            "label":data.label,
            "name":data.name,
            "textname":"",
            "length":"50",
            "minlen":"0",
            "required":"false",
            "allowinput":"false",
            "ckselfdlg":"false",
            "dialogalias":"",
            "dialogname":"",
            "seltype":"normal",
            "textfield":"",
            "valuefield":"",
            "onbuttonclick":"",
            "value":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "style":"height:34px;width:100%;"
        }

        defaultModule(buttoneditInput, data);
        templateView.execCommand('insertHtml', buttoneditInput.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        data["data-options"] = "";
        var dataOptions = data["data-options"] || "{}";
        var optionsJson=mini.decode(dataOptions);
        var binding = getDialogBind(data);
        optionsJson.binding = binding;
        var s = mini.encode(optionsJson);
        thisHtml.setAttribute("data-options",s);
        thisHtml.setAttribute("textName",data.name +"_name");
    }
}
/*-------------------------------------编辑按钮end-----------------------------*/

//复合控件集合
var singleControl={
    'mini-textbox':false,
    'mini-textarea':false,
    'mini-spinner':false,
    'mini-datepicker':false,
    'mini-checkbox':false,
    'mini-month':false,
    'mini-time':false,
    'mini-combobox':true,
    'mini-buttonedit':true,
    'mini-radiobuttonlist':true,
    'mini-checkboxlist':true,
    'mini-user':true,
    'mini-group':true,
    'mini-dep':true,
    'upload-panel':false
};

/*子表*/
function rxGrid(plugins,thisTagName,data){
    if(thisTagName == "li" ){
        var gridDiv = document.createElement("div");
        var buttonDiv = document.createElement("div");
        var gridTable = document.createElement("table");
        var gridThead = document.createElement("thead");
        var gridTbody = document.createElement("tbody");
        var gridTr1 = document.createElement("tr");
        var gridTr2 = document.createElement("tr");
        var gridTh = document.createElement("th");
        var gridTd = document.createElement("td");
        /* var fixedDiv = document.createElement("div");
         fixedDiv.setAttribute("class","rxGridFixed");
         fixedDiv.setAttribute("plugins","rxGrid");*/
        //外框
        var gridDivData = {
            "class":"rx-grid rxc grid-d moduleDivs",
            "plugins":"rx-grid",
            "label":data.label,
            "name":data.name,
            "edittype":"inline",
            "required":"false",
            "templateid":"",
            "pwidth":"780",
            "pheight":"250",
            "formkey":"",
            "fwidth":"0",
            "fheight":"0",
            "treegrid":"false",
            "treecolumn":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"200",
            "hunit":"px",
            "formname":"",
            "data-options":"",
            "style":"width:100%;"
        };
        //表头数据；
        var hederTdData = {
            "class":"header rxGrid",
            "displayfield":"",
            "datatype":"",
            "width":"",
            "header":"zdl",
            "length":"",
            "decimal":"",
            "requires":"false",
            "editcontrol":"mini-textbox",
            "editcontrol_name":"单行文本",
            "cellstyle":"",
            "format":"",
            "style":"text-align:left;"
        };

        //表格数据；
        var tdData = {
            "class":"rxc mini-textbox",
            "plugins":"mini-textbox",
            "property":"editor",
            "allowinput":"true",
            "mwidth":"0",
            "wunit":"px",
            "mheight":"0",
            "hunit":"",
            "datatype":"",
            "name":"",
            "label":"",
            "format":"",
            "from":"forminput"
        };

        //默认表头；
        for (var h = 0; h< 4 ;h++){
            var _th = document.createElement("th");
            for (var key in hederTdData) {
                _th.setAttribute(key,hederTdData[key]);
            }
            _th.innerText = "字段列";
            gridTr1.appendChild(_th);
        }
        //默认表格；
        for (var h = 0; h< 4 ;h++){
            var _td = document.createElement("td");
            var elementBox = document.createElement("input");
            for (var key in tdData) {
                elementBox.setAttribute(key,tdData[key]);
            }
            _td.setAttribute("header",hederTdData.header );
            _td.appendChild(elementBox);
            gridTr2.appendChild(_td);
        }
        //外框；
        for (var key in gridDivData) {
            gridDiv.setAttribute(key , gridDivData[key] );
        }

        buttonDiv.setAttribute("class","button-container");
        gridTable.setAttribute("style","width:100%;");
        gridThead.appendChild(gridTr1);
        gridTbody.appendChild(gridTr2);
        gridTable.appendChild(gridThead);
        gridTable.appendChild(gridTbody);
        gridDiv.appendChild(buttonDiv);
        gridDiv.appendChild(gridTable);
        templateView.execCommand('insertHtml', gridDiv.outerHTML);
    }else {
        var thisHtml =  templateView.body.getElementsByClassName("moduleCheck")[0];
        var headeGrid=mini.get('rxGirdHeder');

        var thisHtmlChild = thisHtml.getElementsByTagName("table")[0];
        var theads = thisHtml.getElementsByTagName("thead")[0];
        var tbodys = thisHtml.getElementsByTagName("tbody")[0];

        var tr1 = theads.getElementsByTagName("tr")[0];
        var tr2 = tbodys.getElementsByTagName("tr")[0];

        var getsDataGrid = getHeaderGridDatas();//拿到编辑前的表格数据；
        var _headerGrid = mini.get("rxGirdHeder");
        var _btnGrid = mini.get("rxGridButtonGrid");
        var _headerGridVal = _headerGrid.getData();
        var _btnGridVal = _btnGrid.getData();
        var h_gridVal = JSON.stringify(_headerGridVal);
        var b_gridVal = JSON.stringify(_btnGridVal)

        if(getsDataGrid["btnGrid"] !== b_gridVal){//对比按钮的表格数据有没有更改；
            //按钮
            var btnGrid=mini.get('rxGridButtonGrid');
            var btnGridData= btnGrid.getData();
            var tDiv = thisHtml.getElementsByClassName("button-container")[0];
            if(tDiv) {
                tDiv.innerHTML = ' ';
            }
            for(var bt = 0 ; bt<btnGridData.length ;bt++ ){
                var girdRow = btnGridData[bt];
                var btn = document.createElement("a");
                //按钮数据；
                if (girdRow.type == 'import'){
                    var sa = girdRow;
                    var name = data.name;
                    var label = data.label;
                    var settingname = girdRow.settingname;
                    var dataOptions = JSON.parse(girdRow.setting);
                    dataOptions.formData = {"name":name,"label":label}
                    var data_options = JSON.stringify(dataOptions)
                    var buttonData = {
                        "class":"mini-button",
                        "type":girdRow.type,
                        "onclick":"subExcelImport(e)",
                        "data-options":data_options
                    };
                }else if(girdRow.type == "custombtn"){
                    var label = girdRow.text;
                    var _Names = makePy(label);
                    var name = _Names[0].toLowerCase();
                    var type = girdRow.type;
                    /*    var ss = girdRow.setting;
                        var sss = girdRow.settingname;
                      */
                    if(girdRow.setting){
                        // var dataOptions = JSON.parse(girdRow.setting);
                        var dataOptions = girdRow.setting;
                        var dialogalias = dataOptions.formData["dialogalias"];
                        var dialogname = dataOptions.formData["dialogname"];
                        var seltype = dataOptions.formData["seltype"];
                        var table = dataOptions.formData["table"];
                        var data1 = dataOptions.btnGridInput;
                        var data2 = dataOptions.btnReturnFields;
                        var uniquefield = dataOptions.formData["uniquefield"];
                        for(var k1=0;k1<data1.length;k1++){
                            var row=data1[k1];
                            delete row.isUpdate;
                            delete row.pagesize;
                            delete row._id;
                            delete row._uid;
                            delete row._state;
                        }
                        for(var k2=0;k2<data2.length;k2++){
                            var row=data2[k2];
                            delete row.isUpdate;
                            delete row.pagesize;
                            delete row._id;
                            delete row._uid;
                            delete row._state;
                        }
                        var josn = {
                            "dialogalias":dialogalias,
                            "dialogname":dialogname,
                            "returnFields":data2,
                            "gridInput":data1,
                            "isMain":"true",
                            "seltype":seltype,
                            "gridName":table,
                            "uniquefield":uniquefield,
                            "onclick":""
                        };

                        var dataOptions = {};
                        var optionsJson=mini.decode(dataOptions);
                        optionsJson.binding = josn;
                        var dataOptions = mini.encode(optionsJson);
                        var  buttonData = {
                            "class":"mini-button",
                            "plugins":"mini-button",
                            "label":label,
                            "name":name,
                            "enabled":"true",
                            "ckselfdlg":"true",
                            "dialogalias":dialogalias,
                            "dialogname":dialogname,
                            "seltype":seltype,
                            "table":table,
                            "type":type,
                            "data-options":dataOptions
                        };
                    }else {
                        var  buttonData = {
                            "class":"mini-button",
                            "plugins":"mini-button",
                            "label":label,
                            "name":name,
                            "enabled":"true",
                            "ckselfdlg":"true",
                            "dialogalias":"",
                            "dialogname":"",
                            "seltype":"",
                            "table":"",
                            "type":type,
                            "data-options":""
                        };
                    }
                } else {
                    var  buttonData = {
                        "class":"mini-button",
                        "type":girdRow.type,
                        "onclick":girdRow.setting
                    };
                }
                for(var key in buttonData){
                    btn.setAttribute(key ,buttonData[key]);
                }
                btn.innerText = girdRow.text;
                tDiv.appendChild(btn);
            }
        }
        if(getsDataGrid["headerGridVal"] !== h_gridVal){//对比表头的表格数据有没有更改;
            debugger;
            if (headeGrid.getData().length > 0  ){
                var theads_ths = theads.getElementsByTagName("th")[0];
                var _header = theads_ths.getAttribute("header");
                var _text = theads_ths.innerText;
                if ( _header == "zdl" && _text == "字段列"){//第一次创建控件；
                    //表格；
                    var hederGrid=mini.get('rxGirdHeder');
                    var hederGridData= hederGrid.getData();
                    function getControlConfig(controlType){
                        for(var i=0;i<controlData.length;i++){
                            if(controlData[i].id==controlType){
                                return controlData[i];
                            }
                        }
                    }
                    while (tr1.firstChild) {//删除所有子节点
                        tr1.removeChild(tr1.firstChild);
                    }
                    while (tr2.firstChild) {
                        tr2.removeChild(tr2.firstChild);
                    }
                    for (var i = 0 ; i < hederGridData.length ; i++ ) {
                        //子表头thead；
                        var ths = document.createElement("th");
                        var row = hederGridData[i];
                        var format=row.format?row.format:'';
                        var name = row.name;
                        var vtype ="";
                        if(!row.displayfield) row.displayfield='';
                        if(!row.datatype)  row.datatype='';
                        if(!row.cellStyle)  row.cellStyle='';
                        if(!row.width) row.width='';
                        if(!row.length) row.length='';
                        if(!row.decimal) row.decimal='';
                        if(!row.requires) row.requires='false';
                        if(!row.editcontrol){
                            row.editcontrol='mini-textbox';
                            row.editcontrol_name='单行文本';
                        }
                        //显示字段自动拼接_name
                        if(singleControl[row.editcontrol]){
                            row.displayfield=row.key+"_name";
                        }
                        var obj = {
                            "class":"header rxGrid",
                            "displayfield":row.displayfield,
                            "editcontrol":row.editcontrol,
                            "editcontrol_name":row.editcontrol_name,
                            "datatype":row.datatype,
                            "width":row.width,
                            "header":row.key,
                            "requires":row.requires,
                            "cellStyle":row.cellStyle,
                            "format":format,
                        }
                        if(row.vtype){
                            obj.vtype = row.vtype;
                            obj.vtype_name = row.vtype_name;
                        }
                        for( var key in obj ){
                            ths.setAttribute(key,obj[key]);
                        }
                        ths.innerText = row.name;
                        var style = '';
                        if(row.cellStyle){
                            style = row.cellStyle + "height: 30px;line-height: 30px;color: #909399;border: 1px solid #eee;padding: 6px 10px;";
                        }else {
                            style = "text-align:left;height: 30px;line-height: 30px;color: #909399;border: 1px solid #eee;padding: 6px 10px;";
                        }
                        ths.setAttribute("style",style);
                        tr1.appendChild(ths);

                        //子表tbody;
                        var tag=row.editcontrol;
                        var thisTagName =""
                        if(tag == 'mini-textarea'){
                            thisTagName = "textarea";
                        }else if(tag == 'mini-textbox'){
                            thisTagName = "h6";
                        }else {
                            thisTagName = "input";
                        }
                        var contrConf=getControlConfig(row.editcontrol);
                        var tdObj = {
                            "class":tag ,
                            "plugins":tag,
                            "name":row.key,
                            "label":row.name,
                            "property":"editor",
                            "allowinput":"true",
                            "mwidth":"100",
                            "wunit":"%",
                            "mheight":"34",
                            "hunit":"px",
                            "datatype":row.datatype,
                            "format":row.format,
                            "from":"forminput",
                            "style":"width:100%;height:34px;"
                        };
                        if(contrConf){
                            tdObj.editcontrol = row.editcontrol;
                            tdObj.editcontrol_name = row.editcontrol_name;
                            if (!row.datatype){
                                row.datatype = contrConf.datatype;
                            }
                            if(contrConf.length){
                                tdObj.length = contrConf.length;
                            }
                        }
                        if(row.datatype=="date"){
                            tdObj.format = row.format;
                        }
                        var tds = document.createElement("td");
                        var tabElment = document.createElement(thisTagName);
                        for(var key in tdObj ){
                            tabElment.setAttribute(key ,tdObj[key] );
                        }
                        if(tag == "mini-buttonedit"){
                            tabElment.setAttribute("data-options",'');
                        }
                        if (tag != "mini-checkbox" || tag != "mini-month" || tag != "mini-tim"){
                            tabElment.setAttribute("required",row.requires);
                        }

                        rxGridModuleJugde(tag,tabElment,row);
                        tds.appendChild(tabElment);
                        tds.setAttribute("header",row.key);
                        tr2.appendChild(tds);
                    }
                }else {
                    //表格；
                    var hederGrid=mini.get('rxGirdHeder');
                    var hederGridData= hederGrid.getData();
                    function getControlConfig(controlType){
                        for(var i=0;i<controlData.length;i++){
                            if(controlData[i].id==controlType){
                                return controlData[i];
                            }
                        }
                    }
                    var trOne = [] ;
                    var trTwo = [] ;
                    for (var s = 0 ;s< tr1.children.length ;s++){
                        trOne.push(tr1.children[s]);
                        trTwo.push(tr2.children[s]);
                    }
                    while (tr1.firstChild) {//删除所有子节点
                        tr1.removeChild(tr1.firstChild);
                    }
                    while (tr2.firstChild) {//删除所有子节点
                        tr2.removeChild(tr2.firstChild);
                    }

                    for (var i = 0 ; i < hederGridData.length ; i++ ) {
                        //子表头thead；
                        var ths = document.createElement("th");
                        var row = hederGridData[i];
                        var format=row.format?row.format:'';
                        var name = row.name;
                        var vtype ="";
                        if(!row.displayfield) row.displayfield='';
                        if(!row.datatype)  row.datatype='';
                        if(!row.cellStyle)  row.cellStyle='';
                        if(!row.width) row.width='';
                        if(!row.length) row.length='';
                        if(!row.decimal) row.decimal='';
                        if(!row.requires) row.requires='false';
                        if(!row.editcontrol){
                            row.editcontrol='mini-textbox';
                            row.editcontrol_name='单行文本';
                        }
                        var obj = {
                            "class":"header rxGrid",
                            "displayfield":row.displayfield,
                            "editcontrol":row.editcontrol,
                            "editcontrol_name":row.editcontrol_name,
                            "datatype":row.datatype,
                            "width":row.width,
                            "header":row.key,
                            "requires":row.requires,
                            "cellStyle":row.cellStyle,
                            "format":format,
                        };
                        if(row.vtype){
                            obj.vtype = row.vtype;
                            obj.vtype_name = row.vtype_name;
                        }
                        for( var key in obj ){
                            ths.setAttribute(key,obj[key]);
                        }
                        ths.innerText = row.name;
                        var style = '';
                        if(row.cellStyle){
                            style = row.cellStyle + "height: 30px;line-height: 30px;color: #909399;border: 1px solid #eee;padding: 6px 10px;";
                        }else {
                            style = "text-align:left;height: 30px;line-height: 30px;color: #909399;border: 1px solid #eee;padding: 6px 10px;";
                        }
                        ths.setAttribute("style",style);

                        tr1.appendChild(ths);

                        //子表tbody;
                        var tag=row.editcontrol;
                        var thisTagName =""
                        if(tag == 'mini-textarea'){
                            thisTagName = "textarea";
                        }else if(tag == 'mini-textbox'){
                            thisTagName = "h6";
                        }else {
                            thisTagName = "input";
                        }
                        var contrConf=getControlConfig(row.editcontrol);
                        var tdObj = {
                            "class":tag ,
                            "plugins":tag,
                            "name":row.key,
                            "label":row.name,
                            "property":"editor",
                            "allowinput":"true",
                            "mwidth":"100",
                            "wunit":"%",
                            "mheight":"34",
                            "hunit":"px",
                            "datatype":row.datatype,
                            "format":row.format,
                            "from":"forminput",
                            "style":"width:100%;height:34px;"
                        };
                        if(contrConf){
                            tdObj.editcontrol = row.editcontrol;
                            tdObj.editcontrol_name = row.editcontrol_name;
                            if (!row.datatype){
                                row.datatype = contrConf.datatype;
                            }
                            if(contrConf.length){
                                tdObj.length = contrConf.length;
                            }
                        }
                        if(row.datatype=="date"){
                            tdObj.format = row.format;
                        }
                        var _thisTd = trTwo[i];
                        var thisTagName2=null;
                        if(_thisTd){
                            var htmlData = beforeRowData() //获取编辑前的数据 ，方法在d_rx-grid.jsp中;
                            var _className = htmlData[i];
                            thisTagName2 = htmlData[i].plugins;
                        }
                        var tds = document.createElement("td");
                        var tabElment = document.createElement(thisTagName);
                        for(var key in tdObj ){
                            tabElment.setAttribute(key ,tdObj[key] );
                        }
                        if(tag == "mini-buttonedit"){
                            tabElment.setAttribute("data-options",'');
                        }

                        if(i < htmlData.length){
                            if (htmlData[i].plugins !=""){
                                if (tag && thisTagName2 && tag.toLowerCase() == thisTagName2.toLowerCase()){
                                    var attr = htmlData[i] ;
                                    if(attr) {
                                        for (var key in attr) {
                                            var val = attr[key];
                                            if (key == "data-options" ){
                                                val=val.replace(new RegExp('&quot;', "g"), "\"");
                                            }
                                            tabElment.setAttribute(key,val );
                                        }
                                    }
                                }
                            }
                        }
                        rxGridModuleJugde(tag,tabElment,row);
                        //设置内置控件的标识
                        tabElment.setAttribute("name",row.key);
                        tabElment.setAttribute("label",row.name);
                        tds.setAttribute("header",row.key);
                        tds.appendChild(tabElment);
                        tr2.appendChild(tds);
                    }
                }

            }
        }

        if(data.edittype == "openwindow"){//弹窗子表；
            var miniWindow = thisHtml.getElementsByClassName("mini-window")[0];
            if(miniWindow){
                miniWindow.remove();
            }
            var openDiv = document.createElement("div");
            var toolBox = document.createElement("div");//创建form-toolBox  div;
            toolBox.setAttribute("class","form-toolBox rxGrid");
            var btn1 = document.createElement("a");//创建按钮 保存;
            var btn2 = document.createElement("a");//创建按钮 关闭;
            btn1.innerText = "保存";
            btn1.style.color = "#fff";
            btn1.setAttribute("class","mini-button button-d rxGrid");
            btn1.setAttribute("onclick","saveFormDetail('"+ data.name +"')");
            btn2.innerText = "关闭";
            btn2.style.color = "#fff";
            btn2.setAttribute("class","mini-button button-d rxGrid");
            btn2.setAttribute("onclick","closeFormDetail('"+ data.name +"')");

            var editDiv = document.createElement("div");//创建editForm_div;
            editDiv.setAttribute("id","editForm_"+ data.name );
            editDiv.setAttribute("class","form");
            /*      var inp = document.createElement("input");//创建隐藏域input
                  inp.setAttribute("class","mini-hidden");
                  inp.setAttribute("name","_uid");
                  inp.setAttribute("type","hidden");*/
            var inp = '<input class="mini-hidden" type="hidden" name="_uid">';
            var gridData = mini.get("rxGirdHeder").getData();
            var _id = data.templateid ;

            var json = $.ajax({
                url: __rootPath +"/bpm/form/bpmFormView/getTemplateHtml.do?templateId="+_id,
                async: false,
                data:{
                    columns:mini.encode(gridData)
                }
            }).responseText;
            try{
                var html = mini.decode(json).data;
            }catch(ex){
                mini.alert(ex);
            }

            var style = "width:"+ data.pwidth +"px"+";height:" + data.pheight +'px' ;
            var openData = {
                "id":"editWindow_"+ data.name,
                "class":"mini-window popup-window-d",
                "title":"编辑"+ data.label +"信息",
                "style":style,
                "showmaxbutton":"true",
                "showmodal":"true",
                "allowresize":"true",
                "allowdrag":"true"
            }
            for (var key in openData) {
                openDiv.setAttribute(key,openData[key]);
            }
            toolBox.appendChild(btn1);
            toolBox.appendChild(btn2);
            openDiv.appendChild(toolBox);
            //    editDiv.appendChild(inp);
            editDiv.innerHTML = inp + html ;
            openDiv.appendChild(editDiv);
            thisHtml.appendChild(openDiv);
            thisHtmlChild.style.display = "none";
        }else {
            thisHtmlChild.style.display = "";
            var openwindow =  thisHtml.getElementsByClassName("mini-window")[0];
            if(openwindow){
                openwindow.style.display = "none";
            }
        }

        $.each(data,function(key,value){
            thisHtml.setAttribute(key,data[key]);
        });
        thisHtml.classList.remove("onNndefined");
        thisHtml.setAttribute('data-options','{label:\\\''+data.label+'\\\',required:'+ data.required +'}');
        //把表格中的数据放到容器属性中；
        /*  thisHtml.setAttribute("headedata",headedata);
          thisHtml.setAttribute("buttondata",buttondata);*/
    }

    function rxGridModuleJugde(tag,tabElment,rows) {
        if(tag == "mini-textbox"){//单行文本；
            tabElment.setAttribute("datatype" ,rows.datatype);
            if(!rows.format){
                if(row.datatype =="number"){
                    tabElment.setAttribute("format" ,"0.00" );
                }else {
                    tabElment.setAttribute("format" ,"" );
                }
            }
        }
        if(tag == "mini-textarea"){//多行文本；
            tabElment.setAttribute("datatype" ,rows.datatype );
        }
        if(tag == "mini-spinner"){//数字；
            if(!rows.format){
                tabElment.setAttribute("format" ,"0.00" );
            }
        }
        if(tag == "mini-datepicker"){//日期；
            tabElment.setAttribute("format" ,"yyyy-MM-dd HH:mm" );
            tabElment.setAttribute("timeformat" ,"H:mm:ss" );
            tabElment.setAttribute("from" ,"none" );
        }
        if(tag == "mini-checkbox"){//复选框；truevalue="是" falsevalue="否"
            tabElment.setAttribute("length" ,"20" );
            tabElment.setAttribute("truevalue" ,"是" );
            tabElment.setAttribute("falsevalue" ,"否" );
        }
        if(tag == "mini-time"){//时间；
            tabElment.setAttribute("format" ,"hh:mm:ss" );
            tabElment.setAttribute("value" ,"00:00:00" );
        }
        if(tag == "mini-combobox"){//下拉框；
            tabElment.setAttribute("length" ,"50" );
            tabElment.setAttribute("from" ,"self" );
        }
        if(tag == "mini-buttonedit"){//编辑按钮； length="50" minlen="0"
            tabElment.setAttribute("length" ,"50" );
            tabElment.setAttribute("minlen" ,"0" );
        }
        if(tag == "mini-user"){//用户选择； length="50"
            tabElment.setAttribute("length" ,"50" );
            tabElment.setAttribute("single" ,"true" );
            tabElment.setAttribute("initloginuser" ,"true" );
        }
        if(tag == "mini-group"){//用户组选择； length="50"
            tabElment.setAttribute("length" ,"50" );
            tabElment.setAttribute("single" ,"true" );
        }
        if(tag == "mini-dep"){//部门选择器； length="50"
            tabElment.setAttribute("length" ,"50" );
            tabElment.setAttribute("minlen" ,"0" );
            tabElment.setAttribute("single" ,"true" );
        }
        if(tag == "upload-panel"){//附件上传；
            tabElment.setAttribute("length" ,"2048" );
            tabElment.setAttribute("sizelimit" ,"50" );
            tabElment.setAttribute("isone" ,"false" );
        }
        if(tag == "mini-radiobuttonlist" ){//单选；
            tabElment.setAttribute("from" ,"self" );
            tabElment.setAttribute("repeatlayout" ,"flow" );
            tabElment.setAttribute("repeatdirection" ,"horizontal" );
        }
        if(tag == "mini-checkboxlist" ){//复选按钮；
            tabElment.setAttribute("from" ,"self" );
            tabElment.setAttribute("repeatlayout" ,"flow" );
            tabElment.setAttribute("repeatdirection" ,"horizontal" );
        }
    }
}

/*-----------------------------------------------子表----------------------------------end*/


/*数据列表*/
function miniList(plugins,thisTagName,data){
    if (thisTagName){
        var miniListBox = document.createElement("div");
        miniListBox.setAttribute("class","miniListBox")
        miniListBox.setAttribute("gridMode","relQuery");
        miniListBox.setAttribute("plugins","mini-data-list");
        var fixedBox = document.createElement("div");
        fixedBox.setAttribute("class","miniListFixed");
        fixedBox.setAttribute("plugins","dataList");
        var dataListDiv = document.createElement("div");
        var formToolDiv = document.createElement("div");
        var formInputBox = document.createElement("div");
        formToolDiv.setAttribute("class","form-toolBox");
        formInputBox.setAttribute("class","form-toolBox");
        formInputBox.setAttribute("id","searchForm_xx");
        var gridBox = document.createElement("div");
        var gridBoxChild = document.createElement("div");
        gridBoxChild.setAttribute("property","columns");

        var data = {//外层盒子；
            "id":"data_listWrapper" ,
            "alias":"data_list" ,
            "form":"data" ,
            "class":"grid-container mini-list",
            "plugins":"mini-list"
        }
        var btnData ={//按钮；
            "onAdd":"新建",
            "onEdit":"编辑",
            "onDetail":"明细",
            "onDel":"删除",
            "onSearch":"搜索",
            "onClear":"清空"
        };
        var grid = {
            "id":"xxGrid",
            "class":"mini-datagrid relation-grid",
            "allowresize":"false",
            "expandonload":"true",
            "height":"auto",
            "idfield":"ID_",
            "multiselect":"true",
            "data-options":"{}",
            "sizelist":"[5,10,20,50,100,200,500]",
            "pagesize":"20",
            "allowalternating":"true",
            "style":"width: 100%;",
            "plugins":"dataList"
        };
        var gridChild = {
            "row1":[{"type":"indexcolumn"}],
            "row2":[{"type":"checkcolumn"}],
            "row3":[{"header":"列一", "width":"100"}],
            "row4":[{"header":"列二", "width":"100"}],
            "row5":[{"header":"列三", "width":"100"}],
            "row6":[{"header":"列四", "width":"100"}],
            "row7":[{"header":"列五", "width":"100"}],
            "row8":[{"header":"列六", "width":"100"}]
        };
        for(var key in btnData){
            var btn_a = document.createElement("a");
            btn_a.setAttribute("class","mini-button");
            btn_a.setAttribute("onclick","RelationGrid."+ key );
            btn_a.innerText = btnData[key];
            formToolDiv.appendChild(btn_a);
        }
        formToolDiv.appendChild(formInputBox);

        for(var t in grid){
            gridBox.setAttribute(t,grid[t]);
        }
        for(var row in gridChild){//列；
            var rowDiv = document.createElement("div");
            var rowArr = gridChild[row];
            var arr = rowArr[0];

            for (var r in arr){
                rowDiv.setAttribute(r,arr[r]);
            }
            if(!arr.type){
                rowDiv.innerText = arr.header;
            }
            gridBoxChild.appendChild(rowDiv);
        }
        defaultModule(dataListDiv, data);
        gridBox.appendChild(gridBoxChild)
        dataListDiv.appendChild(formToolDiv);
        dataListDiv.appendChild(gridBox);
        miniListBox.appendChild(fixedBox);
        miniListBox.appendChild(dataListDiv);
        templateView.execCommand('insertHtml', miniListBox.outerHTML);
    } else {
        var gridHtml = miniListGridHtml();//选择的列表；
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        thisHtml.setAttribute("listid",data.listId);
        //创建一个遮盖层；
        var fixedBox = document.createElement("div");
        fixedBox.setAttribute("class","miniListFixed");
        fixedBox.setAttribute("plugins","dataList");
        if(gridHtml!= ""){
            thisHtml.innerHTML = '';//清空；
            thisHtml.appendChild(fixedBox);
            thisHtml.innerHTML += gridHtml;
        }
        //给新增的Html中添加参数；
        var grid =  thisHtml.getElementsByClassName("relation-grid")[0];//表格；
        var json=eval("(" +grid.getAttribute("data-options") +")");
        var ops =  getSettingJson();
        $.extend(json, ops);
        grid.setAttribute("data-options",JSON.stringify(json));
        thisHtml.removeAttribute("gridmode");
    }
}

/*------------------------------------数据列表end---------------------------------------------*/

/*文本盒子*/
function miniTextboxlist(plugins,thisTagName,data) {
    if (thisTagName){
        var textBoxInput = document.createElement("input");
        var data = {
            "class":"mini-textboxlist rxc moduleDivs",
            "plugins":"mini-textboxlist",
            "label":data.label,
            "name":data.name,
            "textname":"",
            "length":"50",
            "allowinput":"false",
            "isurl":"false",
            "url":"",
            "required":"false",
            "valuefield":"id",
            "textfield":"text",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "value":"",
            "text":"",
            "data":"",
            "style":"height:34px;width:100%;"
        }
        defaultModule(textBoxInput, data);
        templateView.execCommand('insertHtml', textBoxInput.outerHTML);
    } else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.setAttribute("textname", data.name + "_name")
        thisHtml.classList.remove("onNndefined");
        var gridData=mini.get('defaultGrid');
        var data=mini.encode(gridData.getData());

        var gridKeys="";
        var gridValues="";
        var _data=gridData.getData();
        var gridData=[];
        for(var i=0;i<_data.length;i++){
            if(typeof(_data[i].key)=="undefined"||typeof(_data[i].name)=="undefined")continue;
            gridData.push(_data[i]);
        }
        for (var i = 0; i < gridData.length; i++) {
            if(i==0){
                gridKeys=gridData[i].key;
                gridValues=gridData[i].name;
                continue;
            }
            gridKeys=gridKeys+","+gridData[i].key;
            gridValues=gridValues+","+gridData[i].name;
        }
        thisHtml.setAttribute('value',gridKeys);
        thisHtml.setAttribute('text',gridValues);
        thisHtml.setAttribute("data",data);
        thisHtml.classList.remove("onNndefined");
    }
}
/*---------------------------------文本盒子end---------------------*/

/*审批历史*/
function miniCheckhilist(plugins,thisTagName,data){
    if( thisTagName == "li" ){
        var inputs = document.createElement("input");
        var data ={
            "class":"mini-checkhilist rxc moduleDivs",
            "plugins":"mini-checkhilist",
            "label":data.label,
            "name":data.name,
        }
        defaultModule(inputs, data);
        templateView.execCommand('insertHtml', inputs.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
    }
}
/*---------------------------------审批历史end---------------------*/

/*关联流程*/

function miniRelatedsolution(plugins,thisTagName,data) {
    if( thisTagName == "li" ){
        var inputs = document.createElement("input");
        var data ={
            "class":"mini-relatedsolution rxc moduleDivs",
            "plugins":"mini-relatedsolution",
            "label":data.label,
            "name":data.name,
            "solutionname":"",
            "solution":"",
            "chooseitem":"single",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"%",
            "style":"width:auto"
        }
        defaultModule(inputs, data);
        templateView.execCommand('insertHtml', inputs.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        var solution=mini.get("solution");
        changeModule(thisHtml,data);
        thisHtml.setAttribute("solutionname",solution.getText());
        thisHtml.classList.remove("onNndefined");
    }
}

/*-----------------------------------关联流程end-------------------------------*/

/*用户选择*/
function miniUser(plugins,thisTagName,data){
    if(thisTagName == "li"){
        var userInput = document.createElement("input");
        var data = {
            "class":"mini-user moduleDivs rxc",
            "plugins":"mini-user",
            "data-options":"{}",
            "initdim":"",
            "initranklevel":"",
            "allowinput":"false",
            "label":data.label,
            "name":data.name,
            "textname":"",
            "length":"50",
            "maxlength":"50",
            "refconfig":"",
            "mainfield":"no",
            "dimlevel":"",
            "dimid":"",
            "single":"true",
            "required":"false",
            "initloginuser":"true",
            "orgconfig":"",
            "groupid":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "style":"width:100%;height:34px"
        }
        defaultModule(userInput, data);
        templateView.execCommand('insertHtml', userInput.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
        //初始维度
        var initDim = mini.get('initDim').getValue();
        var initDimText = mini.get('initDim').getText();
        //初始等级
        var initRankLevel = mini.get('initRankLevel').getValue();
        var initRankLevelText = mini.get('initRankLevel').getText();
        //加入data-option
        var dataOptions = {initRankLevel:initRankLevel,initRankLevelText:initRankLevelText,initDim:initDim,initDimText:initDimText};
        thisHtml.setAttribute('data-options',mini.encode(dataOptions));
        thisHtml.setAttribute('initdim',initDim);
        thisHtml.setAttribute('initranklevel',initRankLevel);
        thisHtml.setAttribute('allowinput','false');
        var groupid = mini.get('groupid');
        var orgId = mini.get('orgId');
        if(data.refconfig == "specific"){
            thisHtml.setAttribute('dimname',groupid.getText());
        }
        if(data.orgconfig == "selOrg"){
            thisHtml.setAttribute('orgname',orgId.getText());
        }
        for(var key in data){
            if(key == "name"){
                thisHtml.setAttribute("textname",data[key] +"_name");
            }
            if(key=="length" && data[key] && data[key]!=0){
                thisHtml.setAttribute("maxlength",data[key]);
            }
        }

    }
}

/*-----------------------------------用户选择end-------------------------------*/

/*用户组选择*/
function miniGroup(plugins,thisTagName,data){
    if(thisTagName =="li"){
        var inputGroup = document.createElement("input");
        var data ={
            "class":"mini-group rxc moduleDivs",
            "plugins":"mini-group",
            "data-options":"{}",
            "allowinput":"false",
            "label":data.label,
            "name":data.name,
            "textname":"",
            "length":"50",
            "maxlength":"50",
            "single":"true",
            "required":"false",
            "showdim":"true",
            "initlogingroup":"true",
            "level":"",
            "dimid":"1",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "style":"width:100%;height:34px"
        }
        defaultModule(inputGroup, data);
        templateView.execCommand('insertHtml', inputGroup.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
        var single=mini.get('singleGroup').getValue();
        var showDim=mini.get('showdimGroup').getValue();
        var dimId=mini.get('dimidGroup').getValue();
        var level=mini.get('levelGroup').getValue();
        var dataOptions={single:single,showdim:showDim,dimid:dimId,level:level};
        thisHtml.setAttribute('data-options',mini.encode(dataOptions));
        thisHtml.setAttribute('allowinput','false');
        for(var key in data){
            if(key=="name"){
                thisHtml.setAttribute("textname",data[key] +"_name");
            }
            if(key=="length" && data[key] && data[key]!=0){
                thisHtml.setAttribute("maxlength",data[key]);
            }
        }
    }
}
/*----------------------------------用户组选择end--------------------------------*/

/*部门选择器*/
function miniDep(plugins,thisTagName,data){
    if (thisTagName == "li" ){
        var inputEl=  document.createElement("input");
        var data = {
            "class":"mini-dep moduleDivs rxc",
            "plugins":"mini-dep",
            "data-options":"{}",
            "allowinput":"false",
            "label":data.label,
            "name":data.name,
            "textname":"",
            "length":"50",
            "maxlength":"50",
            "minlen":"0",
            "single":"true",
            "required":"false",
            "initlogindep":"true",
            "level":"",
            "refconfig":"",
            "grouplevel":"",
            "groupid":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"34",
            "hunit":"px",
            "style":"width:100%;height:34px"
        }
        defaultModule(inputEl, data);
        templateView.execCommand('insertHtml', inputEl.outerHTML);
    } else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
        var single=mini.get('singledep').getValue();
        var refconfig = mini.get('refconfigdep').getValue();
        var grouplevel = mini.get('groupleveldep').getValue();
        var groupid = mini.get('groupiddep').getValue();
        var groupidText = mini.get('groupiddep').getText();
        var config = {type:refconfig, grouplevel:grouplevel, groupid:groupid , groupidtext:groupidText};
        var dataOptions={single:single, config:config};
        thisHtml.setAttribute('data-options',mini.encode(dataOptions));
        thisHtml.setAttribute('allowinput','false');
        for(var key in data){
            if(key=="name"){
                thisHtml.setAttribute("textName",data[key] +"_name");
            }
            if(key=="length" && data[key] && data[key]!=0){
                thisHtml.setAttribute("maxLength",data[key]);
            }
        }
    }
}
/*----------------------------------------------部门选择器end------------------------------------------*/
/*自定义按钮*/
function miniButton(plugins,thisTagName,data) {
    if(thisTagName == "li"){
        var button = document.createElement("a");
        var data ={
            "href":"#",
            "class":"mini-button rxc moduleDivs",
            "plugins":"mini-button",
            "label":"按钮名称",
            "name":"anmc",
            "enabled":"true",
            "ckselfdlg":"false",
            "dialogalias":"",
            "dialogname":"",
            "seltype":"normal",
            "table":"",
            "uniquefield":"",
            "onclick":"",
            "data-options":"",
            "style":"color:#fff"
        }
        defaultModule(button, data);
        button.innerText = data.label;
        templateView.execCommand('insertHtml', button.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
        for(var key in data){
            if(key=="label"){
                data["text"] = data[key];
            }
        }
        thisHtml.setAttribute("style","color:#fff");
        var dataOptions=thisHtml.getAttribute("data-options") || "{}";
        var optionsJson=mini.decode(dataOptions);
        var binding=getDialogBind(data);
        optionsJson.binding = binding;
        thisHtml.setAttribute("data-options",mini.encode(optionsJson));
        thisHtml.innerText = data.label;
    }
}
/*-------------------------------------自定义按钮end-------------------------*/

/*审批意见*/
function miniNodeopinion(plugins,thisTagName,data){
    if(thisTagName == "li"){
        var textarea = document.createElement("textarea");
        var data = {
            "class":"mini-nodeopinion moduleDivs rxc",
            "plugins":"mini-nodeopinion",
            "label":data.label,
            "name":data.name,
            "required":"false",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"60",
            "hunit":"px",
            "style":"width:100%;height:60px"
        }
        defaultModule(textarea, data);
        templateView.execCommand('insertHtml', textarea.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
        for(var key in data){
            if(key == "name"){
                thisHtml.setAttribute(key,"FORM_OPINION_" + data[key]);
            }
        }
    }
}

/*-------------------------------------审批意见end---------------------------------------*/

/*office*/
function miniOffice(plugins,thisTagName,data){
    if (thisTagName == "li"){
        var ofDiv = document.createElement("input");
        var data = {
            "class":"mini-office moduleDivs rxc",
            "plugins":"mini-office",
            "label":data.label,
            "name":data.name,
            "version":"false",
            // "uploadmodel":"uploadShow",
            "mwidth":"100",
            "wunit":"%",
            //  "mheight":"34",
            //    "hunit":"px",
            //   "readonly":"false",
            "style":"width:100%;height:34px"
        }
        defaultModule(ofDiv, data);
        templateView.execCommand('insertHtml', ofDiv.outerHTML);
    } else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        defaultModule(thisHtml,data);
        var docType = mini.get("docType");
        var styles = "width:"+ data.mwidth + data.wunit +";height:34px;";
        thisHtml.setAttribute("style",styles);
        thisHtml.setAttribute("docType",docType.getValue());
        thisHtml.classList.remove("onNndefined");
    }
}
/*---------------------------------------office end---------------------------------------*/

/*内窗控件*/
function miniIframe(plugins,thisTagName,data){
    if (thisTagName == "li"){
        var ifmDiv = document.createElement("div");
        var data = {
            "class":"mini-iframe moduleDivs rxc",
            "plugins":"mini-iframe",
            "src":"",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"200",
            "hunit":"px",
            "style":"width:100%;height:200px"
        }
        defaultModule(ifmDiv, data);
        templateView.execCommand('insertHtml', ifmDiv.outerHTML);
    } else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.innerText = data.src;
        thisHtml.classList.remove("onNndefined");
    }
}
/*---------------------------------------内窗控件end---------------------------------------*/

/*word模板*/
function miniViewword(plugins,thisTagName,data){
    if(thisTagName == "li" ){
        var wordDiv = document.createElement("div");
        var data = {
            "class":"mini-viewword moduleDivs rxc",
            "iconcls":"icon-word",
            "plugins":"mini-viewword",
            "alias":"",
            "pk":"ID_",
            "title":"打印"
        }
        defaultModule(wordDiv, data);
        wordDiv.innerText = data.title;
        templateView.execCommand('insertHtml', wordDiv.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        defaultModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
    }
}
/*---------------------------------------word模板 end---------------------------------------*/

/*上下文控件*/
function miniContextonly(plugins,thisTagName,data){
    if(thisTagName == "li" ){
        var spanEl = document.createElement("span");
        var data = {
            "class":"mini-contextonly moduleDivs rxc",
            "iconcls":"icon-seq-no-18",
            "plugins":"mini-contextonly",
            "label":data.label,
            "name":data.name,
            "constantitem":"[PLEASECHOSE]",
            "default":"请选择..."
        }
        defaultModule(spanEl, data);
        var val = data["default"];
        var text = data["constantitem"];
        spanEl.innerText = text.slice(0,text.length - 1) + ":" + val +"]"
        templateView.execCommand('insertHtml', spanEl.outerHTML);
    }else {
        var thisHtml = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(thisHtml,data);
        thisHtml.classList.remove("onNndefined");
        var select = mini.get("constant_item");
        var selectTextVal = select.getText();
        var selectVal = select.value;
        thisHtml.innerHTML = selectVal.slice(0,selectVal.length - 1) + ":" + selectTextVal +"]"
    }
}

function  miniWindow(plugins,thisTagName,data) {
    if(thisTagName == "li" ){

    }else {
        var html = templateView.body.getElementsByClassName("moduleCheck")[0];
        changeModule(html,data);
        if (data.mheight == 0){
            var style = "width:" + data.mwidth + data.wunit +";height:auto;";
            html.setAttribute("style",style);
        }else {
            var style = "width:" + data.mwidth + data.wunit +"!important;height:" + data.mheight + data.hunit ;
            html.setAttribute("style",style);
        }
    }
}


function miniTabs(plugins,thisTagName,data){
    if(thisTagName == "li" ){
        var miniTabBox = document.createElement("div");//整个Tab
        miniTabBox.setAttribute("class","miniTabBox moduleDivs top");
        var shadeDiv = document.createElement("div");
        shadeDiv.setAttribute("class","shadeDiv");
        shadeDiv.setAttribute("plugins","shadeDiv");
        miniTabBox.appendChild(shadeDiv);
        var headerUl = document.createElement("div");//头部
        headerUl.setAttribute("class","editTabHeader");
        var miniTabs = document.createElement("div");//身体
        for (var i = 0 ; i<2 ; i++ ){
            var li_div = document.createElement("div");
            li_div.setAttribute("idx",i);
            li_div.innerText = "Tab按钮二";
            if (i == 0){
                li_div.classList.add("activeLi");
                li_div.innerText = "Tab按钮一";
            }
            headerUl.appendChild(li_div);
        }

        var tabData = {
            "class":"mini-tabs",
            "plain":"false",
            "headergrids":"[{&quot;_id&quot;:39,&quot;_uid&quot;:39,&quot;_state&quot;:&quot;added&quot;,&quot;name&quot;:&quot;Tab按钮一&quot;},{&quot;_id&quot;:40,&quot;_uid&quot;:40,&quot;_state&quot;:&quot;added&quot;,&quot;name&quot;:&quot;Tab按钮二&quot;}]",
            "plugins":"mini-tabs",
            "label":"asd",
            "name":"asd",
            "tabposition":"top",
            "widthvalue":"100",
            "mwidth":"100",
            "wunit":"%",
            "mheight":"200",
            "hunit":"px",
            "style":";width:100%;height:200px"
        };

        for (var k1 = 0 ; k1 < 2 ; k1++ ){
            var sonDiv = document.createElement("div");
            sonDiv.setAttribute("class","pageDiv");
            sonDiv.setAttribute("title","Tab按钮二");
            if (k1 == 0){
                sonDiv.classList.add("activeDiv");
                sonDiv.setAttribute("title","Tab按钮一");
            }
            miniTabs.appendChild(sonDiv);
        }
        defaultModule(miniTabs, tabData);
        miniTabBox.appendChild(headerUl);
        miniTabBox.appendChild(miniTabs);
        templateView.execCommand('insertHtml', miniTabBox.outerHTML);
    }else {
        var html = templateView.body.getElementsByClassName("moduleCheck")[0];
        var editTabHeader = html.getElementsByClassName("editTabHeader")[0];
        var shadeDiv = html.getElementsByClassName("shadeDiv")[0];
        var tabsHtml =  html.getElementsByClassName("mini-tabs")[0];
        var tabGrid = mini.get("tabGrid");
        var tabGridData = tabGrid.getData();
        var t_Data = tabHtmlData();//编辑好的数据；

        var newHeader = editTabHeader;
        var newTabs = tabsHtml;
        html.removeChild(editTabHeader);//暂时清除掉；
        html.removeChild(tabsHtml);//暂时清除掉；
        defaultModule(newTabs, data);
        newHeader.innerHTML = "";//清空掉原来的内容；
        newTabs.innerHTML = "";//清空掉原来的内容；

        for (var he = 0 ; he<t_Data.length ;he++){
            var names = t_Data[he].name;
            //header;
            var header_div = document.createElement("div");
            header_div.setAttribute("idx",he);
            header_div.innerText = names;
            //tab-children;
            var tab_div = document.createElement("div");
            tab_div.setAttribute("class","pageDiv");
            tab_div.setAttribute("title",names);
            tab_div.innerHTML = t_Data[he].childHtml;
            if (he == 0){
                header_div.setAttribute("class","activeLi");
                tab_div.classList.add("activeDiv");
            }
            newHeader.appendChild(header_div);
            newTabs.appendChild(tab_div);
        }
        if(data.tabposition == "bottom"){//为bottom的时候header的结构是在下面；
            html.appendChild(newTabs);
            html.appendChild(newHeader);
        }else {
            html.appendChild(newHeader);
            html.appendChild(newTabs);
        }
        newTabs.setAttribute("headergrids",mini.encode(tabGridData));
        html.setAttribute("class","miniTabBox moduleDivs moduleCheck "+ data.tabposition);
        if(data.tabposition == "left" || data.tabposition == "right"){
            var style = ";width:auto;height:"+ data.mheight + data.hunit;
            newTabs.setAttribute("style",style);
            newHeader.setAttribute("style","width:"+ data.widthvalue +"px");
            shadeDiv.setAttribute("style","width:"+ data.widthvalue +"px");
        }
        else{
            var style = ";width:100%;height:"+ data.mheight + data.hunit;
            newHeader.setAttribute("style","width:auto;");
            shadeDiv.setAttribute("style","width:100%;");
            newTabs.setAttribute("style",style);
        }
    }
}

/*miniHorizontal   miniVertical*/
/*横屏*/
function  miniHorizontal(plugins,thisTagName,data) {
    if(thisTagName == "li" ){
        var _div =document.createElement("header");
        _div.setAttribute("id","miniHorizontal")
        templateView.execCommand('insertHtml', _div.outerHTML);
    }
}
/*竖屏*/
function  miniVertical(plugins,thisTagName,data) {
    if(thisTagName == "li" ){
        var _div =document.createElement("header");
        _div.setAttribute("id","miniVertical")
        templateView.execCommand('insertHtml', _div.outerHTML);
    }
}

/*分割线*/
function  miniLine(plugins,thisTagName,data) {
    if(thisTagName == "li" ){
        var _div =document.createElement("div");
        _div.setAttribute("class","mini-line")
        templateView.execCommand('insertHtml', _div.outerHTML);
    }
}