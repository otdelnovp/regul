var forms = (function(window, undefined) {

    'use strict';

    function init(namespace) {

        forms.styleControls(namespace + ' input[type="checkbox"], ' + namespace + ' input[type="radio"]', namespace + ' select:not([multiple]):not(.js-selectric)', namespace + ' input[type="file"]:not(.js-uploader)');
        forms.styleSelects(namespace + ' select.js-selectric');

        forms.maskedInput(namespace);
        forms.makePlaceholders(namespace + ' [placeholder]', namespace + ' .b-form_box.placeholder input, ' + namespace + ' .b-form_box.placeholder textarea, ' + namespace + ' .b-form_box.placeholder select.js-selectric');

        forms.validate(namespace);
        forms.resetForm();

    }

    function validate(namespace) {

        $(namespace + ' form:not(.js-order)').each(function() {

            var $form = $(this);

            if ($.isFunction($.fn.validate) && $form.data('checkup')) {

                $form
                    .validate({
                        onChange: !!$form.data('checkupOnChange') ? $form.data('checkupOnChange') : false,
                        onKeyup: !!$form.data('checkupOnKeyup') ? $form.data('checkupOnKeyup') : false,
                        onBlur: !!$form.data('checkupOnBlur') ? $form.data('checkupOnBlur') : false,
                        conditional: {
                            passwords: function() {

                                return $(this).val() === $('[data-conditional-check="passwords"]').val();

                            },
                            checkboxes: function() {

                                var flag = true;

                                $(this).closest('.b-form_box_field').find('input[type="checkbox"]').each(function() {

                                    flag = $(this).is(':checked');

                                    return !flag;

                                });

                                return flag;

                            }
                        },
                        eachValidField: function() {

                            formNotifications.hideErrorLabel.call($(this));

                        },
                        eachInvalidField: function(status, options) {

                            var conditional = !!$(this).data('conditionalType') ? formNotifications.labels.conditional[$(this).data('conditionalType')] : formNotifications.labels.conditional[$(this).data('conditional')] || formNotifications.labels.conditional.def,
                                pattern = !!$(this).data('patternType') ? formNotifications.labels.pattern[$(this).data('patternType')] : formNotifications.labels.pattern.def,

                                notification = (options.required) ? ((!options.conditional) ? conditional : (!options.pattern) ? pattern : '') : !!$(this).data('requiredType') ? formNotifications.labels.required[$(this).data('requiredType')] : formNotifications.labels.required.def;

                            formNotifications.showErrorLabel.call($(this), notification, status.type !== 'keyup' && status.type !== 'blur' && status.type !== 'change');

                        },
                        valid: function(e) {

                            var $form = $(this),
                                $btn = $(this).find('button[type="submit"].e-btn'),

                                xhrSubmit = !!$(this).data('xhr'),

                                validHandler = $(this).data('handler'),
                                validHandlerMethod = $(this).data('handlerProperty');

                            if (typeof window[validHandler] === 'function') {

                                window[validHandler].call($form, e);

                            }
                            else if (typeof window[validHandler] === 'object') {

                                if (!!window[validHandler][validHandlerMethod]) {

                                    window[validHandler][validHandlerMethod].call($form, e);

                                }

                            }

                            if (xhrSubmit) {

                                e.preventDefault();

                                if ($.isFunction($.fn.ajaxSubmit)) {

                                    $form.ajaxSubmit({
                                        url: $form.attr('action'),
                                        method: $form.attr('method'),
                                        dataType: 'json',
                                        beforeSubmit: function() {

                                            $btn.toggleClass('request');

                                        },
                                        success: function(response) {

                                            $btn.toggleClass('request');
                                            xhrFormHandler.response.call($form, response);

                                        }
                                    });

                                } else {

                                    $.ajax({
                                        url: $form.attr('action'),
                                        method: $form.attr('method'),
                                        data: $form.serialize(),
                                        dataType: 'json',
                                        before: function() {

                                            $btn.toggleClass('request');

                                        },
                                        success: function(response) {

                                            $btn.toggleClass('request');
                                            xhrFormHandler.response.call($form, response);

                                        }
                                    });

                                }

                            }

                        }

                    })
                    .on('focus selectric-before-open refresh.validate', 'input, textarea, select', function() {

                        $(this).closest('.m-valid').removeClass('m-valid');
                        $(this).closest('.m-error').removeClass('m-error');

                    });

            }

            // Check to toggle a button
            if ($form.data('checkupBtn')) {

                $form.validate({
                    nameSpace : 'buttonSwitching',
                    onKeyup: true,
                    onBlur: true,
                    buttonSwitching: true,
                    switching: function(event, options, btnState) {

                        $(this).data('validateStatus', options);

                        var xhrValidateState = typeof $form.data('xhrValidateState') !== 'undefined' ? $form.data('xhrValidateState') : true,
                            prop = btnState && xhrValidateState;

                        $(this).find('button[type="submit"]').prop('disabled', !prop);

                    }
                });

            }

        }); // End loop

    }

    function styleControls(input, select, file) {

        if ($.isFunction($.fn.uniform)) {

            // Inputs
            $(input)
                .not('.js-switcher')
                .uniform();

            // Select
            if(!!select) {

                $(select).uniform({
                    selectAutoWidth: false,
                    selectClass: 'e-select'
                });

            }

            // File
            if(!!file) {

                $(file).each(function() {

                    $(this).uniform({
                        fileButtonHtml: '',
                        fileClass: 'e-uploader e-btn e-btn_grey e-btn_overlay i-ico i-ico-upload',
                        filenameClass: 'e-uploader_file',
                        fileButtonClass: 'e-uploader_btn',
                        fileDefaultHtml: $(this).data('label') || 'Загрузить'
                    });

                });

            }

        }

    }

    function styleSelects(selector) {

        if (helpers.mobile()) {

            if ($.isFunction($.fn.uniform)) {

                $(selector).uniform({
                    selectAutoWidth: false,
                    selectClass: 'e-select'
                });

            }

        }
        else {

            if ($.isFunction($.fn.selectric)) {

                $(selector).selectric({
                    maxHeight: 184,
                    arrowButtonMarkup: '',
                    disableOnMobile: false,
                    optionsItemBuilder: function(data, el) {

                        var storage = $(el).data();

                        return data.text + ((!!storage.price && !!storage.currency) ? '&nbsp;&ndash; <strong>' + storage.price + '&nbsp;<i class="' + storage.currency + '"></i></strong>' : '');

                    },
                    labelBuilder: function(data) {

                        var icon = 'i-sprite i-sprite-chevron-down',
                            text = data.value !== '' ? data.text : '<span class="placeholder">' + data.text + '</span>';

                        return !!icon ? '<span class="' + icon + '">' + text + '</span>' : text;

                    }
                });

                strongWidth();
                $(window).on('resize.selectricWidth', strongWidth);

            }

        }

        function strongWidth() {

            $(selector).each(function() {

                var $wg = $(this).closest('.selectric-wrapper').css({ width: '' });

                if (!!$(this).data('width')) {

                    switch ($(this).data('width')) {

                        default:

                            $wg.css({ width: $(this).data('width') });
                            break;

                        case 'strong':

                            $wg.css({ width: $wg.outerWidth() });
                            break;

                    }

                }

            });

        }

    }

    function makePlaceholders(placeholder, dynamic) {

        $(placeholder).each(function() {

            makeLabelsPlaceholders.call($(this));

        });

        $(dynamic).each(function() {

            makeDynamicPlaceholder.call($(this));

        });

        function makeLabelsPlaceholders() {

            var placeholdersIsSupports = 'placeholder' in document.createElement('input');

            if (!placeholdersIsSupports && this.is('input:not([type="radio"]):not([type="checkbox"]):not(.js-spinner)')) {

                var $field = this.attr('id', !!this.attr('id') ? this.attr('id') : helpers.randomString(6)),
                    $placeholder = $('<label class="b-form_box_field_placeholder" for="' + this.attr('id') + '">' + this.attr('placeholder') + '</label>');

                $field
                    .after($placeholder)
                    .on('focus blur change keyup', function() {

                        $placeholder.toggleClass('complete', !!$(this).val().length);

                    });

            }

        }

        function makeDynamicPlaceholder() {

            this.closest('.b-form_box').toggleClass('active', $(this).val() !== '');

            if (this.is('select.js-selectric')) {

                this
                    .on('selectric-open', function() {

                        $(this).closest('.b-form_box').toggleClass('active', true);

                    })
                    .on('selectric-close', function() {

                        $(this).closest('.b-form_box').toggleClass('active', !!$(this).val().length);

                    });

            } else {

                this.on('focus blur change', function(e) {

                    $(this).closest('.b-form_box').toggleClass('active', e.type === 'focus' || !!$(this).val().length);

                });

            }

            setTimeout($.proxy(function() {

                this.closest('.b-form_box').toggleClass('transition');

            }, this), 100);

        }

    }

    function maskedInput(namespace) {

        if ($.isFunction($.fn.inputmask)) {

            $(namespace + ' [data-masking]').each(function() {

                $(this).inputmask({
                    mask: $(this).data('masking') || '+7 (999) 999-99-99',
                    placeholder: '_',
                    showMaskOnHover: false
                });

            });

        }

    }

    function resetForm() {

        $('body').on('click', '.js-reset-form', function(e) {

            e.preventDefault();

            var $form = $(this).closest('form');

            $form[0].reset();

            $form.find('input[type="text"], select').not('[data-default]').val('');
            $form.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);

            $form.find('select').selectric('refresh');

            $form.find('.js-range').slider('option', {
                values: [
                    $($form.find('.js-range').data('from')).data('default'),
                    $($form.find('.js-range').data('to')).data('default')
                ]
            });

            $.uniform.update();

        });

    }

    return {
        init: init,
        makePlaceholders: makePlaceholders,
        maskedInput: maskedInput,
        resetForm: resetForm,
        styleControls: styleControls,
        styleSelects: styleSelects,
        validate: validate
    };

})(window);

