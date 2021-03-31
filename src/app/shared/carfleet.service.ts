import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CarfleetService {
  array = [];
  arrayclass = [];
  arraybrand = [];
  arrayfleet = [];
  imgsliderarr=[];
  landingimg="";
  landingimgmob="";
  itemList: any = undefined;
  frm: FormGroup = new FormGroup({
    isactive: new FormControl(''),
    isltype: new FormControl(''),
  });
  constructor(private firestore: AngularFirestore, private datePipe: DatePipe) {
    this.imgsliderarr=[];
    this.landingimg="";
    this.landingimgmob="";
    this.getImages();
    this.frm.setValue({
      isactive: "1",
      isltype: "0"
    }); 
    this.firestore.collection('carfleet', ref => ref.where('active', '==', true)).snapshotChanges().subscribe(actionArray => {
      this.arrayclass = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });
    });
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),

    brand: new FormControl('', Validators.required),
    class: new FormControl('', Validators.required),
    features: new FormControl(''),
   
    fuel: new FormControl('', Validators.required),
    gear: new FormControl('', Validators.required),
    ltype: new FormControl('', Validators.required),
    lugguage: new FormControl('', Validators.required),
    seat: new FormControl('', Validators.required),
    active: new FormControl(true)
  });
getImages()
{
  try
  {
    this.imgsliderarr =[];
    this.landingimg="";
    this.landingimgmob="";
  var imgstr=localStorage.getItem('aimgslider');
  this.landingimg=localStorage.getItem('aimgcar');
  this.landingimgmob=localStorage.getItem('aimgcarmob');
  if(imgstr!="")
  {
  imgstr = imgstr.slice(0, -1);
  this.imgsliderarr =imgstr.split("|");
 
  }
  }
  catch
  {

  }
}
  initializeFormGroup() {

    this.form.setValue({
      id: null,

      brand: '',
      class: '',
      features: '',
     
      fuel: '',
      gear: '',
      ltype:'Luxury',
      lugguage: '',
      seat: '',
      active: true,
    });
  }
 
   
  getcarfleet(brand, classname) {
    this.arrayfleet =[];
    
 //  alert("res");
  /*   let brandToSplit = brand;
    brandToSplit = brandToSplit.replace(/ /g, '-');
    let brandSplit = brandToSplit;

    let classToSplit = classname;
    classToSplit = classToSplit.replace(/ /g, '-');
    let classSplit = classToSplit;

    let brandclass = brandSplit + "_" + classSplit; */
    //alert(brandclass);
    return this.firestore.collection('carfleet', ref => ref.where('brand', '==', brand).where('class', '==', classname)).snapshotChanges().subscribe(actionArray => {
      this.arrayfleet = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });
      // console.log(this.arrayfleet);
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
  getcarclass(brand) {
    return this.firestore.collection('carfleet', ref => ref.where('brand', '==', brand)).snapshotChanges().subscribe(actionArray => {
      this.arrayclass = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });
    });
  }
  getpremiumcar(brand) {
  
    return this.firestore.collection('carfleet', ref => ref).snapshotChanges().subscribe(actionArray => {
      this.arraybrand = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });

      console.log("gf")
      console.log(this.arraybrand)
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
this.itemList=this.firestore.collection('carfleet', ref => ref.where("brandactive", "==", true).orderBy('brand', 'asc'));
if(ltype==1 || ltype==2)
{
  this.itemList=this.firestore.collection('carfleet', ref => ref.where("brandactive", "==", true).where("ltype", "==", luxtype).orderBy('brand', 'asc'));
}     
return this.itemList.snapshotChanges();
    }
    else {
    
    this.itemList=this.firestore.collection('carfleet', ref => ref.where("active", "==", retval).where("brandactive", "==", true).orderBy('brand', 'asc'));
    if(ltype==1 || ltype==2)
{
  this.itemList=this.firestore.collection('carfleet', ref => ref.where("active", "==", retval).where("brandactive", "==", true).where("ltype", "==", luxtype).orderBy('brand', 'asc'));

}   
    return this.itemList.snapshotChanges();
    }
  }
  deleteEmployee(id: string) {
    this.itemList.remove(id);
  }

  populateForm(itm) {
    //console.log(itm.features); 

    this.form.setValue({

      id: itm.id,
      brand: itm.brand,
      class: itm.class,
      features: itm.features,
     
      fuel: itm.fuel,
      gear: itm.gear,
      ltype: itm.ltype,
      lugguage: itm.lugguage,
      seat: itm.seat,
      active: itm.active
    });
   
    localStorage.setItem('acarbrand', itm.brand);
    localStorage.setItem('acarclass', itm.class);
    localStorage.setItem('aimgslider', itm.imgslider);
    localStorage.setItem('aimgcar', itm.imgcar);
    localStorage.setItem('aimgcarmob', itm.imgcarmob);
this.getImages();
    // this.form.setValue(_.omit(itm,'createdon','carfleet_id'));
  }

}
