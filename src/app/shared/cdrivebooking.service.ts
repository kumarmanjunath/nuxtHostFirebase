import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';

import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import * as firebase from 'firebase';
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
    agent_name=""; creditused="";gstamt="";gstpercent="";ltype="";  txtsmsmsg="";smscusname="";smsmid="";smscusphone="";smscarname="";smspackage=""; smsfreekms="";smsbookingid="";smsbookingdate="";smsurl="";
    smsform: FormGroup = new FormGroup({
   
      drivername: new FormControl('', Validators.required),
      driverphone:new FormControl('', [Validators.required, Validators.minLength(10)]),
      driverreg: new FormControl(''),
      secretcode:new FormControl('', Validators.required),
      txtmessage: new FormControl('')
    });
  constructor(private firestore: AngularFirestore,private datePipe: DatePipe) {
    this.istype="Chauffeur";
   }  
 

  itemList: any = undefined;
   

  initializeFormGroup() {

  
   
  }
  applyFilter()
  {
    this.txtsmsmsg= "Dear "+this.smscusname+" \nYour Journey details\n\nBooking Id: "+this.smsbookingid+"\nChauffeur: "+this.smsform.get('drivername').value+" \nPhone: "+this.smsform.get('driverphone').value+" \nCar: "+this.smscarname+"\nPackage: "+this.smspackage+"\nVehicle No.:"+this.smsform.get('driverreg').value+"\nCustomer OTP: "+this.smsform.get('secretcode').value+"\n\nCheers\nTeam Hype"
  

  }

  getDrivers(bookingid) { 
    // alert(bookingid)
          this.itemList = this.firestore.collection('driver_transaction', ref => ref.where("bookingid", "==", bookingid));
          return this.itemList.snapshotChanges();
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
            txtmessage: "Dear "+itm.customer_name+" \nYour Journey details\n\nChauffeur: - \nPhone: - \nCar: - \nPackage: - \nVehicle No.: -\nCustomer OTP: "+random_secret+"\n\nCheers\nTeam Hype"
            });
            this.smscusname=itm.customer_name;
            this.smsmid=itm.id;
            this.smspackage=itm.package;
            if(this.smspackage=="Airport")
            this.smspackage="Airport Transfer";
            this.smscarname=itm.brand+" "+itm.class;
            if( itm.package_id=="1")
            {
              this.smsfreekms="8Hrs "+itm.package_kms1+"Kms";
            }
            else if( itm.package_id=="2")
            {
            var smsduration=itm.days; 
            if(parseFloat(smsduration)>1)
            this.smsfreekms=smsduration.toString()+" days"
            else
            this.smsfreekms=smsduration.toString()+" day"

            //alert(this.smsfreekms)
            }
            
            this.smsbookingid=itm.booking_id;
          //  alert("g "+ this.smsbookingid)
            this.smsbookingdate=itm.start_date+" "+itm.start_time;
            this.txtsmsmsg="Dear "+itm.customer_name+" \nYour Journey details\n\nBooking Id: - \nChauffeur: - \nPhone: - \nCar: - \nPackage: - \nVehicle No.: -\nCustomer OTP: "+random_secret+"\n\nCheers\nTeam Hype";
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
  getEmployees(frmdate,todate,bstatus,pid,ctype) {
   // alert(bstatus)
    if(ctype=="All")
    {
  if(pid==0)
  {

    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).orderBy('createdon', 'desc'));
    if(bstatus!="All")
    {
      //alert("here")
    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("status", "==", bstatus).orderBy('createdon', 'desc'));  
    }
    if(frmdate=="")
    {
         
    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.orderBy('createdon', 'desc'));
    if(bstatus!="All")
    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("status", "==", bstatus).orderBy('createdon', 'desc'));
    }
    
  
  }
else{
  this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("package_id", "==", pid).orderBy('createdon', 'desc'));
  if(bstatus!="All")
  this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("package_id", "==", pid).where("status", "==", bstatus).orderBy('createdon', 'desc'));
  if(frmdate=="")
    {         
    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("package_id", "==", pid).orderBy('createdon', 'desc'));
    if(bstatus!="All")
    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("status", "==", bstatus).where("package_id", "==", pid).orderBy('createdon', 'desc'));
    }
}
    }
    else if(ctype=="Admin" || ctype=="UPI MWeb" || ctype=="UPI Web")
    {
  if(pid==0)
  {

    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
    if(bstatus!="All")
    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("status", "==", bstatus).where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
    if(frmdate=="")
    {         
    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
    if(bstatus!="All")
    this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("status", "==", bstatus).where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
    }
  }
else{
  this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("package_id", "==", pid).where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
  if(bstatus!="All")
  this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("package_id", "==", pid).where("status", "==", bstatus).where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
  if(frmdate=="")
  {         
  this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("package_id", "==", pid).where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
  if(bstatus!="All")
  this.itemList = this.firestore.collection('cdrive_booking', ref => ref.where("status", "==", bstatus).where("package_id", "==", pid).where("pendingtype", "==", ctype).orderBy('createdon', 'desc'));
  }
}
    }
   
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
    try
    {
    this.charge_per_exta_km=(parseFloat(itm.extra_kms)*Math.round(itm.extra_kms_rental)).toString();
    }
    catch(ex)
    {}
    this.extra_kms_rental=Math.round(itm.extra_kms_rental).toString();

    this.extra_hrs=itm.extra_hrs;
    this.charge_per_exta_hr=Math.round(itm.charge_per_exta_hr).toString();
    this.extra_hrs_rental=itm.extra_hrs_rental;
    this.coupon_code=itm.coupon_code;
    this.coupon_discount_percentage=itm.coupon_discount_percentage;
    this.coupon_discount=itm.coupon_discount;
    this.ltype=itm.luxtype;
    var isamexused=false;
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
    if(this.chk==true)
    {
      var calcc=(Math.round(parseFloat(itm.basic_rental))*10)/100;
      this.driver_allowance_per_day=calcc.toString();
    }
   
    this.driver_allowance_charges=itm.driver_allowance_charges;
    this.smsbookingid=itm.booking_id;
    this.amount=itm.amount;
    this.agent_name=itm.agent_name;
  }
}