var formNotifications = (function(window, undefined) {

    var settings = {
        errorClass: 'm-error',
        errorSuffix: '_error',
        validClass: 'm-valid'
    };

    var extendLabels = typeof formNotices !== 'undefined' ? formNotices : {},

        labels = {
            required: {
                def: 'Это поле необходимо заполнить'
            },
            conditional: {
                def: 'Введенные данные не совпадают',
                credit: 'Некорректный номер банковской карты',
                passwords: 'Введенные пароли не совпадают',
                checkboxes: 'Необходимо выбрать один из параметров',
                inn: 'Ошибка в ИНН',
                snils: 'Ошибка в номере СНИЛС',
                uploader: 'Необходимо загрузить хотя бы один файл'
            },
            pattern: {
                def: 'Некорректный формат данных',
                email: 'Некорректный адрес электронной почты',
                phone: 'Некорректный номер телефона'
            },
            uploader: {
                count: 'Вы пытаетесь загрузить больше изображений, чем это допустимо',
                uploading: 'Во время загрузки изображений возникла ошибка'
            },
            submit: {
                success: 'Спасибо. Мы свяжемся с вами в ближайшее время.',
                error: 'Ошибка.'
            }
        };

    labels = $.extend({}, labels, extendLabels);

    // Notification alerts
    function showMessage(msg, status, hideForm, callback) {

        var $notice = this.find('.b-form_message').length ? this.find('.b-form_message') : $('<div class="b-form_message"></div>').prependTo(this),
            suffix = status ? 'success' : 'error';

        if (hideForm) {

            $notice
                .html('<div class="b-form_message_balloon b-form_message_balloon__' + suffix + '"><div class="b-form_message_balloon_capsule"><div class="b-form_message_balloon_capsule_inner">' + msg + '</div></div></div>')
                .css({ position: 'absolute', zIndex: 10, left: 0, top: '50%', right: 0, padding: 0, marginTop: -($notice.find('.b-form_message_balloon').height() / 2) });

            $notice.toggleClass('b-form_message__show', true);

            this
                .css({ minHeight: this.outerHeight() })
                .toggleClass('b-form__hide', true)
                .animate({ minHeight: $notice.find('.b-form_message_balloon').height() }, 300, 'easeOutQuart');

        }
        else {

            $notice
                .height($notice.height())
                .html('<div class="b-form_message_balloon b-form_message_balloon__' + suffix + '"><div class="b-form_message_balloon_capsule"><div class="b-form_message_balloon_capsule_inner">' + msg + '</div></div></div>');

            $notice
                .toggleClass('b-form_message__show', true)
                .animate({ height: $notice.find('.b-form_message_balloon').height(), paddingBottom: hideForm ? 0 : 30 }, 300, 'easeOutQuart', function() {

                    $(this).css({ height: '' });

                });

        }

        // Callback
        if(!!callback) {

            callback.call(this);

        }

    }

    function hideMessage() {

        var $notice = this.find('.b-form_message').length ? this.find('.b-form_message') : $('<div class="b-form_message"></div>').prependTo(this);

        $notice
            .slideUp({duration: 300, easing: 'easeOutQuart' });

    }

    // Notification labels
    function showErrorLabel(text, append) {

        var $field = this.closest('.b-form_box');

        $field
            .find('.b-form_box' + settings.errorSuffix).remove();

        if (!!append) {

            $field
                .find('.b-form_box_field')
                .append('<div class="b-form_box' + settings.errorSuffix + '">' + text + '</div>');

        }

        setTimeout(function() {

            $field
                .removeClass(settings.validClass)
                .addClass(settings.errorClass);

        }, 100);

    }

    function hideErrorLabel() {

        var $field = this.closest('.b-form_box');

        $field.removeClass(settings.errorClass);
        $field.find('.b-form_box' + settings.errorSuffix).remove();

        if ($field.find('[data-required]').length) {

            setTimeout(function() {

                $field.addClass(settings.validClass);

            }, 100);

        }

    }

    return {
        labels: labels,
        showErrorLabel: showErrorLabel,
        hideErrorLabel: hideErrorLabel,
        showMessage: showMessage,
        hideMessage: hideMessage
    };

})(window);

