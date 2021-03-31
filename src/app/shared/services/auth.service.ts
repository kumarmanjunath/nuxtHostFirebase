// import  auth  from 'firebase/app';
// import { firebase } from '@firebase/app';
import { Injectable,NgZone  } from '@angular/core';
import { User } from "../services/user";

import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase/app';
import 'firebase/firestore'
const firestore = firebase.firestore()
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  clk="";
  userData: any; // Save logged in user data
  constructor(
  public afs: AngularFirestore,   // Inject Firestore service
  public auth: AngularFireAuth, // Inject Firebase auth service
  public router: Router,  
  public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {    
  /* Saving user data in localstorage when 
  logged in and setting up null when logged out */
  this.auth.authState.subscribe(user => {
  if (user) {
    //alert(" nmnnm");
  this.userData = user;
  localStorage.setItem('user', JSON.stringify(this.userData));
  JSON.parse(localStorage.getItem('user'));
  } else {
  localStorage.setItem('user', null);
  JSON.parse(localStorage.getItem('user'));
  }
  })
  }
  // Sign in with email/password
  
  SignIn(email, password) {

  return this.auth.signInWithEmailAndPassword(email, password)
  .then((result) => {
    this.clk="Just a moment....";
  this.ngZone.run(() => {
  this.router.navigate(['dashboard']);
  });
  this.SetUserData(result.user);
  }).catch((error) => {
  window.alert(error.message)
  })
  }
  
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
  const user = JSON.parse(localStorage.getItem('user'));
  //alert(user);
  return (user !== null) ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
  return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider) {
  return this.auth.signInWithPopup(provider)
  .then((result) => {
  this.ngZone.run(() => {
  this.router.navigate(['dashboard']);
  })
  this.SetUserData(result.user);
  }).catch((error) => {
  window.alert(error)
  })
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
  const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  const userData: User = {
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified
  }
  return userRef.set(userData, {
  merge: true
  })
  }
  // Sign out 
  SignOut() {
   // alert("yes baby");
  return this.auth.signOut().then(() => {
  localStorage.removeItem('user');
  this.router.navigate(['signin']);
  })
  }
}
