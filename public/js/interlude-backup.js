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
 * @version 1.2.0
 * 
 * @param object options 
 */
function Interlude( options ) {
    // Settings
    this.selector = options.selector || '';
    this.interval = {
        seconds : options.intervalSeconds || 5,
        limit   : options.intervalLimit || 240, // Default to 20 mins maximum ( until page is refreshed )
        count   : 0,
        active  : 1
    };
    this.resources = {
        targets     : [],
        pending     : 0,
        isAvailable : ( target ) => false
    };
    render = {
        waiting : function() {  },
    };
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
        this.setIntervalCheck( this.interval, this.runIntervalCheck );
        this.isInitialized();
    }
}

/**
 * Interlude - Is Initialized
 * 
 * All initial methods have been called and Interlude is running.
 * 
 * @since 1.2.0
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
 * @param {object} interval - the interval to run, in seconds
 * @param {function} runIntervalCheck - function to check if resources have been found
 * @param {function} isCleared - function that's run after interval has been cleared
 * 
 * @return {object}
 */
function setIntervalCheck( interval, runIntervalCheck, isCleared ) {
    var intervalMs = interval.seconds * 1000;
    var checkInterval = window.setInterval( function() {
        var hasPendingResources = runIntervalCheck( interval );
        if ( ! hasPendingResources || interval.count === interval.limit ) {
            window.clearInterval( checkInterval ); // If all resources have loaded, stop interval
            interval.active = 0;

            if ( typeof isCleared === 'function' ) {
                isCleared( interval );
            }
        }
    }.bind( this ), ( intervalMs ) );

    return {
        id    : checkInterval,
        delay : intervalMs
    };
}
Interlude.prototype.setIntervalCheck = setIntervalCheck;


/**
 * Interlude - Run Interval Check
 * 
 * Every certain amount of seconds, run a check to see what's available.
 * 
 * @since 1.0.0
 * 
 * @return bool - whether or not there are pending resources
 */
function runIntervalCheck( interval, resources, render ) {
    if ( interval.count === 0 || resources.pending > 0 ) {
        interval.setCount( interval );

        var pendingResourcesCount = 0;
        resources.targets.map( function( target ) {
            if ( ! target.isLoaded ) {
                var isAvailable = resources.isAvailable( target );
                if ( ! isAvailable ) {
                    pendingResourcesCount++;
                    render.waiting( target );
                }
            }
        }.bind( this ) );
        resources.pending = pendingResourcesCount;
    }
    return ( resources.pending > 0 );
}
Interlude.prototype.runIntervalCheck = runIntervalCheck;


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
 * @param object target
 * @return bool
 */
function isResourceAvailable( target ) {
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
Interlude.prototype.isResourceAvailable = isResourceAvailable;

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
        jQuery( '<span class="wpi-Waiting-message">' + this.waitingMessage + '</span> ' ).insertAfter( element );
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


// Export functions for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports.setIntervalCheck = setIntervalCheck;
    module.exports.runIntervalCheck = runIntervalCheck;
    module.exports.isResourceAvailable = isResourceAvailable;
}