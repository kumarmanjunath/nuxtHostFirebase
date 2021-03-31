import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Enquiry } from './enquiry.model';
@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  formData: Enquiry;
  itemList: any = undefined;
  constructor(private firestore: AngularFirestore) { }
  
  getEmployees(frmdate,todate) {   
   // return this.firestore.collection('enquiries'), ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).snapshotChanges();
    this.itemList = this.firestore.collection('enquiries', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).orderBy('createdon', 'desc'));
    if(frmdate=="")
    this.itemList = this.firestore.collection('enquiries', ref => ref.orderBy('createdon', 'desc'));
    return this.itemList.snapshotChanges();
  }
}
