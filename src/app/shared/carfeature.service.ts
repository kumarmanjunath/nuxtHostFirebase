import { Injectable, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Carfeature } from './carfeature.model';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class CarfeatureService {
  
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

    this.firestore.collection('carfeature', ref => ref.where('active','==',true)).snapshotChanges().subscribe(actionArray => {
      this.featurearray = actionArray.map(item => {
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
    featureicon: new FormControl('', Validators.required),
    hfeatureicon: new FormControl(''),
    hactive: new FormControl(''),
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
      description: '',
      hdescription: '',
      hfeatureicon:'',
      featureicon:'',
      hactive: '',
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
      return this.firestore.collection('carfeature', ref => ref.orderBy('description', 'asc')).snapshotChanges();
    }
    else {
      return this.firestore.collection('carfeature', ref => ref.where("active", "==", retval).orderBy('description', 'asc')).snapshotChanges();

    }
  }
  populateForm(itm) {

    this.form.setValue({
      id: itm.id,
      description: itm.description,
      featureicon:'',
      hdescription: itm.description,
      hfeatureicon:itm.featureicon,
      hactive: itm.active,
      active: itm.active
    });
   // document.getElementById('featureicon').innerHTML=itm.featureicon;
    // this.form.setValue(_.omit(itm,'createdon','updatedon'));
  }
}
