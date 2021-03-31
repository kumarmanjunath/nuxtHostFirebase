import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';

import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class YachtbookingService {
  email="";
 
  chk=false;
 booking_source_id=""; mplatform=""; amount="";seating="";anchoringhrs="";sailoringhrs="";

  constructor(private firestore: AngularFirestore,private datePipe: DatePipe) {
  
   }  
 

  itemList: any = undefined;
   

  initializeFormGroup() {

  
   
  }
  
  getEmployees(frmdate,todate,bstatus) {
   // alert(bstatus)
   
    this.itemList = this.firestore.collection('yacht_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).orderBy('createdon', 'desc'));
    if(bstatus!="All")
    {
      //alert("here")
    this.itemList = this.firestore.collection('yacht_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("status", "==", bstatus).orderBy('createdon', 'desc'));  
    }
    if(frmdate=="")
    {
         
    this.itemList = this.firestore.collection('yacht_booking', ref => ref.orderBy('createdon', 'desc'));
    if(bstatus!="All")
    this.itemList = this.firestore.collection('yacht_booking', ref => ref.where("status", "==", bstatus).orderBy('createdon', 'desc'));
    }
  
 
    return this.itemList.snapshotChanges();
  }
  deleteEmployee(id: string) {
    this.itemList.remove(id);
  }

  populateForm(itm) {  
  //  alert(itm.status);
    //this.form.get('status').setValue(itm.status);
   
    this.email=itm.email;
  
    this.booking_source_id=itm.booking_source_id;
    this.mplatform=itm.mplatform;
    this.seating=itm.minpeople+" - "+itm.maxpeople;
    this.anchoringhrs=itm.anchoringhrs;
    this.sailoringhrs=itm.sailoringhrs;
   
    this.amount=itm.yachtprice;
  }
}
