import { Component, OnInit ,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {FormControl} from '@angular/forms';
import { MatTableDataSource,MatSort,MatPaginator,MatDialogRef } from '@angular/material';
import { CarService } from '../shared/car.service';
import { Car } from '../shared/car.model';
import { PagerService } from '../shared/PagerService';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CarbrandService } from '../shared/carbrand.service';
import { CarfleetService } from '../shared/carfleet.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  states: string[] = [
    'Audi', 'BMW', 'Mercedes', 'Toyota' , 'Volvo'];
    brand_name="Please Select Brand Name in Previous screen";
  endpoint = 'https://us-central1-hype-54c03.cloudfunctions.net/imagekitapi/';
  employees: any = undefined;
  private carsarray  = []; 
  public carslist  = []; 
  public sortedList  = []; 
  private selectedStates  = []; 
  showlandbtn=false;
  showlandbtnmob=false;
  showsliderbtn=false;
  farray = new Array();
  constructor(private http: HttpClient,private toastr: ToastrService,public carbrandservice: CarbrandService,public carfleetservice: CarfleetService,private firestore:AngularFirestore,public dialogRef: MatDialogRef<CarsComponent>,private service: CarService,private pagerService: PagerService)
   {
    
    }
    bindFleet(ttype) {
     
      //console.log("ress: "+this.carslist[0].name);
     var acarbrand=localStorage.getItem('acarbrand');
    var acarclass=localStorage.getItem('acarclass');
    this.brand_name=acarbrand+" "+acarclass;
    if(this.brand_name=="" ||this.brand_name==" " ) 
    {
      this.brand_name="Please Select Brand Name in Previous screen";
    }
    var searchone="";
    let filterlist = acarbrand.toLowerCase(); 
    filterlist = filterlist.replace(/ /g, '-');  
if(filterlist!="")
searchone=filterlist;
if(searchone=="undefined")
searchone="";
    let sfilterlist = acarbrand.toLowerCase(); 
    sfilterlist = sfilterlist.replace(/ /g, '_'); 
    if(sfilterlist!="")
    searchone=sfilterlist;
    let filterlistclass = acarclass.toLowerCase(); 
    filterlistclass = filterlistclass.replace(/ /g, '-');  

    let sfilterlistclass = acarclass.toLowerCase(); 
    sfilterlistclass = sfilterlistclass.replace(/ /g, '_'); 
    if(searchone=="undefined")
searchone=""; 
//alert(searchone)
    this.http.get(this.endpoint+"?searchone="+searchone).subscribe((res : any[])=>{
    
      this.carsarray=res;
      this.carslist = this.carsarray;
  
    if(ttype=="landing"  )
    {
  
      this.showlandbtn=true;
 
      this.sortedList = this.carslist.filter(   
     
        car => ((car.name.toLowerCase().includes("front-side"))||(car.name.toLowerCase().includes("side-front"))||(car.name.toLowerCase().includes("side_front"))||(car.name.toLowerCase().includes("front_side"))) && ((car.name.toLowerCase().includes(filterlistclass))||(car.name.toLowerCase().includes(sfilterlistclass))));
     
      }
      if(ttype=="landingmob" )
    {
      this.showlandbtnmob=true;
      
      this.sortedList = this.carslist.filter(   
     
        car => ((car.name.toLowerCase().includes("front-side-mark3"))||(car.name.toLowerCase().includes("side-front"))||(car.name.toLowerCase().includes("side_front"))||(car.name.toLowerCase().includes("front_side"))) && ((car.name.toLowerCase().includes(filterlistclass))||(car.name.toLowerCase().includes(sfilterlistclass))));
     
    }
    if(ttype=="slider")
    {
      this.showsliderbtn=true;
      this.sortedList = this.carslist.filter(    
   car => ((car.name.toLowerCase().includes(filterlistclass))||(car.name.toLowerCase().includes(sfilterlistclass))) && !((car.name.toLowerCase().includes("front-side"))||(car.name.toLowerCase().includes("side-front")))); 
   
    }
  
  });

  }
   // array of all items to be paged
   private allItems: any[];

   // pager object
   pager: any = {};

   // paged items
   pagedItems: any[];

   ngOnInit() { 
    this.selectedStates = this.states;
    this.bindFleet(localStorage.getItem('ttype'));
    
    //this.sendEmail(); 
     }
     
  closeDialog() {
    this.dialogRef.close(false);
    this.carfleetservice.getImages();
  }
     setPage(page: number) {
      // get pager object from service
      this.pager = this.pagerService.getPager(this.sortedList.length, page);

      // get current page of items
      this.sortedList = this.sortedList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
     onKey(value) { 
     // this.selectedStates = this.search(value);
      this.sortedList = this.searchcar(value);     
      }
      onChange(event) {
        //  this.data.splice(index, 1);
        //const interests;
       // alert(event.source.value)
        if (event.checked) {
          this.farray.push(event.source.value);
        } else {
          for (var i = 0; i < 5; i++) {
            if (this.farray[i] == event.source.value) {
              this.farray.splice(i, 1);
            }
          }
        }
        console.log(this.farray);
        /* 
              if(event.checked) {
              
                var featarray = this.farray.push(event.source.value); 
               // console.log("new numbers is : " + farray );  
                //this.interests.push(event.source.value)
            //this.str+=event.source.value+",";
              } else {
                var featarray = this.farray.push(event.source.value); 
              //  const i = this.interests.controls.findIndex(x => x.value === event.source.value);
               // this.interests.removeAt(i);
              }
           console.log(this.farray); */
      }
      handleClickLanding(event: Event) {
        var str="";
       for(var i=0;i<this.farray.length;i++)
       {
        str+=this.farray[i]+"|";
       }
       localStorage.setItem('aimgslider', str);   
       this.closeDialog();    
     /*  var docData = {
        imgslider: str,
      }; */
    
     // var carfleetid=localStorage.getItem('carfleetid');
      
        //  this.firestore.doc('carfleet/'+carfleetid).update(docData);
      ///  this.firestore.collection('carfleet').add(docData);
       // alert('Added Successfully');
        //this.toastr.success('Saved Successfully', 'Image');        
      }
      handleClick(event: Event) {
        var str="";
       for(var i=0;i<this.farray.length;i++)
       {
        str=this.farray[i];
       }
       localStorage.setItem('aimgcar', str);   
       this.closeDialog();
      /* var docData = {

        imgslider: str,

        
      };
      var carfleetid=localStorage.getItem('carfleetid');
      this.firestore.doc('carfleet/'+carfleetid).update(docData); */
      ///  this.firestore.collection('carfleet').add(docData);
     //   alert('Added Successfully');
      //  this.toastr.success('Saved Successfully', 'Image');   
        
      }
      handleClickmob(event: Event) {
        var str="";
       for(var i=0;i<this.farray.length;i++)
       {
        str=this.farray[i];
       }
       localStorage.setItem('aimgcarmob', str);   
       this.closeDialog();
     
        
      }
      searchcar(value: string) { 
        let filter = value.toLowerCase();     
        return this.sortedList.filter(car => car.name.toLowerCase().search(filter));
      }
   /*    search(value: string) { 
        let filter = value.toLowerCase();
       
        return this.states.filter(option => option.toLowerCase().startsWith(filter));
      } */
}
