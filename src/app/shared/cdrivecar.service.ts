import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { CarfleetService } from '../shared/carfleet.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { AgentService } from '../shared/agent.service';
@Injectable({
  providedIn: 'root'
})
export class CdrivecarService {

  frm: FormGroup = new FormGroup({
    isactive: new FormControl(''),
    isltype: new FormControl(''),
  });
  constructor(private firestore: AngularFirestore,public carfleetService: CarfleetService,public agentService: AgentService, private datePipe: DatePipe) {
    this.frm.setValue({
      isactive: "1",
      isltype: "1" 
    }); }
  itemList: any = undefined;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),       
    agent_name: new FormControl('', Validators.required),
    carbrand: new FormControl('', Validators.required),
    carclass: new FormControl('', Validators.required),    
    imgcar: new FormControl(''),  
    imgcarmob:new FormControl(''),
    color: new FormControl(''),    
    launch_year: new FormControl(''),
    location: new FormControl('', Validators.required),  
    ltype:new FormControl('', Validators.required),
    package_hours1: new FormControl(''),  
    package_kms1: new FormControl(''),  
    price1: new FormControl(''),  
    active1:  new FormControl(true),  
    
    package_hrs2: new FormControl(''),   
    package_kms2: new FormControl(''),  
    price2: new FormControl(''),  
    active2:  new FormControl(true),  
    
    toll: new FormControl(''),  
    parking_fee: new FormControl(''),  
    
    price3: new FormControl(''), 
    active3:  new FormControl(true),   
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
      agent_name: '',
      carbrand: '',
      carclass: '',     
      imgcar: '',  
      imgcarmob: '',  
      color: '',
     
      launch_year: '',
      location: '',
      ltype: 'Luxury',
    package_hours1:'8',
    package_kms1: '80',
    price1: '',  
    active1: true,  
    
    package_hrs2: '12am-12am',   
    package_kms2: '250',
    price2: '',
    active2: true, 
     
    toll:'',
    parking_fee: '',
  
    price3:'',
    active3: true, 
      active: true
    });
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
      this.itemList=this.firestore.collection('cdrive_car', ref => ref.where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).orderBy('updatedon','desc'));
      if(ltype==0)
      {
      this.itemList=this.firestore.collection('cdrive_car', ref => ref.where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).orderBy('updatedon','desc'));
      }
      if(ltype==1 || ltype==2)
      {
        this.itemList=this.firestore.collection('cdrive_car', ref => ref.where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).where("ltype", "==", luxtype).orderBy('updatedon','desc'));
      }
     return this.itemList.snapshotChanges();
    }
    else{

      this.itemList=this.firestore.collection('cdrive_car', ref => ref.where("active", "==", retval).where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).orderBy('updatedon','desc'));

      if(ltype==0)
      {
        this.itemList=this.firestore.collection('cdrive_car', ref => ref.where("active", "==", retval).where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).orderBy('updatedon','desc'));
      }
      if(ltype==1 || ltype==2)
      {
        this.itemList=this.firestore.collection('cdrive_car', ref => ref.where("active", "==", retval).where("agent_active", "array-contains", true).where("brandactive", "==", true).where("locactive", "==", true).where("carfleetactive", "==", true).where("ltype", "==", luxtype).orderBy('updatedon','desc'));
      }

      return this.itemList.snapshotChanges();
    }
  }
  deleteEmployee(id: string) {
    this.itemList.remove(id);
  }

  populateForm(itm) {  
    this.form.setValue(_.omit(itm,'carfleetid','brandclass','agentactive','brandactive','locactive','carfleetactive','createdon','carfleet_id','updatedon', 'driver_allowance1','driver_allowance2','driver_allowance3','extra_hour_charge1','extra_km_charge1','extra_km_charge2','agent_show','agent_active'));
    console.log(itm.class);
    this.carfleetService.getcarclass(itm.carbrand);
    this.carfleetService.getcarfleet(itm.carbrand, itm.carclass);
    this.agentService.getagentname(itm.location);

  }
}
