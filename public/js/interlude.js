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
    var self = this;

    // Settings
    this.selector = options.selector || '';
    this.waitingMessage = options.waitingMessage || 'Please wait';

    // Data
    this.version = '2.0.0';
    this.resources = {
        pending : 0
    }
    this.interval = {
        seconds : options.intervalSeconds || 0,
        limit   : options.intervalLimit || 0,
        count   : 0,
        getMs   : function() {
            if ( ! isNaN( this.seconds ) ) {
                return this.seconds * 1000;
            } else {
                console.error( new Error( '"Seconds" value is not a number.' ) );
            }
        },
        intervalShouldRun : function() {
            if ( self.resources ) {
                if ( self.resources.hasOwnProperty( 'pending' ) ) {
                    if ( ! isNaN( self.resources.pending ) ) {
                        return self.resources.pending > 0;
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
    };
    this.resources = {
        targets : [],
        getTargets : function() {
            var elements = document.querySelectorAll( self.selector );
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
        hasPending : function() {
            var pendingTargets = this.targets.map( function( target ) {
                if ( target.pending === 0 ) {
                    return target.key;
                }
            } );
            return ( pendingTargets.length > 0 );
        }
    };
    this.render = {
        waitingClass : function() {
            var targets = self.resources.getTargets();
            for ( var i = 0; i < targets.length; i++ ) {
                var element = targets[ i ].element;
                if ( ! element.classList.contains( 'wpi-Waiting' ) ) {
                    element.classList.add( 'wpi-Waiting' );
                }
            }
        },
        waitingMessage  : function() {
            return '<span class="wpi-Waiting-message">' + this.waitingMessage + '</span>';
        }
    };

}


// Export functions for testing
if ( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
    module.exports.interlude = Interlude;
}
