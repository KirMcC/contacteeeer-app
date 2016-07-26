'use strict';

//Loading dependencies
var GridView = require('../../src/views/GridView');
var EventBus = require('../../src/utils/EventBus');
var dataStore = require('../../src/utils/dataStore');
var $ = require('jquery');

describe('GridView:', function() {
    
    beforeEach(function() {
        this.sandbox = sinon.sandbox.create();
        
        this.gridView = new GridView();
        dataStore =
            [{
                "id": 1,
                "gender": "Female",
                "firstName": "Kathryn",
                "lastName": "Larson",
                "department": "Sales Associate",
                "email": "klarson0@omniture.com"
            }]
        
    });
    
    afterEach(function() {
       this.sandbox.restore();
    });
    
    context('gridView instantiation', function(){
        
        //Checks if the view tagName uses the UL element
        it('should create a list element', function() {
            expect(this.gridView.el.nodeName).to.equal("UL");
        });
        
        //Checks the classname being used is js-grid-view
        it('should have a class of js-grid-view', function() {
           expect($(this.gridView.el).hasClass('js-grid-view')).to.be.true;
        });
        
    });
    context('gridView event calls:', function() {
        
        it('should call method onFilterChanged collection filter', function() {
            this.gridView.off();
            EventBus.off()
        
            var onFilterChangedStub = sinon.stub(this.gridView, 'onFilterChanged');

            this.gridView.initialize();

            EventBus.trigger(EventBus.eventKeys.COLLECTION_FILTERED);
            expect(onFilterChangedStub.callCount).to.equal(1);
        });
        
        it('should call updateGrid when UPDATE_GRID is triggered', function() {
            this.gridView.off();
            EventBus.off()
        
            var updateGridStub = sinon.stub(this.gridView, 'updateGrid');

            this.gridView.initialize();

            EventBus.trigger(EventBus.eventKeys.UPDATE_GRID);
            expect(updateGridStub.callCount).to.equal(1);
        });
    
    });
    
    it('should call the remove method on event', function() {
        var onDispose = sinon.spy(this.gridView, 'dispose');
        
        this.gridView.dispose();
        expect(onDispose.callCount).to.equal(1);
    });
});