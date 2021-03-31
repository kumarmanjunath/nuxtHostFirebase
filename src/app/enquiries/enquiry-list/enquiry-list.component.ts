import { Component, OnInit,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

import { EnquiryService } from '../../shared/enquiry.service';
import { DialogService } from '../../shared/dialog.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Enquiry } from 'app/shared/enquiry.model';
import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialog,MatDialogConfig} from '@angular/material';
import { ExcelServicesService } from '../../shared/excel-services'; 
import { ToastrService } from 'ngx-toastr';
//import { EnquiryComponent } from '../enquiry/enquiry.component';
import { AppDateAdapter, APP_DATE_FORMATS} from  '../../shared/date.adapter';
@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./enquiry-list.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class EnquiryListComponent implements OnInit {

  constructor(private excelService:ExcelServicesService,private firestore:AngularFirestore,private toastr: ToastrService,private service: EnquiryService,private dialogService:DialogService, private dialog:MatDialog)
   { }
   selectedOption:"1";
   listData: MatTableDataSource<any>;
   excelarray=[];  
   displayedColumns: string[] = ['slno','fullName','etype','city','email','phone','mplatform','comments','createdon','actions'];
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   searchKey: string;
   form: FormGroup = new FormGroup({
    startdate : new FormControl(''),
    enddate : new FormControl(''),
    datetype :  new FormControl(''),    
  });
   ngOnInit() {
    this.selectedOption="1";
    var todaydate=new Date();
    todaydate.setDate(todaydate.getDate()-1);
    todaydate.setHours(0);
    var todayenddate=new Date(); 
    todayenddate.setHours(23);
    this.form.setValue({
      startdate : todaydate,
    enddate :todayenddate ,
    datetype : "1"
    });
this.bindgrid("","");
  }
  showdatepicker(event){
    // alert(this.selectedOption);
     if(event=="1")
     {
       document.getElementById("rwdate").style.display="none";
     this.bindgrid("","");   
     }
    // alert(event)
     if(event=="2")
     {
     document.getElementById("rwdate").style.display="flex";
     this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value);   
     }
   }
bindgrid(sdate,edate)
{  
  
  this.service.getEmployees(sdate,edate).subscribe(actionArray => {
    let array = actionArray.map(item => {
      return {
        id: item.payload.doc.id,
        mplatform:"Website",
        city:"-",
        ...item.payload.doc.data()
      };
    
    });
 // console.log(array);
 //this.excelarray=array;
 this.excelarray = actionArray.map(item => {
  return {
    'Type':item.payload.doc.data().etype,
    'Full Name':item.payload.doc.data().fullName,
    
   Platform:item.payload.doc.data().mplatform,
    'Comments':item.payload.doc.data().comments,      
    Location:item.payload.doc.data().city
   

  };

}); 
  this.listData = new MatTableDataSource(array);
this.listData.sort = this.sort;
this.listData.paginator = this.paginator;
this.listData.filterPredicate = (data, filter) => {
  return this.displayedColumns.some(ele => {
   // console.log(data[ele]);
    return ele != 'actions' && ele != 'slno'  && ele != 'createdon' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
    });
  }; 

});}

exportAsXLSX():void {  
  this.excelService.exportAsExcelFile(this.excelarray, 'Enquiry_list');  
}  
updateCalcs(event){
  this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value);
 
}

       onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
      }
    
      applyFilter() {
       // alert(this.searchKey)
        this.listData.filter = this.searchKey.trim().toLowerCase();
      }
    
      onDelete(id: string) {
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.panelClass='confirm-dialog-container';
      ;
     
    this.dialog.open(MatConfirmDialogComponent,dialogConfig)
    .afterClosed().subscribe(res =>{
      if(res){      
        this.firestore.doc('enquiries/' + id).delete();
        this.toastr.warning('Deleted successfully','enquiries. Register');
  }
}); 
   
      }

}
