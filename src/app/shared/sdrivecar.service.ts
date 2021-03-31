import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { CarfleetService } from '../shared/carfleet.service';
import { AgentService } from '../shared/agent.service';

import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class SdrivecarService {
  frm: FormGroup = new FormGroup({
    isactive: new FormControl(''),
    isltype: new FormControl(''),
  });
  constructor(private firestore: AngularFirestore, public carfleetService: CarfleetService,public agentService: AgentService, private datePipe: DatePipe) {
    this.frm.setValue({
      isactive: "1",
      isltype: "1",
    }); 
  }
  itemList: any = undefined;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),       
    agent_name: new FormControl('', Validators.required),
    carbrand: new FormControl('', Validators.required),
    carclass: new FormControl('', Validators.required),
    imgcar: new FormControl(''),
    imgcarmob: new FormControl(''),
    color: new FormControl(''),
    ltype:new FormControl('', Validators.required),
    deposit: new FormControl('', Validators.required),
    extra_km_charge: new FormControl('', Validators.required),
    kms_limit: new FormControl('', Validators.required),
    launch_year: new FormControl(''),
    package_hours: new FormControl(''),
    location: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    active: new FormControl(true)
  });

  initializeFormGroup() {

    this.form.setValue({
      id: null,
      agent_name: '',
      carbrand: '',
      carclass: '',  
      imgcar: '',  
      imgcarmob: '',      
      color: '',
      deposit: '',
      extra_km_charge: '',
      kms_limit:'',
      ltype:'Luxury',
      launch_year: '',
      package_hours: '24',
      location: '',
      price:'',
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
      this.itemList=this.firestore.collection('sdrive_car', ref => ref.where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).orderBy('updatedon','desc'));
      if(ltype==0)
      {
        this.itemList=this.firestore.collection('sdrive_car', ref => ref.where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).orderBy('updatedon','desc'));
      }
      if(ltype==1 || ltype==2)
      {
        this.itemList=this.firestore.collection('sdrive_car', ref => ref.where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).where("ltype", "==", luxtype).orderBy('updatedon','desc'));
      }     
      return this.itemList.snapshotChanges();
    }
    else{
      this.itemList=this.firestore.collection('sdrive_car', ref => ref.where("active", "==", retval).where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).orderBy('updatedon','desc'));
      if(ltype==0)
      {
        this.itemList=this.firestore.collection('sdrive_car', ref => ref.where("active", "==", retval).where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).orderBy('updatedon','desc'));
      }
      if(ltype==1 || ltype==2)
      {
        this.itemList=this.firestore.collection('sdrive_car', ref => ref.where("active", "==", retval).where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).where("ltype", "==", luxtype).orderBy('updatedon','desc'));
      }
      return this.itemList.snapshotChanges();
    }
  }
  deleteEmployee(id: string) {
    this.itemList.remove(id);
  }

  populateForm(itm) {  
    this.form.setValue(_.omit(itm,'carfleetid','agent_active','brandclass','agentactive','brandactive','locactive','carfleetactive','createdon','carfleet_id','updatedon','agent_show'));
   // console.log(itm);
    //alert(itm.brand);
    console.log(itm.class);
    this.carfleetService.getcarclass(itm.carbrand);
this.carfleetService.getcarfleet(itm.carbrand, itm.carclass);
this.agentService.getagentname(itm.location);
   
  }
}
