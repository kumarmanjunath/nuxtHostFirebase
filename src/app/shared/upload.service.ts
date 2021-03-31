import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}

  all() {
    return this.http.get('/app/interests.json');
  }
}
