"use strict";

const boom = require( "boom" );

module.exports.register = async server => {
   server.route( {
       method: "GET",
       path: "/api/material",
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
                   const res = await db.material.getMaterial( userId );

                   // return the recordset object
                   return res.recordset;
               } catch ( err ) {
                   server.log( [ "error", "api", "material" ], err );
                   return boom.boomify( err );
               }
           }
       }
   } );

   server.route( {
    method: "POST",
    path: "/api/material",
    config: {
        auth: {
            strategy: "session",
            mode: "required"
        },
        handler: async request => {
            try {
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;

                const {  startDate, endDate } = request.payload;

                console.log("startDate",startDate);

               // const { startDate, startTime, endDate, endTime, title, description } = request.payload;
               // const res = await db.events.addEvent( { userId, startDate, startTime, endDate, endTime, title, description } );
                
               // execute the query
               const res = await db.material.getMaterial( { userId, startDate, endDate } );

               return res.recordset;
            } catch ( err ) {
                server.log( [ "error", "api", "events" ], err );
                return boom.boomify( err );
            }
        }
    }
} );
  

  
};