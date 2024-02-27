import { LightningElement, wire ,track} from 'lwc';
import getAccountList from '@salesforce/apex/AccountControllerLWC.getAccountList'
//import updateRevenue from '@salesforce/apex/AccountControllerLWC.updateRevenue'
import { updateRecord } from 'lightning/uiRecordApi'
import { refreshApex } from '@salesforce/apex'

import {ShowToastEvent} from  'lightning/platformShowToastEvent'
export default class AccountDataTable extends LightningElement {

  
columnList=[
            
    {label :'Id',fieldName:'Id'},
    {label :'Name',fieldName:'Name'},
    {label :'Revenue',fieldName:'AnnualRevenue',editable : true},
    {
        label: 'Rating',
        type: 'picklist',
        typeAttributes: {
            options: [
                { label: 'Hot', value: 'Hot' },
                { label: 'Cold', value: 'Cold' },
                { label: 'Warm', value: 'Warm' },
        
            ],
            value: { fieldName: 'Rating' },
        },
        wrapText: true
           
     }
]
accountsList;
accList;
saveDraftValues;
wiredAccountList;

  //  response - data,error
    @wire(getAccountList)
    getAccountListHandler(response)
    {
        this.wiredAccountList=response;
        if(response.data)
        {
            this.accountsList=response.data;
            
           this.accList=this.accountsList.slice(0,10);
            console.log(this.accList);
        }
    }
 
    
    
handleSave(event){

    this.saveDraftValues=event.detail.draftValues;
        console.log(this.saveDraftValues);
        console.log(JSON.stringify(this.saveDraftValues));
        
        const fields=this.saveDraftValues?.map(draft=>{
            return { fields : draft}
        })
       console.log(fields);
        
       const fieldsFromProxy =JSON.parse(JSON.stringify(fields));
      console.log(fieldsFromProxy);

   /*this.fields.slice().map(field={
       const f=Object.assign({},d)
       return {fields : d}
   })*/

     const promises = fieldsFromProxy.map(record=>{
                      console.log(record);
                     console.log(record.fields.Id);
                     updateRecord(record);

    })
   Promise.all(promises)
    .then(res=>{
        this.dispatchEvent(new ShowToastEvent({
            title : 'Record Updation',
            message : 'Record Updated',
            variant :'success'
        }));
        this.saveDraftValues=[]
        refreshApex(this.wiredAccountList);

    })
    .catch(error=>{
        console.log(error);
     })
}
}
