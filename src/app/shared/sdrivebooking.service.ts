import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';

import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})

export class SdrivebookingService {
  email="";start_date="";start_time="";end_date="";end_time="";
  pickup_address=""; booking_source_id="";mplatform=""; days="";  price_per_day="";
    basic_rental="";   extra_kms="";  charge_per_exta_km="";  extra_kms_rental="";
    coupon_code="";   coupon_discount_percentage="";   coupon_discount="";
    delivery_charge="";   pickup_charge="";   deposit="";  amount=""; agent_name="";
    creditused="";gstamt="";gstpercent="";ltype="";
   
  itemList: any = undefined;
  txtsmsmsg="";smscusname="";smscusphone="";smscarname="";smsmid="";smspackage=""; smsfreekms="";smsbookingid="";smsbookingdate="";smsurl="";
  smsform: FormGroup = new FormGroup({
 
    drivername: new FormControl('', Validators.required),
    driverphone:new FormControl('', [Validators.required, Validators.minLength(10)]),
    driverreg: new FormControl(''),
    secretcode:new FormControl('', Validators.required),
    txtmessage: new FormControl('')
  });
  
  constructor(private firestore: AngularFirestore,private datePipe: DatePipe) {
   
   }  
 
  initializeFormGroup() {

   
  }
  applyFilter()
  {
    this.txtsmsmsg= "Dear "+this.smscusname+" \nYour Journey details\n\nBooking Id: "+this.smsbookingid+"\nChauffeur: "+this.smsform.get('drivername').value+" \nPhone: "+this.smsform.get('driverphone').value+" \nCar: "+this.smscarname+"\nPackage: "+this.smspackage+"\nVehicle No.:"+this.smsform.get('driverreg').value+"\nCustomer OTP: "+this.smsform.get('secretcode').value+"\n\nCheers\nTeam Hype"
  }
  changestatus(itm) { 
    this.smsmid=itm.id;
    this.smscusname=itm.customer_name;
this.amount=itm.amount;
  }
  getmsg(itm) { 
    const db = firebase.firestore();
  
    var random_secret=Math.floor(100000 + Math.random() * 900000);
    this.smsform.setValue({
  
      drivername: '',
      driverphone: '',
      driverreg:'',
      secretcode:random_secret,
      txtmessage: "Dear "+itm.customer_name+" \nYour Journey details\n\nBooking Id: - \nChauffeur: - \nPhone: - \nCar: - \nPackage: - \nVehicle No.: -\nCustomer OTP: "+random_secret+"\n\nCheers\nTeam Hype"
      });
      this.smscusname=itm.customer_name;
     this.smsmid=itm.id;
      this.smspackage="Self Drive";
      this.smscarname=itm.brand;
      var smsduration=itm.days; 
      if(parseFloat(smsduration)>1)
      this.smsfreekms=smsduration.toString()+" days"
      else
      this.smsfreekms=smsduration.toString()+" day"
      this.smsbookingid=itm.booking_id;
    //  alert("g "+ this.smsbookingid)
      this.smsbookingdate=itm.start_date+" "+itm.start_time;
      this.txtsmsmsg="Dear "+itm.customer_name+" \nYour Journey details\n\nChauffeur: - \nPhone: - \nCar: - \nPackage: - \nVehicle No.: -\nCustomer OTP: "+random_secret+"\n\nCheers\nTeam Hype";
  this.smscusphone=itm.phone;

  this.smsurl="";
  
  try
  {
  db.collection("customer").where("phone", "==", this.smscusphone)
  .get()
  .then((querySnapshot) => {
   // alert(querySnapshot.size)
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
      this.smsurl=doc.data().imageurl;
     // alert(this.smsurl)
      });
    }
  });
  }
  catch(ex)
  {
    this.smsurl="";
  }
  //alert( this.smsurl)
}

    getDrivers(bookingid) { 
    // alert(bookingid)
          this.itemList = this.firestore.collection('driver_transaction', ref => ref.where("bookingid", "==", bookingid));
          return this.itemList.snapshotChanges();
        }

  getEmployees(frmdate,todate,bstatus,ctype) {
  
if(ctype=="All")
{
    this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).orderBy('createdon', 'desc'));
    if(bstatus!="All")
    this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("status", "==", bstatus).orderBy('createdon', 'desc'));

    if(frmdate=="")
    {
      this.itemList = this.firestore.collection('sdrive_booking', ref => ref.orderBy('createdon', 'desc'));
      if(bstatus!="All")
      this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("status", "==", bstatus).orderBy('createdon', 'desc'));
    }
  }
 else if(ctype=="Admin" || ctype=="UPI MWeb" || ctype=="UPI Web")
 {
  this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
  if(bstatus!="All")
  this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("pendingtype", "==", ctype).where("status", "==", bstatus).orderBy('createdon', 'desc'));
  if(frmdate=="")
  {
    this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
  if(bstatus!="All")
  this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("pendingtype", "==", ctype).where("status", "==", bstatus).orderBy('createdon', 'desc'));
  }
 }
/*  else if(ctype=="User")
 {
  this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("pendingtype", "!=", "Admin").orderBy('createdon', 'desc'));
  if(bstatus!="All")
  this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("pendingtype", "!=", "Admin").where("status", "==", bstatus).orderBy('createdon', 'desc'));
  if(frmdate=="")
  {
    this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("pendingtype","!=", "Admin").orderBy('createdon', 'desc'));
  if(bstatus!="All")
  this.itemList = this.firestore.collection('sdrive_booking', ref => ref.where("pendingtype", "!=", "Admin").where("status", "==", bstatus).orderBy('createdon', 'desc'));
  }
 } */
  return this.itemList.snapshotChanges();
  }
  deleteEmployee(id: string) {
    this.itemList.remove(id);
  }
  
  populateForm(itm) {  
  //  alert(itm.status);
    //this.form.get('status').setValue(itm.status);
    this.email=itm.email;
    this.pickup_address=itm.pickup_address;
    this.booking_source_id=itm.booking_source_id;

    this.start_date=itm.start_date;
    this.start_time=itm.start_time;
    this.end_date=itm.end_date;
    this.end_time=itm.end_time;
    this.booking_source_id=itm.booking_source_id;
    this.mplatform=itm.mplatform;
    this.days=itm.days;
    this.price_per_day=itm.price_per_day;
    this.basic_rental=itm.basic_rental;
    this.extra_kms=itm.extra_kms;
    this.charge_per_exta_km=itm.charge_per_exta_km;
    this.extra_kms_rental=itm.extra_kms_rental;
    this.coupon_code=itm.coupon_code;
    this.coupon_discount_percentage=itm.coupon_discount_percentage;
    this.coupon_discount=itm.coupon_discount;
    this.ltype=itm.luxtype;
    try
    {
      this.gstamt=Math.round(itm.gstamt).toString();
      this.gstpercent=Math.round(itm.gstpercent).toString();
    }
    catch(ex)
    {
      this.gstamt="";
      this.gstpercent="";
    }
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
    this.delivery_charge=itm.delivery_charge;
    this.pickup_charge=itm.pickup_charge;
    this.deposit=itm.deposit;
    this.amount=itm.amount;
    this.smsbookingid=itm.booking_id;
  //  alert("jh "+ this.smsbookingid)
    this.agent_name=itm.agent_name;
  }
}
