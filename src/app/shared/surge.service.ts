import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Surge } from './surge.model';
@Injectable({
  providedIn: 'root'
})
export class SurgeService {
  formData: Surge;
  constructor(private firestore: AngularFirestore) { }
  
  getEmployees() {   
    return this.firestore.collection('surge').snapshotChanges();
  }
}
