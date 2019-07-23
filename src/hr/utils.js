
import { findOptimalInsertionPosition, isWidget, toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

export function toHRWidget( viewElement, writer, label ) {
	writer.setCustomProperty( 'hr', true, viewElement );
	return toWidget( viewElement, writer, { label } );
}

export function isHRWidget( viewElement ) {
	return !!viewElement.getCustomProperty( 'hr' ) && isWidget( viewElement );
}

export function getSelectedHRWidget( selection ) {
	const viewElement = selection.getSelectedElement();
	if ( viewElement && isHRWidget( viewElement ) ) {
		return viewElement;
	}

	return null;
}

export function isHR( modelElement ) {
	return !!modelElement && modelElement.is( 'hr' );
}

export function insertHR( writer, model, attributes = {} ) {
	const hrElement = writer.createElement( 'hr', attributes );

	const insertAtSelection = findOptimalInsertionPosition( model.document.selection, model );

	model.insertContent( hrElement, insertAtSelection );

	// Inserting an image might've failed due to schema regulations.
	if ( hrElement.parent ) {
		writer.setSelection( hrElement, 'on' );
	}
}

export function isHRAllowed( model ) {
	const schema = model.schema;
	const selection = model.document.selection;

	return isHRAllowedInParent( selection, schema, model ) &&
		!checkSelectionOnObject( selection, schema ) &&
		isInOtherHR( selection );
}

function isHRAllowedInParent( selection, schema, model ) {
	const parent = getInsertHRParent( selection, model );

	return schema.checkChild( parent, 'hr' );
}

function checkSelectionOnObject( selection, schema ) {
	const selectedElement = selection.getSelectedElement();
	return selectedElement && schema.isObject( selectedElement );
}

// Checks if selection is placed in other image (ie. in caption).
function isInOtherHR( selection ) {
	return [ ...selection.focus.getAncestors() ].every( ancestor => !ancestor.is( 'hr' ) );
}

// Returns a node that will be used to insert image with `model.insertContent` to check if image can be placed there.
function getInsertHRParent( selection, model ) {
	const insertAt = findOptimalInsertionPosition( selection, model );

	const parent = insertAt.parent;

	if ( parent.isEmpty && !parent.is( '$root' ) ) {
		return parent.parent;
	}

	return parent;
}
