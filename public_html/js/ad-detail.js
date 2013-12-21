var FCAPP = FCAPP || {};
FCAPP.YTDetail = FCAPP.YTDetail || {
    RUNTIME: {
        picCount: 0
    },
    init: function () {
        var R = YTDetail.RUNTIME;
        if (!window.gQuery && !gQuery.id) {
            setTimeout(arguments.callee, 200);
            return;
        }
        YTDetail.initElements();
        YTDetail.initEvent();
        YTDetail.loadYTDetailData();
        FCAPP.Common.hideToolbar();
    },
    initElements: function () {
        var R = YTDetail.RUNTIME;
        if (!R.template) {
            R.container = $('#container');
            R.template = FCAPP.Common.escTpl($('#template').html());
            R.popTips = $('div.pop_tips');
            R.btnBack = $("#btnBack");
            var from = window.gQuery && gQuery.from ? gQuery.from : '';
            if (from.length == 0) {
                R.btnBack.hide();
            } else {
                R.btnBack.show();
            }
        }
    },
    initEvent: function () {
        var R = YTDetail.RUNTIME;
        $(window).resize(function () {
            FCAPP.Common.resizeLayout(R.popTips);
            YTDetail.resizeLayout();
        });
        R.btnBack.bind("click", function () {
            if (window.gQuery && gQuery.from) delete gQuery.from;
            if (window.gQuery && gQuery.ytid) delete gQuery.ytid;
            FCAPP.Common.jumpTo('yt-list.html', {}, true);
        });
    },
    loadYTDetailData: function () {
        window.renderData = YTDetail.renderData;
        var datafile = window.gQuery && gQuery.ytid ? gQuery.ytid + '.' : '',
            dt = new Date();
        datafile = datafile.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
        datafile += 'yt-detail.js?';
        $.ajax({
            url: '../' + datafile + dt.getDate() + dt.getHours(),
            dataType: 'jsonp'
        });
    },
    renderData: function (data) {
        var R = YTDetail.RUNTIME,
            id = window.gQuery && gQuery.id ? gQuery.id : '';
        R.picCount = data.images.length;
        FCAPP.Common.hideLoading();
        data.id = id;
        R.container.html($.template(R.template, {
            data: data
        }));
        if (data.bgImg && data.bgImg.length) {
            var bgEl = $("<div style=\"background-image:url(" + data.bgImg + ");background-size:100% 100%;position:fixed;left:0;top:0;right:0;bottom:0;width:100%;height:100%;z-index:-100\"></div>");
            $(document.body).prepend(bgEl);
        }
        var imgtitle = $("#imgTitle");
        myScroll = new iScroll('scroll_wrapper', {
            zoom: false,
            snap: true,
            hScroll: true,
            vScroll: false,
            momentum: false,
            Scrollbar: false,
            hScrollbar: false,
            vScrollbar: false,
            onScrollEnd: function () {
                document.querySelector('#indicator > a.current').className = '';
                document.querySelector('#indicator > a:nth-child(' + (this.currPageX + 1) + ')').className = 'current';
                YTDetail.loadImg(myScroll.currPageX);
                imgtitle.html(data.images[myScroll.currPageX].title);
            }
        });
        YTDetail.loadImg(myScroll.currPageX);
        YTDetail.resizeLayout();
    },
    resizeLayout: function () {
        var R = YTDetail.RUNTIME;
        var scrollWidth = $("#scroll_wrapper")[0].offsetWidth;
        var imgWidth = $("#img_" + myScroll.currPageX)[0].offsetWidth;
        var scrollContainer = $("#scroller")[0];
        var indicator = $("#indicator")[0];
        scrollContainer.style.width = R.picCount * scrollContainer.parentNode.offsetWidth + "px";
        $('#thelist li').css({
            width: scrollWidth + 'px'
        });
        if (myScroll) {
            myScroll.refresh();
            myScroll.scrollToPage(myScroll.currPageX);
        }
        indicator.style.bottom = "auto";
        indicator.style.position = "absolute";
        indicator.style.right = "7px";
        indicator.style.top = "142px";
        var more = $("a.btn_more"),
            boxContent = $("#summary")[0],
            oldHeight = boxContent.style.height;
        boxContent.style.height = "auto";
        if (boxContent.offsetHeight > 89) {
            YTDetail.toogleMore((oldHeight == "auto"));
            more[0].parentNode.style.paddingBottom = "0px";
            more.show();
        } else {
            YTDetail.toogleMore((oldHeight == "auto"));
            if (oldHeight != "auto")
                more[0].parentNode.style.paddingBottom = "10px";
            more.hide();
        }
        var contact = $("#contact div.box");
        var w = window.innerWidth,
            h = window.innerHeight;
        contact.css("position", "absolute");
        contact.css("min-width", "240px");
        contact.css("max-width", "80%");
        contact.css('left', (w - contact[0].offsetWidth) / 2 + 'px');
        contact.css('top', (h - contact[0].offsetHeight) / 2 + 'px');
        contact.css("margin", "0px");
    },
    switchIndex: function (more) {
        var box = more.parentNode;
        if (box.className.indexOf("box_up") != -1) {
            YTDetail.toogleMore(true);
        } else {
            YTDetail.toogleMore(false);
        }
    },
    toogleMore: function (boo) {
        var more = $("a.btn_more")[0];
        var box = $("#summaryBox")[0];
        var boxContent = $("#summary")[0];
        if (boo) {
            box.className = "box box_hide";
            boxContent.style.height = "auto";
            more.innerHTML = '<span>收起</span>';
        } else {
            box.className = "box box_up";
            boxContent.style.height = "75px";
            more.innerHTML = '<span>更多</span>';
        }
    },
    showContacts: function () {
        var dialog = $("#contact");
        dialog.show();
        dialog.unbind("click");
        dialog.bind("click", function (event) {
            $(this).hide();
        });
        YTDetail.resizeLayout();
    },
    loadImg: function (idx) {
        var pic = $("#img_" + idx)[0];
        var src = pic.getAttribute("src");
        var loading = pic.getAttribute("loading");
        if (!src || src.length == 0 || loading) {
            return;
        }
        img = new Image();
        img.idx = idx;
        img.addEventListener('load', function () {
            pic.style.background = "none";
            pic.appendChild(this);
            this.style.width = '100%';
            this.style.height = '100%';
            pic.removeAttribute("src");
            pic.removeAttribute("loading");
            this.onload = null;
        });
        img.src = src;
        pic.setAttribute("loading", true);
    },
    goJoinPage: function (actid, title) {
        FCAPP.Common.jumpTo('yt-join.html', {
            actid: actid,
            refer: "yt-detail.html"
        }, true);
    }
};
var YTDetail = FCAPP.YTDetail,
    myScroll;
$(document).ready(YTDetail.init);