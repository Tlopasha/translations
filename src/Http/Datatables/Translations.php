<?php

/**
 * Part of the Antares Project package.
 *
 * NOTICE OF LICENSE
 *
 * Licensed under the 3-clause BSD License.
 *
 * This source file is subject to the 3-clause BSD License that is
 * bundled with this package in the LICENSE file.
 *
 * @package    Translations
 * @version    0.9.0
 * @author     Antares Team
 * @license    BSD License (3-clause)
 * @copyright  (c) 2017, Antares Project
 * @link       http://antaresproject.io
 */



namespace Antares\Translations\Http\Datatables;

use Antares\Translations\Repository\TranslationRepository;
use Antares\Datatables\Services\DataTable;
use Antares\Translations\Models\Languages;
use Illuminate\Database\Eloquent\Builder;
use Antares\Asset\JavaScriptDecorator;

class Translations extends DataTable
{

    /**
     * items per page
     *
     * @var mixed 
     */
    public $perPage = 25;

    /**
     * @return Builder
     */
    public function query()
    {
        $locale = $this->getLocale();
        $id     = from_route('id');
        return app(TranslationRepository::class)->getList($id, $locale);
    }

    /**
     * {@inheritdoc}
     */
    public function ajax()
    {
        $canEditTranslation = app('antares.acl')->make('antares/translations')->can('edit-translation');
        return $this->prepare()
                        ->filter(function($query) {
                            $columns = app('request')->get('columns');
                            foreach ($columns as $column) {
                                if (strlen($keyword = array_get($column, 'search.value')) > 0) {
                                    $query->where($column['data'], 'like', "%$keyword%");
                                }
                            }
                        })
                        ->editColumn('value', function ($item) {
                            return wordwrap($item->value, '55', '<br />');
                        })
                        ->addColumn('action', $this->getActionsColumn($canEditTranslation))
                        ->make(true);
    }

    /**
     * {@inheritdoc}
     */
    public function html()
    {
        $builder   = $this
                ->setName('Translations List')
                ->setQuery($this->query())
                ->addColumn(['data' => 'id', 'name' => 'id', 'title' => 'Id'])
                ->addColumn(['data' => 'key', 'name' => 'key', 'title' => 'Key'])
                ->addColumn(['data' => 'value', 'name' => 'value', 'title' => 'Translation'])
                ->addAction(['name' => 'edit', 'title' => '', 'class' => 'inline', 'searchable' => false, 'orderable' => false]);
        $id        = from_route('id');
        $locale    = $this->getLocale();
        $current   = Languages::where('code', $locale)->first();
        $languages = Languages::whereNotIn('code', [$current->code])->get();

        return $builder->parameters($this->tableProperties($id, $current, $languages))
                        ->searchable(false)
                        ->massable(false)
                        ->ajax(handles('antares::translations/index/' . $id . '/' . $current->code));
    }

    protected function getLocale()
    {
        $code   = from_route('code');
        $locale = is_null($code) ? app()->getLocale() : $code;
        return $locale == null ? 'en' : $locale;
    }

    /**
     * table properties setter
     * 
     * @return array
     */
    protected function tableProperties($id, $current, $languages)
    {
        $header = JavaScriptDecorator::decorate(view('antares/translations::admin.partials._translation_header', compact('id', 'current', 'languages'))->render());

        $inlineSearch = <<<EOD
                function () {
                    var api = this.api();
                    $('<tr role="row"><th></th><th class="key-search"><div class="form-block ff-rw mb0"><div class="input-field"></div></div></th><th  class="value-search"><div class="col-group"><div class="col-8 select-lang"></div><div class="fill-translation"><div class="form-block ff-rw mb0"><div class="input-field"></div></div></div></div></th><th></th></tr>').appendTo($(api.columns().header()).parent().parent());
                    var input = $('<input />').attr({
                        'type': 'text',
                        'class': 'form-control w220'
                    });
                    $(input).appendTo($('th.key-search .form-block .input-field')).on('keypress', function (e) {                        
                        if (e.which == 13) {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val());
                            api.column(1).search(val, false, false).draw();
                            return false;   
                        }                        
                    });
                    var value = $('<input />').attr({
                        'type': 'text',
                        'class': 'form-control',
                    });
                    $('th.value-search .select-lang').html($header);
                    $(value).appendTo($('th.value-search .fill-translation .form-block .input-field')).on('keypress', function (e) {                        
                        if (e.which == 13) {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val());
                            api.column(2).search(val, false, false).draw();
                            return false;   
                        }                           
                    });
                    $('#dataTableBuilder_filter').remove();
                    $('.column-translation').select2({
                        minimumResultsForSearch: -1
                    });
                }
EOD;
        $rowClass     = <<<EOD
                function( nRow, aData, iDisplayIndex ) {
  nRow.className = "no-padding";
  return nRow;
}
EOD;
        return [
            'bFilter'        => true,
            'iDisplayLength' => $this->perPage,
            'initComplete'   => $inlineSearch,
            'fnRowCallback'  => $rowClass,
            'aoColumnDefs'   => [
                    ['width' => '1%', 'targets' => 0],
                    ['width' => '15%', 'targets' => 1],
                    ['width' => '30%', 'targets' => 2],
                    ['width' => '30%', 'targets' => 3]
            ],
        ];
    }

    /**
     * Get actions column for table builder.
     * 
     * @return callable
     */
    protected function getActionsColumn($canEditTranslation)
    {
        return function ($row) use($canEditTranslation) {
            $form       = app('form');
            $attributes = [
                'class' => 'form-control inline-translation',
                'rows'  => (int) (strlen($row->value) / 80) + 1,
                'cols'  => 5,
                'rel'   => $row->id
            ];
            return ($canEditTranslation) ? '<div class = "form-block" style="margin:0px;">' . $form->textarea('name[' . $row->id . ']', $row->value, $attributes) : app('html')->create('div', $row->value, $attributes)->get() . '</div>';
        };
    }

}
