import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  itemList: any = undefined;
  constructor(private firestore: AngularFirestore) { }
  
  getEmployees(frmdate,todate,ctype) {   
   // return this.firestore.collection('enquiries'), ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).snapshotChanges();
   if(ctype=="Email")
   {
      if(frmdate=="")
   {
     this.itemList = this.firestore.collection('subscriptions', ref => ref.orderBy('createdon', 'desc'));

   }
   else
    this.itemList = this.firestore.collection('subscriptions', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).orderBy('createdon', 'desc'));
   
  }


else if(ctype=="Mobile")
{
   if(frmdate=="")
{
  this.itemList = this.firestore.collection('getlink', ref => ref.orderBy('createdon', 'desc'));

}
else
 this.itemList = this.firestore.collection('getlink', ref => ref.where("createdon", ">=", frmdate).where("createdon", "<=", todate).orderBy('createdon', 'desc'));

}
return this.itemList.snapshotChanges();
}


}
