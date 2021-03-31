import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LocationService } from '../../shared/location.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import * as firebase from 'firebase';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  showerrorExists=false;
  arrayIsExists=0;

  constructor(public dialogRef: MatDialogRef<LocationComponent>, public service: LocationService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef: MatDialogRef<LocationComponent>) { }


  ngOnInit() {

  }

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    // this.toastr.success('Added Successfully', 'Agent');
  }
  onSubmit() {
    this.arrayIsExists=0;
    if (this.service.form.valid) {

      var docData = {

        description: _.startCase(this.service.form.get('description').value),
        createdon: firebase.firestore.FieldValue.serverTimestamp(),
        updatedon: new Date(),
        active: this.service.form.get('active').value
      };
      if (!this.service.form.get('id').value) {

        var desloc=_.startCase(this.service.form.get('description').value);

        const refs=this.firestore.collection('location', ref => ref.where('description', '==',desloc )).get();  
        refs.forEach( (doc) => {
    
            this.arrayIsExists = doc.size;
      if(this.arrayIsExists==0)
      {

        this.firestore.collection('location').add(docData);
        
        this.toastr.success('Added Successfully', 'Record');
        this.onClose();
        this.service.intigrp();
     
        this.showerrorExists=true;
        return;
         
        }
        else{
          this.showerrorExists=true;
        }
        });
        
      }
      else {
        delete docData.createdon;
        
        this.multiUpdate(docData);
        this.service.form.reset();
     
        this.onClose();
      }
     
    }
  }
  async multiUpdate(docData)
  {
    var newValue="";
    var oldValue="";
    var anewValue="";
    var aoldValue="";
    newValue=this.service.form.get('description').value;
    oldValue=this.service.form.get('hdescription').value;
    anewValue=this.service.form.get('active').value;
    aoldValue=this.service.form.get('hactive').value;
    if(newValue.toLowerCase().trim()!=oldValue.toLowerCase().trim() || anewValue!=aoldValue)
    {
    const db = firebase.firestore();
  
  
    const collRef = db.collection('agent');
    const query = collRef.where("location_id", "==", oldValue);
  
    const collRef1 = db.collection('sdrive_car');
    const query1 = collRef1.where("location", "==", oldValue);
  
    const collRef2 = db.collection('cdrive_car');
    const query2 = collRef2.where("location", "==", oldValue);
  
    const mainRef = db.collection('location').doc(this.service.form.get('id').value);
  
  
    const batch = db.batch();
    // Step 1 - Read document data and prepare batch updates
  
  
    try {
      
        batch.update(mainRef, docData);
    
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
  
    try {
      const agentitems = await query.get();
  
      agentitems.forEach(async (doc) => {
        const docRef = collRef.doc(doc.id);
        batch.update(docRef, { location_id: _.startCase(newValue),locactive: anewValue});
       
      });
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
  
    try {
      const scaritems = await query1.get();
      scaritems.forEach(async (doc) => {
        const docRef = collRef1.doc(doc.id);
        batch.update(docRef, { location: _.startCase(newValue),locactive: anewValue});
      
      });
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
    try {
      const ccaritems = await query2.get();
      ccaritems.forEach(async (doc) => {
        const docRef = collRef2.doc(doc.id);
        batch.update(docRef, { location: _.startCase(newValue),locactive: anewValue});
       
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
