const expect = require( 'chai' ).expect;
const jsdom = require( 'jsdom' );

const { JSDOM } = jsdom;
const newDom    = new JSDOM(``);

window   = newDom.window;
document = window.document;

document.body.innerHTML = '<a href="/test" class="wpi-target">Test 1</a><a href="/test" class="wpi-target">Test 1</a>';

const Interlude = require( '../public/js/interlude.js' ).interlude;

// Setup interlude instance
interludeOptions = {
    selector        : '.wpi-target',
    intervalSeconds : 1,
    intervalLimit   : 2,
    waitingMessage  : 'Testing'
};

wpinterlude = new Interlude( interludeOptions );

beforeEach( function () {
    const { JSDOM } = jsdom;
    const newDom = new JSDOM(``);
    window = newDom.window;
} );

describe( 'render', function() {
    describe( 'waitingClass', function() {
        it( 'should add waiting class to each selected elements', function() {
            wpinterlude.render.waitingClass();
            var element = document.querySelector( interludeOptions.selector );
            expect( [ ... element.classList ] ).to.contain( 'wpi-Waiting' );
        } );
    } );
    describe( 'waitingMessage', function() {
        it( 'should return generated HTML string for waiting message' );
    } );
} );