import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray,FormControl,FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { SdrivebookingService } from '../../shared/sdrivebooking.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {MatDialogRef} from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import * as firebase from 'firebase';
@Component({
  selector: 'app-sdrivebookingsms',
  templateUrl: './sdrivebookingsms.component.html',
  styleUrls: ['./sdrivebookingsms.component.scss']
})
export class SdrivebookingComponentsms implements OnInit {
  endpoint = 'https://asia-east2-hype-54c03.cloudfunctions.net/sendcustomersms';
  constructor(private http: HttpClient, public service: SdrivebookingService,private afStorage: AngularFireStorage,private formBuilder: FormBuilder,public dialogRef: MatDialogRef<SdrivebookingComponentsms>, private firestore: AngularFirestore, private toastr: ToastrService) { }
     
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
      
      if (this.service.smsform.valid) {
        var smscontent=this.service.txtsmsmsg;
        var cusname =  this.service.smscusname;    
      //  alert(cusname)         
        var drivername =this.service.smsform.get('drivername').value;
        var driverphone = this.service.smsform.get('driverphone').value;
        var driverreg = this.service.smsform.get('driverreg').value;
        var secretcode = this.service.smsform.get('secretcode').value;
        var smspackage=this.service.smspackage;
        var smscarname=this.service.smscarname;
    if(this.service.smsurl==undefined)
    this.service.smsurl="";
      var docData = {
        cusname:cusname,
        cusphone:this.service.smscusphone,
        carname:smscarname,
        bookingid: this.service.smsbookingid,
        bookingdate: this.service.smsbookingdate,
        package:smspackage,
        drivername: drivername, 
        driverphone:driverphone,
        driverreg:driverreg,
        secretcode:parseFloat(secretcode),
        imgurl:this.service.smsurl,
        createdon: firebase.firestore.FieldValue.serverTimestamp(),
        updatedon: new Date(),
      packagename:this.service.smsfreekms,
      mid:this.service.smsmid,
        status:"Pending",
        active: true
      };
      this.firestore.collection('driver_transaction').add(docData).then(docRefs => {
//alert(this.service.smsmid)
      this.firestore.collection("sdrive_booking")
      .doc(this.service.smsmid)
      .set({verified:false}, {merge: true})
      .then(docRef => {
       console.log("oi raju  ")
              /*     
      this.http.get(this.endpoint+"?cusname="+cusname+"&drivername="+drivername+"&driverphone="+driverphone+"&driverreg="+driverreg+"&secretcode="+secretcode+"&cusphone="+this.service.smscusphone+"&smspackage="+smspackage+"&smscarname="+smscarname).subscribe((res : any[])=>{ */
     
        
      //});
      var mystring=this.endpoint+"?cusname="+cusname+"&drivername="+drivername+"&driverphone="+driverphone+"&bookingid="+this.service.smsbookingid+"&driverreg="+driverreg+"&secretcode="+secretcode+"&cusphone="+this.service.smscusphone+"&smspackage="+smspackage+"&smscarname="+smscarname;

      this.http.get(mystring).subscribe((res : any[])=>{ 
    
       
      });
            }); 
          }); 
        
    
          this.toastr.success('Sent Successfully', 'SMS');
          this.service.smsform.reset();
         
          this.onClose();
        /*     
      this.http.get(this.endpoint+"?cusname="+cusname+"&drivername="+drivername+"&driverphone="+driverphone+"&driverreg="+driverreg+"&secretcode="+secretcode+"&cusphone="+this.service.smscusphone+"&smspackage="+smspackage+"&smscarname="+smscarname).subscribe((res : any[])=>{ */
       /*  this.toastr.success('Sent Successfully', 'SMS');
      
        this.service.smsform.reset();
       
        this.onClose();
         */
      //});
     
     
         
  
      }
    }
   
    closeDialog() {
      this.dialogRef.close(false);
    }

}
