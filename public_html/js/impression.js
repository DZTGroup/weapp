var FCAPP = FCAPP || {};
FCAPP.REVIEW = FCAPP.REVIEW || {
    RUNTIME: {},
    init: function() {
        var R = REVIEW.RUNTIME;
        if (!R.switchBtns) {
            R.switchBtns = $('ul.nav_top li a');
            R.template = FCAPP.Common.escTpl($('#template').html());
            R.review = FCAPP.Common.escTpl($('#reviewTpl').html());
            R.switchPanels = [$('#impress'), $('#professional')];
            R.popTips = $('#popTips');
            R.noticeDiv = $('#noticeDiv');
            R.tipsMsg = $('#tipsMsg');
            R.tipsTitle = $('#tipsTitle');
            R.noticeBtn = $('#noticeBtn');
            R.popConfirmBtn = $('#popConfirmBtn');
            R.popMask = $('#popMask');
            R.inputImpress = $('#inputImpress');
            R.reviewId = $('#reviewId');
            R.floatTips = $('div.pop_tips');
            R.navTop = $('#navTop');
            R.noticeBtn.click(function() {
                REVIEW.showTips(false);
            });
            R.inputImpress.keyup(function() {
                try {
                    clearTimeout(window.tout);
                } catch(e) {}
                window.tout = setTimeout(REVIEW.checkLen, 800);
            });
        }
        REVIEW.loadReviewList();
        REVIEW.loadProList();

        $(window).resize(REVIEW.resizeLayout);
        REVIEW.resizeLayout();
        FCAPP.Common.hideToolbar();
    },
    resizeLayout: function() {
        var R = REVIEW.RUNTIME,
        w = window.innerWidth,
        h = window.innerHeight;
        REVIEW.checkLen();
        FCAPP.Common.resizeLayout(R.floatTips);
    },
    checkLen: function() {
        var R = REVIEW.RUNTIME;
        R.popConfirmBtn.unbind('click', REVIEW.sendReview);
        if (R.inputImpress.val().length == 4) {
            R.popConfirmBtn.removeClass('out');
            R.popConfirmBtn.bind('click', REVIEW.sendReview);
        } else {
            R.popConfirmBtn.addClass('out');
        }
    },
    switchPanel: function(idx) {
        var R = REVIEW.RUNTIME;
        R.switchBtns.removeClass('current');
        R.switchBtns[idx].className = 'current';
        if (idx == 0) {
            R.switchPanels[1].hide();
            R.switchPanels[0].show();
        } else {
            R.switchPanels[0].hide();
            R.switchPanels[1].show();
        }
    },
    closePop: function() {
        var R = REVIEW.RUNTIME;
        R.popTips.hide();
        R.popMask.hide();
        R.reviewId.val(0);
    },
    showTips: function(boo, opt) {
        var R = REVIEW.RUNTIME;
        if (opt && opt.msg) {
            R.tipsMsg.html(opt.msg);
        }
        if (opt && opt.title) {
            R.tipsTitle.html(opt.title);
        }
        if (boo) {
            R.noticeDiv.show();
            R.popMask.show();
        } else {
            R.noticeDiv.hide();
            R.popMask.hide();
        }
    },
	<!-- 加载评论，发送到cgi，返回json-->
    loadReviewList: function() {
        window.reviewResult = REVIEW.reviewResult;
		
        var data = {
            callback: 'reviewResult',
            appid: window.gQuery && gQuery.appid ? gQuery.appid: '',
            eid: window.gQuery && gQuery.eid ? gQuery.eid: 'default',
            openid: window.gQuery && gQuery.openid ? gQuery.openid: '',
            cmd: 'get'
        };
        
        $.ajax({
            url: '/weapp/php/cgi/impression.php?' + $.param(data),
            dataType: 'jsonp'
        });
    },
    reviewResult: function(res) {
        window.renderReviewResult = REVIEW.renderReviewResult;
        var R = REVIEW.RUNTIME;
        R.userReview = res;

        // mod by aohajin
        var staticUri = '/weapp/public_html/data';
        var eid = window.gQuery && gQuery.eid ? gQuery.eid : 'default';
        eid = eid.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');

        var dt = new Date();
        var pathParameter = window.gQuery && gQuery.openid && gQuery.openid == 0 ? 'test':'wechat';

        var path = '/weapp/public_html/data/'+eid+'/'+pathParameter+'/impression.js?';

        $.ajax({
            url: path + dt.getDate() + dt.getHours(),
            dataType: 'jsonp'
        });
    },
    renderReviewResult: function(base){
        var R = REVIEW.RUNTIME;
        var res = R.userReview;
        res.top = base.top;
        res.sum = base.sum;

        if (res.ret == 0 && res.top.length > 0) {
            var total = parseInt(res.sum),
                top = res.top,
                user = res.user;
            R.totalReveiw = total;
            R.topReview = top;
            R.userReview = user;
            for (var i = 0,
                     il = top.length; i < il; i++) {
                top[i].count = Math.floor(parseInt(top[i].count) * 100 / total);
                if ( user.id != -1 &&  top[i].content === user.content ){
                    user.count = top[i].count;
                }
            }

            R.switchPanels[0].html($.template(R.review, {
                top: top,
                user: user
            }));
        } else {
            var msg = '哎呀~出了点儿小问题，点击刷新试试吧~';
            if (res.ret == -100) {
                msg = '哎呀~出了点儿小问题';
            }
            REVIEW.showTips(true, {
                msg: msg
            });
        }
        FCAPP.Common.hideLoading();
    },
    addReview: function(id, content, cls) {
        var R = REVIEW.RUNTIME;
        if (R.userReview.id > 0) {
            REVIEW.showTips(true, {
                msg: '你已经添加过印象了哦~'
            });
            return;
        }
        if (id > 0) {
            R.popConfirmBtn.removeClass('out');
            R.popConfirmBtn.bind('click', REVIEW.sendReview);
        }
        try {
            if (cls != 'is_24') {
                var bcolor = $('a.' + cls).css('background-color'),
                fcolor = $('a.' + cls).css('color');
                R.inputImpress.css({
                    'background-color': bcolor,
                    'border': 'none',
                    color: fcolor
                });
                R.inputImpress.parent().css({
                    'background-color': bcolor
                });
            } else {
                R.inputImpress.css({
                    'background-color': '#fff',
                    border: '2px solid #eee',
                    color: '#383838'
                });
                R.inputImpress.parent().css({
                    'background-color': '#fff'
                });
            }
        } catch(e) {}
        if (id != 0) {
            R.inputImpress.val(content);
            R.reviewId.val(id);
            R.inputImpress.addClass("input_impress_focus");
            R.inputImpress.attr('readonly', true);
        } else {
            if (R.lastContent) {
                R.inputImpress.val(R.lastContent.substr(0, 4));
            } else {
                R.inputImpress.val('');
            }
            R.inputImpress.removeClass("input_impress_focus");
            R.inputImpress.removeAttr('readonly');
            R.reviewId.val(id);
        }
        R.popTips.show();
        R.popMask.show();
    },
	<!-- 添加评论，发送到cgi，返回json-->
    sendReview: function() {
        var R = REVIEW.RUNTIME,
        //id = parseInt(R.reviewId.val()),
        review = R.inputImpress.val();
        if (0) {
        //if (isNaN(id)  || /[^\u4e00-\u9FFF]/g.test(review)) {
            REVIEW.showTips(true, {
                msg: '请输入四个字的楼盘印象'
            });
            R.popTips.hide();
            R.popMask.show();
            R.noticeBtn.one('click',
            function() {
                R.popMask.show();
                R.popTips.show();
            });
            return;
        } else {
            window.sendReviewResult = REVIEW.sendReviewResult;
            var data = {
                callback: 'sendReviewResult',
                appid: window.gQuery && gQuery.appid ? gQuery.appid: '',
                eid: window.gQuery && gQuery.eid ? gQuery.eid: '',
                openid: window.gQuery && gQuery.openid ? gQuery.openid: '',

                cmd: 'set',
                im: review || ''
            };
            /*if (id > 0) {
                data.cmd = 'update';
                data.objid = id;
            } else {
                for (var i = 0,
                il = R.topReview.length; i < il; i++) {
                    if (review == R.topReview[i].content) {
                        data.cmd = 'update';
                        data.objid = R.topReview[i].id;
                        break;
                    }
                }
            }*/
            R.userReviewText = review;
            var top = R.topReview;
            for (var i = 0,
                     il = top.length; i < il; i++) {
                if ( top[i].content === review ){
                    R._userReviewCount = top[i].count;
                }
            }
            $.ajax({
                url: '/weapp/php/cgi/impression.php?' + $.param(data),
                dataType: 'jsonp'
            });
        }
    },
    sendReviewResult: function(res) {
        var R = REVIEW.RUNTIME,
        msg = '',
        count = 0;
        R.popTips.hide();
        if (res.ret == 0) {
            R.popMask.hide();
            msg = "印象添加成功！";
            if (res.user) {
                R.userReview = res.user;
                R.totalReveiw += 1;
                count = Math.floor(R._userReviewCount * 100 / R.totalReveiw);

                R._userReviewCount = undefined;
            }
            $('#userReview').replaceClass('is_24', 'is_25');
            if (count < 1) {
                $('#userReview').html('<span>印象很独特哦</span>');
            } else {
                $('#userReview').html('<em>我的楼盘印象<i>' + R.userReviewText.substr(0, 4) + '</i>与' + count + '%房友相同</em>');
            }
        } else {
            var msg = '哎呀~出了点儿小问题，点击刷新试试吧~';
            if (res.ret == -100) {
                msg = '哎呀~出了点儿小问题';
            }
        }
        REVIEW.showTips(true, {
            msg: msg
        });
    },
    
    loadProList: function() {
        window.renderProList = REVIEW.renderProList;

        var eid = window.gQuery && gQuery.eid ? gQuery.eid : 'default',
            dt = new Date();
        eid = eid.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');

        var pathParameter = window.gQuery && gQuery.openid && gQuery.openid == 0 ? 'test':'wechat';
        // mod by aohajin
        var path = '/weapp/public_html/data/'+eid+'/'+pathParameter+'/comment.js?';
        $.ajax({
            url: path + dt.getDate() + dt.getHours(),
            dataType: 'jsonp'
        });

        /*
        var datafile = window.gQuery && gQuery.loupanid ? gQuery.loupanid + '.': '',
        dt = new Date();
        datafile = datafile.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
        datafile += 'prolist.js?';
        $.ajax({
            url: '/weapp/public_html/prolist.js?' + dt.getDate() + dt.getHours(),
            dataType: "jsonp",
            error: REVIEW.proListError
        });*/
    },
    renderProList: function(data) {
        var R = REVIEW.RUNTIME;
        R.switchPanels[1].html($.template(R.template, {
            data: data
        }));
        R.navTop.css('display', '-webkit-box');
    },
    proListError: function() {
        var R = REVIEW.RUNTIME;
        R.navTop.hide();
    }
};
var REVIEW = FCAPP.REVIEW;
$(document).ready(REVIEW.init);
