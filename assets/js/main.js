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

      var $list = $('.b-invest_list'),
          $range = $('.b-invest_range');

      $list.owlCarousel({
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

      $range.slider({
        range: "min",
      	min: 0,
      	max: 1000,
      	value: 100,
        stop: function(event, ui) {
    		  var active = 1;
          if(ui.value < 250) active = 1;
            else if(ui.value < 500) active = 2;
              else if(ui.value < 750) active = 3;
                else active = 4;
          $('.b-invest_list_item.active').removeClass('active');
          $('.b-invest_list_item__' + active).addClass('active');
        }
      });

      $('.b-invest_list_item').click(function() {
        $range.slider("value", $(this).data('count') * 250 - 150 );
        $('.b-invest_list_item').removeClass('active');
        $(this).addClass('active');
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

        },
        setBackgrounds: backgrounds
    };

})(window);
