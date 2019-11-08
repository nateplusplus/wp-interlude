const expect = require( 'chai' ).expect;
const jsdom = require( 'jsdom' );


beforeEach( function () {
    const { JSDOM } = jsdom;
    const newDom = new JSDOM(``);
    window = newDom.window;

    // Stub interval data
    interval = {
        count   : 0,
        seconds : 1,
        limit   : 2,
    };

    resources = {
        pending: 1,
    };
} );

describe( 'interval', function() {
    describe( 'getMs', function() {

        var getMs = require( '../public/js/interlude.js' ).interval.getMs;
    
        it( 'should return value in milliseconds', function() {
            var milliseconds = getMs( interval.seconds );
            expect( milliseconds ).to.equal( interval.seconds * 1000 );
        } );
    } );
    
    describe( 'intervalShouldRun', function() {
    
        var intervalShouldRun = require( '../public/js/interlude.js' ).interval.intervalShouldRun;
    
        it( 'should return true while resources are still pending', function() {
            expect( intervalShouldRun( resources ) ).to.be.true;
        } );
        it( 'should return false when no resources are pending', function() {
            resources.pending = 0;
            expect( intervalShouldRun( resources ) ).to.be.false;
        } );
    } );
} );
