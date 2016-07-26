'use strict';

//Loading dependencies
var FilterModel = require('../../src/models/FilterModel');


describe('FilterModal:', function(){
    
    beforeEach(function() {
       this.filterData = {
         gender: "Female"
       };
    });
    
    //Checks that the selected filter data is an object
    it('should be an object for the selected filter data', function(){
        var filterModel = new FilterModel();
        
        var filterSet = filterModel.set('selectedFilterData', this.filterData);
        var filterResponse = filterSet.attributes;
        
        expect(typeof(filterResponse)).to.equal('object');
    });
    
    //Make sures each the first selectbox is an array and not left blank.
    it('should contain options for first filter', function() {
        var filterModel = new FilterModel();
        var filterOptions = filterModel.get('filterOptions');
        
        expect(typeof(filterOptions.options)).to.equal('object');
        expect(filterOptions.options.length).to.be.above(0);
    });
    
    //Make sures the second select box in filter is an array and not left blank
    it('should contain gender values for second filter', function() {
        var filterModel = new FilterModel();
        var filterOptions = filterModel.get('filterGender');
        
        expect(typeof(filterOptions)).to.equal('object');
        expect(filterOptions.length).to.be.above(0);
    });
});