import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../shared/customer.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  constructor(public service: CustomerService, private toastr: ToastrService,private firestore: AngularFirestore ,public dailogRef: MatDialogRef<CustomerComponent>) { }

  ngOnInit() {
   // this.service.initializeFormGroup();
  }
  closeDialog() {
    this.dailogRef.close(false);
  }
  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    //  this.service.getEmployees(this.form.get('isactive').value);
    // this.toastr.success('Added Successfully', 'Agent');
  }
  onSubmit() {
  
    if (this.service.form.valid) {
      if(this.service.form.get('couponcode').value!=="")
{
      var docData = {

        couponcode: this.service.form.get('couponcode').value
      };


            this.firestore.doc('customer/' + this.service.form.get('id').value).update(docData);
            this.toastr.success('Updated Coupon Code Amex Successfully', 'Record');
            this.onClose();
            
    }
  }
  }
 
  onClose() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dailogRef.close();
  }
}
