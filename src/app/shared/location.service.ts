import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { FormGroup, FormControl, Validators } from "@angular/forms";

import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  array = [];
  formData: Location;
  frm: FormGroup = new FormGroup({
    isactive: new FormControl('')
  });
  constructor(private firestore: AngularFirestore) {
    this.frm.setValue({
      isactive: "1"
    }); 
    this.firestore.collection('location', ref => ref.where('active', '==', true)).snapshotChanges().subscribe(actionArray => {
      this.array = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });
    });
  }
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    description: new FormControl('', Validators.required),
    hdescription: new FormControl(''),
    hactive: new FormControl(''),
    active: new FormControl(true)
  });


  initializeFormGroup() {
    this.form.setValue({
      id: null,
      description: '',
      hdescription: '',
      hactive: '',
      active: true
    });
  }

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
  getEmployees(val) {
    // alert(val);
    // val=2;
    let retval = true;
    if (val == 2)
      retval = false;
    if (val == 0) {
      return this.firestore.collection('location', ref => ref.orderBy('description', 'asc')).snapshotChanges();
    }
    else {
      return this.firestore.collection('location', ref => ref.where("active", "==", retval).orderBy('description', 'asc')).snapshotChanges();

    }
  }

  getLocations() {
    return this.firestore.collection('location', ref => ref.where("active", "==", true)).snapshotChanges();
  }
  getDepartmentName($key) {
    if ($key == "0")
      return "";
    else {
      return _.find(this.array, (obj) => { return obj.$key == $key; })['name'];
    }
  }
  populateForm(itm) {
    
    this.form.setValue({
      id: itm.id,
      description: itm.description,
      hdescription: itm.description,
      hactive: itm.active,
      active: itm.active
    });
    //this.form.setValue(_.omit(itm, 'createdon', 'updatedon'));
  }

}
