import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray,FormControl,FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { CdrivebookingService } from '../../shared/cdrivebooking.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {MatDialogRef} from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import * as firebase from 'firebase';
@Component({
  selector: 'app-cdrivestatus',
  templateUrl: './cdrivestatus.component.html',
  styleUrls: ['./cdrivestatus.component.scss']
})
export class CdrivestatusComponent implements OnInit {
  endpoint = 'https://asia-east2-hype-54c03.cloudfunctions.net/sendcustomersms';
  constructor(private http: HttpClient, public service: CdrivebookingService,private afStorage: AngularFireStorage,private formBuilder: FormBuilder,public dialogRef: MatDialogRef<CdrivestatusComponent>, private firestore: AngularFirestore, private toastr: ToastrService) { }
     
  ngOnInit() {
  
    }
       
    onClose() {
           this.service.initializeFormGroup();
      this.dialogRef.close();
    }
    onClear() {
      this.service.smsform.reset();
      this.service.initializeFormGroup();
      // this.toastr.success('Added Successfully', 'Agent');
    }
    onSubmit() {
      if (1==1) {

//alert("dfgdfg")

        const db = firebase.firestore();
  db.collection("parameter")
.doc("bookingids")
.get()
.then(docpar => {

var parameterCntr = docpar.data().cntr;

var sdBookingId = parameterCntr + 1;

if (parameterCntr != 0) {
db.collection("parameter")
.doc("bookingids")
.set({
 cntr: sdBookingId
})
.then(docRef => {
     let sdRef = db.collection("cdrive_booking").doc(this.service.smsmid);

let setWithOptions = sdRef.set({
status: "Done",
instamojo_id: "",
booking_type:"Offline",
booking_id:sdBookingId,
payment_status: "Done",
smssent:false,
emailsent:false,
zohosent:false    
}, {merge: true}).then(docRef => {
  this.toastr.success('Created Successfully', 'Booking Id');
              //});
                    }); 
                  }); 
                }
              }); 
      //});
    
              
     
      this.service.smsform.reset();
               
      this.onClose();
  
      }
    }
   
    closeDialog() {
      this.dialogRef.close(false);
    }

}
