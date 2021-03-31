import { Component, OnInit } from '@angular/core';

import { CouponService } from '../../shared/coupon.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {MatDialogRef,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import * as _ from 'lodash';
import * as firebase from 'firebase';
import { AppDateAdapter, APP_DATE_FORMATS} from  '../../shared/date.adapter';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class CouponComponent implements OnInit { 
  ltype: any = undefined;
  constructor( public dialogRef: MatDialogRef<CouponComponent>,public service: CouponService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef:MatDialogRef<CouponComponent>) { }
  
  ngOnInit() {
    this.ltype = [
      { description: 'Luxury' },
      { description: 'Premium'}
    ];
  }

    onClear() {
      this.service.form.reset();
      this.service.initializeFormGroup();
      this.toastr.success('Submitted successfully', 'Coupon. Register');
    }
  
    onSubmit() {
      var strdiscount=this.service.form.get('discount').value;
      var strdiscountAmt=this.service.form.get('discountAmt').value;
      if (this.service.form.get('optiontype').value == 2) {
     
        this.service.form.get('discount').clearValidators();
        this.service.form.get('discount').updateValueAndValidity(); 
        strdiscount="";
     //   this.service.form.get('discount').value="";
      }  
      else
      {
        this.service.form.get('discountAmt').clearValidators();
        this.service.form.get('discountAmt').updateValueAndValidity(); 
        strdiscountAmt=""; 
      }

      if (this.service.form.valid) { 
//alert(this.service.form.get('ltype').value)
        var enddate=new Date(this.service.form.get('enddate').value);
        enddate.setHours(23);
      var str=this.service.form.get('startdate').value;
  //  alert(this.service.form.get('optiontype').value);
  var docData = {
  code: _.toUpper(this.service.form.get('code').value) ,
    description : _.capitalize(this.service.form.get('description').value),
    type : this.service.form.get('optiontype').value,
    discount : strdiscount,
    discountAmt : strdiscountAmt,
    startdate :this.service.form.get('startdate').value, 
   enddate : enddate, 
   ltype: this.service.form.get('ltype').value,
  createdon:firebase.firestore.FieldValue.serverTimestamp(), 
  updatedon:new Date(),
  active:this.service.form.get('active').value,
  removedeposit:this.service.form.get('deposit').value
    };
 
        if (!this.service.form.get('id').value)
        {
      
        var docRef = this.firestore.collection('coupon').add(docData);
        this.toastr.success('Saved Successfully', 'Record');
        //  var setWithMerge = docRef.set(docData);
        }
        else
        {
          delete docData.createdon;
          this.firestore.doc('coupon/' +this.service.form.get('id').value).update(docData);
          this.toastr.success('Updated Successfully', 'Record');
        }
        this.service.form.reset();
       // this.service.initializeFormGroup();
       
        this.onClose();
        
      }
    }
  
    onClose() {
      this.service.form.reset();
      this.service.initializeFormGroup();
      this.dialogRef.close();
    }
   
   
    closeDialog() {
      this.dialogRef.close(false);
    }
}
