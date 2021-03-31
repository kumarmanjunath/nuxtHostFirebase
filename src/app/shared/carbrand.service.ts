import { Injectable,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator } from '@angular/material';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Carbrand } from './carbrand.model';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class CarbrandService {

  // formData: Carbrand;
  array = [];
  itemList: any = undefined;
  frm: FormGroup = new FormGroup({

    isactive: new FormControl(''),    
    isltype: new FormControl(''),
  });
  constructor(private firestore: AngularFirestore) {
    this.frm.setValue({

      isactive: "1",
      isltype: "0"
    });

    this.firestore.collection('brand', ref => ref.where('ltype', '==', 'Luxury').where('active', '==', true).orderBy('description','asc')).snapshotChanges().subscribe(actionArray => {
   
   //alert("yes");
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
     
    ltype:new FormControl('', Validators.required),
    hactive: new FormControl(''),
    active: new FormControl(true)
  });

  list = [
    { "name": "All", ID: "0", "selected": false },
    { "name": "Active", ID: "1", "selected": true },
    { "name": "Inactive", ID: "2", "selected": false }
  ]
  //chosenItem = this.list[1].name;
  initializeFormGroup() {
    this.form.setValue({
      id: null,
      description: '',
      hdescription: '',
      hactive: '',
      ltype: 'Luxury',
      active: true

    });

    //this.getEmployees(val);
  }
  intigrp() {
    this.list = [
      { "name": "All", ID: "0", "selected": false },
      { "name": "Active", ID: "1", "selected": true },
      { "name": "Inactive", ID: "2", "selected": false }
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
      this.itemList=this.firestore.collection('brand', ref => ref.orderBy('description', 'asc'));    
      if(ltype==1 || ltype==2)
      {
        this.itemList=this.firestore.collection('brand', ref => ref.orderBy('description', 'asc').where("ltype", "==", luxtype));      
      }
    }
    else {
      this.itemList=this.firestore.collection('brand', ref => ref.where("active", "==", retval).orderBy('description', 'asc'));
      if(ltype==1 || ltype==2)
      {
        this.itemList=this.firestore.collection('brand', ref => ref.where("active", "==", retval).where("ltype", "==", luxtype).orderBy('description', 'asc'));     
      }

    }
    return this.itemList.snapshotChanges();    
  }

  getbrand(ltype) {
    return  this.firestore.collection('brand', ref => ref.where('ltype', '==', ltype).where('active', '==', true).orderBy('description','asc')).snapshotChanges().subscribe(actionArray => {
   
      //alert("yes");
         this.array = actionArray.map(item => {
           return {
             id: item.payload.doc['id'],
             ...item.payload.doc.data() as {}
           };
   
         });
       });
  }
  populateForm(itm) {

    this.form.setValue({
      id: itm.id,
      description: itm.description,
      hdescription: itm.description,
      ltype:itm.ltype,
      hactive: itm.active,
      active: itm.active
    });
    // this.form.setValue(_.omit(itm,'createdon','updatedon'));
  }
}
