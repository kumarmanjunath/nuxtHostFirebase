import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';

import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CdrivebookingService {
  email="";
  istype="";
  chk=false;
  pickup_address=""; booking_source_id=""; mplatform=""; days="";  price_per_day="";
    basic_rental="";   extra_kms="";  charge_per_exta_km="";  extra_kms_rental="";
    extra_hrs="";  charge_per_exta_hr="";  extra_hrs_rental="";
    coupon_code="";   coupon_discount_percentage="";   coupon_discount="";
    driver_allowance_per_day="";   driver_allowance_charges=""; airport_type="";  deposit="";  amount="";
    agent_name=""; creditused="";
  constructor(private firestore: AngularFirestore,private datePipe: DatePipe) {
    this.istype="Chauffeur";
   }  
 

  itemList: any = undefined;
   

  initializeFormGroup() {

  
   
  }

  getEmployees(frmdate,todate,bstatus,pid,ctype) {

let strqry="ref";
if(frmdate!="")
{ 
  strqry+='.where("createdon", ">=", '+frmdate+').where("createdon", "<=", '+todate+
  ')';
}
if(pid!=0)
{
  strqry+='.where("package_id", "==", '+pid+')'; 
}
if(ctype=="Amex")
{
  strqry+='.where("isamexuser", "==", true)'; 
}
if(ctype=="ICICI")
{
  strqry+='.where("icicicoupon", "==", true)'; 
}
if(bstatus=="Pending")
{
  strqry+='.where("status", "==", "Pending")'; 
}
if(bstatus=="Done")
{
  strqry+='.where("status", "==", "Done")'; 
}
strqry+=".orderBy('createdon', 'desc')"; 
this.itemList = this.firestore.collection('cdrive_booking', ref =>this[strqry]);
//this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).orderBy('createdon', 'desc'));
alert(strqry)
    return this.itemList.snapshotChanges();
  }
  deleteEmployee(id: string) {
    this.itemList.remove(id);
  }

  populateForm(itm) {  
  //  alert(itm.status);
    //this.form.get('status').setValue(itm.status);
   
    this.chk=itm.airport;
    if(this.chk==true)
    { this.istype="Airport";}
    this.email=itm.email;
    this.pickup_address=itm.pickup_address;
    this.airport_type=itm.selectattype;
    this.booking_source_id=itm.booking_source_id;
    this.mplatform=itm.mplatform;
    this.days=itm.days;
    this.price_per_day=itm.price_per_day;
    this.basic_rental=itm.basic_rental;
    this.extra_kms=itm.extra_kms;
    this.charge_per_exta_km=itm.charge_per_exta_km;
    this.extra_kms_rental=itm.extra_kms_rental;

    this.extra_hrs=itm.extra_hrs;
    this.charge_per_exta_hr=itm.charge_per_exta_hr;
    this.extra_hrs_rental=itm.extra_hrs_rental;
    this.coupon_code=itm.coupon_code;
    this.coupon_discount_percentage=itm.coupon_discount_percentage;
    this.coupon_discount=itm.coupon_discount;
    var isamexused=false;
    var creditused="";
    try
    {
   isamexused=itm.isamexused;
  
    if(isamexused==true)
    {
     creditused=itm.creditused;
    }
  }
  catch(ex)
  {}
    this.creditused=creditused;
    this.driver_allowance_per_day=itm.driver_allowance_per_day;
    this.driver_allowance_charges=itm.driver_allowance_charges;
    
    this.amount=itm.amount;
    this.agent_name=itm.agent_name;
  }
}
