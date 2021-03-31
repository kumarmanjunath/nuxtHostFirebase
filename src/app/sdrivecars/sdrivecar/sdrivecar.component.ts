import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from "@angular/forms";
import { CarfleetService } from '../../shared/carfleet.service';
import { CarbrandService } from '../../shared/carbrand.service';
import { SdrivecarService } from '../../shared/sdrivecar.service';
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
  selector: 'app-sdrivecar',
  templateUrl: './sdrivecar.component.html',
  styleUrls: ['./sdrivecar.component.scss']
})
export class SdrivecarComponent implements OnInit {
  ltype: any = undefined;
  fueltype: any = undefined;
  constructor(private afStorage: AngularFireStorage, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<SdrivecarComponent>, public locationservice: LocationService, public agentservice: AgentService, public carbrandservice: CarbrandService, public service: SdrivecarService, public carfleetservice: CarfleetService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef: MatDialogRef<SdrivecarComponent>) { }


  ngOnInit() {
    this.ltype = [
      { description: 'Luxury' },
      { description: 'Premium'}
    ];
    this.carfleetservice.arrayfleet =[];
    this.fueltype = [
      { description: '24' },
      { description: '9am - 9pm'},
    { description: '12am - 12am'}	    
    ];

  }
  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.toastr.success('Submitted successfully', 'Self-drive. Register');
  }

  onSubmit() {

    if (this.service.form.valid) {
      let brandToSplit = this.service.form.get('carbrand').value;
      brandToSplit = brandToSplit.replace(/ /g, '-');
      let brandSplit = brandToSplit;

      let classToSplit = this.service.form.get('carclass').value;
      classToSplit = classToSplit.replace(/ /g, '-');
      let classSplit = classToSplit;

      let brandclass = brandSplit + "_" + classSplit;
     let arr= this.carfleetservice.arrayfleet;
     //console.log(arr);
    // carfleet_id=arr[0].id;

    var agarr=this.service.form.get('agent_name').value;
    var activeagent=[];
    for(var i=0;i<agarr.length;i++)
    {
      activeagent.push(true);
    }
      var docData = {
        agent_name: this.service.form.get('agent_name').value,
        agent_show: this.service.form.get('agent_name').value,
        agent_active:activeagent,
        carbrand: this.service.form.get('carbrand').value,
        carclass: this.service.form.get('carclass').value,
        brandclass: this.service.form.get('carbrand').value+"_"+this.service.form.get('carclass').value+"_"+this.service.form.get('price').value,
        imgcar:this.service.form.get('imgcar').value,
        imgcarmob:this.service.form.get('imgcarmob').value,
        color: this.service.form.get('color').value,
        deposit: this.service.form.get('deposit').value,
        carfleet_id: arr[0].id,
        extra_km_charge: this.service.form.get('extra_km_charge').value,
        kms_limit: this.service.form.get('kms_limit').value,
        launch_year: this.service.form.get('launch_year').value,
        package_hours: this.service.form.get('package_hours').value,
        location: this.service.form.get('location').value,
        price: this.service.form.get('price').value,
        createdon: firebase.firestore.FieldValue.serverTimestamp(),
        updatedon: new Date(),
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
        this.firestore.collection('sdrive_car').add(docData);
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
        this.firestore.doc('sdrive_car/' + this.service.form.get('id').value).update(docData);
        this.toastr.success('Updated Successfully', 'Record');
      }
      this.service.form.reset();
      //  this.service.initializeFormGroup();
    //  this.service.intigrp();
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
