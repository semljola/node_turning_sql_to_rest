"use strict";

const utils = require( "../utils" );

const register = async ( { sql, getConnection } ) => {
   // read in all the .sql files for this folder
   const sqlQueries = await utils.loadSqlQueries( "material" );

   const getMaterial = async ( { userId, startDate, endDate } ) => {

       // get a connection to SQL Server
       const cnx = await getConnection();

       // create a new request
       const request = await cnx.request();

       // configure sql query parameters
       request.input( "userId", sql.VarChar( 50 ), userId );
       request.input( "startDate", sql.Date, startDate );
       request.input( "endDate", sql.Date, endDate );

       // return the executed query
       var json = request.query( sqlQueries.getMaterial ).then(
        function(result){
          return result;
        });
 
       return json;
   };

   return {
      getMaterial
   };
};

module.exports = { register };