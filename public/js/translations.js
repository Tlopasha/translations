$(document).ready(function () {
    $('.translations-component').select2({
        minimumResultsForSearch: Infinity
    }).on("change", function (e) {
        $('body').LoadingOverlay('show');
        window.location.href = $(this).find('option[value=' + $(this).val() + ']').attr('data-url');
        return false;
    });

    $('.change-language').on("change", function (e) {
        $('body').LoadingOverlay('show');
        window.location.href = $(this).find('option[value=' + $(this).val() + ']').attr('data-url');
        return false;
    });

    function Swaller(handler) {
        this.handler = handler;
        this.swal = function (callback) {
            swal($.extend({}, APP.swal.cb1Warning(), {
                title: handler.attr('data-title'),
                text: handler.attr('data-description'),
                showCancelButton: true,
                closeOnConfirm: false,
                closeOnCancel: true
            }), function (isConfirm) {
                if (isConfirm) {
                    APP.swal.close();
                    if (callback === undefined) {
                        return false;
                    }
                    if (isConfirm) {
                        callback();
                    }
                }
            });
        }
    }
    $('.publish-translations').on('click', function (e) {
        e.preventDefault();
        var handler = $(this);
        swaller = new Swaller(handler);
        swaller.swal(function () {
            window.location.href = handler.attr('href');
        });
    });
    $('.export-translations').on('click', function (e) {
        e.preventDefault();
        var handler = $(this);
        swaller = new Swaller(handler);
        swaller.swal(function () {
            window.location.href = handler.attr('href');
        });
    });
    $('.import-translations').on('click', function (e) {
        e.preventDefault();
        var handler = $(this);
        $.ajax({
            url: handler.attr('href'),
            success: function (response) {
                $('.language-form').html(response);

            },
            error: function (error) {

            }
        });
    });
    $('.translations-container').on("change", '.column-translation', function (e) {
        e.preventDefault();
        $('.translations-container').LoadingOverlay('show');
        handler = $(this);
        searchInput = $('th.value-search input');
        if (handler.val() !== handler.attr('default')) {
            searchInput.attr('disabled', 'disabled');
        } else {
            searchInput.removeAttr('disabled');
        }
        keys = [];
        $('.translations-container tbody td:nth-child(2)').each(function (index, item) {
            keys.push($(item).text());
        });
        $.ajax({
            url: handler.attr('rel'),
            type: 'POST',
            dataType: 'json',
            data: {keys: keys, 'code': handler.val()},
            success: function (response) {
                $('.translations-container tbody td:nth-child(2)').each(function (index, item) {
                    text = $(item).text();
                    valueItem = $(item).next();
                    for (var i = 0; i < response.length; i++) {

                        if (response[i].key === text) {

                            $(item).next().html(response[i].value);
                        }
                    }
                });
                $('.translations-container').LoadingOverlay('hide');
            },
            error: function (error) {
                $('.translations-container').LoadingOverlay('hide');
            }
        });

        return false;
    });


});