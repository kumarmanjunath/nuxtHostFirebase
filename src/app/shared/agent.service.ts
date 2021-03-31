import { Injectable,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AgentService {
  array = [];
  frm: FormGroup = new FormGroup({
    isactive: new FormControl('')
  });
 
  constructor(private firestore: AngularFirestore, private datePipe: DatePipe) {
    this.frm.setValue({
      isactive: "1"
    });
   
    this.firestore.collection('agent', ref => ref.where('active', '==', true)).snapshotChanges().subscribe(actionArray => {
      this.array = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });
    });
  }

  itemList: any = undefined;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    fullname: new FormControl('', Validators.required),
    hfullname: new FormControl(''),
    location_id: new FormControl(''),
    phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    phone1: new FormControl('', [Validators.minLength(10)]),
    phone2: new FormControl('', [Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    email1: new FormControl('', [Validators.email]),
    email2: new FormControl('', [Validators.email]),
    bank: new FormControl(''),
    accno: new FormControl(''),
    ifsc: new FormControl(''),
    servicetax: new FormControl(''),
    tax: new FormControl(0),
    commission: new FormControl(0),
    discount: new FormControl(0),
    hactive: new FormControl(null),
    active: new FormControl(true)
  });

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

  initializeFormGroup() {

    this.form.setValue({
      id: null,
      fullname: '',
      hfullname: '',
      location_id: '',
      phone: '',
      phone1: '',
      phone2: '',
      email: '',
      email1: '',
      email2: '',
      bank: '',
      accno: '',
      ifsc: '',
      servicetax: '',
      tax: 0,
      commission: 0,
      discount: 0,
      hactive: '',
      active: true
    });
  }

  getEmployees(val) {
   //  alert(val);
    let retval = true;
    if (val == 2)
      retval = false;
    if (val == 0) {
    //  alert("Sdgdsfg")
      return this.firestore.collection('agent', ref => ref.orderBy('updatedon', 'desc')).snapshotChanges();
    }
    else {
      //alert("gg")
      return this.firestore.collection('agent', ref => ref.where("active", "==", retval).orderBy('updatedon', 'desc')).snapshotChanges();

    }
  }
  getagentname(location) {
    return this.firestore.collection('agent', ref => ref.where('location_id', '==', location).where('active', '==', true)).snapshotChanges().subscribe(actionArray => {
      this.array = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });
    });

    // console.log(  this.array );
  }
  deleteEmployee(id: string) {
    this.itemList.remove(id);
  }

  populateForm(itm) {
  //  this.form.setValue(_.omit(itm, 'createdon', 'updatedon'));
 
    this.form.setValue({
      id: itm.id,
      fullname: itm.fullname,
        location_id: itm.location_id,
        phone: itm.phone,
        phone1: itm.phone1,
        phone2: itm.phone2,
        email: itm.email,
        email1: itm.email1,
        email2: itm.email2,
        bank: itm.bank,
        accno: itm.accno,
        ifsc: itm.ifsc,
        servicetax: itm.servicetax,
        tax: itm.tax,
        commission: itm.commission,
      
        discount: itm.discount,
        active: itm.active,
        hfullname: itm.fullname,
      hactive: itm.active
     
    });
  }

}
