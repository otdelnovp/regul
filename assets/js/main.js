$(document).ready(function() {

    // User interface
    site.init();

    // Init UI modules
    siteModules.hashNav();

    siteModules.dropDown({
        selector: 'js-dropDown'
    });

    siteModules.tabs({
        selector: '.js-tabs'
    });

    siteModules.spoilers({
        selector: '.js-spoiler'
    });

    siteModules.pockets({
        selector: '.js-pocket'
    });

    // Init plugins
    sitePlugins.popUps();
    sitePlugins.scrollBars();
    sitePlugins.scrollSpy();
    sitePlugins.toolTips();

    sitePlugins.carousels({
        selector: '.b-carousel'
    });

    // Init forms handlers
    forms.init('.b-page');

    // Init responsive helpers
    siteResponsive.init('.b-page');

    // Init calc
    investmentsCalc.init();

});

// UI
var site = (function(window, undefined) {

    'use strict';

    function onLoadPage() {

        $(window).on('load.pageReady', function() {

            // VK API
            // helpers.async('//vk.com/js/api/openapi.js?116');

            // YMaps API
            // helpers.async('http://api-maps.yandex.ru/2.1/?load=package.full&lang=ru-RU&onload=YandexMaps.init');

            // YShare API
            // helpers.async('//yastatic.net/es5-shims/0.0.2/es5-shims.min.js');
            // helpers.async('//yastatic.net/share2/share.js');

        });

    }

    function targetBlank() {

        $('a[data-target="_blank"]')
            .on('click', function() {

                return !window.open($(this).attr('href'));

            });

    }

    function orderedLists() {

        $('ol[start]').each(function() {

            $(this).css({ counterReset: 'list ' + (parseInt($(this).attr('start')) - 1) });

        });

    }

    function backgrounds(options) {

        options = !!options ? options : {};
        options.namespace = !!options.namespace ? options.namespace + ' ' : '';

        var $img = $(options.namespace + '[data-background-image]'),
            $color = $(options.namespace + '[data-background-color]');

        $img.each(function() {

            var isRetina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;

            $(this).css({
                backgroundImage: 'url(' + (isRetina && typeof $(this).data('backgroundImage2x') !== 'undefined' ? $(this).data('backgroundImage2x') : $(this).data('backgroundImage')) + ')'
            });

        });

        $color.each(function() {

            $(this).css({
                backgroundColor: $(this).data('backgroundColor')
            });

        });

    }

    function barsWidth(options) {

        options = !!options ? options : {};
        options.namespace = !!options.namespace ? options.namespace + ' ' : '';

        var $items = $(options.namespace + '[data-width]');

        $items.each(function() {

            $(this).css({
                width: $(this).data('width')
            });

        });

    }

    function verticalAlignment() {

        $('.js-flexRows').flexRows({
            auto: true,
            strong: false,
            selector: '.js-flexRowsTile'
        });

        $('.b-howTo_scheme').flexRows({
            auto: true,
            strong: false,
            selector: '.b-howTo_scheme_item'
        });

    }

    function footerBottom() {

        var $page = $('.b-page'),
            $footer = $('.b-footer', $page),

            screens = [/*'xs', 'sm', 'md', */'lg'];

        _processing();

        $footer.on('footer.refresh', _processing);

        $(window).on('load.refreshFooterPosition resize.refreshFooterPosition', _processing);

        function _processing() {

            if (screens.indexOf(helpers.screen()) >= 0) {

                $page.css({ paddingBottom: $footer.outerHeight(true) });
                $footer.css({ position: 'absolute', left: 0, bottom: 0, right: 0, minWidth: 320 })

            } else {

                $page.css({ paddingBottom: '' });
                $footer.css({ position: '', zIndex: '', left: '', bottom: '', right: '', minWidth: '' });

            }

        }

    }

    function header() {

        siteModules.dropDown({
            selector: 'js-headerNav'
        });


        $(window).on('scroll.header', _processing);

        function _processing() {

          var $header = $('.b-header');

          if($(window).scrollTop()>100) $header.addClass('b-header__fixed'); else $header.removeClass('b-header__fixed');

        }

    }

    function pageUp() {

        var $pageUp = $('.b-footer_pageUp');

        $pageUp.on('click.pageUp', function(e) {

            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 600/*, 'easeInOutSine'*/);

        });

        $(window).on('load.pageUp resize.pageUp', function() {

            helpers.delay.call($pageUp, _processing, 100);

        });

        $(window).on('scroll.pageUp pageUp.Refresh', _processing);

        function _processing() {

            var scroll = document.documentElement.scrollTop || document.body.scrollTop,

                windowHeight = $(window).height(),
                screenBottom = scroll + windowHeight,

                footerOffset = $('.b-footer').offset().top || 0,
                footerThreshold = footerOffset + 20 + (['md'].indexOf(helpers.screen()) >= 0 ? 29 : 20);

            $pageUp.toggleClass('sticky', screenBottom < footerThreshold);
            $pageUp.toggleClass('visible', screenBottom > windowHeight * 1.5);

        }

    }

    function buildQueryStringsForPopUps() {

        $('.js-popup').each(function() {

            var link = $(this).attr('href'),
                data = $(this).data(),
                i = 0;

            link += link.indexOf('?') < 0 ? '?' : '';

            if (!!data.header) {

                link += 'header=' + encodeURIComponent(data.header) + '&';

            }

            if (!!data.subHeader) {

                link += 'subHeader=' + encodeURIComponent(data.subHeader) + '&';

            }

            if (!!data.comment) {

                link += 'comment=' + encodeURIComponent(data.comment) + '&';

            }

            link = link.substring(0, link.length - 1);
            $(this).attr('href', link);

        });

    }

    function investCalc() {

      $('.b-invest_list').owlCarousel({
        loop: false,
        margin: 0,
        dots: false,
        responsiveClass: true,
        mouseDrag: false,
        responsive:{
          0:{
            items: 1,
            nav: true
          },
          768:{
            items: 4,
            nav: false
          }
        }
      });
      $('.b-invest_list').on('changed.owl.carousel', function(event) {
        var value;
        console.log(event.item.index);
        if((event.item.index + 1) == 1) value = 250;
          else if((event.item.index + 1) == 2) value = 500;
            else if((event.item.index + 1) == 3) value = 750;
              else value = 1000;
        _processing(event.item.index + 1, value - 150);
      });

      $('.b-invest_range').slider({
        range: "min",
      	min: 0,
      	max: 1000,
      	value: 100,
        stop: function(event, ui) {
    		  var active;
          if(ui.value < 250) active = 1;
            else if(ui.value < 500) active = 2;
              else if(ui.value < 750) active = 3;
                else active = 4;
          _processing(active, ui.value);
        }
      });

      $('.b-invest_list_item').click(function() {
        _processing( $(this).data('count'), $(this).data('count') * 250 - 150 );
      });

      _processing(1, 100);

      function _processing(count, value) {

        $('.b-invest_list').trigger('to.owl.carousel', count - 1);

        var param = [ { delta: 1.6, month: 1, percent: 5 },
                      { delta: 10, month: 2, percent: 14 },
                      { delta: 48, month: 4, percent: 44 },
                      { delta: 340, month: 5, percent: 65 }
                    ],
            result_1 = Math.round(value * param[count - 1].delta),
            result_2 = param[count - 1].month * 30,
            result_3 = result_1 + result_1 * param[count - 1].percent * param[count - 1].month,
            result_4 = Math.round(result_3 / result_2),
            result_5 = Math.round(result_1 * result_3 / param[count - 1].month),
            result_6 = Math.round(result_3 - result_1 / param[count - 1].month);

        $('.b-invest_range').slider("value", value );
        $('.b-invest_list_item').removeClass('active');
        $('.b-invest_list_item__' + count).addClass('active');

        $('.b-invest_result__1 input').val(result_1 + " $");
        $('.b-invest_result__2 input').val(result_2 + " дней");
        $('.b-invest_result__3 input').val(result_3 + " $");
        $('.b-invest_result__4 input').val(result_4 + " $");
        $('.b-invest_result__5 input').val(result_5 + " $ в месяц");
        $('.b-invest_result__6 input').val(result_6 + " $ в месяц");

      }

    }

    function partners() {

      $('.b-partners_list_item').click(function() {

        $('.b-partners_list_item').removeClass('active');
        for(var i=1; i < $(this).data('count') + 1; i++ ) {
          $('.b-partners_list_item__' + i).addClass('active');
        }

      });

      $('.b-partners_list_item').hover(function() {

          $('.b-partners_list_item').removeClass('active');
          for(var i=1; i < $(this).data('count') + 1; i++ ) {
            $('.b-partners_list_item__' + i).addClass('active');
          }

        }, function() {

        $('.b-partners_list_item').removeClass('active');

      });

    }

    return {
        init: function() {

            // Footer positioning
            footerBottom();

            // On load page
            onLoadPage();

            // Vertical align
            verticalAlignment();

            // Valid target attribute
            targetBlank();

            // Set start num for ol
            orderedLists();

            // Background
            backgrounds();

            // Bars width
            barsWidth();

            // Header
            header();

            // Page up
            pageUp();

            // Build query strings for pop-ups
            buildQueryStringsForPopUps();

            investCalc();

            partners();

        },
        setBackgrounds: backgrounds
    };

})(window);
