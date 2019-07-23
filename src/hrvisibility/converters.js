
import first from '@ckeditor/ckeditor5-utils/src/first';
const invisibleClassName = 'clearfix-only';

export function modelToViewVisibilityAttribute( evt, data, conversionApi ) {
	if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
		return;
	}

	const viewElement = conversionApi.mapper.toViewElement( data.item );
	const viewWriter = conversionApi.writer;

	viewWriter[ data.attributeNewValue ? 'removeClass' : 'addClass' ]( invisibleClassName, viewElement );
}

export function viewToModelVisibilityAttribute( evt, data, conversionApi ) {
	if ( !data.modelRange ) {
		return;
	}

	const viewHRElement = data.viewItem;
	const modelHRElement = first( data.modelRange.getItems() );

	if ( !conversionApi.schema.checkAttribute( modelHRElement, 'visibility' ) ) {
		return;
	}

	const isHidden = conversionApi.consumable.consume( viewHRElement, { classes: invisibleClassName } );
	conversionApi.writer.setAttribute( 'visibility', !isHidden, modelHRElement );
}
