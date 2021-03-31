import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import {UploadService } from '../shared/upload.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent {
  interestFormGroup : FormGroup
  interests:any;
  selected: any;


  constructor(public interestService: UploadService, private formBuilder: FormBuilder,private firestore: AngularFirestore
  ) { }

  ngOnInit() {

    this.interestFormGroup = this.formBuilder.group({
      interests: this.formBuilder.array([])
    });


    setTimeout((res) => {

      this.interests = ["interest1", "interest2", "interest3"];
 console.log(this.firestore.collection('location').snapshotChanges());
      const valuesFromServer = ["interest1", "interest3"];
      const formArray = this.interestFormGroup.get('interests') as FormArray;
      valuesFromServer.forEach(x => formArray.push(new FormControl(x)));  
    });

  }

  onChange(event) {
    const interests = this.interestFormGroup.get('interests') as FormArray;

    if(event.checked) {
      interests.push(new FormControl(event.source.value))
    } else {
      const i = interests.controls.findIndex(x => x.value === event.source.value);
      interests.removeAt(i);
    }
  }

  submit() {
    console.log(this.interestFormGroup.value);
  }
  
}
