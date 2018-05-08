//
// Form validator
//
import _ from 'lodash';
import Config from './../Config';
import AlertLib from './../Ui/Alert';
import LoaderLib from './../Ui/Loader';

class Validator
{
    /**
     * Constructor
     *
     * @param string formId
     * @param object settings
     * @return void
     */
    constructor( containerId, settings = {} )
    {
        this.containerId = containerId;
        this.container = $( containerId );
        this.form = $( 'form', this.container );
        this.loader = new LoaderLib();

        //set settings
        this._setSettings( settings );
    }

    /**
     * Setup validator
     *
     * @return array
     */
    setup()
    {
        if ( this.container.length < 1 ) {
            return false;
        }

        let self = this;
        jQuery.validator.addMethod("recaptcha", function(value, element)
        {
            return recaptchaResponse;
        });

        jQuery.validator.addMethod('filesize', function (value, element, param)
        {
            return this.optional(element) || (element.files[0].size <= param);
        }, 'File size must be less than {0}');

        jQuery.validator.addMethod('username', function (value, element, param)
        {
            return this.optional(element) || value == value.match(/^[a-zA-Z0-9_]+$/);
        });

        this.form.validate(
        {
            errorClass: "input--error--msg",
            errorElement: "div",
            onkeyup: false,
            //Validator rules
            rules: this.getRules(),
            //Validator messages
            messages: this.getMessages(),
            //Handling error placement
            errorPlacement: ( error, element ) => this.errorPlacement( error, element ),
            //Handling highlight
            highlight: ( element, errorClass, validClass ) => this.highlight( element, errorClass, validClass ),
            //Handling unhighlight
            unhighlight: (element, errorClass, validClass) => this.unhighlight( element, errorClass, validClass ),
            submitHandler: (form) =>
            {
                this.submit( form );
                return false;
            }
        });

        return this;
    }

    /**
     * Get rules
     *
     * @return object
     */
    getRules()
    {
        return {};
    }

    /**
     * Get messages
     *
     * @return object
     */
    getMessages()
    {
        return {};
    }

    /**
     * Handling error placemenet
     *
     * @param object error
     * @param object element
     * @return void
     */
    errorPlacement( error, element )
    {
        let elname = element.attr( 'name' );
        let msgwrapper = $( '._form--messages', this.container );

        let elerror = $( '._error[data-name="'+elname+'"]' );
        if ( elerror.length < 1 ) {
            elerror = $( '<div class="_error" data-name="'+elname+'"></div>' );
            elerror.html( error );
            msgwrapper.append( elerror );
        }
        else  {
            elerror.html( error );
        }
    }

    /**
     * Handling highlighting
     *
     * @param object element
     * @param string errorClass
     * @param string validClass
     * @return void
     */
    highlight( element, errorClass, validClass )
    {
        $(element)
            .parents( '.field' )
            .addClass( 'input--invalid' );
    }

    /**
     * Handling unhighlighting
     *
     * @param object element
     * @param string errorClass
     * @param string validClass
     * @return void
     */
    unhighlight( element, errorClass, validClass )
    {
        $(element)
            .parents( '.field' )
            .removeClass( 'input--invalid' );

        var elname = $(element).attr( 'name' );
        var elerror = $( '._error[data-name="'+elname+'"]' );
        if ( elerror.length > 0 ) {
            elerror.remove();
        }
    }

    /**
     * Handling submit form
     *
     * @param object form
     * @return void
     */
    submit( form )
    {
        let self = this;

        this.preProcess( form );

        $.ajax({
            type: 'POST',
            url: $(form).attr( 'action' ),
            data: $(form).serialize(),
            dataType: "json",
            success: (response) => this.success( response, form ),
            error: (response) => this.error( response, form )
        });
    }

    /**
     * Pre process
     *
     * @param object form
     * @return void
     */
    preProcess( form )
    {
        //Show loader
        this.loader.show();
    }

    /**
     * Success process
     *
     * @param response form
     * @param object form
     * @return void
     */
    success( response, form )
    {
        if ( typeof response.redirect != 'undefined' && response.redirect != null )
        {
            window.location.href = response.redirect;
        }
        else
        {
            if ( response.status == 1 )
            {
                //Show alert
                new AlertLib( response.message, 'success' ).show();
                form.reset();

                this.afterSuccess( response, form );
            }
            else {
                //Show alert
                new AlertLib( response.message, 'danger' ).show();
            }
            //Hide loader
            this.loader.hide();
        }
    }

    /**
     * After process success
     *
     * @param response form
     * @param object form
     * @return void
     */
    afterSuccess( response, form )
    {
    }

    /**
     * Error process
     *
     * @param response form
     * @param object form
     * @return void
     */
    error( response, form )
    {
        //Show alert
        new AlertLib( response.message, 'danger' ).show();
        //Hide loader
        this.loader.hide();
    }

    /**
     * Set settings
     *
     * @param array settings
     * @return Uploader
     */
    _setSettings( settings )
    {
        let defaultSettings = this._getDefaultSettings();
        this.config = new Config( defaultSettings, settings );
        return this;
    }

    /**
     * Get default settings
     *
     * @return object
     */
    _getDefaultSettings()
    {
        let settings = {
        };
        return settings;
    }
};

export default Validator;
