'use strict';

//Loading dependencies
var Backbone = require('backbone');
var GridItemView = require('./GridItemView');
var dataStore = require('../utils/dataStore');
var EventBus = require('../utils/EventBus.js');
var AppRouter = require('../utils/AppRouter');

module.exports = Backbone.View.extend({

    //Set the element to render out as ul
    tagName: 'ul',

    //Set the view div el with following class name
    className: 'js-grid-view',

    /**
     * Set listener events to listen out for:
     * a sync event on when the collection has sync with the server,
     * a collection filtered to update the grid after filter,
     * a deletion of profile to remove name from grid.
     *
     * Set the grid items array to be empty.
     *
     */
    initialize: function() {
        this.appRouter = new AppRouter();
        this.listenTo(dataStore.contacts, 'sync', this.onCollectionSync);
        this.listenTo(EventBus, EventBus.eventKeys.COLLECTION_FILTERED, this.onFilterChanged);
        this.listenTo(EventBus, EventBus.eventKeys.UPDATE_GRID, this.updateGrid);
        //Creates a new empty array to store each item elements
        this.gridItemViews = [];
    },

    /**
     * If no data is found, set the display model with original model and refresh url.
     *
     * Loop through each model within the collection
     * Passing the models to the GridItemView
     * Push the gridItem views to the array
     * Each rendered element is then appended to the document fragment
     *
     *@return {object} - returns the view reference.
     *
     */

    render: function() {
        if (dataStore.contacts.displayModels.length === 0) {
            dataStore.contacts.displayModels = dataStore.contacts.models;
            this.appRouter.navigate('/');
        }

        var documentFragment = document.createDocumentFragment();
        dataStore.contacts.displayModels.forEach(function(contactModel) {

            var gridItem = new GridItemView({model: contactModel});
            this.gridItemViews.push(gridItem);

            documentFragment.appendChild(gridItem.render().el);
        }, this);

        this.$el.html(documentFragment);
        return this;

    },

    //When collection has sync to server, update grid
    onCollectionSync: function() {
        this.render();
    },

    /**
     * Disposes this view and each of the grid Items when called by an event listener called from
     * AppView on change page.
     *
     *@return {object} - this views reference
     */
    dispose: function() {
        //Disposes all of the models within the array
        this.gridItemViews.forEach(function(view) {
            view.dispose();
        });

        //Sets the array length to zero
        this.gridItemViews.length = 0;
        this.remove();
    },

    //When content has been filtered, update grid
    onFilterChanged: function() {
        this.render();
    },

    //When a contact has been removed from collection, update grid.
    updateGrid: function() {
        this.render();
    }
});
