var siteResponsive = (function(window, undefined) {

    function init(namespace) {

        // For Retina displays
        siteModules.imagesOnRetinaDisplays();

        // Tables
        swipedTables({
            collection: '.b-wysiwyg table',
            namespace: namespace
        });

        // Set screen class
        var $body = $('body').addClass('m-' + helpers.screen()).addClass('m-' + (!!helpers.mobile() ? 'touch' : 'mouse'));

        $(window)
            .off('resize.sizeClass')
            .on('resize.sizeClass', function() {

                $body
                    .removeClass('m-xs m-sm m-md m-lg')
                    .addClass('m-' + helpers.screen());

            });

    }

    function swipedTables(options) {

        _processing();

        $(window)
            .off('load.responsive resize.responsive')
            .on('load.responsive resize.responsive', _processing);

        function _processing() {

            var $collection = $(options.collection);

            $collection.each(function() {

                if (!$(this).closest('.b-table_overflow').length) {

                    $(this).wrap('<div class="b-table_overflow"></div>');

                }

                var $container = $(this).closest('.b-table_overflow'),

                    tableWidth = $(this).width(),
                    containerWidth = $container.width();

                $(this).closest('.b-table_overflow').toggleClass('scrollable', tableWidth > containerWidth && ($(this).data('resolutions') ? $(this).data('resolutions').split(',').indexOf(helpers.screen()) >= 0 : true));

                if ($.isFunction($.fn.perfectScrollbar)) {

                    if (tableWidth > containerWidth) {

                        $(this).closest('.b-table_overflow').perfectScrollbar({
                            suppressScrollY: true
                        });

                    }

                }

            });

        }

    }

    return {
        init: init
    };

})(window);