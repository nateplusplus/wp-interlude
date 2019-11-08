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
    this.waitingMessage = options.waitingMessage || 'Please wait';
    this.waitingClass = options.waitingClass || 'wpi-Waiting';

    // Data
    this.version = '2.0.0';
}


var interval = {
    getMs : function( seconds ) {
        if ( ! isNaN( seconds ) ) {
            return seconds * 1000;
        } else {
            console.error( new Error( '"Seconds" value is not a number.' ) );
        }
    },
    intervalShouldRun : function( resources ) {
        if ( resources ) {
            if ( resources.hasOwnProperty( 'pending' ) ) {
                if ( ! isNaN( resources.pending ) ) {
                    return resources.pending > 0;
                } else {
                    console.error( new Error( '"Pending" value is not a number.' ) );
                }
            } else {
                console.error( new Error( '"Pending" property does not exist.' ) );
            }
        } else {
            console.error( new Error( 'resources object not provided.' ) );
        }
    }
}

var resources = {
    getTargets : function( elements ) {
        var targets = [];
        if ( elements ) {
            for ( var i = 0; i < elements.length; i++ ) {
                var target = {
                    key      : i,
                    element  : elements[i],
                    status   : 0,
                };
                targets.push( target );
            }
        }
        return targets;
    },
    hasPending : function( targets ) {
        var pendingTargets = targets.map( function( target ) {
            if ( target.pending === 0 ) {
                return target.key;
            }
        } );

        return ( pendingTargets.length > 0 );
    }
}


// Export functions for testing
if ( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
    module.exports.interval = interval;
    module.exports.resources = resources;
}
