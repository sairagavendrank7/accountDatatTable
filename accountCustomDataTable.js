import { LightningElement } from 'lwc';
import combobox from './combobox.html'
import lightningDataTable from 'lightning/datatable'
export default class AccountCustomDataTable extends lightningDataTable {

    

    static customTypes = {
        picklist: {
            template:combobox ,
            typeAttributes: ['options','value']
        }
    };
    
}
