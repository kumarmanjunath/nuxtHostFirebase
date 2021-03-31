import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from "@angular/forms";
import { OfferService } from '../../shared/offer.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as _ from 'lodash';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {
  array = [];
  showerrorExists = false;
  chkclick=false;
  arrayIsExists = 0;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  
  edittrue = false;
  constructor(private afStorage: AngularFireStorage,public dialogRef: MatDialogRef<OfferComponent>, public service: OfferService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef: MatDialogRef<OfferComponent>) { }


  ngOnInit() {

  }
  
  upload(event) {
    this.chkclick=true;
    this.service.form.controls['imgurl'].setValidators([Validators.required])
    this.service.form.controls['imgurl'].updateValueAndValidity()
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
         
        this.service.form.get('imgurl').clearValidators();
        this.service.form.get('imgurl').updateValueAndValidity();
      }
  //  alert(this.service.form.get('id').value)
 
    if (this.service.form.valid) {
    


      let brandToSplit = (this.service.form.get('description').value);
     
      //   alert(brandToSplit);
    try{
         featureicon=document.getElementById('imgurl').innerHTML;
    }
    catch(ex)
    {}
      brandToSplit = brandToSplit.replace(/ /g, '-');
      //  alert(brandToSplit);
//var featureicon=document.getElementById('featureicon').innerHTML;
//alert(featureicon);
      var docData = {
        title: (this.service.form.get('title').value),
        description: (this.service.form.get('description').value),
        imgurl: featureicon,
        createdon: firebase.firestore.FieldValue.serverTimestamp(),
        updatedon: new Date(),
        active: this.service.form.get('active').value
      };

      if (!this.service.form.get('id').value) {

        var titleloc =(this.service.form.get('title').value);

        const refs = this.firestore.collection('offers', refs => refs.where('title', '==', titleloc)).get();
        refs.forEach((doc) => {

          this.arrayIsExists = doc.size;
          if (this.arrayIsExists == 0) {


            this.firestore.collection('offers').add(docData);

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
    var titleloc = (this.service.form.get('title').value);
    db.collection("offers").where("title", "==", titleloc)
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
    if(document.getElementById('imgurl').innerHTML=="")
    delete docData.imgurl;
    }
    catch(ex){delete docData.imgurl;}
    
    this.firestore.doc('offers/' + this.service.form.value.id).update(docData);


    this.service.form.reset();

    this.onClose();
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
