//存储,url传值
/*function set(id) {
    //由于是一个新的技术，你可以通过下面的代码检测你的浏览器是否支持
    if (window.localStorage) {
        //存储变量的值
        localStorage.url = id;
        location.href = 'detail.html';
    } else {
        alert("NOT SUPPORT");
    }
}*/


//根据输入条件查询
function queryByCondition() {
    //输入框的内容
    var input_search = $("#search").val();
    if(input_search!=''){
    //清空item
    $(".item").html("");
    $.ajax({
        type:'get',
        url:'https://api.douban.com/v2/movie/search?q='+input_search+'&apikey=0b2bdeda43b5688921839c8ecb20399b',
        dataType:'jsonp',
        success:function (result) {
            var show = '';
            var rate = '';
            $.each(result.subjects,function (index,item) {
                rate = item.rating.average==0?'暂无评分':'评分:'+item.rating.average;
                show += "<figure>" +
                    "<a href='detail.html?id="+item.id+"'><img src='"+item.images.medium+"'></a>" +
                    "<figcaption>" +
                    "<p><span class='title'>"+item.title+"</span></p>" +
                    "<p><span class='rate'>"+rate+"</span></p>" +
                    "</figcaption>" +
                    "</figure>"
            });
            $(".item").append(show);
        }
    })
    }
}