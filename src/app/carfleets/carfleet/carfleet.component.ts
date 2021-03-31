import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from "@angular/forms";
import { CarfleetService } from '../../shared/carfleet.service';
import { CarbrandService } from '../../shared/carbrand.service';
import { CarfeatureService } from '../../shared/carfeature.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';

import { finalize } from 'rxjs/operators';
import { CarsComponent } from '../../cars/cars.component';
import * as _ from 'lodash';
import * as firebase from 'firebase';
import 'rxjs/operators/map';
@Component({
  selector: 'app-carfleet',
  templateUrl: './carfleet.component.html',
  styleUrls: ['./carfleet.component.scss']
})
export class CarfleetComponent implements OnInit {
 
  str = "";
  showerrorExists=false;
  public strchkRecordExists = false;
  ltype: any = undefined;
  fueltype: any = undefined;
  featarray = [];
  public ficnarray=[];
  arrayIsExists=[];
  interestFormGroup: FormGroup
  interests: any;
  selected: any;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  uploadProgress1: Observable<number>;
  uploadProgress2: Observable<number>;
  uploadProgress3: Observable<number>;
  downloadURL: Observable<string>;
  downloadURL1: Observable<string>;
  downloadURL2: Observable<string>;
  downloadURL3: Observable<string>;
  constructor(private afStorage: AngularFireStorage, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CarfleetComponent>, public dialog: MatDialog, public carbrandservice: CarbrandService, public carfeatureservice: CarfeatureService, public service: CarfleetService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef: MatDialogRef<CarfleetComponent>) { }

