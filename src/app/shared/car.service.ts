import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

import { Car } from './car.model';
@Injectable({
  providedIn: 'root'
})
export class CarService {

  formData: Car;
  constructor(private firestore: AngularFirestore) { }  

  getEmployees() {       
    return this.firestore.collection('carfleet').snapshotChanges();
  }
}
