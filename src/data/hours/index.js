"use strict";

const utils = require( "../utils" );

const register = async ( { sql, getConnection } ) => {
   // read in all the .sql files for this folder
   const sqlQueries = await utils.loadSqlQueries( "hours" );

   const getHours = async ( { clientId, startDate, endDate } ) => {

       // get a connection to SQL Server
       const cnx = await getConnection();

       // create a new request
       const request = await cnx.request();

       // configure sql query parameters
       request.input( "clientId", sql.VarChar( 50 ), clientId );
       request.input( "startDate", sql.Date, startDate );
       request.input( "endDate", sql.Date, endDate );

       // return the executed query
       var json = request.query( sqlQueries.getHours ).then(
        function(result){
            console.log("hours result",result);
          return result;
        });
 
       return json;
   };

   return {
      getHours
   };
};

module.exports = { register };