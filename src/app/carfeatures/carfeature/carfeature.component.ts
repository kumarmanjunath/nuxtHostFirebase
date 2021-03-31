import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from "@angular/forms";
import { CarfeatureService } from '../../shared/carfeature.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import 'firebase/firestore'
const firestore = firebase.firestore()
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-carfeature',
  templateUrl: './carfeature.component.html',
  styleUrls: ['./carfeature.component.scss']
})
export class CarfeatureComponent implements OnInit {
  array = [];
  showerrorExists = false;
  chkclick=false;
  arrayIsExists = 0;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  
  edittrue = false;
  constructor(private afStorage: AngularFireStorage,public dialogRef: MatDialogRef<CarfeatureComponent>, public service: CarfeatureService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef: MatDialogRef<CarfeatureComponent>) { }


  ngOnInit() {

  }
  
  upload(event) {
    this.chkclick=true;
    this.service.form.controls['featureicon'].setValidators([Validators.required])
    this.service.form.controls['featureicon'].updateValueAndValidity()
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(finalize(() =>
     this.downloadURL = this.ref.getDownloadURL() 

     ))
    
.subscribe();

/* console.log(this.downloadURL)
this.service.form.setValue({
  featureicon: this.downloadURL
}); */
  } 
  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    //  this.service.getEmployees(this.form.get('isactive').value);
    // this.toastr.success('Added Successfully', 'Agent');
  }
  onSubmit() {
    this.arrayIsExists = 0;
    var featureicon="";
    if (this.service.form.get('id').value && this.chkclick==false) {
      //  alert("yes")
         featureicon="";
         
        this.service.form.get('featureicon').clearValidators();
        this.service.form.get('featureicon').updateValueAndValidity();
      }
  //  alert(this.service.form.get('id').value)
 
    if (this.service.form.valid) {
    


      let brandToSplit = _.startCase(this.service.form.get('description').value);
     
      //   alert(brandToSplit);
    try{
         featureicon=document.getElementById('featureicon').innerHTML;
    }
    catch(ex)
    {}
      brandToSplit = brandToSplit.replace(/ /g, '-');
      //  alert(brandToSplit);
//var featureicon=document.getElementById('featureicon').innerHTML;
//alert(featureicon);
      var docData = {

        description: _.startCase(this.service.form.get('description').value),
        featureicon: featureicon,
        createdon: firebase.firestore.FieldValue.serverTimestamp(),
        updatedon: new Date(),
        active: this.service.form.get('active').value
      };

      if (!this.service.form.get('id').value) {

        var desloc = _.startCase(this.service.form.get('description').value);

        const refs = this.firestore.collection('carfeature', refs => refs.where('description', '==', desloc)).get();
        refs.forEach((doc) => {

          this.arrayIsExists = doc.size;
          if (this.arrayIsExists == 0) {


            this.firestore.collection('carfeature').add(docData);

            this.toastr.success('Added Successfully', 'Record');
            this.onClose();
            this.service.intigrp();

            this.showerrorExists = true;
            return;

          }
          else {
            this.showerrorExists = true;
          }
        });
      }
      else {
        //alert("c")
        this.checkEdit(docData);



      }
    }

  }
  async checkEdit(docData) {


    const db = firebase.firestore();
    var desloc = _.startCase(this.service.form.get('description').value);
    db.collection("carfeature").where("description", "==", desloc)
      .get()
      .then((querySnapshot) => {
        this.showerrorExists = true;
//alert(querySnapshot.size)
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            var editId = doc.id;
          //  alert("editId"+editId)
           // alert("other"+this.service.form.get('id').value)
            if (editId != this.service.form.get('id').value) {
              this.showerrorExists = true;
            }
            else {
           //   alert("yes")
              this.showerrorExists = false;
              this.updates(docData);
            }
          });
          // do something with the data
        } else {
          this.updates(docData);
        }




      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });


  }
  updates(docData) {
    delete docData.createdon;
    try
    {
    if(document.getElementById('featureicon').innerHTML=="")
    delete docData.featureicon;
    }
    catch(ex){delete docData.featureicon;}
    this.multiUpdate(docData);
    this.service.form.reset();

    this.onClose();
  }
  async multiUpdate(docData)
  {
   // alert("done")
    var newValue = "";
    var oldValue = "";
    var anewValue = true;
    var aoldValue = "";
    var hfeatureoldValue="";
    newValue = this.service.form.get('description').value;
    oldValue = this.service.form.get('hdescription').value;
    hfeatureoldValue = this.service.form.get('hfeatureicon').value;
    try
    {
      hfeatureoldValue=document.getElementById("featureicon").innerHTML;
    }
    catch(ex){}
    anewValue = this.service.form.get('active').value;
    aoldValue = this.service.form.get('hactive').value;
    var activenot=this.service.form.get('active').value;  
    if(1==1)
    {
  // alert(oldValue);
    //alert(newValue);
    const db = firebase.firestore();
  
    const collRef1 = db.collection('carfleet');
    const query1 = collRef1.where("features", "array-contains", oldValue);
  
    const mainRef = db.collection('carfeature').doc(this.service.form.get('id').value);
  
  
    const batch = db.batch();
    // Step 1 - Read document data and prepare batch updates
  
  
    try {
     
        batch.update(mainRef, docData);
    
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
  
    try {
    //("hi")
      const scaritems = await query1.get();
      scaritems.forEach(async (doc) => {
     // alert("his sd");
        const docRef = collRef1.doc(doc.id);
      //  console.log("len"+doc.data().agent_name.length);
        var arr=doc.data().features;
        var arractive=doc.data().featuresicon;
        console.log(arr);
        console.log(arractive)
        var temparr=[];
        var temparractive=[];
       
        for(var i=0;i<arr.length;i++)
        {
       //   alert(arr[i]);
        //  alert(oldValue);
          if(arr[i]==oldValue)
          {
          //  alert(oldValue)
           // if(activenot==true)
           // {
             if(anewValue==true)
             {
        temparr.push(newValue);
        
        temparractive.push(hfeatureoldValue);
             }
           // }
       
          }
          else
          {
          temparr.push(arr[i]);
         temparractive.push(arractive[i]);
         
          }
         

        }
      console.log(temparr);
        console.log(temparractive);
        batch.update(docRef, { features:temparr,featuresicon:temparractive});
      //  agent_name: _.startCase(newValue),
      });
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
    
  
  
     // Step 2 - Run batch update
     try {
      await batch.commit();
      this.toastr.success('Updated Successfully', 'Record');
      this.service.form.setValue({
        id: null,
     
      });
    //  this.service.form.get('toll').addva();
      this.service.form.controls['featureicon'].setValidators([Validators.required])
      this.service.form.controls['featureicon'].updateValueAndValidity()
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 2): error caught. Error=');
      console.log((error));
    }
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
