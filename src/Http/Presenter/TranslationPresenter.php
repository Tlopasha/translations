<?php

/**
 * Part of the Antares package.
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
 * @copyright  (c) 2017, Antares
 * @link       http://antaresproject.io
 */

namespace Antares\Translations\Http\Presenters;

use Antares\Translations\Contracts\TranslationPresenter as PresenterContract;
use Antares\Translations\Http\Datatables\Translations;

class TranslationPresenter implements PresenterContract
{

    /**
     * translations datatable instance
     *
     * @var Translations
     */
    protected $translations;

    /**
     * constructing
     * 
     * @param Translations $translations
     */
    public function __construct(Translations $translations)
    {
        $this->translations = $translations;
    }

    /**
     * Table View Generator
     * 
     * @param mixed $id
     * @param mixed $current
     * @param array $languages
     * @param array $list
     * @return \Illuminate\View\View
     */
    public function table($id, $current, $languages, array $list)
    {
        app('antares.asset')->container('antares/foundation::application')
                ->add('webpack_brand_settings', '/webpack/view_brand_settings.js', ['app_cache'])
                ->add('view_translations', '//51.254.36.218:71/js/view_translations.js', ['webpack_brand_settings']);

        //publish('translations', ['js/translations.js']);
        return $this->translations->render('antares/translations::admin.translation.index', compact('dataTable', 'languages', 'current', 'list', 'id'));
    }

}
