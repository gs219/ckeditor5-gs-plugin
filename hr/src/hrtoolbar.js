import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { getSelectedHRWidget } from './hr/utils';
import WidgetToolbarRepository from '@ckeditor/ckeditor5-widget/src/widgettoolbarrepository';

export default class HRToolbar extends Plugin {
	static get requires() {
		return [ WidgetToolbarRepository ];
	}

	static get pluginName() {
		return 'HRToolbar';
	}

	afterInit() {
		const editor = this.editor;
		const widgetToolbarRepository = editor.plugins.get( WidgetToolbarRepository );

		widgetToolbarRepository.register( 'hr', {
			items: editor.config.get( 'hr.toolbar' ) || [],
			getRelatedElement: getSelectedHRWidget,
		} );
	}
}
