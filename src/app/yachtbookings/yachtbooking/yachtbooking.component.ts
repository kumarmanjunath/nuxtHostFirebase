import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray,FormControl,FormBuilder, Validators } from "@angular/forms";

import { YachtbookingService } from '../../shared/yachtbooking.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {MatDialogRef} from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import * as firebase from 'firebase';
@Component({
  selector: 'app-yachtbooking',
  templateUrl: './yachtbooking.component.html',
  styleUrls: ['./yachtbooking.component.scss']
})
export class YachtbookingComponent implements OnInit {
  constructor( public service: YachtbookingService,private afStorage: AngularFireStorage,private formBuilder: FormBuilder,public dialogRef: MatDialogRef<YachtbookingComponent>, private firestore: AngularFirestore, private toastr: ToastrService) { }
     
  ngOnInit() {
  
    }
       
    onClose() {
           this.service.initializeFormGroup();
      this.dialogRef.close();
    }
   
   
    closeDialog() {
      this.dialogRef.close(false);
    }
}
