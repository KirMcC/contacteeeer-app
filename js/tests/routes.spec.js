'use strict';

//Loading dependencies
var Backbone = require('backbone');
var AppRouter = require('../src/utils/AppRouter');
var EventBus = require('../src/utils/EventBus');

describe('router:', function() {
    
    describe("AppRouter routes", function() {
        
      /**
        *
        * To avoid backbone history triggering an intial route check we pass the silent: true option.
        * Then pass the pushState for browser support.
        *
        */
        beforeEach(function() {
            this.router = new AppRouter();
            this.routeSpy = sinon.spy();
            
            try {
                Backbone.history.start({silent:true, pushState:true});
            } catch(e) {}

            this.router.navigate("elsewhere");
        });
        
       /**
         * Bind to route:landing event to an anonymous sinon js spy function for tracking.
         * Trigger the URL route for the landing page and check if it's been called and nothing
         * has been called with it.
         *
         */
        it("fires the index route with a blank hash", function() {
            this.router.bind('route:landing', this.routeSpy);
            this.router.navigate('', true);
            expect(this.routeSpy.called).to.be.true;
            expect(this.routeSpy.calledWith()).to.be.true;
        });
        
        /**
         * Bind to route:addContact event to an anonymous sinon js spy function for tracking.
         * Trigger the URL route for the add page and check if it's been called and nothing
         * has been called with it.
         *
         */
        it("fires the addContact route", function() {
            this.router.bind('route:addContact', this.routeSpy);
            this.router.navigate("add", true);
            expect(this.routeSpy.called).to.be.true;
            expect(this.routeSpy.calledWith()).to.be.true;
        });

        /**
         * Bind to route:editContact event to an anonymous sinon js spy function for tracking.
         * Trigger the URL route for the edit page and check if it's been called and an id
         * has been called with it.
         *
         */
        it("fires the editContact route", function() {
            this.router.bind('route:editContact', this.routeSpy);
            this.router.navigate("edit/1", true);
            expect(this.routeSpy.called).to.be.true;
            expect(this.routeSpy.calledWith("1")).to.be.true;
        });
        
        /**
         * Bind to route:viewContact event to an anonymous sinon js spy function for tracking.
         * Trigger the URL route for the view page and check if it's been called and an id
         * has been called with it.
         *
         */
        it("fires the viewContact route", function() {
            this.router.bind('route:viewContact', this.routeSpy);
            this.router.navigate("view/1", true);
            expect(this.routeSpy.called).to.be.true;
            expect(this.routeSpy.calledWith("1")).to.be.true;
        });
    });
});