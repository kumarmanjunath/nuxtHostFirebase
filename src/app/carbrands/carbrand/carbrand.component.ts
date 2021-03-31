import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from "@angular/forms";
import { CarbrandService } from '../../shared/carbrand.service'; 
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import 'firebase/firestore'
const firestore = firebase.firestore()

@Component({
  selector: 'app-carbrand',
  templateUrl: './carbrand.component.html',
  styleUrls: ['./carbrand.component.scss']
})
export class CarbrandComponent implements OnInit {
  ltype: any = undefined;
  array = [];
  showerrorExists = false;
  arrayIsExists = 0;
  edittrue = false;
  constructor(public dialogRef: MatDialogRef<CarbrandComponent>, public service: CarbrandService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef: MatDialogRef<CarbrandComponent>) { }


  ngOnInit() {
    this.ltype = [
      { description: 'Luxury' },
      { description: 'Premium'}
    ];
  }

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    //  this.service.getEmployees(this.form.get('isactive').value);
    // this.toastr.success('Added Successfully', 'Agent');
  }
  onSubmit() {
    this.arrayIsExists = 0;
    if (this.service.form.valid) {
      let brandToSplit = _.startCase(this.service.form.get('description').value);
      //   alert(brandToSplit);

      brandToSplit = brandToSplit.replace(/ /g, '-');
      //  alert(brandToSplit);

      var docData = {

        description: _.startCase(this.service.form.get('description').value),
        ltype: this.service.form.get('ltype').value, 
        createdon: firebase.firestore.FieldValue.serverTimestamp(),
        updatedon: new Date(),
        active: this.service.form.get('active').value
      };

      if (!this.service.form.get('id').value) {

        var desloc = _.startCase(this.service.form.get('description').value);

        const refs = this.firestore.collection('brand', refs => refs.where('ltype', '==', this.service.form.get('ltype').value).where('description', '==', desloc)).get();
        refs.forEach((doc) => {
          this.arrayIsExists = doc.size;
          if (this.arrayIsExists == 0) {


            this.firestore.collection('brand').add(docData);

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
    db.collection("brand").where("description", "==", desloc)
      .get()
      .then((querySnapshot) => {
        this.showerrorExists = true;

        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            var editId = doc.id;
            if (editId != this.service.form.get('id').value) {
              this.showerrorExists = true;
            }
            else {
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

    this.multiUpdate(docData);
    this.service.form.reset();

    this.onClose();
  }
  async multiUpdate(docData) {
    if (this.service.form.get('id').value) {
      var newValue = "";
      var oldValue = "";
      var anewValue = "";
      var aoldValue = "";
      newValue = this.service.form.get('description').value;
      oldValue = this.service.form.get('hdescription').value;
      anewValue = this.service.form.get('active').value;
      aoldValue = this.service.form.get('hactive').value;
      //newValue.toLowerCase().trim() != oldValue.toLowerCase().trim() || anewValue != aoldValue
      if (1==1) {
        const db = firebase.firestore();


        const collRef = db.collection('carfleet');
        const query = collRef.where("brand", "==", oldValue);

        const collRef1 = db.collection('sdrive_car');
        const query1 = collRef1.where("carbrand", "==", oldValue);

        const collRef2 = db.collection('cdrive_car');
        const query2 = collRef2.where("carbrand", "==", oldValue);

        const mainRef = db.collection('brand').doc(this.service.form.get('id').value);


        const batch = db.batch();
        // Step 1 - Read document data and prepare batch updates


        try {

          batch.update(mainRef, docData);

        } catch (error) {
          console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
        }

        try {
          const carfleetitems = await query.get();

          carfleetitems.forEach(async (doc) => {
            const docRef = collRef.doc(doc.id);
            var fleetid = doc.data().carfleet_id;
            var res = "";
            var res1 = "";
            try {
              res = fleetid.split("_")[0];
              res1 = fleetid.split("_")[1];
              res = _.startCase(newValue);
              res = res.replace(/ /g, '-');
              res = res + "_" + res1;
            } catch (ex) { }
            batch.update(docRef, { brand: _.startCase(newValue), carfleet_id: res, brandactive: anewValue });

          });
        } catch (error) {
          console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
        }

        try {
          const scaritems = await query1.get();
          scaritems.forEach(async (doc) => {
            const docRef = collRef1.doc(doc.id);
            batch.update(docRef, { carbrand: _.startCase(newValue), brandactive: anewValue });

          });
        } catch (error) {
          console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
        }
        try {
          const ccaritems = await query2.get();
          ccaritems.forEach(async (doc) => {
            const docRef = collRef2.doc(doc.id);
            batch.update(docRef, { carbrand: _.startCase(newValue), brandactive: anewValue });

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
