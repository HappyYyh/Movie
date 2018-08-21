var searchURL = window.location.search;
searchURL = searchURL.substring(1, searchURL.length);
//前一个页面传过来的id
var id = searchURL.split("&")[0].split("=")[1];

$(function () {
    var url = 'http://api.douban.com/v2/movie/subject/'+id+'?apikey=0b2bdeda43b5688921839c8ecb20399b';
    $.ajax({
        type :'get',
        url :url,
        dataType:'jsonp',
        success:function (result) {
            //标题
            $(".detail h1").html(result.title+'('+result.year+')');

            //图片
            $("#image").attr('src',showImg(result.images.small));

            //导演
            var directors='';
            $.each(result.directors,function (index,item) {
                directors += item.name+' / ';
            });
            $("#directors").html(directors.slice(0,directors.length-2));

            //编剧
            var writer_name='';
            $.each(result.writers,function (index,item) {
                writer_name += item.name+' / ';
            });
            $("#writers").html(writer_name.slice(0,writer_name.length-2));

            //主演
            var casts_name='';
            $.each(result.casts,function (index,item) {
                casts_name += item.name+' / ';
            });
            $("#casts").html(casts_name.slice(0,casts_name.length-2).substring(0,30));

            //剧情
            showInfo(result.genres,"#genres");

            //制片国家/地区
            showInfo(result.countries,"#countries");

            //语言
            showInfo(result.languages,"#languages");

            //上映日期
            showInfo(result.pubdates,"#pubdates");

            //片长
            showInfo(result.durations,"#durations");

            //又名
            showInfo(result.aka,"#aka");
            /*var aka='';
            $.each(result.aka,function (index,item) {
                aka += item+' / ';
            });
            $("#aka").html(aka.slice(0,casts_name.length-2).substring(0,40));*/

            //剧情介绍的标题
            $("#s_title").html(result.title);

            //剧情简介
            $(".summary .s_content").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+result.summary)

            //影人的标题
            $("#c_title").html(result.title);

            //评论的标题
            $("#r_title").html(result.title);

            //评分区域
            var sum =0;
            //计算出总评论数
            $.each(result.rating.details,function (index,item) {
                sum+=item;
            });
            $.each(result.rating.details,function (index,item) {
                var len =((item/sum)*100).toFixed(1);
                //console.log((index-1)+"   "+len);
                if(item!=0){
                    $(".rate_item .power:eq("+(index-1)+")").css('width',''+(len*2)+'px');
                    $(".rate_item .rat_per:eq("+(index-1)+")").text(len+'%');
                }
            });

            //评论人数
            $(".wish_count").html(result.wish_count+"人评论");

            var avg_rate =result.rating.average==0?'暂无':result.rating.average;
            //平均分
            $(".rate_info h2").html(avg_rate);

            //影人信息
            var yr_info = '';
            $.each(result.casts,function (index,item) {
                yr_info += "<figure>" +
                    "<img src='"+showImg(item.avatars.small)+"'>" +
                    "<figcaption>" +
                    "<p class='name'>"+item.name_en+"</p>" +
                    "<p class='en_name'>"+item.name+"</p>" +
                    "</figcaption>" +
                    "</figure>";
            });
            $(".yr_info").append(yr_info);

        }
    });

    //评论初始化加载的url
    var first_comment_url = 'http://api.douban.com/v2/movie/subject/'+id+'/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&count=5';

    showComments(first_comment_url);

    //查看更多的评论
    var more_comment_url = 'http://api.douban.com/v2/movie/subject/'+id+'/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&start=5';

    $("#more_comment").on('click',function () {
        //隐藏 ’查看更多’
        $(".showmore").css('display','none');
        //查询
        showComments(more_comment_url);
        //展示 ’收起‘
        $(".showless").css('display','block');
    });

    //收起评论
    $("#less_comment").on('click',function () {
        //先清除评论内容
        $(".comments").empty();
        //查询初始数据
        showComments(first_comment_url);
        $(".showmore").css('display','block');
        $(".showless").css('display','none');
    })

});

//由于豆瓣对一些资源进行限制，故需要缓存
function showImg(url) {
    if(url!==undefined){
        //subString（7）值截取http://之后的地址
        return 'https://images.weserv.nl/?url=' + url.substring(7);
    }
}

//查看信息
function showInfo(result,element) {
    var info = '';
    $.each(result,function (index,item) {
        info += item + ' / ';
    });
    //slice为了去除最后的/和空格，subString为了截取长度，不超过限制
    $(element).html(info.slice(0,info.length-2).substring(0,35));
}

//查看评论
function showComments(comment_url) {
    $.ajax({
        type :'get',
        url: comment_url,
        dataType:'jsonp',
        success:function (result) {
            var show = '';
            $.each(result.comments,function (index,item) {
                show += "<p class='p1'><span class='author'>"+item.author.name+"</span><span>看过</span>" +
                    "<span class='date'>"+item.created_at+"</span>" +
                    "<span class='userful'>"+item.useful_count+"</span><span class='youyong'>有用</span>" +
                    "</p>" +
                    "<p class='c_content'>&nbsp;&nbsp;&nbsp;&nbsp;"+item.content+"</p>"+
                    "<hr>"
            });
            $(".comments").append(show);
        }
    })
}