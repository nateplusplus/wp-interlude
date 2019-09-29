jQuery( document ).ready( function() {

    var options = {};
    if ( window.wpInterludeOptions ) {
        options = wpInterludeOptions;
    }

    new Interlude( options );
} );