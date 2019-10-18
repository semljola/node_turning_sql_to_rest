"use strict";

const events = require( "./events" );
const customers = require( "./customers" );
const material = require( "./material" );

module.exports.register = async server => {
   await events.register( server );
   await customers.register( server );
   await material.register( server );
};