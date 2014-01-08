var FCAPP = FCAPP || {};
FCAPP.PAY = {
    CONFIG: {
        Error: {
            '-601': '验证码错误，请重新输入',
            '-602': '您点太快了，请60秒后再试',
            '-603': '验证码已失效，请重新获取',
            '-604': '验证码已失效，请重新获取',
            '-605': '验证码已失效，请重新获取',
            '-606': '验证码错误，请重新输入',
            '1005': '系统繁忙，请重新提交'
        },
//        Server: 'http://cgi.trade.qq.com/cgi-bin/common/pay_order.fcg',
        Server: 'http://112.124.55.78/weixinfc/pay_order.php',
//        Verify: 'http://cgi.trade.qq.com/cgi-bin/common/mobile_verify.fcg',
        Verify: 'http://112.124.55.78/weixinfc/mobile_verify.php',
//        State: 'http://cgi.trade.qq.com/cgi-bin/common/meishi_interface.fcg',
        State: 'http://112.124.55.78/weixinfc/pay_auth.php',
        qrcode: 'n13551178921362'
    },
    RUNTIME: {
        subData: {}
    },
    init: function () {
        var R = PAY.RUNTIME,
            C = PAY.CONFIG;
        PAY.initElements(R);
        PAY.initEvents(R, C);
        PAY.getUserState();
        PAY.restoreData();
        PAY.loadInfo();
        if (window.gQuery && gQuery.qrcode) {
            C.qrcode = gQuery.qrcode.replace(/[^a-z0-9]/gi, '');
        }
        var id = '';
        if (window.gQuery && gQuery.id) {
            id = gQuery.id;
        }
        //FCAPP.Common.loadpreData(id);
        FCAPP.Common.hideToolbar();
    },
    initElements: function (R) {
        if (!R.banner) {
            R.banner = $('#banner');
            R.retBanner = $('#retBanner');
            R.deadLine = $('#deadline');
            R.actTop = $('div.act_top');
            R.actTopTips = $('#actTopTips');
            R.popTips = $('#popTips');
            R.actOver = $('#actOver');
            R.payTitle = $('#payTitle');
            R.payBox = $('#payBox');
            R.payTips = $('#payTips');
            R.payNote = $('#payTips dl.act_rule');
            R.ruleList = $('#ruleList');
            R.ruleDetail = R.ruleList.parent();
            R.ruleTitle = $('#ruleTitle');
            R.fromPoint = $('#fromPoint');
            R.uname = $('#uname');
            R.idcard = $('#idcard');
            R.phone = $('#phone');
            R.payCount = $('#payCount');
            R.payUnit0 = $('#payUnit0');
            R.payUnit1 = $('#payUnit1');
            R.agree = $("#agree");
            R.agreeBox = $('#agreeBox');
            R.ruleLink = $('span.link');
            R.applyOff = $('#applyOff');
            R.verifyCode = $('#verifyCode');
            R.verifyBtn = $('#verifyBtn');
            R.payOnLine = $('#payOnLine');
            R.payOffLine = $('#payOffLine');
            R.payRuleList = $('#ruleList');
            R.fromHouseList = $('#fromHouseList');
            R.fromLabel = $(fromLabel);
            R.popFail = $('#popFail');
            R.template = FCAPP.Common.escTpl($('#template').html());
            R.applyState = 0;
            R.baseCount = 0;
            R.paySence = 'info';
        }
    },
    initEvents: function (R, C) {
        R.ruleLink.click(function () {
            var data = {
                '#wechat_webview_type': 1
            };
            if (R.agree.is(':checked')) {
                data.form = 1;
            }
            R.ruleTitle.show();
            location.hash = '#ruleAnchor';
        });
        $(window).resize(function () {
            FCAPP.Common.resizeLayout(R.popTips);
        });
        R.fromPoint.change(function () {
            PAY.updatePayMoney(R);
        });
        R.payCount.change(function () {
            PAY.updatePayMoney(R);
        });
        R.verifyBtn.click(function () {
            document.body.focus();
            setTimeout(function () {
                PAY.verifyPhone('acquire', 'verifyCB', false);
            }, 100);
        });
        R.applyOff.on('click', PAY.switchPayBox);
        R.retBanner.on('click', PAY.showPayInfo);
    },
    showPayInfo: function () {
        var R = PAY.RUNTIME;
        R.retBanner.hide();
        R.actTop.show();
        R.deadLine.show();
        R.applyOff.html('马上报名');
        R.payBox.hide();
        R.payTips.show();
        R.ruleTitle.show();
        R.agreeBox.show();
        R.paySence = 'info';
        R.applyOff.off('click', PAY.checkForm);
        R.applyOff.on('click', PAY.switchPayBox);
        FCAPP.Common.hideLoading();
    },
    switchPayBox: function () {
        var R = PAY.RUNTIME;
        if (R.applyState == 0) {
            R.agree.prop("disabled", true);
            FCAPP.Common.msg(true, {
                msg: '认筹还未开始哦，请稍后再试'
            });
        } else if (R.applyState == 2) {
            R.agree.prop("disabled", true);
            FCAPP.Common.msg(true, {
                msg: '本次认筹已经结束，敬请期待下次认筹'
            });
        } else if (R.applyState == 1) {
            if (R.agree.is(':checked')) {
                R.agreeBox.hide();
                R.payTips.hide();
                R.ruleTitle.hide();
                R.payBox.show();
                R.retBanner.show();
                R.deadLine.hide();
                R.actTop.hide();
                if (R.paySence == 'info') {
                    R.paySence == 'pay';
                    R.applyOff.html('去支付');
                    R.applyOff.off('click', PAY.switchPayBox);
                    R.applyOff.on('click', PAY.checkForm);
                } else {
                    R.paySence = 'info';
                    R.applyOff.on('click', PAY.checkForm);
                    R.applyOff.off('click', PAY.switchPayBox);
                }
            } else {
                FCAPP.Common.msg(true, {
                    msg: '请阅读并同意《认筹须知》',
                    ok: function () {
                        R.agree.prop('checked', true);
                        location.hash = '#agreeAnchor';
                    }
                });
            }
        }
    },
    verifyPhone: function (cmd, cb, verifyCode) {
        var R = PAY.RUNTIME,
            C = PAY.CONFIG,
            data = {
                'callback': cb,
                cmd: cmd
            }, phone = R.phone.val(),
            verify = R.verifyCode.val();
        if (phone.length != 11 || !/^1\d{10}$/.test(phone)) {
            FCAPP.Common.msg(true, {
                msg: '请输入正确的手机号'
            });
            FCAPP.Common.hideLoading();
            return;
        }
        if (R.verifyCodeTimeout > 0 && !verifyCode) {
            return;
        }
        if (verifyCode) {
            if (verify.length != 6 || !/^\d{6}$/.test(verify)) {
                FCAPP.Common.msg(true, {
                    msg: '请正确输入验证码'
                });
                FCAPP.Common.hideLoading();
                return;
            } else {
                data.verifycode = verify;
            }
        }
        R.subData.mobile = phone;
        data.mobile = phone;
        data.bid = R.currentBid;
        data._ = new Date().getTime();
        window[cb] = PAY[cb];
        $.ajax({
            url: C.Verify + '?' + $.param(data),
            dataType: 'jsonp',
            error: function () {
                PAY.verifyCB({
                    ret: -1
                });
            }
        });
        R.verifyCodeTimeout = 60;
        try {
            clearInterval(R.verifyCodeInterval);
        } catch (e) {};
        R.verifyCodeInterval = window.setInterval(PAY.updateVerifyBtnContent, 1000);
    },
    updateVerifyBtnContent: function () {
        var R = PAY.RUNTIME;
        if (R.verifyCodeTimeout > 0) {
            R.verifyCodeTimeout--;
            R.verifyBtn.html('' + R.verifyCodeTimeout + 's后再获取');
            R.verifyBtn.css('background', '#e1e1e1');
        } else {
            R.verifyBtn.html('获取验证码');
            R.verifyBtn.css('background', '-webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#fafafa))');
            clearInterval(R.verifyCodeInterval);
        }
    },
    verifyCB: function (res) {
        var R = PAY.RUNTIME,
            C = PAY.CONFIG.Error;
        if (res.ret == 0) {
            FCAPP.Common.msg(true, {
                msg: '验证码发送成功，请查看手机短信'
            });
        } else {
            var msg = '验证码发送失败，请重试';
            if (res.ret in C) {
                msg = C[res.ret];
            }
            FCAPP.Common.msg(true, {
                msg: msg
            });
            R.verifyCodeTimeout = 0;
            PAY.updateVerifyBtnContent();
        }
    },
    verifyCode: function () {
        PAY.verifyPhone('check', 'verifyResult', true);
    },
    verifyResult: function (res) {
        var R = PAY.RUNTIME,
            C = PAY.CONFIG.Error;
        if (res.ret == 0) {
            PAY.applyAction();
        } else {
            R.isSaving = false;
            var msg = '请正确输入验证码';
            if (res.ret in C) {
                msg = C[res.ret];
            }
            try {
                clearInterval(R.verifyCodeInterval);
            } catch (e) {}
            R.verifyCodeTimeout = 0;
            PAY.updateVerifyBtnContent();
            FCAPP.Common.hideLoading();
            FCAPP.Common.msg(true, {
                msg: msg
            });
        }
    },
    updatePayMoney: function (R) {
        var cnt = parseInt(R.payCount.val()),
            vals = R.fromPoint.val().split('-'),
            id = parseInt(vals[0]),
            online = parseInt(vals[1]),
            offline = parseInt(vals[2]);
        online = parseFloat(online / 100).toFixed(2);
        offline = parseFloat(offline / 100).toFixed(2);
        if (isNaN(cnt)) {
            cnt = 1;
            R.payCount.val(1);
        }
        R.payOnLine.html(cnt * online);
        R.payOffLine.html(offline);
        R.payUnit0.html(online);
        R.payUnit1.html(online);
    },
    loadInfo: function () {
        window.loadInfoResult = PAY.loadInfoResult;

        var eid = window.gQuery && gQuery.eid ? gQuery.eid : 'default',
            dt = new Date();
        eid = eid.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
        var pathParameter = window.gQuery && gQuery.openid && gQuery.openid == 0 ? 'test':'wechat';
        // mod by aohajin
        var path = '/weapp/public_html/data/'+eid+'/'+pathParameter+'/reservation.js?';
        //var path = '/weapp/public_html/reservation.data.js?';
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
        var datafile = window.gQuery && gQuery.id ? gQuery.id + '.' : '',
            dt = new Date();
        datafile = datafile.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
        datafile += 'pay.js?';
        $.ajax({
 //           url: '/fangchan/static/' + datafile + dt.getDate() + dt.getHours(),
		url: '' + datafile + dt.getDate() + dt.getHours(),
            dataType: 'jsonp'
        });*/
    },
    loadInfoResult: function (res) {
        var R = PAY.RUNTIME;
        R.banner.prop('src', res.banner);
        PAY.checkTime(res.startTime, res.endTime);
        PAY.renderHouseType(res.type, res.housetype);
        PAY.renderApplyCount(res.maxApplyCount);
        PAY.renderInfo(res.rules, R.payNote);
        FCAPP.Common.hideLoading();
        R.subData.actno = res.issue;
        R.subData.benefit = res.rules.title;
        R.subData.tips = res.tips;
        R.subData.housetype = res.type;
        R.currentBid = res.bid;
        R.payRuleList.html($.template(R.template, {
            data: res.details
        }));
        FCAPP.Common.hideLoading();
    },
    checkTime: function (stime, etime) {
        var R = PAY.RUNTIME,
            now = Math.floor(new Date().getTime() / 1000),
            day = 0;
        R.actOver.hide();
        if (/^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}$/.test(stime)) {
            stime = Math.floor(new Date(stime.replace(/\-/gi, '/')).getTime() / 1000);
        }
        if (/^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}$/.test(etime)) {
            etime = Math.floor(new Date(etime.replace(/\-/gi, '/')).getTime() / 1000);
        }
        if (now < stime) {
            day = Math.abs(stime - now);
            R.applyState = 0;
            R.deadLine.removeClass('act_time_end');
            FCAPP.Common.timer(day, 'deadline');
            R.applyOff.replaceClass('btn_strong', 'btn_off');
            R.actTopTips.html('距离本次报名开始还有');
        } else if (now < etime) {
            day = Math.abs(etime - now);
            R.applyState = 1;
            R.deadLine.removeClass('act_time_end');
            FCAPP.Common.timer(day, 'deadline');
            R.applyOff.replaceClass('btn_off', 'btn_strong');
            R.actTopTips.html('距离本次报名截止还有');
        } else {
            R.applyState = 2;
            R.actOver.show();
            R.deadLine.addClass('act_time_end');
            R.applyOff.replaceClass('btn_strong', 'btn_off');
            R.applyOff.html('认筹已截止')
            FCAPP.Common.msg(true, {
                msg: '本期认筹已结束，敬请期待下期认筹'
            });
            R.actTopTips.parent().hide();
        }
    },
    renderHouseType: function (type, data) {
        var R = PAY.RUNTIME,
            lineSelect = R.fromPoint.get(0),
            lblTxt = {
                0: '统一：',
                1: '房型：',
                2: '面积：'
            };
        for (var i = 0, il = data.length; i < il; i++) {
            var txt = FCAPP.Common.escapeHTML(data[i].text),
                online = FCAPP.Common.escapeHTML(data[i].online),
                offline = FCAPP.Common.escapeHTML(data[i].offline),
                id = FCAPP.Common.escapeHTML(data[i].id);
            lineSelect.options[i] = new Option(txt, id + '-' + online + '-' + offline + '-' + txt);
        }
        if (type in lblTxt) {
            R.fromLabel.html(FCAPP.Common.escapeHTML(lblTxt[type]));
        }
        if (type == 0) {
            R.fromHouseList.hide();
        }
    },
    renderApplyCount: function (num) {
        var R = PAY.RUNTIME,
            lineSelect = R.payCount.get(0),
            len = lineSelect.options.length;
        lineSelect.options = null;
        for (var i = 1; i <= num; i++) {
            lineSelect.options[i - 1] = new Option(i, i);
        }
        if (len > num) {
            for (i = len - 1; i >= num; i--) {
                lineSelect.options[i] = null;
            }
        }
        setTimeout(function () {
            PAY.updatePayMoney(R);
        }, 50);
    },
    renderInfo: function (data, $obj) {
        var R = PAY.RUNTIME;
        R.payTitle.html(FCAPP.Common.escapeHTML(data.title));
        var tpl = '<dd>{desc}</dd>',
            List = [];
        List.push(FCAPP.Common.format(tpl, {
            title: data.title,
            desc: data.desc.join('<br>')
        }));
        $obj.html(List.join(''));
    },
    getUserState: function () {
        var C = PAY.CONFIG,
            data = {
                appid: window.gQuery && gQuery.appid ? gQuery.appid : '',
                wticket: window.gQuery && gQuery.wticket ? gQuery.wticket : '',
                cmd: 'getuserbyappid',
                callback: 'userStateResult',
                _: new Date().getTime()
            };
        window.userStateResult = PAY.userStateResult;
        $.ajax({
            url: C.State + '?' + $.param(data),
            dataType: 'jsonp',
            error: PAY.userStateError
        });
    },
    userStateError: function () {
        var C = PAY.CONFIG;
        if (window.gQuery && gQuery.debug == 1) {
            if (gQuery.form != 1) {
                FCAPP.Common.msg(true, {
                    msg: '您已进入预览模式，禁止认筹'
                });
            }
        } else {
            FCAPP.Common.msg(true, {
                msg: FCAPP.Common.CONFIG.errJumpNote,
                ok: function () {
                    FCAPP.Common.errJump('pay');
                }
            });
        }
    },
    userStateResult: function (res) {
        var R = PAY.RUNTIME,
            C = PAY.CONFIG;
        if (res.ret != 0) {
            PAY.userStateError();
        } else {
            R.openID = res.openid;
        }
    },
    restoreData: function () {
        var R = PAY.RUNTIME,
            uname = FCAPP.Common.getCookie('puname'),
            paycount = FCAPP.Common.getCookie('ppaycount'),
            phone = FCAPP.Common.getCookie('pphone'),
            fromPoint = FCAPP.Common.getCookie('pfrompoint');
        if (uname.length) {
            R.uname.val(FCAPP.Common.escapeHTML(uname));
        }
        if (paycount) {
            R.payCount.val(FCAPP.Common.escapeHTML(paycount));
        }
        if (phone) {
            R.phone.val(FCAPP.Common.escapeHTML(phone));
        }
        if (fromPoint) {
            R.fromPoint.val(FCAPP.Common.escapeHTML(fromPoint));
        }
    },
    checkForm: function () {
        var R = PAY.RUNTIME,
            name = R.uname.val(),
            idcard = R.idcard.val(),
            verify = R.verifyCode.val(),
            phone = R.phone.val(),
            fromPoint = R.fromPoint.val(),
            payCount = parseInt(R.payCount.val());
        FCAPP.Common.saveCookie('puname', name, 300);
        FCAPP.Common.saveCookie('ppaycount', payCount, 300);
        FCAPP.Common.saveCookie('pphone', phone, 300);
        FCAPP.Common.saveCookie('pfrompoint', fromPoint, 300);
        if (!R.agree.is(":checked")) {
            FCAPP.Common.msg(true, {
                msg: '请阅读并同意《认筹须知》'
            });
            return;
        }
        if (name.replace(/[\r\n\s]+/g, '').length < 1 || /[^\u4e00-\u9FA5\sa-z]+/i.test(name)) {
            FCAPP.Common.msg(true, {
                msg: '请正确输入姓名'
            });
            return;
        }
        R.subData.username = name;
        if ((/^\d{15}$/.test(idcard) || /^\d{17}[0-9x]$/i.test(idcard))) {
            if (!PAY.checkIdCard(idcard)) {
                FCAPP.Common.msg(true, {
                    msg: '请输入正确的身份证号码'
                });
                return;
            }
        } else {
            FCAPP.Common.msg(true, {
                msg: '请输入正确的身份证号码'
            });
            return;
        }
        R.subData.identityid = idcard;
        if (!/^1\d{10}$/.test(phone)) {
            FCAPP.Common.msg(true, {
                msg: '请输入正确的手机号码'
            });
            return;
        }
        R.subData.mobile = phone;
        if (verify.length != 6 || !/^\d{6}$/.test(verify)) {
            FCAPP.Common.msg(true, {
                msg: '请正确输入验证码'
            });
            return;
        }
        if (isNaN(payCount) || payCount <= 0) {
            FCAPP.Common.msg(true, {
                msg: '认筹数必须大于0'
            });
            return;
        }
        R.subData.paynum = payCount;
        var info = fromPoint.split('-');
        R.subData.payid = parseInt(info[0]);
        R.subData.payfee = payCount * parseInt(info[1]);
        R.subData.offlinefee = payCount * parseInt(info[2]);
        R.subData.offlineunit = parseInt(info[2]);
        R.subData.housestyle = info.slice(3).join('-');
        if (R.isSaving) {
            return;
        }
        PAY.verifyCode();
        FCAPP.Common.showLoading();
    },
    isLeapYear: function (year) {
        year = parseInt(year);
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    },
    checkIdCard: function (id) {
        var prov = {
            11: true,
            12: true,
            13: true,
            14: true,
            15: true,
            21: true,
            22: true,
            23: true,
            31: true,
            32: true,
            33: true,
            34: true,
            35: true,
            36: true,
            37: true,
            41: true,
            42: true,
            43: true,
            44: true,
            45: true,
            46: true,
            50: true,
            51: true,
            52: true,
            53: true,
            54: true,
            61: true,
            62: true,
            63: true,
            64: true,
            65: true,
            71: true,
            81: true,
            82: true,
            91: true
        };
        var idChars = id.split("");
        if (!prov[parseInt(id.substr(0, 2))]) {
            return false;
        }
        switch (id.length) {
        case 15:
            var year = parseInt(id.substr(6, 2)) + 1900;
            if (PAY.isLeapYear(year)) {
                regExp = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
            } else {
                regExp = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
            }
            return regExp.test(id);
            break;
        case 18:
            var year = id.substr(6, 4);
            if (PAY.isLeapYear(year)) {
                regExp = /^[1-9][0-9]{5}[1-9][0-9]{3}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
            } else {
                regExp = /^[1-9][0-9]{5}[1-9][0-9]{3}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
            }
            if (regExp.test(id)) {
                var modulus, checkCodeList = '10X98765432';
                var sum, code;
                sum = (parseInt(idChars[0]) + parseInt(idChars[10])) * 7 + (parseInt(idChars[1]) + parseInt(idChars[11])) * 9 + (parseInt(idChars[2]) + parseInt(idChars[12])) * 10 + (parseInt(idChars[3]) + parseInt(idChars[13])) * 5 + (parseInt(idChars[4]) + parseInt(idChars[14])) * 8 + (parseInt(idChars[5]) + parseInt(idChars[15])) * 4 + (parseInt(idChars[6]) + parseInt(idChars[16])) * 2 +
                    parseInt(idChars[7]) * 1 +
                    parseInt(idChars[8]) * 6 +
                    parseInt(idChars[9]) * 3;
                modulus = sum % 11;
                code = checkCodeList.substr(modulus, 1).toUpperCase();
                if (code == idChars[17]) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            break;
        default:
            return false;
        }
    },
    applyAction: function () {
        var R = PAY.RUNTIME,
            data = {
                appid: window.gQuery && gQuery.appid ? gQuery.appid : '',
                wticket: window.gQuery && gQuery.wticket ? gQuery.wticket : '',
                cmd: 'new',
                bus: 'weixin_house'
            };
        R.isSaving = true;
        data.payinfo = JSON.stringify(R.subData);
        if (window.gQuery && gQuery.debug == 1) {
            FCAPP.Common.msg(true, {
                msg: '预览模式禁止认筹'
            });
            return;
        }
        PAY.save(data);
    },
    save: function (data) {
        var C = PAY.CONFIG;
        data.callback = 'saveResult';
        data._ = new Date().getTime();
        window.saveResult = PAY.saveResult;
        $.ajax({
            url: C.Server + '?' + $.param(data),
            dataType: 'jsonp',
            error: function () {
                PAY.saveResult({
                    ret: -1
                });
            }
        });
    },
    saveResult: function (res) {
        var R = PAY.RUNTIME,
            C = PAY.CONFIG,
            msg = '';
        R.isSaving = false;
        if (res.ret == 0 && res.payurl) {
            location.href = res.payurl;
        } else {
            FCAPP.Common.hideLoading();
            msg = '您太长时间没有操作，为了帐号安全请点击确定后重新提交';
            if (res.ret in C) {
                msg = C[res.ret];
            }
            FCAPP.Common.msg(true, {
                msg: msg,
                ok: function () {
                    FCAPP.Common.errJump('pay');
                }
            });
        }
    }
};
var PAY = FCAPP.PAY;
$(document).ready(PAY.init);
