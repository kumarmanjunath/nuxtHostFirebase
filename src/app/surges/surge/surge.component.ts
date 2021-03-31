import { Component, OnInit } from '@angular/core';
import {  NgForm } from "@angular/forms";
import { SurgeService } from '../../shared/surge.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {MatDialogRef} from '@angular/material';
import * as firebase from 'firebase';
@Component({
  selector: 'app-surge',
  templateUrl: './surge.component.html',
  styleUrls: ['./surge.component.scss']
})
export class SurgeComponent implements OnInit {

  
  
  constructor( public dialogRef: MatDialogRef<SurgeComponent>,public service: SurgeService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef:MatDialogRef<SurgeComponent>) { }
  
    
  ngOnInit() {

   
   

    }
    
  resetForm(form?: NgForm) {
/* if(this.service.formData.id=='' || this.service.formData.id==null)
{ */
    if (form != null)
      form.resetForm();
      
    this.service.formData = {
      id: null,
      sd: 0,
        cd: 0,
       ap: 0,
       luxsd: 0,
       luxcd: 0,
       luxat: 0,
       yachtsurge: 0,
    }

  }
  onSubmit(form: NgForm) {
    let data = Object.assign({}, form.value);
    delete data.id;


    if (form.value.id == null)
    {
     // this.firestore.collection('surge').add(data);
    }
    else
    {
     // alert(form.value.cdsgt
        //)
      data={    
        ap:form.value.ap,
        cd:form.value.cd,
        sd:form.value.sd,
        luxat:form.value.luxat,
        luxcd:form.value.luxcd,
        luxsd:form.value.luxsd,
        yachtsurge:form.value.yachtsurge,
       
        updated_on:firebase.firestore.FieldValue.serverTimestamp(),         
        };
      this.firestore.doc('surge/' + form.value.id).update(data);
    }
    this.resetForm(form);
    this.toastr.success('Updated Successfully', 'Record');
    this.dailogRef.close();
  }
  onClear(form: NgForm)
  {
    this.resetForm(form);
  }
  closeDialog() {
    this.dialogRef.close(false);
  }
}
