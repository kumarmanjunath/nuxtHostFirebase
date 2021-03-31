import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray,FormControl,FormBuilder, Validators } from "@angular/forms";

import { SdrivebookingService } from '../../shared/sdrivebooking.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {MatDialogRef} from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { MatTableDataSource,MatSort,MatPaginator,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import * as firebase from 'firebase';
@Component({
  selector: 'app-sdrivebooking',
  templateUrl: './sdrivebooking.component.html',
  styleUrls: ['./sdrivebooking.component.scss']
})
export class SdrivebookingComponent implements OnInit {
 
  constructor( public service: SdrivebookingService,private afStorage: AngularFireStorage,private formBuilder: FormBuilder,public dialogRef: MatDialogRef<SdrivebookingComponent>, private firestore: AngularFirestore, private toastr: ToastrService) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['drivername','driverphone','driverreg','secretcode','status','createdon'];
 
  ngOnInit() {
    
  //this.bindgrid(this.service.smsbookingid);
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
