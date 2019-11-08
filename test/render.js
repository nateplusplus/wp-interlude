const expect = require( 'chai' ).expect;
const jsdom = require( 'jsdom' );


beforeEach( function () {
    const { JSDOM } = jsdom;
    const newDom = new JSDOM(``);
    window = newDom.window;
} );

describe( 'render', function() {
    describe( 'buildWaitingMessage', function() {
        it( 'should return generated HTML string for waiting message' );
    } );
} );