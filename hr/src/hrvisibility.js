/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module hr/hrstyle/hrstyleediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Command from '@ckeditor/ckeditor5-core/src/command';
// // import HREditing from './hr/hrediting';
import { viewToModelVisibilityAttribute, modelToViewVisibilityAttribute } from './hrvisibility/converters';
import EyeIcon from '../theme/icons/eye.svg';
import { isHR } from './hr/utils';

/**
 * The hr style engine plugin. It sets the default configuration, creates converters and registers
 * {@link module:hr/hrstyle/hrstylecommand~HRToggleVisibilityCommand HRToggleVisibilityCommand}.
 *
 * @extends {module:core/plugin~Plugin}
 */
export default class HRVisibility extends Plugin {
	constructor( ...args ) {
		super( ...args );
		this._createButton = this._createButton.bind( this );
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HRVisibility';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const { editor } = this;
		const { config, data, model, editing, commands } = editor;
		const { schema } = model;

		// Define default configuration.
		config.define( 'hr.visibility', true );

		// Allow visibility attribute in hr.
		schema.extend( 'hr', { allowAttributes: 'hrVisibility' } );

		// Converters for visibility attribute from model to view.
		editing.downcastDispatcher.on( 'attribute:hrVisibility:hr', modelToViewVisibilityAttribute );
		data.downcastDispatcher.on( 'attribute:hrVisibility:hr', modelToViewVisibilityAttribute );

		// Converter for hr element from view to model.
		data.upcastDispatcher.on( 'element:hr', viewToModelVisibilityAttribute, { priority: 'low' } );

		// // Register visibility command.
		commands.add( 'hrToggleVisibility', new HRToggleVisibilityCommand( editor ) );

		this._createButton();
	}

	_createButton() {
		const { editor } = this;

		editor.ui.componentFactory.add( 'hrVisibility:toggle', locale => {
			const command = editor.commands.get( 'hrToggleVisibility' );
			const view = new ButtonView( locale );

			view.set( {
				label: 'Toggle visibility',
				icon: EyeIcon,
				tooltip: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );
			this.listenTo( view, 'execute', () => editor.execute( 'hrToggleVisibility' ) );

			return view;
		} );
	}
}

class HRToggleVisibilityCommand extends Command {
	constructor( editor ) {
		super( editor );
		this._defaultVisibility = true;
	}

	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isHR( element );

		if ( !element ) {
			this.value = false;
		} else if ( element.hasAttribute( 'hrVisibility' ) ) {
			this.value = !element.getAttribute( 'hrVisibility' );
		} else {
			this.value = this._defaultVisibility;
		}
	}

	execute() {
		const model = this.editor.model;
		const hrElement = model.document.selection.getSelectedElement();

		if ( hrElement.hasAttribute( 'hrVisibility' ) ) {
			this.value = hrElement.getAttribute( 'hrVisibility' );
		} else {
			this.value = this._defaultVisibility;
		}

		model.change( writer => {
			writer.setAttribute( 'hrVisibility', !this.value, hrElement );
		} );
	}
}