  farray = new Array();
 fleetId="";
 showimageerrorExists=false;
  ngOnInit() {  
  
   
    interests: [];
    this.farray = new Array();
    var featarray = new Array();
    /*  const valuesFromServer = ["Bangalore"];
     const formArray = this.service.form.get('locations') as FormArray;
     valuesFromServer.forEach(x => formArray.push(new FormControl(x)));  */
     this.ltype = [
      { description: 'Luxury' },
      { description: 'Premium'}
    ];


    this.fueltype = [
      { description: 'Petrol' },
      { description: 'Diesel' },
      { description: 'Electric' },
      { description: 'Hybrid' }
    ];
    
  
    //console.log(this.imgsliderarr);
    //alert(document.getElementById("as").nodeValue)
  }
  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.toastr.success('Saved Successfully', 'Record');
  }
  /* upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(finalize(() => this.downloadURL = this.ref.getDownloadURL()))
      .subscribe();
    this.service.form.get('imgcar').setValue(this.downloadURL);

  } */

  onChange(event) {
    //  this.data.splice(index, 1);
    //const interests;
    if (event.checked) {
      this.farray.push(event.source.value);
    } else {
      for (var i = 0; i < 5; i++) {
        if (this.farray[i] == event.source.value) {
          this.farray.splice(i, 1);
        }
      }
    }
    console.log(this.farray);
    
  }
  getbrand(value) {
    this.carbrandservice.getbrand(value);
  }
  emailUpdated(event) {
    alert(event.target.value);
    console.log("New email", event.target.value);
  }
  onImageClick(ttype)
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    this.dialog.open(CarsComponent, dialogConfig);
    localStorage.setItem('acarbrand', this.service.form.get('brand').value);
    localStorage.setItem('acarclass', this.service.form.get('class').value);
    localStorage.setItem('ttype', ttype);
  }
  fnperformActions(brandclass)
  {
    var isactive=this.service.form.get('active').value;

    var docData = {

      brand: this.service.form.get('brand').value,
      class: this.service.form.get('class').value,
      carfleet_id: brandclass,
      features:  this.service.form.get('features').value,
      featuresicon:this.ficnarray,
      imgcar: localStorage.getItem('aimgcar'),
      imgcarmob: localStorage.getItem('aimgcarmob'),
      imgslider:localStorage.getItem('aimgslider'),
     /*  imgcar: this.service.form.get('imgcar').value,
      imgslider1: this.service.form.get('imgslider1').value,
      imgslider2: this.service.form.get('imgslider2').value,
      imgslider3: this.service.form.get('imgslider3').value, */
      fuel: this.service.form.get('fuel').value,
      gear: this.service.form.get('gear').value,
      ltype: this.service.form.get('ltype').value,
      lugguage: this.service.form.get('lugguage').value,
      seat: this.service.form.get('seat').value,
      createdon: firebase.firestore.FieldValue.serverTimestamp(),
      updatedon: new Date(),
      brandactive: true,
      active: isactive
    };

   
    if (!this.service.form.get('id').value) {
      this.firestore.collection('carfleet', ref => ref.where('brand', '==', this.service.form.get('brand').value).where('class', '==', this.service.form.get('class').value)).valueChanges().subscribe(actionArray => {
        //  alert("g");
          this.arrayIsExists = actionArray;
    
    console.log( this.arrayIsExists.length);
    //alert(this.service.form.get('id').value);
    if(this.arrayIsExists.length==0)
    {
  
       if(this.service.form.get('brand').value!="")
       {
      this.firestore.collection('carfleet').add(docData);
      
      this.toastr.success('Added Successfully', 'Record');
      this.onClose();
      this.service.intigrp();
   
      this.showerrorExists=true;
      return;
       }
      }
      else{
        this.showerrorExists=true;
      }
      });
      // var docRef = this.firestore.collection('carfleet').doc(brandclass);  
      //  var setWithMerge = docRef.set(docData);
    }
    
    else {
      delete docData.createdon;
      delete docData.brandactive;
      this.multiUpdate(docData);
      this.onClose();
      this.service.intigrp();
   
      this.showerrorExists=true;
      return;
    }
   
  }
  async fngeticons(farr,brandclass)
  {
    for(var k=0;k<farr.length;k++)
    {
   
    try {
     // console.log(farr[k]);
      const db = firebase.firestore();
      const collRef2 = db.collection('carfeature');
      const query2 = collRef2.where("description", "==",  farr[k]);
      const ccaritems = await query2.get();
      ccaritems.forEach(async (doc) => {
       
        this.ficnarray.push(doc.data().featureicon);  
        
      });
     // console.log( "ficnarray"+ this.ficnarray);
     /*  firebase
      .firestore()
      .collection("carfeature")
      .where("description",'==', farr[k])    
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
      
          this.ficnarray.push(doc.data().featureicon);     
          console.log("f"+this.ficnarray);    
        });
      }); */

    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }

    }
    this.fnperformActions(brandclass);
  }
  onSubmit() {
    this.arrayIsExists=[];
  //  alert("g");
 //  alert(localStorage.getItem('aimgcar'));
    if (this.service.form.valid) {
      if(localStorage.getItem('aimgcar')!="" && localStorage.getItem('aimgslider')!="" && localStorage.getItem('aimgcarmob')!="")
      {
  //   alert("hello");
  this.showimageerrorExists=false;


    let brandToSplit = this.service.form.get('brand').value;
    brandToSplit = brandToSplit.replace(/ /g, '-');
    let brandSplit = brandToSplit;

    let classToSplit =this.service.form.get('class').value;
    classToSplit = classToSplit.replace(/ /g, '-');
    let classSplit = classToSplit;

    let brandclass = brandSplit + "_" + classSplit;
//alert(brandclass);
    let stringToSplit = this.str;
    stringToSplit = stringToSplit.replace(/,\s*$/, "");
    let x = stringToSplit.split(",");
   // const db = firebase.firestore();
    var farr=this.service.form.get('features').value;
   // this.ficnarray=[
   this.fngeticons(farr,brandclass);
  
      }
      else
      {
        this.showimageerrorExists=true;
      }
    }
  }
  async multiUpdate(docData)
  {
    var hbrand=this.service.form.get('brand').value;
    var hclass=this.service.form.get('class').value;
    var aimgcar=localStorage.getItem('aimgcar');
    var aimgcarmob=localStorage.getItem('aimgcarmob');
   var hactive=this.service.form.get('active').value;
    const db = firebase.firestore();
    const collRef1 = db.collection('sdrive_car');
    const query1 = collRef1.where("carfleet_id", "==", this.service.form.get('id').value);
  
    const collRef2 = db.collection('cdrive_car');
    const query2 = collRef2.where("carfleet_id", "==", this.service.form.get('id').value);
  
    const mainRef = db.collection('carfleet').doc(this.service.form.get('id').value);
  
  
    const batch = db.batch();
    // Step 1 - Read document data and prepare batch updates
  
  
    try {
      
        batch.update(mainRef, docData);
    
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
  
  
    try {
      const scaritems = await query1.get();
      scaritems.forEach(async (doc) => {
        const docRef = collRef1.doc(doc.id);
        batch.update(docRef, { carbrand: _.startCase(hbrand),carclass:(hclass), imgcar:aimgcar,imgcarmob:aimgcarmob, carfleetactive:hactive});
      
      });
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
    try {
      const ccaritems = await query2.get();
      ccaritems.forEach(async (doc) => {
        const docRef = collRef2.doc(doc.id);
        batch.update(docRef, {carbrand: _.startCase(hbrand),carclass:(hclass), imgcar:aimgcar,imgcarmob:aimgcarmob, carfleetactive:hactive});
       
      });
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
  
  
  
     // Step 2 - Run batch update
     try {
      await batch.commit();
      this.toastr.success('Updated Successfully', 'Record');
  
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 2): error caught. Error=');
      console.log((error));
    }
  
  }
  onClose() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();
  }


  closeDialog() {
    this.dialogRef.close(false);
  }

}
