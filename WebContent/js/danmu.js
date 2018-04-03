var ref = new Wilddog("https://danmu.wilddogio.com");/* 我们已经创建了一个野狗客户端。要读写数据，必须先创建 Wilddog 引用*/
var words = ref.child("words");


$(document).ready(function () {
    var word; //用来存储输入框中的值
    var arr = []; //用来存储野狗云已有数据 // 此数组用来存放所有的消息元素
    /**
     * 通过on()立即读取数据，并监听该节点数据的变化。
     */
    //监听 当野狗云中新增数据时，将新增的值存入 arr 中
    //刷新页面时 arr 将获得存储在野狗云的所有数据
    words.on("child_added", function (snap) {
        arr.push(snap.val());
    });

    //监听： 野狗云的 words 节点，当该节点被删除时清空数组arr 并将面板置空
    ref.on("child_removed", function () {
        arr = [];
        $("#showWords").empty(); //删除显示面板的子元素
    });

    //监听： 当野狗云 words下的直接子节点被删除时删除数组 arr 中对应的值
    words.on("child_removed", function (snap) {
        var deletedWord = snap.val();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == deletedWord) {
                arr.splice(i, 1);
                break;
            }
        }

    });

    //4 每3秒随机在面板上弹出野狗云上的数据
   var getAndRun = function () {
        var i = arr.length;
        if (i > 0) {
            var y = Math.floor(i * Math.random());
            var obj = $("<span class='moveWord'>" + arr[y] + "</span>");
            $("#showWords").append(obj);
            moveObj(obj,20);//给个默认值
        }

        setTimeout(getAndRun, 5000); //每3秒调用一下自身
    }

    //设置显示面板的高度为浏览器显示窗口高度的60%
    var setHeight = function () {
        //浏览器显示窗口的宽度
        var w = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;

        //浏览器显示窗口的高度
        var h = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

        $("#showWords").css({
            "height": h * 0.81
        });

    };
    setHeight();

    //设置随机颜色值
    var setColor = function () {
        var i = Math.floor(256 * (Math.random()));
        return i;
        return i;
    }

    //2 让发射的消息动起来
    var moveObj = function (obj,f) {
        var f=f.valueOf();
        var topMax = $("#showWords").height();// 显示框底部距顶部距离
        var _top = Math.floor(topMax * (Math.random())); //设置top初始位置为面板高度内的随机数 每个滚动消息距顶部距离
        if (_top + obj.height() >= topMax) {
            _top -= obj.height();
        }
        var _left = $("#showWords").width()/* - obj.width()*/; //设置left初始位置位于显示面板最右侧
       /* var _fontSize=obj.fontSize();*/
       /* alert(obj.height())*/
        //初始化消息位置
        obj.css({
            "top": _top,
            "left": _left,
            "color": "rgb(" + setColor() + "," + setColor() + "," + setColor() + ")" ,//调用 setColor 函数设置随机颜色
            "fontSize":f  //设置字体的大小*!/*/
        });

        var time = 10000 + 10000 * Math.random();

        //进行动画，动画结束后通过回调函数把消息从面板中删除
        /**
         * animate() 方法执行 CSS 属性集的自定义动画。逐渐改变的，这样就可以创建动画效果。
         */
        obj.animate({
            left: -$("#showWords").offset().left - obj.width() //让消息距左距离逐渐减小，产生右向左滚动动画。
        }, time, function () {
            obj.remove();
        });

    }


    //1 单击【发送】按钮时执行以下代码
    $("#addWords").click(function () {
        word = $("#word").val(); //获取输入框中的值并存到全局变量word中(获取输入的内容)
        var fontSize=$("#wordSize").val();//获得设置字体的大小
        //当输入的值不为空时，执行以下代码
        if (word != "") {
            ref.child('words').push(word); //将word的值写入野狗云
            $("#word").val(""); //清空输入框
            var obj = $("<span class='moveWord'>" + word + "</span>"); //为word值生成对象
            $("#showWords").append(obj); //将生成的对象附加到面板上
            moveObj(obj,fontSize); //调用 moveObj 函数使生成的对象动起来
        }
        $("#word").focus(); //将焦点置于输入框
    });

    //3 单击【清屏】按钮即删除数据，定位到节点下调用 remove()
    $("#removeAll").click(function () {
        ref.child("words").remove(); //删除野狗云 words 子节点下的数据
        $("#showWords").empty(); //删除显示面板的子元素
        arr = [];
    });
   getAndRun();//调用函数
});