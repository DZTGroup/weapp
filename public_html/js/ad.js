var FCAPP = FCAPP || {};
FCAPP.YTList = FCAPP.YTList || {
RUNTIME: {},
init: function () {
    var R = YTList.RUNTIME;
    if (!window.gQuery && !gQuery.id) {
        setTimeout(arguments.callee, 200);
        return;
    }
    YTList.initElements();
    YTList.initEvents();
    YTList.loadYTListData();
    FCAPP.Common.hideToolbar();
},
initElements: function () {
    var R = YTList.RUNTIME;
    if (!R.template) {
        R.container = $('#container');
        R.template = FCAPP.Common.escTpl($('#template').html());
        R.popTips = $('div.pop_tips');
    }
},
initEvents: function () {
    var R = YTList.RUNTIME;
    $(window).resize(function () {
                     FCAPP.Common.resizeLayout(R.popTips);
                     });
},
loadYTListData: function () {
    window.renderData = YTList.renderData;
    var eid = window.gQuery && gQuery.eid ? gQuery.eid : 'default',
        dt = new Date();
    eid = eid.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
    var pathParameter = window.gQuery && gQuery.openid && gQuery.openid == 0 ? 'test':'wechat';
    // mod by aohajin
    var path = '/weapp/public_html/data/'+eid+'/'+pathParameter+'/ad.js?';
    $.ajax({
        url: path + dt.getDate() + dt.getHours(),
        dataType: 'jsonp',
        error: function() {
            FCAPP.Common.msg(true, {
                msg: '无效数据'
            });
        }
    });
},
    renderData: function (data) {
    var R = YTList.RUNTIME,
    id = window.gQuery && gQuery.id ? gQuery.id : '';
    FCAPP.Common.hideLoading();
    data.id = id;
    R.container.html($.template(R.template, {
                              data: data
                              }));
    FCAPP.Common.loadImg(data.banner, 'bannerImage', function (img) {
                       img.id = img.idx;
                       img.style.height = "170px";
                       img.style.width = "auto";
                       });
    if (data.bgImg && data.bgImg.length) {
    var bgEl = $("<div style=\"background-image:url(" + data.bgImg + ");background-size:100% 100%;position:fixed;left:0;top:0;right:0;bottom:0;width:100%;height:100%;z-index:-100\"></div>");
    $(document.body).prepend(bgEl);
    }
    },
    goDetail: function (id) {
    FCAPP.Common.jumpTo('ad-detail.html', {
                      idx: id,
                      from: "advertise.html"
                      }, true);
    }
    };
    var YTList = FCAPP.YTList;
    $(document).ready(YTList.init);