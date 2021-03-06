function Calendar() {
    var self = this,
        $calendar, $previous, $next, $month, $weekdays, $days, $rows, startDate, endDate, currentMonth, today, singleDate, firstDayOfWeek = 0,
        opts = {}, weekdaysMin = "日_一_二_三_四_五_六".split("_"),
        tap = 'click',
        startDateString = "startDate",
        endDateString = "endDate",
        setDate = function (type, value) {
            value && value.startOf('day');
            if (type == startDateString) {
                startDate = value;
            } else {
                endDate = value;
            }
            drawSelection();
            $calendar.attr('data-' + type.toLowerCase(), !value ? "" : value.toString());
            $calendar.trigger(type + "Changed");
        }, dateSelected = function (evt) {
            evt.preventDefault();
            var $this = $(this);
            if ($this.parent().hasClass("dis") || ($this.text().length == 0)) {
                return;
            }
            var selectedDate = moment(new Date(currentMonth.year(), currentMonth.month(), parseInt($this.text())));
            if (singleDate) {
                setDate(startDateString, selectedDate);
                return;
            }
            if (!startDate) {
                if (!endDate) {
                    setDate(startDateString, selectedDate);
                } else {
                    if (selectedDate < endDate) {
                        setDate(startDateString, selectedDate);
                    } else if (endDate < selectedDate) {
                        setDate(startDateString, endDate);
                        setDate(endDateString, selectedDate);
                    } else {
                        setDate(endDateString, null);
                    }
                }
            } else if (!endDate) {
                if (startDate < selectedDate) {
                    setDate(endDateString, selectedDate);
                } else if (selectedDate < startDate) {
                    setDate(endDateString, startDate);
                    setDate(startDateString, selectedDate);
                } else {
                    setDate(startDateString, null);
                }
            } else {
                if ($this.hasClass(startDateString)) {
                    setDate(startDateString, null);
                } else if ($this.hasClass(endDateString)) {
                    setDate(endDateString, null);
                } else {
                    setDate(startDateString, null);
                    setDate(endDateString, null);
                }
            }
        }, getDay = function (day) {
            return (day + firstDayOfWeek) % 7;
        }, drawSelection = function () {
            $days.removeClass(startDateString).removeClass(endDateString).removeClass("betweenDates");
            $days.parent().removeClass('here');
            var firstDay = currentMonth.clone().startOf('month');
            var lastDay = currentMonth.clone().endOf("month");
            var dayOffset = getDay(firstDay.day()) - 1;
            if ( !! startDate && !! endDate && (startDate < lastDay) && (endDate > firstDay)) {
                var firstBetweenDay = moment(new Date(Math.max(firstDay, moment(startDate).clone().add('days', 1))));
                var lastBetweenDay = moment(new Date(Math.min(lastDay, moment(endDate).clone().add('days', -1))));
                if (firstBetweenDay <= lastBetweenDay) {
                    $days.slice(dayOffset + firstBetweenDay.date(), dayOffset + lastBetweenDay.date() + 1).addClass("betweenDates");
                }
            }
            if ( !! startDate && (firstDay <= startDate) && (startDate <= lastDay)) {
                $days.eq(dayOffset + startDate.date()).addClass(startDateString).parent().addClass('here');
            }
            if ( !! endDate && (firstDay <= endDate) && (endDate <= lastDay)) {
                $days.eq(dayOffset + endDate.date()).addClass(endDateString);
            }
        };
    self.ready = function ($element, options) {
        opts = options;
        $calendar = $element;
        $prev = $('<a href="#" class="pre" style="padding:0 15px"><span>上一月</span></a>');
        $next = $('<a href="#" class="next" style="padding:0px"><span>下一月</span></a>');
        $month = $('<span class="text">2013年6月</span>');
        $calendar.append($('<div class="date_month"></div>').append($prev).append($month).append($next));
        for (var i = 0, th = "", td = ""; i < 7; i++) {
            th += '<th></th>';
            td += '<td><a href="#"></a></td>';
        }
        for (var i = 0, tr = ""; i < 6; i++) {
            tr += '<tr>' + td + '</tr>';
        }
        $calendar.append('<div class="calGrid"><table width="100%"><thead><tr>' + th + '</tr></thead><tbody>' + tr + '</tbody></table></div>');
        $weekdays = $calendar.find("th");
        $days = $calendar.find("td a");
        $rows = $calendar.find("tr");
        $rows.eq(1).addClass("first");
        singleDate = true;
        firstDayOfWeek = $calendar.attr('data-firstdayofweek') || firstDayOfWeek;
        $calendar.get(0).calendar = self;
        if ($.fn) {
            $.fn.slice = $.fn.slice || function (start, end) {
                return $([].slice.call(this, start, end));
            }
            $.fn.calendar = function () {
                return this.get(0).calendar;
            }
        }
        today = moment().startOf('day');
        startDate = $calendar.attr("data-startdate");
        startDate = startDate ? moment(new Date(startDate)).startOf('day') : null;
        endDate = $calendar.attr("data-enddate");
        endDate = endDate ? moment(new Date(endDate)).startOf('day') : null;
        currentMonth = (startDate || today).clone();
        var $monthGrid = $calendar.find(".calGrid");
        $prev.bind(tap, function (evt) {
            evt.preventDefault();
            currentMonth = currentMonth.add('months', -1);
            self.showMonth(currentMonth);
        });
        $next.bind(tap, function (evt) {
            evt.preventDefault();
            currentMonth = currentMonth.add('months', 1);
            self.showMonth(currentMonth);
        });
        $calendar.bind("resetDates", function (evt) {
            setDate(startDateString, null);
            setDate(endDateString, null);
        });
        $days.bind(tap, dateSelected);
        self.showMonth(currentMonth);
    }
    self.setDates = function (start, end) {
        start && (start = moment(start));
        end && (end = moment(end));
        if (singleDate) {
            currentMonth = (start || today).clone();
            self.showMonth(currentMonth);
        }
        setDate(startDateString, start && end ? moment(new Date(Math.min(start, end))) : start);
        !singleDate && setDate(endDateString, start && end ? (start.getTime() != end.getTime() ? moment(new Date(Math.max(start, end))) : null) : end);
    }
    self.showMonth = function (date) {
        $month.text(date.year() + "年" + (date.month() + 1) + "月");
        for (var i = 0, maxI = $weekdays.length; i < maxI; i++) {
            $weekdays.eq(getDay(i)).text(weekdaysMin[i]);
        }
        var beforeMinDate = today > date.clone().endOf('month');
        var includesToday = !beforeMinDate && (today >= date.clone().startOf('month'));
        var minDay = today.date();
        $days.parent('td').removeClass('current').removeClass("dis");
        $rows.removeClass("last").show();
        var firstDay = getDay(date.clone().startOf('month').day()) - 1;
        var lastDay = firstDay + date.clone().endOf("month").date();
        for (var i = 0, maxI = $days.length; i < maxI; i++) {
            var isDay = (i > firstDay) && (i <= lastDay);
            var $day = $days.eq(i).text(isDay ? ("" + (i - firstDay)) : "");
            var $td = $day.parent('td');
            if (isDay && (beforeMinDate || (includesToday && (i - firstDay < minDay)))) {
                $td.addClass("dis");
            }
            if (date.month() == today.month() && today.date() == (i - firstDay)) {
                $day.parent('td').addClass("current");
            }
            if (opts && opts.selectRange) {
                var d1 = moment(opts.selectRange[0]);
                var d2 = moment(opts.selectRange[1]);
                var d = moment(new Date(date.year(), date.month(), parseInt($day.text())));
                if (d < d1 || d > d2) {
                    if ($td.hasClass("dis") == false) {
                        $td.addClass("dis")
                        $td.removeClass("current");
                    }
                }
            }
            if (i == lastDay) {
                try {
                    var $lastTr = $day.closest("tr").addClass("last");
                    $lastTr.nextObject().hide().nextObject().hide();
                } catch (ex) {}
            }
        }
        drawSelection();
    }
}
(function ($) {
    $.fn.nextObject = function () {
        var n = this[0];
        do n = n.nextSibling; while (n && n.nodeType != 1);
        return $(n);
    };
    $.fn.previousObject = function () {
        var p = this[0];
        do p = p.previousSibling; while (p && p.nodeType != 1);
        return $(p);
    }
})($);