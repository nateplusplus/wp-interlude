const expect = require( 'chai' ).expect;
const jsdom = require( 'jsdom' );

const { JSDOM } = jsdom;
const newDom = new JSDOM(``);
window = newDom.window;
document = window.document;

document.body.innerHTML = '<a href="/test" class="wpi-target">Test 1</a><a href="/test" class="wpi-target">Test 1</a>';

const Interlude = require( '../public/js/interlude.js' ).interlude;

// Setup interlude instance
interludeOptions = {
    selector        : '.wpi-target',
    intervalSeconds : 1,
    intervalLimit   : 2
};

wpinterlude = new Interlude( interludeOptions );

elements = document.getElementsByClassName('wpi-target');

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

describe( 'resources', function() {
    describe( 'getTargets', function() {

        var targets = wpinterlude.resources.getTargets();

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
            wpinterlude.resources.targets = targetsMock;
            var hasPending = wpinterlude.resources.hasPending();
            expect( hasPending ).to.be.true;
        } );

    } );
} );
