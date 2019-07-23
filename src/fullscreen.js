import imageIcon from '../theme/icons/fullscreen.svg';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Command from '@ckeditor/ckeditor5-core/src/command';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

const FULLSCREEN = 'fullscreen';

export default  class Fullscreen extends Plugin {
    static get requires() {
        return [ FullscreenUI, FullscreenEditing ];
    }
    	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return FULLSCREEN;
	}
}

class FullscreenEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
        const editor = this.editor;
        this.editor.commands.add( FULLSCREEN, new FullscreenCommand( this.editor, {isEnabled: true} ) );

        editor.keystrokes.set( 'CTRL+SHIFT+F', FULLSCREEN );

        editor.keystrokes.set( 'ESC', ( data, cancel ) => {
            editor.execute( FULLSCREEN, false );
            cancel();
        } );
	}
}

class FullscreenUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add( FULLSCREEN, locale => {
            const view = new ButtonView( locale );
            const command = editor.commands.get( FULLSCREEN );

            view.set( {
                label: t( 'Fullscreen' ),
                icon: imageIcon,
                keystroke: 'CTRL+SHIFT+F',
                tooltip: true,
            } );

            view.bind( 'isOn' ).to( command, 'active' );
            this.listenTo( view, 'execute', () => {
                editor.execute( FULLSCREEN );
            } );
            return view;
        } );
    }
}

class FullscreenCommand extends Command {
    constructor( editor ) {
        super(editor);
        this.set( 'isEnabled', true );
        this.set('active', false);
    }
    execute(active) {
        if(typeof active === 'undefined') {
            this.set('active', !this.active);
            this.editor.config._config.onFullscreen();
        } else {
            this.set('active', false);
            this.editor.config._config.onFullscreen(false);
        }
        // view.set('isOn', !view.isOn);
    }
}