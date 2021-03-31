import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from "@angular/forms";
import { AgentService } from '../../shared/agent.service';
import { LocationService } from '../../shared/location.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { MatTableDataSource,MatSort,MatPaginator } from '@angular/material';
import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import 'firebase/firestore'
const firestore = firebase.firestore()


@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  locations = [];
  str = "";
  constructor(public dialogRef: MatDialogRef<AgentComponent>, private formBuilder: FormBuilder, public service: AgentService, public locationservice: LocationService, private firestore: AngularFirestore, private toastr: ToastrService, public dailogRef: MatDialogRef<AgentComponent>) { }
  interestFormGroup: FormGroup
  interests: any;
  selected: any;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['slno', 'fullname', 'location_id', 'email', 'phone', 'updatedon', 'active', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;
  ngOnInit() {

  }

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    // this.toastr.success('Added Successfully', 'Agent');
  }

  onSubmit() {
    if (this.service.form.valid) {
      let nameToSplit = this.service.form.get('fullname').value;
      nameToSplit = nameToSplit.replace(/ /g, '_');
      let nameSplit = nameToSplit;
      var docData = {

        fullname: _.startCase(this.service.form.get('fullname').value),
        location_id: this.service.form.get('location_id').value,
        phone: this.service.form.get('phone').value,
        phone1: this.service.form.get('phone1').value,
        phone2: this.service.form.get('phone2').value,
        email: this.service.form.get('email').value,
        email1: this.service.form.get('email1').value,
        email2: this.service.form.get('email2').value,
        bank: this.service.form.get('bank').value,
        accno: this.service.form.get('accno').value,
        ifsc: this.service.form.get('ifsc').value,
        servicetax: this.service.form.get('servicetax').value,
        tax: this.service.form.get('tax').value,
        commission: this.service.form.get('commission').value,
        createdon: firebase.firestore.FieldValue.serverTimestamp(),
        updatedon: new Date(),
        discount: this.service.form.get('discount').value,
        active: this.service.form.get('active').value
      };
      if (!this.service.form.get('id').value) {

        var docRef = this.firestore.collection('agent').doc(nameSplit);

        var setWithMerge = docRef.set(docData);
        this.toastr.success('Saved Successfully', 'Record');
      }
      else {
        delete docData.createdon;
        this.multiUpdate(docData);
      
      }
      this.service.form.reset();
      //  this.service.initializeFormGroup();
     // this.service.intigrp();
      this.bindgrid();
      this.onClose();

    }
  }
  async multiUpdate(docData)
  {
    var newValue="";
    var oldValue="";
    var anewValue="";
    var aoldValue="";
    newValue=this.service.form.get('fullname').value;
    oldValue=this.service.form.get('hfullname').value;
  var newlocation=this.service.form.get('location_id').value;
    anewValue=this.service.form.get('active').value;
    aoldValue=this.service.form.get('hactive').value;
    if(1==1)
    {
     // alert(oldValue);
    const db = firebase.firestore();
  
    const collRef1 = db.collection('sdrive_car');
    const query1 = collRef1.where("agent_name", "array-contains", oldValue);
  
    const collRef2 = db.collection('cdrive_car');
    const query2 = collRef2.where("agent_name", "array-contains", oldValue);
  
    const mainRef = db.collection('agent').doc(this.service.form.get('id').value);
  
  
    const batch = db.batch();
    // Step 1 - Read document data and prepare batch updates
  
  
    try {
      
        batch.update(mainRef, docData);
    
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
  
    try {
      const scaritems = await query1.get();
      scaritems.forEach(async (doc) => {
        const docRef = collRef1.doc(doc.id);
      //  console.log("len"+doc.data().agent_name.length);
        var arr=doc.data().agent_name;
        var arractive=doc.data().agent_active;
        var curlocation=doc.data().location;
       
        var arrshow=doc.data().agent_show;
        var temparr=[];
        var temparractive=[];
        var temparrshow=[];
        for(var i=0;i<arr.length;i++)
        {
          if(arr[i]==oldValue)
          {
        temparr.push(newValue);
        if(newlocation!=curlocation)
        {
          temparractive.push(false);
        }
        else
        {
        temparractive.push(anewValue);
        }
          }
          else
          {
          temparr.push(arr[i]);
         temparractive.push(arractive[i]);
         
          }
         

        }
        for(var i=0;i<temparr.length;i++)
        {
          if(temparractive[i]==true)
          {
          temparrshow.push(temparr[i]);
          }
        }
        batch.update(docRef, { agent_name:temparr,agent_show:temparrshow,agent_active:temparractive});
      //  agent_name: _.startCase(newValue),
      });
    } catch (error) {
      console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
    }
    try {
      const ccaritems = await query2.get();
      ccaritems.forEach(async (doc) => {
        const docRef = collRef2.doc(doc.id);
        var arr=doc.data().agent_name;
        var curlocation=doc.data().location;
        var arractive=doc.data().agent_active;
        var arrshow=doc.data().agent_show;
        var temparr=[];
        var temparractive=[];
        var temparrshow=[];
        for(var i=0;i<arr.length;i++)
        {
          if(arr[i]==oldValue)
          {
        temparr.push(newValue);
       // temparractive.push(anewValue);
        if(newlocation!=curlocation)
        {
          temparractive.push(false);
        }
        else
        {
        temparractive.push(anewValue);
        }
          }
          else
          {
          temparr.push(arr[i]);
         temparractive.push(arractive[i]);
        
          }
        }
        for(var i=0;i<temparr.length;i++)
        {
          if(temparractive[i]==true)
          {
          temparrshow.push(temparr[i]);
          }
        }
        batch.update(docRef, { agent_name:temparr,agent_show:temparrshow,agent_active:temparractive});
       
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
  bindgrid() {
    this.service.getEmployees( this.service.frm.get('isactive').value).subscribe(actionArray => {
      let array = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });

      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          // console.log(data[ele]);
          return ele != 'actions' && ele != 'slno' && ele != 'active'  && ele != 'updatedon' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      };

    });
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
