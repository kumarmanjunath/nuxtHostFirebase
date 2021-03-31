import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Customer } from './customer.model';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  formData: Customer;
  itemList: any = undefined;
  constructor(private firestore: AngularFirestore) { 


    
  }
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    couponcode: new FormControl(''),
  });
  initializeFormGroup() {
    this.form.setValue({
      id: null,
      couponcode: '',
    });

    //this.getEmployees(val);
  }
  getEmployees(frmdate,todate,ctype) {  
    //yes 
   // alert(ctype)
  
    if(ctype=="All")
    {
     
    this.itemList = this.firestore.collection('customer', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).orderBy('createdon', 'desc'));
    if(frmdate=="")
    {
         
    this.itemList = this.firestore.collection('customer', ref => ref.orderBy('createdon', 'desc'));
    }
    }
    else if(ctype=="Amex")
    {
    this.itemList = this.firestore.collection('customer', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).where("membertype", "==", "Amex").orderBy('createdon', 'desc'));
    //alert(frmdate) 
    if(frmdate=="")
    {
     // alert("ye") 
    this.itemList = this.firestore.collection('customer', ref => ref.where("membertype", "==", "Amex").orderBy('createdon', 'desc'));
    }
  }
   

    
    return this.itemList.snapshotChanges();
  }

  populateForm(itm) {
//alert("sudfjask")
var cpn=itm.couponcode;
if(cpn==undefined)
cpn='';
    this.form.setValue({
      id: itm.id,
      couponcode: cpn,      
    });
    // this.form.setValue(_.omit(itm,'createdon','updatedon'));
  }

}