var xhrFormHandler = (function(window, undefined) {

    function response(response) {

        var $form = this,
            message = '';

        // start check
        if (typeof response.fields === 'boolean' && response.fields) {

            message = response.msg || formNotifications.labels.submit.success;
            formNotifications.showMessage.call(this.closest('.b-form'), message, !!response.fields, !!response.hideForm);

        } else if (typeof response.fields === 'object') {

            // Get error message string
            var messageStr = ' Некорректно заполнены поля: ';

            $.each(response.fields, function(key, value) {

                var fieldName = $form.find('[name="' + key + '"]').attr('placeholder') || $form.find('[name="' + key + '"]').closest('.b-form_box').find('.b-form_box_title').text().replace(' *', '');

                messageStr += '&laquo;' + fieldName + '&raquo;, ';

            });

            message = response.msg || formNotifications.labels.submit.error + messageStr.substring(0, messageStr.length - 2) + '.';

            formNotifications.showMessage.call(this.closest('.b-form'), message, false, false, function(form) {

                highlightFields($form, response.fields);

            });

        } else {

            if ('console' in window) {
                console.log('Неверный формат ответа обработчика формы');
                console.log(response);
            }

        }

    }

    function highlightFields(form, array) {

        $.each(array, function(key, value) {

            formNotifications.showErrorLabel.call(form.find('[name="' + key + '"]'), value, 0);

        });

    }

    return {
        response: response
    };

})(window);
