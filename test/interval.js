const expect = require( 'chai' ).expect;
const jsdom = require( 'jsdom' );
const Interlude = require( '../public/js/interlude.js' ).interlude;


// Setup interlude instance
interludeOptions = {
   intervalSeconds: 1,
   intervalLimit: 2
};

beforeEach( function () {
    const { JSDOM } = jsdom;
    const newDom = new JSDOM(``);
    window = newDom.window;
} );

describe( 'interval', function() {
    describe( 'getMs', function() {
        var wpinterlude = new Interlude( interludeOptions );
        it( 'should return value in milliseconds', function() {
            var milliseconds = wpinterlude.interval.getMs();
            expect( milliseconds ).to.equal( interludeOptions.intervalSeconds * 1000 );
        } );
    } );
    describe( 'intervalShouldRun', function() {
        var wpinterlude = new Interlude( interludeOptions );
        var intervalShouldRun = wpinterlude.interval.intervalShouldRun;
        it( 'should return true while resources are still pending', function() {
            wpinterlude.resources.pending = 1;
            expect( intervalShouldRun() ).to.be.true;
        } );
        it( 'should return false when no resources are pending', function() {
            wpinterlude.resources.pending = 0;
            expect( intervalShouldRun() ).to.be.false;
        } );
    } );
} );
