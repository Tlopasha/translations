
var dataTable9y3 = function () {};
var oTable0AC;
dataTable9y3.datatables = dataTable9y3.datatables || {};
dataTable9y3.prototype.init = function () {
    var self = this;
    (function datatables() {
        $('.translations-table').on('init.dt', function () {
            $(this).closest('.tbl-c').LoadingOverlay('hide');
        });
        $('.translations-table').closest('.tbl-c').LoadingOverlay('show');
        oTable0AC = $('.translations-table').DataTable(self.datatables.options);
        self.datatables.filterSearch();
        self.datatables.zeroData();

        function detect() {
            var tblC = $('.translations-table').closest('.tbl-c'), filter = tblC.find('.columns-filter'), url = filter.data('url'), key = filter.data('key');


            tblC.find('.ddown--columns .ddown__menu li').on('click', function () {
                $(this).toggleClass('col-is-visible');
                $(this).toggleClass('col-is-hidden');

                var order = $(this).index(), isVisible = oTable0AC.column(order).visible();
                filter.find('.ddown__menu').LoadingOverlay('show');
                $.post(url, {index: order, visible: !isVisible, key: key}).done(function () {
                    filter.find('.ddown__menu').LoadingOverlay('hide');
                });
                if (isVisible === true) {
                    oTable0AC.column(order).visible(false);
                } else {
                    oTable0AC.column(order).visible(true);
                }

            });
        }
        detect();

    }());
};
dataTable9y3.prototype.datatables = {
    variables: {
        'table': $(".translations-table"),
        'tr': $('.translations-table tr')
    },
    options: {
        'bFilter': true,
        'iDisplayLength': 999,
        'bLengthChange': true,
        'bInfo': false,
        'columnDefs': [{
                responsivePriority: 0,
                targets: -1
            }],
        'serverSide': true,
        'dom': '<\"dt-area-top\"i>rt<\"dt-area-bottom pagination pagination--type2\" fpL><\"clear\">',
        'responsive': true,
        'bProcessing': false,
        'processing': false,
        'oLanguage': {
            'oPaginate': {
                'sPrevious': '<i class=\'zmdi zmdi-long-arrow-left dt-pag-left\'><\/i>',
                'sNext': '<i class=\'zmdi zmdi-long-arrow-right dt-pag-right\'><\/i>'
            },
            'sLengthMenu': '_MENU_'
        },
        'lengthMenu': [
            [10, 25, 50],
            [10, 25, 50]
        ],
        'initComplete': function () {
            self.editCell();
            self.initFirstRow(this.api());
        },
        'fnRowCallback': function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

            if ($(nRow).find('.dt-actions').length <= 0) {
                $(nRow).addClass('no-actions');
            }
        },
        'aoColumnDefs': [{
                'width': '1%',
                'targets': 0
            }, {
                'width': '15%',
                'targets': 1
            }, {
                'width': '30%',
                'targets': 2
            }, {
                'width': '30%',
                'targets': 3
            }],
        'ajax': function (data, callback, settings) {

            var dtInstance = $(settings.oInstance);
            var instance = dtInstance.closest('.grid-stack-item-content').length > 0 ? dtInstance.closest('.grid-stack-item-content') : dtInstance.closest('.tbl-c');

            if (instance.length > 0) {
                instance.LoadingOverlay('show');
            }
            settings.jqXHR = $.ajax({
                "dataType": 'json',
                "timeout": 20000,
                "type": "POST",
                "url": "http://192.168.1.225/admin/translations/index/admin/en",
                "data": data,
                "success": callback
            }).always(function (data) {
                if (instance.length > 0) {
                    instance.LoadingOverlay('hide');
                }
                $(document).trigger("datatablesLoaded", [dtInstance]);
            });
        },
        'columns': [{
                'data': 'id',
                'name': 'id',
                'title': 'Id',
                'searchable': false,
                'orderable': false,
                'class': 'no-sort',
                'exportable': true,
                'printable': true,
                'footer': ''
            }, {
                'data': 'key',
                'name': 'key',
                'title': 'Key',
                'orderable': true,
                'searchable': true,
                'exportable': true,
                'printable': true,
                'footer': ''
            }, {
                'data': 'value',
                'name': 'value',
                'title': 'Translation',
                'orderable': true,
                'searchable': true,
                'exportable': true,
                'printable': true,
                'footer': ''
            }, {
                'defaultContent': '',
                'data': 'action',
                'name': 'edit',
                'title': '',
                'render': null,
                'orderable': false,
                'searchable': false,
                'exportable': false,
                'printable': true,
                'footer': '',
                'class': 'inline'
            }],
        'fnDrawCallback': function (oSettings) {
            var tblC = this.closest('.tbl-c');
            if (this.fnGetData().length === 0) {
                tblC.addClass('tbl-c--zd');
            } else {
                tblC.removeClass('tbl-c--zd');
            }
        }
    },
    timeout: null,
    delay: (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })(),
    filterSearch: function () {
        var self = this;
        var input = $(this.variables.table.selector).closest('.tbl-c').find('.card-ctrls .mdl-textfield__input');
        input.closest('form').submit(function (e) {
            oTable0AC.search($(this).find('input:text').val()).draw();
            return false;
        });
    },
    container: function () {
        return this.variables.table.closest('.tbl-c');
    },

    zeroData: function () {
        var bTable = $(this.variables.table.selector);
        bTable.closest('.tbl-c').LoadingOverlay('hide');
        var cell = bTable.find('tbody td');
        var zeroElement = bTable.find('tbody .dataTables_empty');
        if (cell.length === 1 && zeroElement.length) {
            bTable.closest('.tbl-c').addClass('tbl-c--zd');
        }
    }

};

$(function () {
    window.dataTable9y3 = new dataTable9y3();
    window.dataTable9y3.init();

});