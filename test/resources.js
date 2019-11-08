const expect = require( 'chai' ).expect;
const jsdom = require( 'jsdom' );

const resources = require( '../public/js/interlude.js' ).resources;


beforeEach( function () {
    const { JSDOM } = jsdom;
    const newDom = new JSDOM(``);
    window = newDom.window;
    document = window.document;

    document.body.innerHTML = '<a href="/test" class="wpi-target">Test 1</a><a href="/test" class="wpi-target">Test 1</a>';

    elements = document.getElementsByClassName( 'wpi-target' );
    targets = resources.getTargets( elements );

    targetsMock = [
        {
            key     : 0,
            element : elements[0],
            status  : 0,
        },
        {
            key     : 1,
            element : elements[1],
            status  : 0,
        },
    ];

} );

describe( 'resources', function() {
    describe( 'getTargets', function() {

        it( 'should return an array of more than one object', function() {
            expect( targets ).to.be.lengthOf( 2 );
            expect( targets[0] ).to.be.a( 'object' );
        } );

        it( 'should match expected structure of target objects', function() {
            expect( targets ).to.deep.equal( targetsMock );
        } );

    } );

    describe( 'hasPending', function() {

        it( 'should return true if any targets have status of 0', function() {
            var hasPending = resources.hasPending( targets );
            expect( hasPending ).to.be.true;
        } );

    } );
} );
