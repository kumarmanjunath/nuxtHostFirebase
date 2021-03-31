import { Injectable, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class OfferService {
  
  // formData: Carbrand;
  array = [];
  featurearray= [];
  frm: FormGroup = new FormGroup({

    isactive: new FormControl('')
  });
  constructor(private firestore: AngularFirestore) {
    this.frm.setValue({

      isactive: "1"
    });


  }
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imgurl: new FormControl('', Validators.required),
    active: new FormControl(true)
  });

  list = [
    { "name": "All", ID: "0", "checked": false },
    { "name": "Active", ID: "1", "checked": true },
    { "name": "Inactive", ID: "2", "checked": false }
  ]
  //chosenItem = this.list[1].name;
  initializeFormGroup() {
    this.form.setValue({
      id: null,
      title: '',
      description: '',
      imgurl:'',
      active: true

    });

    //this.getEmployees(val);
  }
  intigrp() {
    this.list = [
      { "name": "All", ID: "0", "checked": false },
      { "name": "Active", ID: "1", "checked": true },
      { "name": "Inactive", ID: "2", "checked": false }
    ]
  }
  
  getEmployees(val) {
    // alert(val);
    let retval = true;
    if (val == 2)
      retval = false;
    if (val == 0) {
      return this.firestore.collection('offers', ref => ref.orderBy('createdon', 'desc')).snapshotChanges();
    }
    else {
      return this.firestore.collection('offers', ref => ref.where("active", "==", retval).orderBy('createdon', 'desc')).snapshotChanges();

    }
  }
  populateForm(itm) {

    this.form.setValue({
      id: itm.id,
      title: itm.title,
      description: itm.description,
      imgurl:'',
      active: itm.active
    });
   // document.getElementById('featureicon').innerHTML=itm.featureicon;
    // this.form.setValue(_.omit(itm,'createdon','updatedon'));
  }
}
