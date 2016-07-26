'use strict';

//Loading Dependencies
var FilterModel = require('../src/models/FilterModel');
var ContactCollection = require('../src/collections/ContactCollection');
var AppRouter = require('../src/utils/AppRouter');
var EventBus = require('../src/utils/EventBus');

describe('app:', function() {
    
    beforeEach(function() {

        this.sandbox = sinon.sandbox.create();
        
        this.contactCollection = new ContactCollection(null, {
            filterModel: ''
        });
    });
    
    afterEach(function() {
        this.sandbox.restore();
    });
    
    context('setupDataStore', function() {
        
        it('should instantiate the filtermodel', function() {
            var filterModel = new FilterModel();
            
            expect(typeof(filterModel)).to.equal('object');
        });
        
        it('should instantiate the contactCollection', function() {
            
            expect(typeof(this.contactCollection)).to.equal('object');
        });
    });

    
    context('onDelete', function() {
        
        it('should trigger the app router', function() {
            var appRouter = new AppRouter();
            
            var appRouterResponse = appRouter.navigate('/', {trigger: true});
            expect(typeof(appRouterResponse)).to.equal('object');
        });
    });
   
});