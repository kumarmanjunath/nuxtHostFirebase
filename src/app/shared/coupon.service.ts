import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CouponService {
  showdiscount=true;
   showdiscountamt=false;
  frm: FormGroup = new FormGroup({
    isactive: new FormControl(''),
    isltype: new FormControl(''),
  });
  constructor(private firestore: AngularFirestore, private datePipe: DatePipe) {
    this.frm.setValue({
      isactive: "1",
      isltype: "0"
    });
  }
  itemList: any = undefined;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    code: new FormControl('', Validators.required),
    description: new FormControl(''),
    optiontype:new FormControl(1),
    discountAmt:new FormControl('', Validators.required),
    ltype:new FormControl('', Validators.required),
    discount: new FormControl('', Validators.required),
    startdate: new FormControl('', Validators.required),
    enddate: new FormControl('', Validators.required),
    active: new FormControl(true),
    deposit: new FormControl(false)
  });

  initializeFormGroup() {

    this.form.setValue({
      id: null,
      code: '',
      description: '',
      discount: '',
      optiontype:1,
      discountAmt:'',
      ltype: 'Luxury',
      startdate: '',
      enddate: '',
      active: true,
      deposit: false
    });
    this.oplist = [
      { "name": "Discount %", ID: "1", "checked": true },
      { "name": "Discount Amt", ID: "2", "checked": false },
      
    ]
  }
  oplist = [
    { "name": "Discount %", ID: "1", "checked": true },
    { "name": "Discount Amt", ID: "2", "checked": false },
    
  ]
  list = [
    { "name": "All", ID: "0", "checked": false },
    { "name": "Active", ID: "1", "checked": true },
    { "name": "Inactive", ID: "2", "checked": false }
  ]
  intigrp() {
    this.list = [
      { "name": "All", ID: "0", "checked": false },
      { "name": "Active", ID: "1", "checked": true },
      { "name": "Inactive", ID: "2", "checked": false }
    ]
  }
  getEmployees(val,ltype) {
    let retval=true;
    var luxtype="All";
    if(ltype==1)
    luxtype="Luxury";
    if(ltype==2)
    luxtype="Premium";
    if(val==2)
    retval=false;
    if(val==0)
    {
      return this.firestore.collection('coupon', ref => ref.orderBy('updatedon', 'desc')).snapshotChanges();
    }
    else {
      return this.firestore.collection('coupon', ref => ref.where("active", "==", retval).orderBy('updatedon', 'desc')).snapshotChanges();

    }
  }
  deleteEmployee(id: string) {
    this.itemList.remove(id);
  }

  populateForm(itm) {
    var sDate = new Date(itm.startdate.seconds * 1000);
    var sdateString = sDate;
    var eDate = new Date(itm.enddate.seconds * 1000);
    var edateString = eDate;
   // alert(itm.type);
    this.form.setValue({
      id: itm.id,
      code: itm.code,
      description: itm.description,
      discount: itm.discount,
      optiontype: itm.type,
      discountAmt: itm.discountAmt,
      startdate: sdateString,
      enddate: edateString,
      ltype:itm.ltype,
      active: itm.active,
      deposit: itm.removedeposit
    });
    if(itm.type=="1")
    {
    this.oplist = [
      { "name": "Discount %", ID: "1", "checked": true },
      { "name": "Discount Amt", ID: "2", "checked": false },      
    ]
    this.showdiscount=true;
    this.showdiscountamt=false;
  }
    else
    {
    this.oplist = [
      { "name": "Discount %", ID: "1", "checked": false },
      { "name": "Discount Amt", ID: "2", "checked": true },      
    ]
    this.showdiscountamt=true;
    this.showdiscount=false;
  }
    
    // this.form.setValue(_.omit(itm,'createdon'));

  }
  radioChange(event) {   
    if(event.source.value==1)
    {
   this.showdiscount=true;
   this.showdiscountamt=false;

    }
   else
  {
    this.showdiscountamt=true;
    this.showdiscount=false;
  }
    
  }
}
