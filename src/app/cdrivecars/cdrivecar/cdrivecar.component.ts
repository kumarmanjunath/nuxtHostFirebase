import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from "@angular/forms";
import { CarfleetService } from '../../shared/carfleet.service';
import { CarbrandService } from '../../shared/carbrand.service';
import { CdrivecarService } from '../../shared/cdrivecar.service';
import { LocationService } from '../../shared/location.service';
import { AgentService } from '../../shared/agent.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import * as firebase from 'firebase';
@Component({
  selector: 'app-cdrivecar',
  templateUrl: './cdrivecar.component.html',
  styleUrls: ['./cdrivecar.component.scss']
})
export class CdrivecarComponent implements OnInit {
  ltype: any = undefined;
  constructor(private afStorage: AngularFireStorage, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CdrivecarComponent>, public locationservice: LocationService, public agentservice: AgentService, public carbrandservice: CarbrandService, public service: CdrivecarService, public carfleetservice: CarfleetService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef: MatDialogRef<CdrivecarComponent>) { }


  ngOnInit() {

    this.ltype = [
      { description: 'Luxury' },
      { description: 'Premium'}
    ];

  }
  activeChange(event) {

  }
  onClear() {
    this.service.form.reset();

    
    this.service.initializeFormGroup();
    this.toastr.success('Saved Successfully', 'Chauffeur');
  }

  onSubmit() {
    if (this.service.form.get('active1').value == false) {
    
      this.service.form.get('package_hours1').clearValidators();
      this.service.form.get('package_hours1').updateValueAndValidity();

      this.service.form.get('package_kms1').clearValidators();
      this.service.form.get('package_kms1').updateValueAndValidity();

      this.service.form.get('price1').clearValidators();
      this.service.form.get('price1').updateValueAndValidity();
    }
//outstation
    if (this.service.form.get('active2').value == false) {
    
      this.service.form.get('package_hrs2').clearValidators();
      this.service.form.get('package_hrs2').updateValueAndValidity();

      this.service.form.get('package_kms2').clearValidators();
      this.service.form.get('package_kms2').updateValueAndValidity();

      this.service.form.get('price2').clearValidators();
      this.service.form.get('price2').updateValueAndValidity();

    }
//Airport
    if (this.service.form.get('active3').value == false) {
     
      this.service.form.get('toll').clearValidators();
      this.service.form.get('toll').updateValueAndValidity();

      this.service.form.get('parking_fee').clearValidators();
      this.service.form.get('parking_fee').updateValueAndValidity();

      this.service.form.get('price3').clearValidators();
      this.service.form.get('price3').updateValueAndValidity();
    }
    if (this.service.form.valid) {
var tblnme='cdrive_car';
      let brandToSplit = this.service.form.get('carbrand').value;
      brandToSplit = brandToSplit.replace(/ /g, '-');
      let brandSplit = brandToSplit;

      let classToSplit = this.service.form.get('carclass').value;
      classToSplit = classToSplit.replace(/ /g, '-');
      let classSplit = classToSplit;

      let brandclass = brandSplit + "_" + classSplit;
      let arr= this.carfleetservice.arrayfleet;
      var agarr=this.service.form.get('agent_name').value;
      var activeagent=[];
      for(var i=0;i<agarr.length;i++)
      {
        activeagent.push(true);
      }
     
    
      var docData = {
        agent_active:activeagent,
        agent_name: this.service.form.get('agent_name').value,
        agent_show: this.service.form.get('agent_name').value,
        carbrand: this.service.form.get('carbrand').value,
        carclass: this.service.form.get('carclass').value,
        brandclass: this.service.form.get('carbrand').value+"_"+this.service.form.get('carclass').value+"_"+this.service.form.get('price1').value,
        imgcar: this.service.form.get('imgcar').value,
        imgcarmob: this.service.form.get('imgcarmob').value,
        color: this.service.form.get('color').value,
        carfleet_id: arr[0].id,
        launch_year: this.service.form.get('launch_year').value,
        location: this.service.form.get('location').value,
      package_hours1: this.service.form.get('package_hours1').value,
        package_kms1: this.service.form.get('package_kms1').value,
        price1: this.service.form.get('price1').value,
        active1: this.service.form.get('active1').value,
         package_hrs2: this.service.form.get('package_hrs2').value,
        package_kms2: this.service.form.get('package_kms2').value,
        price2: this.service.form.get('price2').value,
        active2: this.service.form.get('active2').value,
           toll: this.service.form.get('toll').value,
        parking_fee: this.service.form.get('parking_fee').value,
        price3: this.service.form.get('price3').value,
        active3: this.service.form.get('active3').value,
        createdon: firebase.firestore.FieldValue.serverTimestamp(),
        updatedon:new Date(),
        brandactive: true,
        locactive: true,
        agentactive:true,
        carfleetactive:true,
       ltype: this.service.form.get('ltype').value, 
        active: this.service.form.get('active').value
      };
      // console.log(docData);
      //var myid=this.service.form.get('brand').value+"_"+this.service.form.get('carbrand').value;

      //alert(myid);
      if (!this.service.form.get('id').value) {
        this.firestore.collection("cdrive_car").add(docData);
        // var docRef = this.firestore.collection('sdrive_car').doc(brandclass);
        this.toastr.success('Added Successfully', 'Record');
        // var setWithMerge = docRef.set(docData);
      }
      else {
        delete docData.createdon;
        delete docData.brandactive;
        delete docData.locactive;
        delete docData.agentactive;
        delete docData.carfleetactive;     
        this.firestore.doc('cdrive_car/' + this.service.form.get('id').value).update(docData);
        this.toastr.success('Updated Successfully', 'Record');
      }
      this.service.form.reset();
      //this.service.initializeFormGroup();
     // this.service.intigrp();
      this.onClose();

    }
  }
  /*   <select class="textfield" name="color">
	    	    	<option value="">Select Color</option>
	    	<option value="White">White</option>
	    	<option value="Black">Black</option>
	    	<option value="Silver">Silver</option>
	    	<option value="Brown">Brown</option>
	    	<option value="Red" selected="">Red</option>
	    	<option value="Blue">Blue</option>
	    </select> */
  getagent(value) {
    this.agentservice.getagentname(value);
  }
  getbrand(value) {
    this.carbrandservice.getbrand(value);
  }
  getclassname(value) {
    this.carfleetservice.getcarclass(value);
  }
  getpremium(value) {
   
    if(value=="Premium")
    this.carfleetservice.getpremiumcar(value);
  }
  getfleet(value) {
    var carbrand = this.service.form.get('carbrand').value;
    this.carfleetservice.getcarfleet(carbrand, value);
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
