import { Component, OnInit ,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CustomerService } from '../../shared/customer.service';
import { DialogService } from '../../shared/dialog.service';
import { Customer } from 'app/shared/customer.model';
import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatConfirmDialogActionComponent } from '../../mat-confirm-dialogaction/mat-confirm-dialog.component';
import {MatDialog,MatDialogConfig} from '@angular/material';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { CustomerComponent } from '../customer/customer.component';
import { AppDateAdapter, APP_DATE_FORMATS} from  '../../shared/date.adapter';
import * as firebase from 'firebase';
import { ExcelServicesService } from '../../shared/excel-services'; 
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class CustomerListComponent implements OnInit {
  excelarray=[];  
  amexcoupon:false;
  fueltype: any = undefined;
  constructor(private excelService:ExcelServicesService,private firestore:AngularFirestore,private toastr: ToastrService,private service: CustomerService,private dialogService:DialogService, private dialog:MatDialog)
   { }
   listData: MatTableDataSource<any>;
   displayedColumns: string[] = ['slno','fullname','city','phone','email','platformtype','amextype','maincredits','couponcode','createdon','active','actions'];
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   searchKey: string;

   selectedOption:"1";
   form: FormGroup = new FormGroup({
    startdate : new FormControl(''),
    enddate : new FormControl(''),
    ctype  : new FormControl(''),
    datetype :  new FormControl('') 
  });
   ngOnInit() {
    // document.getElementById("n").value="";
    var todaydate=new Date();
    todaydate.setDate(todaydate.getDate()-1);
    todaydate.setHours(0);
    var todayenddate=new Date(); 
    todayenddate.setHours(23);
    this.form.setValue({
      startdate : todaydate,
    enddate :todayenddate,
    ctype  : 'All',
    datetype : "1"  
    });
 
  
    
this.selectedOption="1";
//alert(this.selectedOption)
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
  
  this.service.getEmployees(sdate, edate, this.form.get('ctype').value).subscribe(actionArray => {
    let array = actionArray.map(item => {
    
      return {
        id: item.payload.doc.id,
        amextype: "-",
        platformtype:"Website",
        maincredits:"-",
        couponcode:"-",

        ...item.payload.doc.data()
      };
    
    });
   // this.excelarray =array;
   this.excelarray = actionArray.map(item => {
      return {
      
       
        'Full Name':item.payload.doc.data().fullname,
        
        Location:item.payload.doc.data().city,
        'Member Type':item.payload.doc.data().membertype,
        'Amex Type':item.payload.doc.data().amextype,
        'Main Credits':item.payload.doc.data().maincredits,
        'Coupon Code':item.payload.doc.data().couponcode,
        'Platform Type':item.payload.doc.data().platformtype,      
        Active:item.payload.doc.data().active
       

      };

    }); 
//  console.log(array);
  this.listData = new MatTableDataSource(array);
this.listData.sort = this.sort;
this.listData.paginator = this.paginator;
this.listData.filterPredicate = (data, filter) => {
  console.log(data);
  return this.displayedColumns.some(ele => {
  var elem="";
  try
  {
    elem=data[ele];
    if(elem==null)
    elem="";
  }
  catch(ex)
  {}
    return ele != 'actions' && ele != 'slno' && ele != 'createdon'  && ele != 'active'  && elem.toString().toLowerCase().indexOf(filter) != -1;
    });
  }; 

});}


exportAsXLSX():void {  
  this.excelService.exportAsExcelFile(this.excelarray, 'Customer_list');  
}
updateCalcs(event){
  this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value);   
 
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
       onCreate(){
        //this.service.initializeFormGroup();
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="50%";
    this.dialog.open(CustomerComponent,dialogConfig);
      }

       onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
      }
    
      applyFilter() {
        
        this.listData.filter = this.searchKey.trim().toLowerCase();
      }
   /*   onEdit(emp: Customer) {
      
     console.log(emp);
        this.service.formData = Object.assign({}, emp);
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="50%";
    this.dialog.open(CustomerComponent,dialogConfig);
    
      }
     */
      onDelete(id: string) {
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.panelClass='confirm-dialog-container';
      ;
     
    this.dialog.open(MatConfirmDialogComponent,dialogConfig)
    .afterClosed().subscribe(res =>{
      if(res){      
        this.firestore.doc('customer/' + id).delete();
        this.toastr.warning('Deleted successfully','Customer. Register');
  }
}); 
   
      }

      onEdit(row) {

        this.service.populateForm(row); 
         const dialogConfig=new MatDialogConfig();
         dialogConfig.disableClose=true;
         dialogConfig.autoFocus=true;
         dialogConfig.width="60%";
     this.dialog.open(CustomerComponent,dialogConfig);
     
       }

      onDowngrade(id: string) {
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.panelClass='confirm-dialog-container';
      ;
     
    this.dialog.open(MatConfirmDialogActionComponent,dialogConfig)
    .afterClosed().subscribe(res =>{
      if(res){      
      //  alert(id)
        var docData = {
         membertype: firebase.firestore.FieldValue.delete(),
         amextype: firebase.firestore.FieldValue.delete(),
         maincredits: firebase.firestore.FieldValue.delete()
        };
        this.firestore.doc('customer/' + id).update(docData);
        this.toastr.warning('Converted to Normal user successfully','Customer. Register');
  }
}); 
   
      }



}
