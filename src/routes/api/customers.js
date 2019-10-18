"use strict";

const boom = require( "boom" );

module.exports.register = async server => {
   server.route( {
       method: "GET",
       path: "/api/customers",
       config: {
           auth: {
               strategy: "session",
               mode: "required"
           },
           handler: async request => {
               try {
                   // get the sql client registered as a plugin
                   const db = request.server.plugins.sql.client;

                   // get the current authenticated user's id
                   const userId = request.auth.credentials.profile.id;

                   // execute the query
                   const res = await db.customers.getCustomers( userId );

                   // return the recordset object
                   return res.recordset;
               } catch ( err ) {
                   server.log( [ "error", "api", "customers" ], err );
                   return boom.boomify( err );
               }
           }
       }
   } );
};