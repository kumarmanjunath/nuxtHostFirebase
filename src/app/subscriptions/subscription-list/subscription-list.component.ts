import { Component, OnInit,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

import { SubscriptionService } from '../../shared/subscription.service';
import { DialogService } from '../../shared/dialog.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialog,MatDialogConfig} from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { ExcelServicesService } from '../../shared/excel-services'; 
//import { EnquiryComponent } from '../enquiry/enquiry.component';
import { AppDateAdapter, APP_DATE_FORMATS} from  '../../shared/date.adapter';
@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class SubscriptionListComponent implements OnInit {
  excelarray=[];  
  constructor(private excelService:ExcelServicesService,private firestore:AngularFirestore,private toastr: ToastrService,private service: SubscriptionService,private dialogService:DialogService, private dialog:MatDialog)
   { }
   listData: MatTableDataSource<any>;
   displayedColumns: string[] = ['slno','emailid','city','createdon','actions'];
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   searchKey: string;
   form: FormGroup = new FormGroup({
    startdate : new FormControl(''),
    enddate : new FormControl(''),
    datetype :  new FormControl('') ,
    ctype  : new FormControl(''),
  });
   ngOnInit() {
    var todaydate=new Date();
    todaydate.setDate(todaydate.getDate()-1);
    todaydate.setHours(0);
    var todayenddate=new Date(); 
    todayenddate.setHours(23);
    this.form.setValue({
      startdate : todaydate,
    enddate :todayenddate ,
    datetype : "1",
    ctype  : 'Email',  
    });
this.bindgrid("","");
  }
  radioChange(event){        
    if(document.getElementById("rwdate").style.display=="none")
    this.bindgrid("","");         
    else
    this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value);  

  }
bindgrid(sdate,edate)
{  
  
  this.service.getEmployees(sdate,edate,this.form.get('ctype').value).subscribe(actionArray => {
    let array = actionArray.map(item => {
      return {
        id: item.payload.doc.id,
        emailid:item.payload.doc.data().mobile,
        ...item.payload.doc.data()
      };
    
    });
 // console.log(array);
 this.excelarray = actionArray.map(item => {
  var mtable=item.payload.doc.data().emailid;
  var lbl=this.form.get('ctype').value;
  if(this.form.get('ctype').value=="Mobile")
  mtable=item.payload.doc.data().mobile;
  return {
  
   
    lbl:mtable,
    
    'City':item.payload.doc.data().city,
   
   

  };
});

  this.listData = new MatTableDataSource(array);
this.listData.sort = this.sort;
this.listData.paginator = this.paginator;
this.listData.filterPredicate = (data, filter) => {
  return this.displayedColumns.some(ele => {
   // console.log(data[ele]);
    return  ele != 'slno'  && ele != 'createdon' && data[ele].toLowerCase().indexOf(filter) != -1;
    });
  }; 

});}
exportAsXLSX():void {  
  this.excelService.exportAsExcelFile(this.excelarray, 'Subscriptions_list');  
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
updateCalcs(event){
  this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value);
 
}

       onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
      }
    
      applyFilter() {
        
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
        var mtable="subscriptions";
        if(this.form.get('ctype').value=="Mobile")
        mtable="getlink";
        this.firestore.doc(mtable+'/' + id).delete();
        this.toastr.warning('Deleted successfully','subscriptions. Register');
  }
}); 
   
      }

}
