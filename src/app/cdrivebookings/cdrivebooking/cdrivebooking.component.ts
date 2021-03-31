import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray,FormControl,FormBuilder, Validators } from "@angular/forms";
import { MatTableDataSource,MatSort,MatPaginator,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

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
  selector: 'app-cdrivebooking',
  templateUrl: './cdrivebooking.component.html',
  styleUrls: ['./cdrivebooking.component.scss']
})
export class CdrivebookingComponent implements OnInit {
  constructor( public service: CdrivebookingService,private afStorage: AngularFireStorage,private formBuilder: FormBuilder,public dialogRef: MatDialogRef<CdrivebookingComponent>, private firestore: AngularFirestore, private toastr: ToastrService) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['drivername','driverphone','driverreg','secretcode','status','createdon'];
 
  ngOnInit() {
  
    }
    bindgrid(bookingid)
    {
     this.service.getDrivers(bookingid).subscribe(actionArray => {
       let array = actionArray.map(item => {
         return {
           id: item.payload.doc.id,
          
           ...item.payload.doc.data()
         };
       
       });
     
      // console.log(array);
       this.listData = new MatTableDataSource(array);
       return this.displayedColumns.some(ele => {
         // console.log(data[ele]);
          return ele != 'actions';
          });
     });
    }
    onClose() {
           this.service.initializeFormGroup();
      this.dialogRef.close();
    }
   
   
    closeDialog() {
      this.dialogRef.close(false);
    }
}
