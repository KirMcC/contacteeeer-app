'use strict';

//Loading Dependencies
var ContactCollection = require('../../src/collections/ContactCollection');
var ContactModel = require('../../src/models/ContactModel');
var FilterModel = require('../../src/models/FilterModel');
var EventBus = require('../../src/utils/EventBus');
var AppRouter = require('../../src/utils/AppRouter');

var testFilterResponse = function(response, keyName){
    expect(typeof(response)).to.equal('object');
    expect(response[0].attributes.gender).to.equal(keyName);
};

describe('ContactCollection:', function() {
    
    
    beforeEach(function() {
        this.sandbox = sinon.sandbox.create();
        
        this.contactData =
            [{
                "id": 1,
                "gender": "Female",
                "firstName": "Kathryn",
                "lastName": "Larson",
                "department": "Sales Associate",
                "email": "klarson0@omniture.com"
              },
              {
                "id": 2,
                "gender": "Male",
                "firstName": "Catherine",
                "lastName": "Watkins",
                "department": "Product Engineer",
                "email": "cwatkins1@lulu.com"
              }];
        this.filterModel = new FilterModel();
        this.contactCollection = new ContactCollection(this.contactData, {
            filterModel: this.filterModel
        });
    });
    
    afterEach(function() {
        this.sandbox.restore();
    });
    
    //Make sures the models from the collection uses contactmodel constructor
    it('Should use the contact model', function() {
      expect(this.contactCollection.at(0)).to.be.an.instanceof(ContactModel);
    });
    
    //The collections needs to have url endpoint
    it('Should have an api end point', function() {
        expect(this.contactCollection.url).to.exist;
    });
    
    //onFilterChange
    context('onFilterChange', function() {
        
        it('should find the selectedFilter from filter model', function() {
            var onFilterChangeResponse = this.contactCollection.onFilterChange();
            
            expect(typeof(onFilterChangeResponse)).to.equal('object');
        });
    });

    //applyFilter method
    context('applyFilter', function() {
        
        it('should return Female contacts', function() {
            var filterData = {gender: "Female"};
            var applyFilterResponse = this.contactCollection.applyFilter(filterData);
            
            expect(applyFilterResponse).to.have.length.above(0);
            testFilterResponse(applyFilterResponse, 'Female');
        });
        
        it('should return Male contacts', function() {
            var filterData = {gender: 'Male'};

            var applyFilterResponse = this.contactCollection.applyFilter(filterData);
            
            expect(applyFilterResponse).to.have.length.above(0);
            testFilterResponse(applyFilterResponse, 'Male');
        });
    
        it('should return no contact found message if no data matching filter is found', function() {
            var filterData = {gender: "male"};

            var applyFilterResponse = this.contactCollection.applyFilter(filterData);
            expect(typeof(applyFilterResponse)).to.equal('string');
        });
    });
    
    //getModalType method
    context('getModalType', function() {
        it('should output an object with delete key name for delete modal', function() {
            var modalArray = ['delete', 1];
        
            var modalDataResponse = this.contactCollection.getModalType(modalArray);
            expect(typeof(modalDataResponse)).to.equal('object');
            expect(modalDataResponse.delete).to.equal('delete');
        });
        
        it('should output an object with edit key name for edit modal', function() {
            var modalArray = ['edit', 1];
        
            var modalDataResponse = this.contactCollection.getModalType(modalArray);
            expect(typeof(modalDataResponse)).to.equal('object');
            expect(modalDataResponse.edit).to.equal('edit');
    });
    
        it('should output an object with add key name for add modal', function() {
            var modalArray = ['add'];

            var modalDataResponse = this.contactCollection.getModalType(modalArray);
            expect(typeof(modalDataResponse)).to.equal('object');
            expect(modalDataResponse.add).to.equal('add');
        });
    });
    
    context('onProfileDel', function() {
        
        
        it('should get correct contact matching id', function() {
            var profileID = 1;
            
            var getIdContact = this.contactCollection.get(profileID);
            expect(typeof(getIdContact)).to.equal('object');
            expect(getIdContact.id).to.equal(profileID);
            
        });
         
    });
    
    
    context('contactCollection event calls', function() {
        
        //getModalType
        it('should call getModalType when event fires', function() {
            this.contactCollection.off
            EventBus.off();
            
            var getModalTypeStub = this.sandbox.stub(this.contactCollection, 'getModalType');
            
            this.contactCollection.bindListeners();
            
            EventBus.trigger(EventBus.eventKeys.MODAL_STRING, ['delete', 1]);
            expect(getModalTypeStub.callCount).to.equal(1);
        });
        
        //onProfileDelete method
        it('should call onProfileDel when event fires', function() {
            this.contactCollection.off
            EventBus.off();

            var onProfileDelStub = this.sandbox.stub(this.contactCollection, 'onProfileDel');
            
            this.contactCollection.bindListeners();
            
            EventBus.trigger(EventBus.eventKeys.DEL_PROFILE, 1);
            expect(onProfileDelStub.callCount).to.equal(1);
        });
    
        //onReset
        it('should fire the reset method on collection reset event', function() {
            this.contactCollection.off();
            
            var onResetStub = this.sandbox.stub(this.contactCollection, 'onReset');
            
            this.contactCollection.bindListeners();
            
            this.contactCollection.reset();
            expect(onResetStub.callCount).to.equal(1);
            
        });
        
        //Call onFilterChange
        it('should fire the onFilterChange method when filtermodel changes', function() {
            this.contactCollection.off();
            
            var onfilterChangeStub = this.sandbox.stub(this.contactCollection, 'onFilterChange');
            
            this.contactCollection.bindListeners();
            
            this.contactCollection.filterModel.set('selectedFilterData', {gender: 'Female'});
            expect(onfilterChangeStub.callCount).to.equal(1);
        });
        
    });
    
    context('contactCollection fetch', function() {
        
        beforeEach(function() {
            this.server = sinon.fakeServer.create();
            this.appRouter = new AppRouter();
        });
        
        afterEach(function() {
            this.server.restore();
        });
       
        it('should fetch all of the data in the collection', function() {
            this.server.respondWith("GET", "/contacts",
                [200, {"Content-Type" : "application/json"}, '[{"name":"paul", "id":"123" }, {"name":"kirsty", "id":"12" }]' ]);
            
            var fetch = this.contactCollection.fetch({
                success: function(model, response, options) {
                }
            });
            this.server.respond();
            
            expect(typeof(fetch.responseJSON)).to.equal('object');
            expect(fetch.responseJSON.length).to.be.at.least(1);
            
        });
    });
});



