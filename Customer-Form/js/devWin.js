/**
* author:lzh 
* 作用:可拖拽排序表单实现
* 参数:oclick     点击触发事件的对象
*      ocreate    出发后在表单中传入的对象
*      bisMany    单个oclick对象是否可拖入多个ocreate对象
*      oplace     拖入时占位div对象
*      obox       拖入的容器，不填则默认为body
*/
function createWin(oclick,ocreate,bisMany,oplace,obox=document.body)
{
    //是否点击了触发对象
    var isClick = false;
    //触发对象是否为容器内的元素
    var isIncludeBox = false;
    oplace.style.width = obox.offsetWidth-5 + "px";
    oplace.style.height = oclick.offsetHeight-5 + "px";
    //移动效果的临时元素
    var oclickClone;
    var oclickDown;
    //计算偏移量
    var diffObj;
    var diffX;
    var diffY;
    var tmp;
    var omove_position;
    //点是否包含在容器内
    function isInclude(x,y,includeBox=obox)
    {
        if(x  > includeBox.offsetLeft 
        && y > includeBox.offsetTop 
        && x < includeBox.offsetLeft + includeBox.offsetWidth
        && y < includeBox.offsetTop + includeBox.offsetHeight)
            return true;
        return false;
    }
    //移动效果函数
    function moveMagic(omove,e)
    {
        // omove_position = window.getComputedStyle(omove).getPropertyValue('position');
        omove.style.opacity = 0.4;
        omove.style.position = "absolute";
        document.body.appendChild(omove);
        omove.style.left = e.clientX-diffX+"px";
        omove.style.top = e.clientY-diffY+"px";
    }
    function getdiff(e)
    {
        diffObj = e.target;
        diffX = e.clientX-diffObj.offsetLeft;
        diffY = e.clientY-diffObj.offsetTop;
    }
    //鼠标按下事件
    function down(e)
    {
        if(isInclude(e.clientX,e.clientY,oclick))
        {
            isClick = true;
            //克隆点击的触发节点
            oclickClone=oclick.cloneNode(true);
            //计算鼠标的偏移量（如果有margin的话会有偏移现象）
            getdiff(e);
        }
        else
        {
            getdiff(e);
            var child = obox.childNodes;
            for(var i=0; i < child.length; i++)
            {
                //判断鼠标点击是否是容器内的元素，并且不能是占位div（如果不加这个占位div判断会有bug，具体原因不知道）
                if(isInclude(e.clientX,e.clientY,child[i])&& child[i] != oplace)
                {
                    isClick = true;
                    isIncludeBox = true;
                    //克隆元素用来拖动时的效果
                    oclickClone = child[i].cloneNode(true);
                    //克隆元素用来放下
                    oclickDown = child[i].cloneNode(true);
                    //按下之后删除元素，并使用移动效果来展示元素
                    obox.removeChild(child[i]);
                    moveMagic(oclickClone,e);
                    //插入占位div来弄
                    obox.insertBefore(oplace,child[i]);
                    // flag = true;
                    break;
                }
            }
        }
    }
    //鼠标移动事件
    function move(e)
    {
        if(isClick)
        {
            moveMagic(oclickClone,e);
            //判断鼠标是否移动到了容器内部
            if(isInclude(e.clientX,e.clientY,obox))
            {
                //计算容器内的子节点
                var child = obox.childNodes;
                //一旦进入就可以在首位置插入占位DIV
                obox.insertBefore(oplace,child[0]);
                //根据鼠标位置放置占位DIV
                for(var i = 0; i < child.length; i++)
                {
                    //因为占位DIV是唯一的，所以只需要这样判断即可
                    if(e.clientY > child[i].offsetTop+child[i].offsetHeight/2)
                    {
                        //判断是否拖动到了结尾
                        if(i != child.length-1)
                            obox.insertBefore(oplace,child[i+1]);
                        else
                            obox.appendChild(oplace);
                    }
                }
            }
        }
    }
    //鼠标抬起事件
    function up(e)
    {
        isClick = false;
        //鼠标抬起则可以删除临时的拖动效果元素
        document.body.removeChild(oclickClone);
        //如果将元素放置到了容器内
        if(isInclude(e.clientX,e.clientY))
        {
            var child = obox.childNodes;
            //占位div的位置
            var insertPlace;
            for(var i=0; i<child.length;i++)
            {
                //确定占位div的位置
                if(oplace === child[i])
                {
                    obox.removeChild(child[i]);
                    insertPlace = i;
                    break;
                }
            }
            //判断是否可以放置多个
            if(!bisMany)
            {
                if(isIncludeBox)
                    ocreate = oclickDown;
                if(insertPlace==child.length)
                    obox.appendChild(ocreate);
                else
                    obox.insertBefore(ocreate,child[insertPlace]);
            }
            else
            {
                    //可以放置多个则需要每个都克隆一下
                if(isIncludeBox)
                    var ocreateClone = oclickDown;
                else
                    var ocreateClone = ocreate.cloneNode(true);
                if(insertPlace==child.length)
                    obox.appendChild(ocreateClone);
                else
                {
                    obox.insertBefore(ocreateClone,child[insertPlace]);
                }
            }
        }
        else
        {
            if(isIncludeBox)
            {
                var child  = obox.childNodes;
                for(var i=0; i<child.length; i++)
                {
                    if(child[i] === oplace)
                    {
                        obox.removeChild(child[i]);
                        obox.insertBefore(oclickDown,child[i]);
                    }1
                }
            }
        }
        isIncludeBox = false;
    }
    document.addEventListener('mousemove',move);
    document.addEventListener('mousedown',down);
    document.addEventListener('mouseup',up);
}