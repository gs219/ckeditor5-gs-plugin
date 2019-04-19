import Command from '@ckeditor/ckeditor5-core/src/command';
import { insertHR, isHRAllowed } from './utils';

export default class HRInsertCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		this.isEnabled = isHRAllowed( this.editor.model );
	}

	execute() {
		const model = this.editor.model;

		model.change( writer => {
			insertHR( writer, model );
		} );
	}
}
