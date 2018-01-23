var investmentsCalc = (function(window, undefined) {

    'use strict';

    var shares = 0,
        shareDataByYears = {
            profit: [26160.51, 28325.98, 30435.87, 32642.36, 34950.28, 37364.69, 39890.92, 42534.57, 45301.49, 48197.86, 51230.15, 54405.16, 57730.01, 61212.21, 64859.61],
            taxes: [10408.21, 10511.78, 10607.06, 10716.76, 10841.62, 10982.40, 11139.88, 11314.91, 11508.35, 11721.15, 11954.25, 12208.67, 12485.49, 12785.82, 13110.83],
            maintenance: [4658.07, 4860.30, 5058.47, 5265.79, 5482.69, 5709.67, 5947.23, 6195.90, 6456.24, 6728.81, 7014.25, 7313.19, 7626.31, 7954.31, 8297.94],
            infrastructure: [4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75, 4368.75]
        },

        startYear = 2018,
        monthsFactors = [.9167, .8333333333, .7500, .6667, .5833333333, .5000, .4167, .3333333333, .25, .1667, .0833333333, 0],

        results = {
            profit: [],
            taxes: [],
            maintenance: [],
            infrastructure: [],
            sum: []
        };

    function init() {

        var $slider = $('.b-calc_wg_shares_controller_slider'),
            $results = $('.b-calc_wg_shares_controller_results');

        _calc($results.data('amount'));
        _render();

        if ($.isFunction($.fn.slider)) {

            $slider.slider({
                range: 'min',
                min: $slider.data('min') || 1,
                max: $slider.data('max') || 201,
                value: $slider.data('default') || 1,
                step: 1,
                slide: function(e, ui) {

                    var price = $results.data('price'),
                        amount = ui.value;

                    $results
                        .attr('data-amount', amount)
                        .data('amount', amount);

                    $results
                        .find('.b-calc_wg_shares_controller_results_sum')
                        .text((price * amount).toString().discharge(' '));

                    $results
                        .find('.b-calc_wg_shares_controller_results_shares')
                        .text(amount + ' ' + helpers.getNumEnding(amount, ['пай', 'пая', 'паев']));

                    helpers.delay.call($results, function() {

                        _calc(amount);
                        _render();

                    }, 100);

                }
            });

        }

        $(window).on('resize.refreshCalcChart', function() {

            helpers.delay.call($results, function() {

                _render();

            }, 250);

        });

    }

    function _render() {

        // Shares progress bar
        var $sharesProgressBar = $('.b-calc_wg_shares_counter_progress_bar');
            $sharesProgressBar.css({ width: (($sharesProgressBar.data('sharesSold') / $sharesProgressBar.data('shares')) * 100) + '%' });

        // Chart and table
        var $chart = $('.b-calc_wg_chart_canvas'),
            $table = $('.b-calc_plan_table_body'),

            maxSumOfResult = _extPoint(), //Math.round(Math.max.apply(null, results.sum)),
            chartVerticalStep = maxSumOfResult / $chart.height(),

            planTableRows = '';

        $chart.find('.b-calc_wg_chart_stack').each(function(i) {

            $(this).find('.b-calc_wg_chart_stack_bar.taxes').css({ height: Math.round(results.taxes[i] / chartVerticalStep) });
            $(this).find('.b-calc_wg_chart_stack_bar.profit').css({ height: Math.round(results.profit[i] / chartVerticalStep) });
            $(this).find('.b-calc_wg_chart_stack_bar.maintenance').css({ height: Math.round(results.maintenance[i] / chartVerticalStep) });
            $(this).find('.b-calc_wg_chart_stack_bar.infrastructure').css({ height: Math.round(results.infrastructure[i] / chartVerticalStep) });

            $(this).find('.b-calc_wg_chart_stack_popover_table .taxes').text(results.taxes[i].toFixed(0).discharge(' '));
            $(this).find('.b-calc_wg_chart_stack_popover_table .profit').text(results.profit[i].toFixed(0).discharge(' '));
            $(this).find('.b-calc_wg_chart_stack_popover_table .maintenance').text(results.maintenance[i].toFixed(0).discharge(' '));
            $(this).find('.b-calc_wg_chart_stack_popover_table .infrastructure').text(results.infrastructure[i].toFixed(0).discharge(' '));

            planTableRows += '<tr><td>' + (i + 1) + '&nbsp;год</td><td>' + (results.profit[i].toFixed(0).discharge(' ')) + '&nbsp;<i class="e-rub"></i></td><td>' + ((results.profit[i] - (results.profit[i] * (helpers.getRandom($table.data('randFrom') || 3, $table.data('randTo') || 10) / 100 ))).toFixed(0).discharge(' ')) + '&nbsp;<i class="e-rub"></td></tr>';

        });

        $chart.find('.b-calc_wg_chart_canvas_label').each(function(i) {

            $(this).find('span').text((maxSumOfResult - (maxSumOfResult / 6 * i)).toFixed(0).discharge(' '));

        });

        $table.html(planTableRows);

        function _extPoint() {

            var max = $('.b-calc_wg_shares_controller_slider').data('max') * (shareDataByYears.profit[14] + shareDataByYears.taxes[14] + shareDataByYears.maintenance[14] + shareDataByYears.infrastructure[14]);

            //max = (parseInt((max.toFixed(0) / 100000).toString().split('.')[0], 10) + 1) * 100000;
            max = (parseInt((max.toFixed(0) / 100000).toFixed(0), 10) + 1) * 100000;

            return max; //15600000;

        }

    }

    function _calc(shareAmount) {

        var now = new Date(2018, 2, 1),

            currentYear = now.getFullYear(),
            currentMonth = now.getMonth(),

            yearIndex = currentYear - startYear,

            sum, percentage;

        for (var a = 0; a < shareDataByYears.profit.length; a++) {

            sum = shareDataByYears.profit[a];
            percentage = yearIndex > a ? 0 : yearIndex === a ? monthsFactors[currentMonth] : 1;

            results.profit[a] = shareAmount * sum * percentage;

        }

        for (var b = 0; b < shareDataByYears.taxes.length; b++) {

            sum = shareDataByYears.taxes[b];
            percentage = yearIndex > b ? 0 : yearIndex === b ? monthsFactors[currentMonth] : 1;

            results.taxes[b] = shareAmount * sum * percentage;

        }

        for (var c = 0; c < shareDataByYears.maintenance.length; c++) {

            sum = shareDataByYears.maintenance[c];
            percentage = yearIndex > c ? 0 : yearIndex === c ? monthsFactors[currentMonth] : 1;

            results.maintenance[c] = shareAmount * sum * percentage;

        }

        for (var d = 0; d < shareDataByYears.infrastructure.length; d++) {

            sum = shareDataByYears.infrastructure[d];
            percentage = yearIndex > d ? 0 : yearIndex === d ? monthsFactors[currentMonth] : 1;

            results.infrastructure[d] = shareAmount * sum * percentage;
            results.sum[d] = results.profit[d] + results.taxes[d] + results.maintenance[d] + results.infrastructure[d];

        }

    }

    // (v - (v * (helpers.getRandom(3, 10) / 100 )))

    return {
        init: init
    };

})(window);