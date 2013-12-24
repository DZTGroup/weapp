var FCAPP = FCAPP || {};
FCAPP.YTJoin = FCAPP.YTJoin || {
    CONFIG: {
        Error: {
            '-100': '身份认证失败，点击确定刷新',
            '-300': '日期超出范围',
            '-301': '报名人数过多',
            '-302': '名额已经满了',
            '-303': '您的报名次数超过最大值了',
            '-304': '今天的名额已满'
        },
        Server: 'http://cgi.trade.qq.com/cgi-bin/common/enroll.fcg',
        Wticket: "djkshdiuw928",
        Appid: "2"
    },
    RUNTIME: {
        stData: {},
        cgiData: {},
        drag: {
            sTop: 0
        }
    },
    init: function () {
        var R = YTJoin.RUNTIME;
        if (!window.gQuery && !gQuery.id) {
            setTimeout(arguments.callee, 200);
            return;
        }
        YTJoin.initElements();
        YTJoin.initEvent();
        YTJoin.loadYTJoinData();
        FCAPP.Common.hideToolbar();
    },
    initElements: function () {
        var R = YTJoin.RUNTIME;
        if (!R.template) {
            R.container = $('#container');
            R.navBar = $("#navBar");
            R.titleBar = $("#titleBar");
            R.btnBack = $("#btnBack");
            R.template = FCAPP.Common.escTpl($('#template').html());
            R.popTips = $('div.pop_tips');
        }
    },
    initEvent: function () {
        var R = YTJoin.RUNTIME;
        $(window).resize(function () {
            FCAPP.Common.resizeLayout(R.popTips);
            YTJoin.resizeLayout();
        });
        R.btnBack.bind("click", function () {
            var refer = window.gQuery && gQuery.refer ? gQuery.refer : '';
            if (window.gQuery && gQuery.refer) delete gQuery.refer;
            if (window.gQuery && gQuery.actid) delete gQuery.actid;
            FCAPP.Common.jumpTo(refer, {}, true);
        });
        document.body.addEventListener("touchmove", YTJoin.scrollEvent, false);
        $(document).on("scroll", YTJoin.scrollEvent);
    },
    scrollEvent: function () {
        var R = YTJoin.RUNTIME;
        var sTop = document.body.scrollTop,
            sHeight = document.body.scrollHeight,
            cHeight = document.body.clientHeight;
        if (sTop > R.drag.sTop) {
            R.drag.sTop = sTop;
            if (sTop > 44)
                R.navBar.hide();
        } else if (sTop < R.drag.sTop) {
            R.drag.sTop = sTop;
            if (sTop < sHeight && sTop + cHeight < sHeight)
                R.navBar.show();
        }
    },
    loadYTJoinData: function () {
        window.renderStaticData = YTJoin.renderStaticData;

        var eid = window.gQuery && gQuery.eid ? gQuery.eid : 'default',
            idx = window.gQuery && gQuery.actid ? gQuery.actid : 'default',
            dt = new Date();
        eid = eid.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
        var pathParameter = window.gQuery && gQuery.openid && gQuery.openid == 0 ? 'test':'wechat';
        // mod by aohajin
        var path = '/weapp/public_html/data/'+eid+'/'+pathParameter+'/discount.'+idx+'.js?';
        $.ajax({
            url: path + dt.getDate() + dt.getHours(),
            dataType: 'jsonp',
            error: function() {
                FCAPP.Common.msg(true, {
                    msg: '无效数据'
                });
            }
        });

        /*
        var datafile = window.gQuery && gQuery.actid ? gQuery.actid + '.' : '',
            dt = new Date();
        datafile = datafile.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
        datafile += 'yt-join.js?';
        $.ajax({
            url: '' + datafile + dt.getDate() + dt.getHours(),
            dataType: 'jsonp'
        });*/
    },
    renderStaticData: function (data) {
        var R = YTJoin.RUNTIME;
        R.stData = data;
        if (data.joinType == 0) {
            YTJoin.loadYTJoinState();
        } else {
            R.cgiData.ret = 0;
            YTJoin.renderData();
        }
    },
    loadYTJoinState: function () {
        window.YTJoinStateResult = YTJoin.YTJoinStateResult;
        var C = YTJoin.CONFIG;
        var data = {
            appid: window.gQuery && gQuery.appid ? gQuery.appid : C.Appid,
            wticket: window.gQuery && gQuery.wticket ? gQuery.wticket : C.Wticket,
            bizid: window.gQuery && gQuery.actid ? gQuery.actid : '',
            cmd: 'exist',
            callback: 'YTJoinStateResult',
            biztype: "format"
        };
        $.ajax({
            url: C.Server + "?" + $.param(data),
            dataType: 'jsonp',
            error: function () {}
        });
    },
    YTJoinStateResult: function (data) {
        if (YTJoin.validCGIData(data) == false) {
            return;
        }
        var R = YTJoin.RUNTIME;
        R.cgiData = data;
        if (Object.keys(R.stData).length > 0) {
            YTJoin.renderData();
        }
    },
    joinAction: function () {
        var tbUserName = $("#username"),
            tbUserCount = $("#usercount"),
            tbPhoneNum = $("#phonenumber"),
            tbBeginDate = $("#timeBegin"),
            tbEndDate = $("#timeEnd");
        var regPhone = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
        if (tbUserName.val().length == 0 || tbUserCount.val().length == 0 || tbPhoneNum.val().length == 0 || tbBeginDate.val().length == 0 || tbEndDate.val().length == 0) {
            FCAPP.Common.msg(true, {
                msg: '请先检查数据是否填写完整'
            });
        } else if (regPhone.test(tbPhoneNum.val()) == false) {
            FCAPP.Common.msg(true, {
                msg: '请输入正确的手机号码'
            });
        } else {
            window.YTJoinActionResult = YTJoin.YTJoinActionResult;
            var C = YTJoin.CONFIG;
            var R = YTJoin.RUNTIME;
            var remark = {
                ytName: R.stData.ytName,
                activityName: R.stData.activityName,
                actid: R.stData.actid,
                phone: R.stData.contact.phones
            };
            var data = {
                appid: window.gQuery && gQuery.appid ? gQuery.appid : C.Appid,
                wticket: window.gQuery && gQuery.wticket ? gQuery.wticket : C.Wticket,
                bizid: window.gQuery && gQuery.actid ? gQuery.actid : '',
                cmd: 'add',
                callback: 'YTJoinActionResult',
                biztype: "format",
                name: tbUserName.val(),
                mobile: tbPhoneNum.val(),
                num: parseInt(tbUserCount[0].options[tbUserCount[0].selectedIndex].text),
                bt: tbBeginDate.val(),
                et: tbEndDate.val(),
                remark: JSON.stringify(remark)
            };
            $.ajax({
                url: C.Server + "?" + $.param(data),
                dataType: 'jsonp',
                error: function () {
                    YTJoin.showResultDialog(false);
                }
            });
            FCAPP.Common.showLoading();
        }
    },
    YTJoinActionResult: function (data) {
        FCAPP.Common.hideLoading();
        if (YTJoin.validCGIData(data) == false) {
            return;
        }
        YTJoin.showResultDialog(true);
    },
    getRules: function () {
        var R = YTJoin.RUNTIME;
        var rule = {
            joined: false,
            nummin: 1,
            nummax: 1
        };
        for (var i = 0, n = R.stData.FsRule.length; i < n; i++) {
            var r = R.stData.FsRule[i];
            if (r.type == 0) {
                rule.enrollbt = r.rule.enrollbt;
                rule.enrollet = r.rule.enrollet;
            } else if (r.type == 1) {
                rule.nummax = r.rule.nummax;
                rule.nummin = r.rule.nummin;
            } else if (r.type == 2) {
                rule.totalmax = r.rule.totalmax;
                rule.totalmin = r.rule.totalmin;
            } else if (r.type == 3) {
                rule.enrollmax = r.rule.enrollmax;
                rule.joined = (R.cgiData.exist >= r.rule.enrollmax);
            } else if (r.type == 4) {
                rule.totalmaxoneday = r.rule.totalmaxoneday;
                rule.totalminoneday = r.rule.totalminoneday;
            }
        }
        return rule;
    },
    renderData: function () {
        FCAPP.Common.hideLoading();
        var R = YTJoin.RUNTIME,
            id = window.gQuery && gQuery.id ? gQuery.id : '';
        var data = R.stData;
        data.id = id;
        data.rules = YTJoin.getRules();
        R.container.html($.template(R.template, {
            data: data
        }));
        if (data.bgImg && data.bgImg.length) {
            var bgEl = $("<div style=\"background-image:url(" + data.bgImg + ");background-size:100% 100%;position:fixed;left:0;top:0;right:0;bottom:0;width:100%;height:100%;z-index:-100\"></div>");
            $(document.body).prepend(bgEl);
        }
        R.titleBar.html(data.activityName);
        if (data.status == 0 && data.rules.joined == false && data.joinType == 0) {
            YTJoin.setupDatePicker(data.rules.enrollbt, data.rules.enrollet);
        }
    },
    setupDatePicker: function (d1, d2) {
        var $timeBegin = $('#timeBegin');
        var $timeEnd = $('#timeEnd');
        var $calendar1 = $('#calendar1').hide();
        var $calendar2 = $('#calendar2').hide();
        var textInputs = $("input[type='text']");
        var selector = $("#usercount");
        var hideCalendars = function (event) {
            $calendar1.hide();
            $calendar2.hide();
            $timeBegin[0].removeAttribute("style")
            $timeEnd[0].removeAttribute("style")
        };
        textInputs.unbind("click");
        textInputs.bind("click", hideCalendars);
        selector.unbind("focus");
        selector.bind("focus", hideCalendars);
        $timeBegin.unbind("click");
        $timeBegin.bind('click', function (event) {
            if ($timeBegin[0].style.length == 0) {
                $timeBegin[0].setAttribute("style", "border:2px solid #FF7148;")
                $timeEnd[0].removeAttribute("style")
                $calendar1.show();
                $calendar2.hide();
            } else {
                hideCalendars(event);
            }
        });
        $timeEnd.unbind("click");
        $timeEnd.bind('click', function (event) {
            if ($timeEnd[0].style.length == 0) {
                $timeBegin[0].removeAttribute("style")
                $timeEnd[0].setAttribute("style", "border:2px solid #FF7148;")
                $calendar1.hide();
                $calendar2.show();
            } else {
                hideCalendars(event);
            }
        });
        var gCalendar1 = new Calendar(),
            gCalendar2 = new Calendar();
        var date1 = moment(d1),
            date2 = moment(d2),
            today = moment(new Date());
        var outOfDate = false;
        if (date1 < today) {
            date1 = today;
        }
        if (date2 < today) {
            date2 = today.add('days', -1);
            outOfDate = true;
        }
        gCalendar1.ready($calendar1, {
            selectRange: [date1.clone().format('YYYY-MM-DD'), date2.clone().format('YYYY-MM-DD')]
        });
        gCalendar2.ready($calendar2, {
            selectRange: [date1.clone().format('YYYY-MM-DD'), date2.clone().format('YYYY-MM-DD')]
        });
        if (outOfDate == false) {
            gCalendar1.setDates(date1.format('YYYY-MM-DD'));
            gCalendar2.setDates(date1.format('YYYY-MM-DD'));
            $timeBegin.val(date1.format('YYYY-MM-DD'));
            $timeEnd.val(date1.format('YYYY-MM-DD'));
        }
        $calendar1.on('startDateChanged', function () {
            var $this = $(this);
            var startdate = $this.attr('data-startdate');
            var timeBegin = moment(new Date(startdate));
            var timeEnd = moment($timeEnd.val());
            if (timeBegin >= timeEnd) {
                timeEnd = timeBegin.clone();
                $timeEnd.val(timeEnd.format('YYYY-MM-DD'));
                gCalendar2.setDates(timeEnd);
            }
            $timeBegin.val(timeBegin.format('YYYY-MM-DD'));
        });
        $calendar2.on('startDateChanged', function () {
            var $this = $(this);
            var enddate = $this.attr('data-startdate');
            var timeBegin = moment($timeBegin.val());
            var timeEnd = moment(new Date(enddate));
            if (timeBegin >= timeEnd) {
                timeBegin = timeEnd.clone();
                $timeBegin.val(timeBegin.format('YYYY-MM-DD'));
                gCalendar1.setDates(timeBegin);
            }
            $timeEnd.val(timeEnd.format('YYYY-MM-DD'));
        });
    },
    showContacts: function () {
        var dialog = $("#contact");
        dialog.show();
        dialog.unbind("click");
        dialog.bind("click", function (event) {
            $(this).hide();
        });
        YTJoin.resizeLayout();
    },
    showResultDialog: function (success) {
        var resDlg = $("#resultDialog"),
            resTitle = $("#resultTitle"),
            resMsg = $("#resultMsg");
        if (success) {
            resTitle.attr("class", "ico_success");
            resTitle.html("您已经报名成功!");
            resMsg.html("<p>工作人员将以短信或电话的方式</p><p>确认您的报名信息</p><em class='weak'>三秒钟返回上一页</em>");
            setTimeout(function () {
                history.back();
            }, 3000);
        } else {
            resTitle.attr("class", "ico_sad");
            resTitle.html("预约失败，请检查您的网络");
            resMsg.html("<p class='weak'>工作人员将以短信或电话的方式</p><p class='weak'>认您的报名信息</p>");
            resDlg.unbind("click");
            resDlg.bind("click", function (event) {
                $(this).hide();
            });
        }
        resDlg.show();
        YTJoin.resizeLayout();
    },
    resizeLayout: function () {
        var R = YTJoin.RUNTIME;
        FCAPP.Common.resizeLayout(R.popTips);
        var contact = $("#contact div.box"),
            resultBox = $('#resultDialog div.box');
        var w = window.innerWidth,
            h = window.innerHeight;
        if (contact.length > 0) {
            contact.css("position", "absolute");
            contact.css("min-width", "240px");
            contact.css("max-width", "80%");
            contact.css('left', (w - contact[0].offsetWidth) / 2 + 'px');
            contact.css('top', (h - contact[0].offsetHeight) / 2 + 'px');
            contact.css("margin", "0px");
        }
        if (resultBox.length > 0) {
            resultBox.css("position", "absolute");
            resultBox.css("min-width", "240px");
            resultBox.css("max-width", "80%");
            resultBox.css('left', (w - resultBox[0].offsetWidth) / 2 + 'px');
            resultBox.css('top', (h - resultBox[0].offsetHeight) / 2 + 'px');
            resultBox.css("margin", "0px");
        }
    },
    validCGIData: function (data) {
        var C = YTJoin.CONFIG;
        var opts = null;
        var success = (data.ret == 0);
        if (success == false) {
            var message = typeof (C.Error[data.ret]) == 'undefined' ? data.msg : C.Error[data.ret];
            if (data.ret == -100) {
                opts = {
                    msg: message,
                    ok: function () {
                        YTJoin.refreshMe();
                    }
                }
            } else {
                opts = {
                    msg: message
                };
            }
            FCAPP.Common.msg(true, opts);
        }
        return success;
    },
    refreshMe: function () {
        var url = "http://trade.qq.com/fangchan/yt-join.html";
        FCAPP.Common.jumpWithAuth(url, null);
    }
};
var YTJoin = FCAPP.YTJoin;
$(document).ready(YTJoin.init);