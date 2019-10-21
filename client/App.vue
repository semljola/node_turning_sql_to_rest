<template>
 <div id="app">
   <h1>{{ msg }}</h1>
  <div class="gg-card post no-image" id="invoiceEdit">
       <h2>1. Specify input details</h2>
       <form class="col s12" @submit.prevent="getInvoiceDetail">
           <div class="row">
               <div class="input-field col s6">
                 <span class="datetime-label">Select client</span>
                 <select v-if="hasCustomers" v-model="selected" style="display:inline">
                  <option v-for="customer in customers" v-bind:key="customer.KundeNr">
                    {{ customer.KundeNavn }} [KundeNr:{{ customer.KundeNr }}, Kontakt:{{ customer.Kontakt }}]
                  </option>
                </select>
              </div> 
               <div class="input-field col s3">
                   <span class="datetime-label">Start Date</span>
                   <datetime v-model="startDate" input-id="startDate" type="date" value-zone="local" input-class="validate"></datetime>
               </div>
               <div class="input-field col s3">
                   <span class="datetime-label">End Date</span>
                   <datetime v-model="endDate" input-id="endDate" type="date" value-zone="local" input-class="validate"></datetime>
               </div>
           </div>
           <button id="InvoiceDetailSubmit" class="btn" type="submit"><i class="material-icons right">send</i>Submit</button>
       </form>
  </div>

   <div class="row" id="hoursList">
       <h2 v-if="hasHours">Hours</h2>
       <table v-if="hasHours" class="striped">
           <thead>
               <tr>
                <th>IdOrdre</th>
                <th>Info</th>
                <th>Antall</th>
               </tr>
           </thead>
           <tbody>
                <tr v-for="hour in hours" :key="hour.IdOrdre">
                <th>{{hour.IdOrdre}}</th>
                <th>{{hour.Info}}</th>
                <th>{{hour.Antall}}</th>
               </tr>
           </tbody>
       </table>
   </div>

   <div class="row" id="materialList">
       <h2 v-if="hasMaterial">Material</h2>
       <table v-if="hasMaterial">
           <thead>
               <tr>
                <th>IdOrdre</th>
                <th>Dato</th>
                <th>Beskrivelse</th>
                <th>Antall</th>
                <th>Pris</th>
               </tr>
           </thead>
           <tbody>
                <tr v-for="theMaterial in material" :key="theMaterial.IdOrdre">
                <th>{{theMaterial.IdOrdre}}</th>
                <th>{{theMaterial.Dato}}</th>
                <th>{{theMaterial.Beskrivelse}}</th>
                <th>{{theMaterial.Antall}}</th>
                <th>{{theMaterial.Pris}}</th>
               </tr>
           </tbody>
       </table>
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
   hasMaterial() {
     return this.isLoading === false && this.material.length > 0;
   },
   hasHours() {
     return this.isLoading === false && this.hours.length > 0;
   },
   noCustomers() {
     return this.isLoading === false && this.customers.length === 0;
   }
 },
 data() {
   return {
    isLoading: true,
    customers:[],
    material:[],
    hours:[],
    selected: '',
    sortColumn: ''
   };
 },
 methods: {
   "sortTable": function sortTable(col) {
     console.log('sort');
      if (this.sortColumn === col) {
        this.ascending = !this.ascending;
      } else {
        this.ascending = true;
        this.sortColumn = col;
      }

      var ascending = this.ascending;

      this.rows.sort(function(a, b) {
        if (a[col] > b[col]) {
          return ascending ? 1 : -1
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1
        }
        return 0;
      })
    },
    getInvoiceDetail(){
      this.getHours();
      this.getMaterial();
    },
    getMaterial() {
       const myInput = {
       clientId:this.selected,
       startDate: this.startDate ? moment( this.startDate ).format( "YYYY-MM-DD" ) : null,
       endDate: this.endDate ? moment( this.endDate ).format( "YYYY-MM-DD" ) : null,
     };
     axios
       .post( "/api/material", myInput )
       .then( res => {
         this.isLoading = false;
         this.material = this.formatMaterial( res.data );
       } )
       .catch( err => {
         this.msg = err.message;
         console.log( err );
       } );
   },
    getHours() {
       const myInput = {
       clientId:this.selected,
       startDate: this.startDate ? moment( this.startDate ).format( "YYYY-MM-DD" ) : null,
       endDate: this.endDate ? moment( this.endDate ).format( "YYYY-MM-DD" ) : null,
     };
     axios
       .post( "/api/hours", myInput )
       .then( res => {
         this.isLoading = false;
         this.hours = this.formatHours( res.data );
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
   formatHours( hours ) {
     return hours.map( hour => {
       return {
        IdOrdre: hour.IdOrdre,
        Beskrivelse: hour.Info,
        Antall: hour.Antall
       };
     } );
   },
   formatMaterial( material ) {
     return material.map( theMaterial => {
       return {
        IdOrdre: theMaterial.IdOrdre,
        Dato: this.formatDate( theMaterial.Dato ),
        Beskrivelse: theMaterial.Beskrivelse,
        Antall: theMaterial.Antall,
        Pris: theMaterial.Pris
       };
     } );
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

table {

}

</style>