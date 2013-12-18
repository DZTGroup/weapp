var FCAPP = FCAPP || {};
FCAPP.APPLY = {
    CONFIG: {
        Error: {
            '-100': '提交超时,请重新报名',
            '-101': '请先关注该公共帐号',
            '-102': '不存在的看房团',
            '-411': '请正确输入手机号',
            '-414': '请输入您的姓名',
            '-445': '请正确选择报名人数',
            '-446': '请正确选择出发地点',
            '-1401': '您已经报名了，请不要重复报名'
        },
        Server: '/weapp/php/cgi/group.php'
    },
    RUNTIME: {},
    init: function() {
        var R = APPLY.RUNTIME,
        C = APPLY.CONFIG;
        if (!R.noticeLink) {
            R.noticeLink = $('#noticeLink');
            R.popTips = $('#popTips');
            R.banner = $('#banner');
            R.actRule = $('#actRule');
            R.fromPoint = $('#fromPoint');
            R.deadLine = $('#deadline');
            R.applyResult = $('#applyResult');
            R.applyTips = $('#applyTips');
            R.applyBox = $('#applyBox');
            R.submitBtn = $('#submitBtn');
            R.uname = $("#uname");
            R.persons = $('#persons');
            R.phone = $('#phone');
            R.iagree = $('#iagree');
        }
        APPLY.restoreData();
        APPLY.loadInfo();
        // mod by aohain
        // not needed in new design.
        //APPLY.getUserState();
        APPLY.initEvents();
        if (window.gQuery && gQuery.qrcode) {
            C.qrcode = gQuery.qrcode.replace(/[^a-z0-9]/gi, '');
        }
        var id = '';
        if (window.gQuery && gQuery.id) {
            id = gQuery.id;
        }
        //FCAPP.Common.loadShareData(id);
        FCAPP.Common.hideToolbar();
    },
    initEvents: function() {
        var R = APPLY.RUNTIME;
        R.noticeLink.click(function() {
            FCAPP.Common.jumpTo('rule.html', {
                '#wechat_webview_type': 1
            },
            true);
        });
        $(window).resize(function() {
            FCAPP.Common.resizeLayout(R.popTips);
        });
    },
	//
    loadInfo: function() {
        //callback
        window.loadInfoResult = APPLY.loadInfoResult;
        var eid = window.gQuery && gQuery.eid ? gQuery.eid : 'default',
            dt = new Date();
        eid = eid.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');

        var pathParameter = window.gQuery && gQuery.openid && gQuery.openid == 0 ? 'test':'wechat';
        // mod by aohajin
        var path = '/weapp/public_html/data/'+eid+'/'+pathParameter+'/group.js?';
        $.ajax({
            url: path + dt.getDate() + dt.getHours(),
            dataType: 'jsonp',
            error: function() {
                FCAPP.Common.msg(true, {
                    msg: '无效的看房团！'
                });
            }
        });
    },
    loadInfoResult: function(res) {
        var R = APPLY.RUNTIME;
        R.banner.prop('src', res.banner);
        APPLY.renderApplyTips(res.ads);
        APPLY.renderLines(res.lines);
        APPLY.renderInfo(res.rules, R.actRule);
        APPLY.checkTime(res.startTime, res.endTime);
        FCAPP.Common.hideLoading();
        R.openID = window.gQuery && gQuery.openid ? gQuery.openid : '0';
        R.issue = res.issue;
        R.house = res.ads.strong;
        isApply();
    },
    renderApplyTips: function(data) {
        var R = APPLY.RUNTIME,
        msg = FCAPP.Common.escapeHTML(data.msg) || ' ',
        strong = FCAPP.Common.escapeHTML(data.strong) || '',
        tips,
        what = R.applyTips;
        $('h3', what).html('<em>' + msg + '</em>' + strong);
        if (data.tips) {
            tips = FCAPP.Common.escapeHTML(data.tips) || '';
            $('p', what).html(tips);
        }
    },
    renderLines: function(data) {
        var R = APPLY.RUNTIME,
        lineSelect = R.fromPoint.get(0);
        for (var i = 0,
        il = data.length; i < il; i++) {
            lineSelect.options[i] = new Option(data[i].text, data[i].value);
        }
    },
    renderInfo: function(data, $obj) {
        var tpl = '<dt>{title}</dt><dd>{desc}</dd>',
        List = [];
        for (var i = 0,
        il = data.length; i < il; i++) {
            List.push(FCAPP.Common.format(tpl, {
                title: data[i].title,
                desc: data[i].desc.join('<br>')
            }));
        }
        $obj.html(List.join(''));
    },
    getUserState: function() {
        var C = APPLY.CONFIG,
        data = {
            appid: window.gQuery && gQuery.appid ? gQuery.appid: '',
            wticket: window.gQuery && gQuery.wticket ? gQuery.wticket: '',
            cmd: 'getuserbyappid',
            callback: 'userStateResult',
            _: new Date().getTime()
        };
        window.userStateResult = APPLY.userStateResult;
        $.ajax({
            url: C.State + '?' + $.param(data),
            dataType: 'jsonp',
            error: APPLY.userStateError
        });
    },
    userStateResult: function(res) {
        var R = APPLY.RUNTIME,
        C = APPLY.CONFIG;
        if (res.ret != 0) {
            APPLY.userStateError();
        } else {
            R.openID = res.openid;
            APPLY.isApply();
        }
    },
    userStateError: function() {
        var C = APPLY.CONFIG;
        if (window.gQuery && gQuery.debug == 1) {
            if (gQuery.form != 1) {
                FCAPP.Common.msg(true, {
                    msg: '您已进入预览模式，禁止报名'
                });
            }
        } else {
            FCAPP.Common.msg(true, {
                msg: '访问超时,请重新进入',
                ok: function() {
                    location.href = "http://meishi.qq.com/qr/" + C.qrcode + '#wechat_redirect';
                }
            });
        }
    },
    showResult: function(obj) {
        var R = APPLY.RUNTIME,
        resState = {
            success: 'ico_success',
            sad: 'ico_sad',
            smile: 'ico_smile'
        },
        title = obj.title || '',
        state = obj.state in resState ? resState[obj.state] : resState.sad,
        what = R.applyResult,
        deadline = R.deadLine,
        $h4 = $('h4', what),
        $info = $('div.result_info', what);
        $h4.html(FCAPP.Common.escapeHTML(title));
        $h4.attr('class', state);
        if (obj.link) {
            $info.html('<a href="javascript:void(0);" class="btn_strong"><span>查看更多往期精彩活动</span></a>');
        } else {
            $info.html('<p>' + obj.msg.join('</p><p>') + '</p>');
        }
        if (obj.tips == false) {
            $('p', what).hide();
        }
        deadline.hide();
        what.show();
    },
    restoreData: function() {
        var R = APPLY.RUNTIME,
        uname = FCAPP.Common.getCookie('uname'),
        nums = FCAPP.Common.getCookie('nums'),
        phone = FCAPP.Common.getCookie('phone'),
        from = FCAPP.Common.getCookie('from');
        if (uname.length) {
            R.uname.val(uname.replace(/[<>\'\"]+/gi, ''));
        }
        if (nums) {
            R.persons.val(nums.replace(/[<>\'\"]+/gi, ''));
        }
        if (phone) {
            R.phone.val(phone.replace(/[<>\'\"]+/gi, ''));
        }
        if (from) {
            R.fromPoint.val(from.replace(/[<>\'\"]+/gi, ''));
        }
    },
    isApply: function() {
        var R = APPLY.RUNTIME;
        if (!R.openID || !R.issue) {
            setTimeout(APPLY.isApply, 100);
            return;
        }
        var val = FCAPP.Common.getCookie(R.openID + R.issue);
        if (val == 1) {
            R.applyBox.hide();
            R.deadLine.hide();
            APPLY.showResult({
                state: 'smile',
                title: '您已经报名成功!',
                msg: ['工作人员将以短信或电话的方式', '确认您的报名信息']
            });
        }
    },
    checkTime: function(stime, etime) {
        var R = APPLY.RUNTIME,
        now = Math.floor(new Date().getTime() / 1000);
        if (window.gQuery && gQuery.ts && /^\d+$/.test(gQuery.ts)) {
            now = gQuery.ts;
        }
        if (/^\d{4}\-\d{2}\-\d{2} (\d{2}|\d{1}):\d{2}:\d{2}$/.test(stime)) {
            stime = Math.floor(new Date(stime.replace(/\-/gi, '/')).getTime() / 1000);
        }
        if (/^\d{4}\-\d{2}\-\d{2} (\d{2}|\d{1}):\d{2}:\d{2}$/.test(etime)) {
            etime = Math.floor(new Date(etime.replace(/\-/gi, '/')).getTime() / 1000);
        }
        if (now < stime) {
            R.applyBox.show();
            R.deadLine.show();
            APPLY.setSwitchEvent();
            FCAPP.Common.timer(Math.abs(stime - now), 'deadline');
        } else {
            R.applyBox.hide();
            R.deadLine.hide();
            if (now < etime) {
                APPLY.showResult({
                    state: 'sad',
                    title: '',
                    msg: ['本次报名已截止', '请关注下一次团购']
                });
            } else {
                APPLY.showResult({
                    state: 'smile',
                    title: '活动已成功结束!',
                    msg: ['请关注我们的微信', '留意下一次团购']
                });
            }
        }
    },
    setSwitchEvent: function() {
        var R = APPLY.RUNTIME;
        R.submitBtn.click(APPLY.checkForm);
    },
    checkForm: function() {
        var R = APPLY.RUNTIME,
        name = R.uname.val(),
        nums = R.persons.val(),
        from = R.fromPoint.val(),
        phone = R.phone.val();
        FCAPP.Common.saveCookie('uname', name, 300);
        FCAPP.Common.saveCookie('nums', nums, 300);
        FCAPP.Common.saveCookie('from', from, 300);
        FCAPP.Common.saveCookie('phone', phone, 300);
        if (!R.iagree.is(":checked")) {
            FCAPP.Common.msg(true, {
                msg: '请阅读并同意《网友活动须知》'
            });
            return;
        }
        if (name.replace(/[\r\n\s]+/g, '').length < 1 || /[^\u4e00-\u9FA5\sa-z]+/i.test(name)) {
            FCAPP.Common.msg(true, {
                msg: '请正确输入姓名'
            });
            return;
        }
        if (!/^1\d{10}$/.test(phone)) {
            FCAPP.Common.msg(true, {
                msg: '请正确输入手机号'
            });
            return;
        }
        var info = {
            name: name,
            mobile: phone,
            number: nums,
            line: from
        };
        APPLY.applyAction(info);
    },
    applyAction: function(info, callback) {
        var R = APPLY.RUNTIME,
        data = {
            appid: window.gQuery && gQuery.appid ? gQuery.appid: '',
            eid: window.gQuery && gQuery.eid ? gQuery.eid: 'default',
            openid: window.gQuery && gQuery.openid ? gQuery.openid: ''
            //house: R.house || ''
        };

        for (var i in info) {
            data[i] = info[i].replace(/[<>\'\"]+/gi, '');
        }
        data['gid'] = R.issue;

        if (window.gQuery && gQuery.openid == 0) {
            FCAPP.Common.msg(true, {
                msg: '预览模式'
            });
            return;
        }
        APPLY.save(data);
    },
    save: function(data) {
        var C = APPLY.CONFIG;
        data.cmd = 'apply';
        data.callback = 'saveResult';
        window.saveResult = APPLY.saveResult;
		
        $.ajax({
            url: C.Server + '?' + $.param(data),
            dataType: 'jsonp'
		//	complete:function(){ alert"xxx";}
        });
	   //$.get(C.Server + '?' + $.param(data),null,saveResult,'json');
    },
    saveResult: function(data) {
        var R = APPLY.RUNTIME,
        C = APPLY.CONFIG;
        if (data.ret == 0 || data.ret == -1401) {
            FCAPP.Common.saveCookie(R.openID + R.issue, 1, 30 * 3600 * 24);
        }
        if (data.ret == 0) {
            R.applyBox.hide();
            FCAPP.Common.msg(true, {
                msg: "您已经报名成功!",
                ok: function() {
                    APPLY.showResult({
                        state: 'smile',
                        title: '您已经报名成功!',
                        msg: ['工作人员将以短信或电话的方式', '确认您的报名信息']
                    });
                }
            });
        } else if (data.ret == -1401) {
            R.applyBox.hide();
            var cb = function() {};
            if (data.ret in C.Error) {
                FCAPP.Common.msg(true, {
                    msg: C.Error[data.ret],
                    ok: cb
                });
            }
            APPLY.showResult({
                state: 'smile',
                title: '您已经报名成功!',
                msg: ['工作人员将以短信或电话的方式', '确认您的报名信息']
            });
        } else {
            var cb = function() {};
            if (data.ret in C.Error) {
                FCAPP.Common.msg(true, {
                    msg: C.Error[data.ret],
                    ok: cb
                });
            } else {
                FCAPP.Common.msg(true, {
                    msg: '网络不给力,请稍候再试'
                });
            }
        }
    }
};
var APPLY = FCAPP.APPLY;
$(document).ready(APPLY.init);