/**
 * Interlude
 * 
 * Object constructor.
 * 
 * Finds buttons based on the provided selector and
 * replaces them with waiting message.
 * 
 * Meanwhile, checks resource to see if it's available.
 * When the resource is available, the waiting message is removed.
 * 
 * @version 1.0.0
 * 
 * @param object options 
 */
function Interlude( options ) {
    // Settings
    this.selector = options.selector || '';
    this.intervalSeconds = options.intervalSeconds || 5;
    this.intervalLimit = options.intervalLimit || 240; // Default to 20 mins maximum ( until page is refreshed )
    this.waitingMessage = options.waitingMessage || 'Please wait';
    this.waitingClass = options.waitingClass || 'wpi-Waiting';

    // Data
    this.version = '1.0.0';
    this.targets = [];
    this.pendingResourcesCount = null;
    this.intervalCount = 0;

    // Setup the JS
    this.init();
}

/**
 * Interlude - Initialize the JS
 * 
 * @since 1.0.0
 * 
 * @return void
 */
Interlude.prototype.init = function() {
    if ( this.selector && this.selector !== '' ) {
        this.getTargets();
        this.runIntervalCheck();
        this.setIntervalCheck();
        this.isInitialized();
    }
}

/**
 * Interlude - Is Initialized
 * 
 * All initial methods have been called and Interlude is running.
 * 
 * @since 1.1.0
 * 
 * @return void
 */
Interlude.prototype.isInitialized = function() {
    // Remove inline CSS for initial loading state
    var inlineStyle = document.getElementById( 'wp-interlude-inline-css' );
    inlineStyle.remove();
}

/**
 * Interlude - Get Resource URL
 * 
 * Get the resource URL for each target
 * 
 * @since 1.0.0
 * 
 * @param object target
 * @return string - URL
 */
Interlude.prototype.getResourceURL = function( target ) {
    var url;
    
    // Links will use href attribute
    if ( typeof target.attr('href') !== 'undefined' && target.attr('href') !== '' ) {
        url = target.attr('href');
    }

    // Media or iframes will use src attribute
    if ( ! url && typeof target.attr('src') !== 'undefined' && target.attr('src') !== '' ) {
        url = target.src;
    }

    return url;
}

/**
 * Interlude - Get Resource URL
 * 
 * Get the resource URL for each target
 * 
 * @since 1.0.0
 * 
 * @return void
 */
Interlude.prototype.getTargets = function() {
    var elements = jQuery( this.selector ),
        wpi = this;
    
    jQuery( elements ).each( function( i ) {
        var target = jQuery( this ),
            resourceURL = wpi.getResourceURL( target );
        if ( resourceURL ) {
            wpi.targets.push( {
                id       : i,
                element  : target,
                resource : resourceURL,
                isReady  : false,
                isLoaded : false,
            } );
        }
    } );
}


/**
 * Interlude - Set Interval Check
 * 
 * Every certain amount of seconds, run a check to see what's available.
 * 
 * @since 1.0.0
 * 
 * @return void
 */
Interlude.prototype.setIntervalCheck = function() {

    var checkInterval = window.setInterval( function() {
        var hasPendingResources = this.runIntervalCheck();
        if ( ! hasPendingResources || this.intervalCount === this.intervalLimit ) {
            window.clearInterval( checkInterval ); // If all resources have loaded, stop interval
        }
    }.bind( this ), ( this.intervalSeconds * 1000 ) );

}


/**
 * Interlude - Run Interval Check
 * 
 * Every certain amount of seconds, run a check to see what's available.
 * 
 * @since 1.0.0
 * 
 * @return bool - whether or not there are pending resources
 */
Interlude.prototype.runIntervalCheck = function() {
    if ( this.pendingResourcesCount === null || this.pendingResourcesCount > 0 ) {
        this.pendingResourcesCount = 0;
        this.intervalCount++;

        this.targets.map( function( target ) {
            if ( ! target.isLoaded ) {
                this.isResourceAvailable( target );
                var isAvailable = this.setDisplayIfAvailable( target );
                if ( ! isAvailable ) {
                    this.pendingResourcesCount++;
                    this.renderWaitingMessage( target );
                }
            }
        }.bind( this ) );
    }
    return ( this.pendingResourcesCount > 0 );
}

/**
 * Interlude - Set Display If Available
 * 
 * Either display a working button or a waiting message.
 * 
 * @since 1.0.0
 * 
 * @param object target
 * @return boolean - whether or not resource is available
 */
Interlude.prototype.setDisplayIfAvailable = function( target ) {
    var isAvailable = this.targets[ target.id ].isReady;
    if ( isAvailable ) {
        this.targets[ target.id ].isLoaded = true;
        this.removeWaitingMessage( target );
        return true;
    }
    return false;
}

/**
 * Interlude - Is Resource Available?
 * 
 * Check if the resource is available via JS fetch() method
 * 
 * @since 1.0.0
 * 
 * @param string resourceURL
 * @return bool
 */
Interlude.prototype.isResourceAvailable = function( target ) {
    // Use fetch, return async response
    fetch( target.resource )
        .then( function( response ) {
            if ( response.status === 200 ) {
                this.targets[ target.id ].isReady = true;
            }
            else {
                console.error( target.resource + ' is not available.' );
            }
        }.bind( this ) )
        .catch( function( error ) {
            console.error( error );
        }.bind( this ) );
}

/**
 * Interlude - Render Waiting Message
 * 
 * Replace target with waiting message and disable button or link.
 * 
 * @since 1.0.0
 * 
 * @param object - target
 * @return void
 */
Interlude.prototype.renderWaitingMessage = function( target ) {
    var element = jQuery( target.element );
    if ( ! element.hasClass( this.waitingClass ) ) {
        element.addClass( this.waitingClass );
        jQuery( '<span class="wpi-Waiting-message"><b>' + this.waitingMessage + '</b></span> ' ).insertAfter( element );
        element.prop( 'disabled', true );
    }
}


/**
 * Interlude - Remove Waiting Message
 * 
 * Remove special waiting message and enable button/link 
 * 
 * @since 1.0.0
 * 
 * @param object - target
 * @return void
 */
Interlude.prototype.removeWaitingMessage = function( target ) {
    var element = jQuery( target.element );
    if ( element.hasClass( this.waitingClass ) ) {
        element.removeClass( this.waitingClass );
        element.next('.wpi-Waiting-message').remove();
        element.prop( 'disabled', false );
    }
}