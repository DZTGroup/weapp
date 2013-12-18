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
    var datafile = "",
    dt = new Date();
    datafile = datafile.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
    datafile += '../js/yt-data.js?';
    $.ajax({
         url: '' + datafile + dt.getDate() + dt.getHours(),
         dataType: 'jsonp'
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
    id = id || '';
    FCAPP.Common.jumpTo('yt-detail.html', {
                      ytid: id,
                      from: "yt-list.html"
                      }, true);
    }
    };
    var YTList = FCAPP.YTList;
    $(document).ready(YTList.init);