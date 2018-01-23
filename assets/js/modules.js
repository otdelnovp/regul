var siteModules = (function(window, undefined) {

    function autoComplete(namespace) {

        namespace = !!namespace ? namespace + ' ' : '';

        var $fields = $(namespace + '.js-autoComplete');

        $fields.each(function() {

            var $this = $(this).attr('autocomplete', 'off'),
                $wrapper = $this.parent(),

                $wg = $('<div class="b-autoComplete"></div>').appendTo($wrapper),
                $wgList = $('<ul class="b-autoComplete_list"></ul>').prependTo($wg);

            $this.on('keypress.autoComplete get.autoComplete', function(e) {

                var value = $(this).val();

                if (value.length > 1) {

                    $.ajax({
                        url: $this.closest('form').attr('action') || $this.data('source'),
                        method: $this.closest('form').attr('method') || 'post',
                        data: $this.closest('form').serialize(),
                        dataType: 'json',
                        success: function (response) {

                            if (response.status) {

                                $wgList.html(response.results);
                                $wg.toggleClass('opened', true);

                                site.setBackgrounds({
                                    namespace: '.b-autoComplete_list'
                                });

                                $(document)
                                    .off('touchend.closeAutoComplete click.closeAutoComplete')
                                    .on(helpers.isTouchDevice() ? 'touchend.closeAutoComplete' : 'click.closeAutoComplete', function(e) {

                                        var $target = $(e.target),

                                            wgClass = $wrapper.attr('class').split(' ')[0],
                                            targetIsWg = $target.hasClass(wgClass) || !!$target.closest('.' + wgClass).length && !$target.is('button[type="reset"]');

                                        if (!targetIsWg) {

                                            $wg.toggleClass('opened', false);

                                            setTimeout(function() {

                                                $wgList.empty();

                                            }, 350);

                                        }

                                    });

                            }

                        }
                    });

                }

            });

        });

    }

    function dropDown(options) {

        var $locker = !!options.locker ? options.locker : $('.b-page');

        options.switch = !!options.switch ? options.switch : 'opened';

        $(document)
            .off('click.dropDown' + options.selector)
            .on('click.dropDown' + options.selector, function(e) {

                var $target = $(e.target),

                    targetIsSwitcher = $target.hasClass(options.selector + '-toggle') || !!$target.closest('.' + options.selector + '-toggle').length,
                    targetIsClose = $target.hasClass(options.selector + '-close') || !!$target.closest('.' + options.selector + '-close').length,
                    targetIsBox = $target.hasClass(options.selector + '-box') || !!$target.closest('.' + options.selector + '-box').length,

                    isSwipeAction = helpers.touches.touchmove.y > -1 && (Math.abs(helpers.touches.touchstart.y - helpers.touches.touchmove.y) > 5);

                if (targetIsSwitcher) {

                    $target = $target.hasClass(options.selector + '-toggle') ? $target : $target.closest('.' + options.selector + '-toggle');

                    if ($target.is('a')) { e.preventDefault(); }

                    var screens = !!$target.data('resolutions') ? $target.data('resolutions').split(',') : ['xs', 'sm', 'md', 'lg'],
                        touchOnly = !!$target.data('touch') ? $target.data('touch') : false;

                    if (screens.indexOf(helpers.screen()) >= 0 && touchOnly ? !!helpers.mobile() : true) {

                        e.preventDefault();

                        var $dropDown = $target.closest('.' + options.selector),
                            state = $dropDown.hasClass(options.switch);

                        $('.' + options.selector).toggleClass(options.switch, false);

                        $dropDown.toggleClass(options.switch, !state);
                        $dropDown.find('.' + options.selector + '-box').toggleClass(options.switch, !state);

                        if (!!options.onToggle) {

                            options.onToggle.call($dropDown, !state);

                        }

                        if (!!$dropDown.data('lock')) {

                            if (!state) {

                                _lockPage.call($locker);

                            } else {

                                _unLockPage.call($locker);

                            }

                        }

                        setTimeout(function() {

                            $(window).trigger('aside.stepRefresh');

                        }, 300);

                    }

                }
                else if (!isSwipeAction && (!targetIsBox || targetIsClose)) {

                    $('.' + options.selector).each(function() {

                        var $this = $(this),

                            state = $this.hasClass('opened'),
                            screens = !!$(this).find(options.selector + '-toggle').data('resolutions') ? $(this).find(options.selector + '-toggle').data('resolutions').split(',') : ['xs', 'sm', 'md', 'lg'];

                        if (screens.indexOf(helpers.screen()) >= 0) {

                            $this.toggleClass(options.switch, false);

                            if ($this.data('lock') && state) {

                                _unLockPage.call($locker);

                            }

                            if (!!options.onToggle) {

                                options.onToggle.call($this, false);

                            }

                            setTimeout(function() {

                                $(window).trigger('aside.stepRefresh');

                            }, 300);

                        }

                    });

                }

                helpers.touches = {
                    touchstart: {x: -1, y: -1 },
                    touchmove: { x: -1, y: -1 }
                };

            });

        $('.' + options.selector)
            .on('dropDown.open', function() {

                $(this).toggleClass(options.switch, true);

                if (!!$(this).data('lock')) {

                    _lockPage.call($locker);

                }

            })
            .on('dropDown.close', function() {

                $(this).toggleClass(options.switch, false);
                _unLockPage.call($locker);

            });

        function _lockPage() {

            var $body = $('body'),
                $header = $('.b-header__fixed'),

                scroll = document.documentElement.scrollTop || document.body.scrollTop;

            this.data('isLocked', true);
            this.data('vpOverflow', $body.css('overflow'));
            this.data('lockScrollState', scroll);

            $body.css({
                overflow: 'hidden'
            });

            if (document.body.scrollHeight > window.innerHeight) {

                $body.css({
                    paddingRight: helpers.getScrollBarWidth()
                });

                $header.css({
                    paddingRight: helpers.getScrollBarWidth()
                });

            }

            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {

                $body.css({
                    position: 'fixed',
                    left: 0,
                    top: -($body.scrollTop()),
                    right: 0
                });

            }

        }

        function _unLockPage() {

            var $body = $('body');

            if (!!this.data('isLocked')) {

                setTimeout($.proxy(function() {

                    $body.css({
                        position: '',
                        left: '',
                        top: '',
                        right: '',
                        overflow: '',
                        paddingRight: '',
                        height: ''
                    });

                    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {

                        $body.scrollTop(this.data('lockScrollState'));

                    }

                }, this), 300);

            }

        }

    }

    function spoilers(options) {

        options = !!options ? options : {};
        options.namespace = !!options.namespace ? options.namespace + ' ' : '';

        options.toggleClass = !!options.toggleClass ? options.toggleClass : 'opened';

        // Hash check
        var hash = location.hash;

        if (!!hash && hash.match('spoiler')) {

            $(options.selector).each(function() {

                $(this).removeClass('opened');

                if ($(this).attr('id') === hash.split('#')[1]) {

                    $(this).addClass('opened');

                }

            });

        }

        // Init
        init(options);

        $(window)
            .off('resize.spoilerReInit')
            .on('resize.spoilerReInit', function() {

                init(options);

            });

        function init(options) {

            $(options.namespace + options.selector).each(function() {

                var $spoiler = $(this).toggleClass('js-spoiler-active', true),

                    $body = $spoiler.find(options.selector + '-box').css({ display: '' }),
                    $toggle = $spoiler.find(options.selector + '-toggle').off('click.spoiler'),

                    screens = !!$spoiler.data('resolutions') ? $spoiler.data('resolutions').split(',') : ['xs', 'sm', 'md', 'lg', 'xl'];

                if (screens.indexOf(helpers.screen()) >= 0) {

                    $spoiler.not('.' + options.toggleClass).find(options.selector + '-box').slideDown(0).slideUp(0);
                    $spoiler.filter('.' + options.toggleClass).find(options.selector + '-box').slideDown(0);

                    $toggle
                        .off('click.spoiler')
                        .on('click.spoiler', function(e) {

                            if (!$(e.target).is('a[href]:not(a[href="#"])')) {

                                e.preventDefault();

                            }

                            if (!$(e.target).hasClass('e-hint') && !$(e.target).closest('.e-hint').length) {

                                var item = $(this).closest(options.selector),
                                    state = item.hasClass(options.toggleClass) && item.find(/*'> ' + */options.selector + '-box').is(':visible');

                                if (!state) {

                                    spoilerOpen.call(item, options.selector, options.onToggle);

                                } else {

                                    spoilerClose.call(item, options.selector, options.onToggle);

                                }

                                // Close neighbors items
                                if (!!item.data('closeNeighbors') && ['lg'].indexOf(helpers.screen()) >= 0) {

                                    var $neighbors = typeof item.data('closeNeighbors') === 'boolean' ? item.siblings(options.selector) : item.closest(item.data('closeNeighbors')).find(options.selector);

                                    $neighbors.each(function() {
                                        spoilerClose.call($(this), options.selector);
                                    });

                                }

                            }

                        });

                } else {

                    $spoiler.find(options.selector + '-box').show();

                }

            });

        }

        function spoilerClose(sel, callback) {

            var $spoiler = this,

                $spoilerToggle = this.find(sel + '-toggle').filter(function() {

                    return $(this).closest('.js-spoiler')[0] === $spoiler[0];

                }),
                $spoilerToggleTxt = $spoilerToggle.find('[data-closed][data-opened]'),

                $spoilerContent = this.find(sel + '-box').filter(function() {

                    return $(this).closest('.js-spoiler')[0] === $spoiler[0];

                });

            $spoiler.toggleClass(options.toggleClass, false);

            var toggle = !!$spoilerToggle.data('closed') ? $spoilerToggle.data('closed') : $spoilerToggleTxt.length ? $spoilerToggleTxt.data('closed') : $spoilerToggle.html();

            if ($spoilerToggleTxt.length) {

                $spoilerToggleTxt.html(toggle);

            }

            if (!!$spoilerToggle.data('closed')) {

                $spoilerToggle.html(toggle);

            }

            $spoilerToggle.toggleClass('active', false);

            $spoilerContent
                .slideUp({ duration: 250, easing: 'easeOutQuart',
                    step: function() {},
                    complete: function() {

                        if(typeof callback !== 'undefined' && callback) {

                            callback(this);

                        }

                    }
                });

        }

        function spoilerOpen(sel, callback) {

            var $spoiler = this,

                $spoilerToggle = this.find(sel + '-toggle').filter(function() {

                    return $(this).closest('.js-spoiler')[0] === $spoiler[0];

                }),
                $spoilerToggleTxt = $spoilerToggle.find('> [data-closed][data-opened]'),

                $spoilerContent = this.find(sel + '-box').filter(function() {

                    return $(this).closest('.js-spoiler')[0] === $spoiler[0];

                });

            $spoiler.toggleClass(options.toggleClass, true);

            var toggle = !!$spoilerToggle.data('opened') ? $spoilerToggle.data('opened') : $spoilerToggleTxt.length ? $spoilerToggleTxt.data('opened') : $spoilerToggle.html();

            if ($spoilerToggleTxt.length) {

                $spoilerToggleTxt.html(toggle);

            }

            if (!!$spoilerToggle.data('opened')) {

                $spoilerToggle.html(toggle);

            }

            $spoilerToggle.toggleClass('active', true);

            $spoilerContent
                .slideDown({ duration: 250, easing: 'easeOutQuart',
                    step: function() {},
                    complete: function() {

                        if(typeof callback !== 'undefined' && callback) {

                            callback(this);

                        }

                    }
                });

        }

    }

    function pockets(options) {

        // Init
        init(options);

        $(window)
            .off('load.pocketReInit resize.pocketReInit')
            .on('load.pocketReInit resize.pocketReInit', function() {

                helpers.delay.call($('body'), function() {

                    init(options);

                }, 250);

            });

        function init(options) {

            $(options.selector).each(function() {

                var $pocket = $(this),

                    $pocketBody = $pocket.find(options.selector + '-box'),
                    $pocketBodyInner = $pocket.find(options.selector + '-box-inner').css({ overflow: 'hidden' }),
                    $pocketToggle = $pocket.find(options.selector + '-toggle').off('click.pocketModule'),

                    screens = !!$pocket.data('resolutions') ? $pocket.data('resolutions').split(',') : ['xs', 'sm', 'md', 'lg'],

                    heights = !!$pocket.data('heights') ? $pocket.data('heights').split(',') : false,
                    blocks = !!$pocket.data('blocks') ? $pocket.data('blocks').split(',') : false,

                    lines = !!$pocket.data('lines') ? $pocket.data('lines').split(',') : [2, 3, 4, 6, 6];

                if (screens.indexOf(helpers.screen()) >= 0) {

                    $pocket.toggleClass('active', true);
                    $pocketBody.css({ overflow: 'hidden' });

                    var maxHeight = $pocketBodyInner.length ? $pocketBodyInner.outerHeight() : $pocketBody.outerHeight();

                    $pocket.data('range', { min: 0, max: maxHeight });

                    if (!!heights) {

                        $pocket.data('range', {
                            min: parseInt(heights[screens.indexOf(helpers.screen())], 10),
                            max: maxHeight
                        });

                    }
                    else if (!!blocks) {

                        var minHeight = 0,
                            margin = 0,

                            length = blocks[screens.indexOf(helpers.screen())];

                        $pocketBodyInner.find('> *').each(function(i) {

                            if (i < length) {

                                minHeight += $(this).outerHeight();

                                if (i > 0) {

                                    minHeight += Math.max(margin, parseInt($(this).css('margin-top'), 10));

                                }

                                margin = parseInt($(this).css('margin-bottom'), 10);

                            }
                            else {

                                return false;

                            }

                        });

                        $pocket.data('range', {
                            min: minHeight,
                            max: maxHeight
                        });

                    }
                    else if (!!lines) {

                        $pocket.data('range', {
                            min: _getLineHeight.call($pocketBody) * lines[screens.indexOf(helpers.screen())] - 2,
                            max: maxHeight
                        });

                    }

                    setTimeout(function() {

                        if (typeof $pocket.data('range') !== 'undefined') {

                            $pocket.not('.opened').find(options.selector + '-box').css({ maxHeight: $pocket.data('range').min });

                        }

                        if ($.isFunction($.fn.owlCarousel)) {

                            $pocketBody.closest('.owl-carousel').trigger('refresh.owl.carousel');

                        }

                    }, 10);

                    $pocketToggle
                        .toggleClass('excess', $pocket.data('range').max <= $pocket.data('range').min)
                        .on('click.pocketModule', function(e) {

                            e.preventDefault();

                            var $this = $(this).closest(options.selector),
                                state = $this.hasClass('opened');

                            _pocketToggle.call($this, options, !state);

                            // Close neighbors items
                            if (!!$this.data('closeNeighbors')) {

                                var $neighbors = typeof $this.data('closeNeighbors') === 'boolean' ? $this.siblings(options.selector) : $this.closest($this.data('closeNeighbors')).find(options.selector);

                                $neighbors.each(function() {

                                    _pocketToggle.call($(this), options, false);

                                });

                            }

                        });

                } else {

                    $pocket.toggleClass('active', false);

                    $pocketBody.css({ maxHeight: '', overflow: 'visible' });
                    $pocketBodyInner.css({ overflow: '' });

                }

            });

        }

        function _getLineHeight() {

            var lineHeight = this.css('line-height') !== 'normal' ? parseFloat(this.css('line-height')) : 1.14,
                fontSize = Math.ceil(parseFloat(this.css('font-size')));

            lineHeight = typeof lineHeight !== 'undefined' && lineHeight < fontSize ? lineHeight * fontSize : lineHeight;

            return parseInt(typeof lineHeight !== 'undefined' ? lineHeight : fontSize, 10);

        }

        function _pocketToggle(options, state) {

            if (typeof options.onToggle !== 'undefined' && options.onToggle) {

                options.onToggle.call(this, state);

            }

            var $pocket = this,

                $pocketBody = $pocket.find(options.selector + '-box'),
                $pocketBodyInner = $pocket.find(options.selector + '-box-inner'),

                $pocketToggle = $pocket.find(options.selector + '-toggle'),
                $pocketToggleText = $pocketToggle.find('[data-opened][data-closed]').length ? $pocketToggle.find('[data-opened][data-closed]') : $pocketToggle,

                stringFlag = state ? 'opened' : 'closed',
                height = state ? $pocketBodyInner.length ? $pocketBodyInner.outerHeight() : $pocket.data('range').max : $pocket.data('range').min;

            $pocket.toggleClass('opened', state);

            $pocketBody.css({ maxHeight: height });
            $pocketToggleText.html(!!$pocketToggleText.data(stringFlag) ? $pocketToggleText.data(stringFlag) : $pocketToggleText.html());

            setTimeout($.proxy(function() {

                if (typeof options.onToggled !== 'undefined' && options.onToggled) {

                    options.onToggled.call(this, state);

                }

            }, this), options.duration);

        }

    }

    function tabs(options) {

        options = !!options ? options : {};
        options.namespace = !!options.namespace ? options.namespace + ' ' : '';

        var widget = options.selector,
            toggle = options.selector + '-toggle',
            toggleItem = options.selector + '-toggle-control',
            content = options.selector + '-wrapper',
            page = options.selector + '-page',
            manual = options.selector + '-manual';

        init(options);

        $(window).on('resize.tabsReInit', function() {

            init(options);

        });

        function init(options) {

            $(options.namespace + options.selector).each(function() {

                var $wg = $(this),
                    $wrapper = $(this).find(content),

                    screens = !!$(this).data('resolutions') ? $(this).data('resolutions').split(',') : ['xs', 'sm', 'md', 'lg'];

                if (screens.indexOf(helpers.screen()) >= 0) {

                    // Init tabs
                    $(this).toggleClass('js-init', true);

                    setTimeout(function() {

                        $(this).toggleClass('js-transition', true);

                    }, 500);

                    if (!$(this).find(toggle + ' a.current').length)
                        $(this).find(toggle + ' a:first').addClass('current');

                    if (!$(this).find(toggleItem + '.current').length)
                        $(this).find(toggleItem + ':first').addClass('current');

                    var hash = $(this).find(toggle + ' a.current, ' + toggleItem + '.current').data('hash') || $(this).find(toggle + ' a.current, ' + toggle + ' ' + toggleItem + '.current').attr('href'),
                        height = $(page + hash).outerHeight(true);

                    $(this)
                        .find(page)
                        .toggleClass('opened', false);

                    $(this)
                        .find(page + hash + ', ' + page + hash + '-tab')
                        .toggleClass('opened', true);

                    // Listening events
                    var $btn = $(this).find(options.selector + '-toggle a[href*="#"], ' + toggleItem + ', ' + manual);

                    $btn
                        .off(!$btn.is('input') ? 'click.switchTabs' : 'change.changeTabs')
                        .on(!$btn.is('input') ? 'click.switchTabs' : 'change.changeTabs', function(e) {

                            e.preventDefault();

                            $wrapper.css({ height: $(page + hash + ', ' + page + hash + '-tab').outerHeight(true) });

                            hash = $(this).data('hash') || $(this).attr('href');
                            height = $(page + hash + ', ' + page + hash + '-tab').outerHeight(true);

                            // Off tabs
                            $(this)
                                .closest(widget)
                                .find(toggle + ' a, ' + toggleItem)
                                .toggleClass('current', false);

                            $(this)
                                .closest(widget)
                                .find(page)
                                .toggleClass('opened', false);

                            // On select tab
                            $(this)
                                .toggleClass('current', true);

                            $(this)
                                .closest(widget)
                                .find(page + hash + ', ' + page + hash + '-tab')
                                .toggleClass('opened', true);

                            if ($(this).is(manual)) {

                                $wg.find(options.selector + '-toggle a[href="' + $(this).attr('href') + '"]').toggleClass('current', true);
                                console.log( $wg.find(options.selector + '-toggle a[href="' + $(this).attr('href') + '"]') );

                            }

                            // Correct wrapper
                            $wrapper.stop(true).animate({ height: height }, 500, 'easeOutQuart', function() {

                                $(this).css({ height: '' });

                            });

                            // Callback fire
                            if(typeof options.onToggle !== 'undefined' && options.onToggle) {

                                options.onToggle.call($wg, $(this), $(this).closest(options.selector).find(options.selector + '-page' + ($(this).data('hash') || $(this).attr('href'))));

                            }

                        });

                    // Set hash
                    if (window.location.hash !== '#' && window.location.hash.length > 1) {

                        var $target = $(this).find(toggle + ' [href="' + window.location.hash + '"], ' + toggle + ' [data-hash="' + window.location.hash + '"]');
                            $target.trigger('click.switchTabs');

                    }

                } else {

                    $(this).toggleClass('js-init', false);

                    $(this)
                        .find(toggle + ' a')
                        .toggleClass('current', false);

                    /*$(this)
                        .find(page)
                        .toggleClass('opened', false);*/

                    $(this)
                        .find(content)
                        .css({ height: '' });

                }

            });

        }

    }

    function hashNav() {

        var timer = false;

        $('body')
            .on('click', '[data-hash], a[href^="#"]:not([href="#"], [class*="js-tabs-toggle"] a, .js-popup, .js-lightBox, .js-videoBox)', function(e) {

                if (!$(this).data('delay') || ['lg'].indexOf(helpers.screen()) >= 0) {

                    _goTo.call(this, e);

                }
                else {

                    if (typeof timer !== 'boolean') {

                        clearTimeout(timer);

                    }

                    timer = setTimeout($.proxy(function() {

                        _goTo.call(this, e);

                    }, this), $(this).data('delay') || 0);

                }

            });

        function _goTo(e) {

            var $header = $('.b-header__fixed'),

                url = $(this).attr('href') || $(this).data('hash'),
                threshold = $header.outerHeight() + 20 || $(this).data('threshold') || 0;

            if (!!$(this).data('tab')) {

                $('.js-tabs a[href="' + $(this).attr('href') + '"]').trigger('click.switchTabs')

            }

            if (url.length > 1 && $(url).length) {

                var $element = !!$(url).length ? $(url) : $('[name="' + (url.substring(1)) + '"]');

                e.preventDefault();

                var destination = $element.offset().top - threshold;

                $('html, body').animate({ scrollTop: destination }, 1500, 'easeInOutExpo');

            }

        }

    }

    function imagesOnRetinaDisplays(options) {

        options = !!options ? options : {};
        options.namespace = !!options.namespace ? options.namespace + ' ' : '.b-page ';

        if ('devicePixelRatio' in window && window.devicePixelRatio > 1) {

            var $images = $(options.namespace + '.js-retina, ' + options.namespace + '[data-2x]');

            $images.each(function() {

                var lowRes = $(this).attr('src'),
                    highRes = $(this).data('2x');

                $(this)
                    .attr('src', highRes)
                    .on('error', function() {

                        $(this).attr('src', lowRes);

                    });

            });

            // Cookie
            document.cookie = 'devicePixelRatio=' + window.devicePixelRatio + ';';

        }

    }

    return {
        autoComplete: autoComplete,
        dropDown: dropDown,
        pockets: pockets,
        spoilers: spoilers,
        tabs: tabs,
        hashNav: hashNav,
        imagesOnRetinaDisplays: imagesOnRetinaDisplays
    };

})(window);