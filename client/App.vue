<template>
 <div id="app">
   <h1>{{ msg }}</h1>
   <div class="row" id="customerList">
       <h2>List of Quant's List</h2>
       <table v-if="hasCustomers">
           <thead>
               <tr>
                <th>KundeNr</th>
                <th>KundeNavn</th>
                <th>FR_Adresse</th>
                <th>Kontakt</th>
                <th> RecDato</th>
                <th>IdBaksystem</th>
                <th>ePostAdresse</th>
                <th>Firmakunde</th>
               </tr>
           </thead>
           <tbody>
                <tr v-for="customer in customers" :key="customer.KundeNr">
                <th>{{customer.KundeNr}}</th>
                <th>{{customer.KundeNavn}}</th>
                <th>{{customer.FR_Adresse}}</th>
                <th>{{customer.Kontakt}}</th>
                <th>{{customer.RecDato}}</th>
                <th>{{customer.IdBaksystem}}</th>
                <th>{{customer.ePostAdresse}}</th>
                <th>{{customer.Firmakunde}}</th>

               </tr>
           </tbody>
       </table>
       <p v-if="noCustomers">No events yet!</p>
   </div>
  <div class="row" id="invoiceEdit">
       <h2>Select company and start & end date for invoice</h2>
       <form class="col s12" @submit.prevent="getMaterial">
           <div class="row">
               <div class="input-field col s6">
                   <span class="datetime-label">Start Date</span>
                   <datetime v-model="startDate" input-id="startDate" type="date" value-zone="local" input-class="validate"></datetime>
                   <!-- <label for="startDate" class="datetime-label">Start Date</label> -->
               </div>
               <div class="input-field col s6">
                   <span class="datetime-label">End Date</span>
                   <datetime v-model="endDate" input-id="endDate" type="date" value-zone="local" input-class="validate"></datetime>
                   <!-- <label for="endDate">End Date</label> -->
               </div>
           </div>
           <button id="materialSubmit" class="btn" type="submit"><i class="material-icons right">send</i>Submit</button>

       </form>
  </div>

   <div class="row" id="materialList">
       <h2>Material</h2>
       <table v-if="hasMaterial">
           <thead>
               <tr>
                <th>KundeNr</th>
                <th>KundeNavn</th>
                <th>FR_Adresse</th>
                <th>Kontakt</th>
                <th> RecDato</th>
                <th>IdBaksystem</th>
                <th>ePostAdresse</th>
                <th>Firmakunde</th>
               </tr>
           </thead>
           <tbody>
                <tr v-for="customer in customers" :key="customer.KundeNr">
                <th>{{customer.KundeNr}}</th>
                <th>{{customer.KundeNavn}}</th>
                <th>{{customer.FR_Adresse}}</th>
                <th>{{customer.Kontakt}}</th>
                <th>{{customer.RecDato}}</th>
                <th>{{customer.IdBaksystem}}</th>
                <th>{{customer.ePostAdresse}}</th>
                <th>{{customer.Firmakunde}}</th>

               </tr>
           </tbody>
       </table>
       <p v-else>No material yet!</p>
   </div>



 </div>
</template>

<script>
import axios from "axios";
import * as M from "materialize-css";
import moment from "moment";

export default {
 name: "app",
 computed: {
   hasCustomers() {
     return this.isLoading === false && this.customers.length > 0;
   },
   noCustomers() {
     return this.isLoading === false && this.customers.length === 0;
   }
 },
 data() {
   return {
     isLoading: true,
        KundeNr: "",
        KundeNavn: "",
        FR_Adresse: "",
        Kontakt: "",
        RecDato: "",
        IdBaksystem: "",
        ePostAdresse: "",
        Firmakunde: "",
   };
 },
 methods: {
    getMaterial() {
     const material = {
       startDate: this.startDate ? moment( this.startDate ).format( "YYYY-MM-DD" ) : null,
       endDate: this.endDate ? moment( this.endDate ).format( "YYYY-MM-DD" ) : null,
       KundeNr: this.KundeNr
     };
     axios
       .post( "c", event )
       .then( () => {
         this.startDate = "";
         this.endDate = "";
         this.KundeNr = "";
         //this.loadEvents();
       } )
       .catch( err => {
         this.msg = err.message;
         console.log( err );
       } );
   },
   formatDate( d ) {
     return d ? moment.utc( d ).format( "MMM D, YYYY" ) : "";
   },
   formatTime( t ) {
     return t ? moment( t ).format( "h:mm a" ) : "";
   },
    formatCustomers( customers ) {
     return customers.map( customer => {
       return {
        KundeNr: customer.KundeNr,
        KundeNavn: customer.KundeNavn,
        FR_Adresse: customer.FR_Adresse,
        Kontakt: customer.Kontakt,
        RecDato: this.formatDate( customer.RecDato ),
        IdBaksystem: customer.IdBaksystem,
        ePostAdresse: customer.ePostAdresse,
        Firmakunde: customer.Firmakunde,
       };
     } );
   },
   loadCustomers() {
     axios
       .get( "/api/customers" )
       .then( res => {
         this.isLoading = false;
         this.customers = this.formatCustomers( res.data );
       } )
       .catch( err => {
         this.msg = err.message;
         console.log( err );
       } );
   }
 },
 mounted() {
   return this.loadCustomers();
 }
};
</script>

<style lang="css">
#app h2 {
 font-size: 2rem;
}
.datetime-label {
 color: #4e9e36;
 font-size: .8rem;
}
</style>