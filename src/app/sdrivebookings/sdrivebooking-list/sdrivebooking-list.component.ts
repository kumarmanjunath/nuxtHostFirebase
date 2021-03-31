import { Component, OnInit ,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { SdrivebookingService } from '../../shared/sdrivebooking.service';
import { DialogService } from '../../shared/dialog.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {MatDialog,MatDialogConfig} from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { SdrivebookingComponent } from '../sdrivebooking/sdrivebooking.component';
import { AppDateAdapter, APP_DATE_FORMATS} from  '../../shared/date.adapter';
import { SdrivebookingComponentsms } from '../sdrivebookingsms/sdrivebookingsms.component';
import { ExcelServicesService } from '../../shared/excel-services';
import { SdrivestatusComponent } from '../sdrivestatus/sdrivestatus.component';
@Component({
  selector: 'app-sdrivebooking-list',
  templateUrl: './sdrivebooking-list.component.html',
  styleUrls: ['./sdrivebooking-list.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class SdrivebookingListComponent implements OnInit {
  excelarray=[];
  amexarray=[];
  iciciarray=[];
  carfeatures: any = undefined;
  selectedOption:"1";
  constructor(private excelService:ExcelServicesService,private firestore:AngularFirestore,private toastr: ToastrService,private service: SdrivebookingService,private dialogService:DialogService, private dialog:MatDialog)
   { }
   listData: MatTableDataSource<any>;
   displayedColumns: string[] = ['slno','sverified','booking_id','customer_name','phone','carname','location','start_date','end_date','amount','mplatform','createdon','pendingtype','status','actions'];
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   searchKey: string;
   form: FormGroup = new FormGroup({
    startdate : new FormControl(''),
    enddate : new FormControl(''),  
    ctype  : new FormControl(''),
    datetype :  new FormControl(''),
    status_id : new FormControl('')     
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
    enddate :todayenddate  ,
    ctype:'All',
    datetype : "1",
    status_id:"Done"
    });
    this.bindgrid("","","Done");  
      
       }
     
      radioChange(event){        
        if(document.getElementById("rwdate").style.display=="none")
        this.bindgrid("","",this.form.get('status_id').value);         
        else
        this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value,this.form.get('status_id').value);  
      }
      onSMS(row) {

        this.service.getmsg(row); 
         const dialogConfig=new MatDialogConfig();
         dialogConfig.disableClose=true;
         dialogConfig.autoFocus=true;
         dialogConfig.width="60%";
     this.dialog.open(SdrivebookingComponentsms,dialogConfig);
     
       }
      showdatepicker(event){
        // alert(this.selectedOption);
         if(event=="1")
         {
           document.getElementById("rwdate").style.display="none";
        this.bindgrid("","",this.form.get('status_id').value);   
         }
        // alert(event)
         if(event=="2")
         {
         document.getElementById("rwdate").style.display="flex";
        this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value,this.form.get('status_id').value);   
         }
       }
       showstatus(event){
        if(document.getElementById("rwdate").style.display=="none")
        this.bindgrid("","",event);    
             
        else
        this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value,event);  
       }
    bindgrid(sdate,edate,statusid)
    {  
      
      this.service.getEmployees(sdate,edate,statusid, this.form.get('ctype').value).subscribe(actionArray => {
      let array = actionArray.map(item => {
        var sverified="";
        if(item.payload.doc.data().verified==true)
        {
        //  alert(sverified)
        sverified="1";
        }
        else  if(item.payload.doc.data().verified==false)
        {
          sverified="2";
        }
        else 
        {
          sverified="";
        }
        return {
          id: item.payload.doc.id,
          mplatform:"Website",
          amextype:"-",
          booking_type:"",
          pendingtype:"User",
          sverified:sverified,
          carname:item.payload.doc.data().carbrand+" "+item.payload.doc.data().carclass,
          ...item.payload.doc.data()
        };
      
      });
     
     // this.excelarray = array;
     
      this.fnexcel(actionArray);
     // console.log(array);
      this.listData = new MatTableDataSource(array);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        console.log("hehrbe "+data[ele]);
        return ele != 'actions' && ele != 'slno' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      }; 

    });}
       orders = [
         { id: 100, name: 'order 1' },
         { id: 200, name: 'order 2' },
         { id: 300, name: 'order 3' },
         { id: 400, name: 'order 4' }
       ];
       fnexcel(actionArray)
     {
      this.excelarray = actionArray.map(item => {
        return {
          'Booking Id':item.payload.doc.data().booking_id,
          Car :item.payload.doc.data().carbrand+" "+item.payload.doc.data().carclass,
             
          'Start Date':item.payload.doc.data().start_date+" "+item.payload.doc.data().start_time,
          'End Date':item.payload.doc.data().end_date+ " "+item.payload.doc.data().end_time,
          Location:item.payload.doc.data().location,
          'Customer Name':item.payload.doc.data().customer_name,
        
          'Days':item.payload.doc.data().days,
          
          'Coupon Code':item.payload.doc.data().coupon_code,          
          'Coupon Discount':item.payload.doc.data().coupon_discount,
          'Kms Limit':item.payload.doc.data().kms_limit,
          'Deposit':item.payload.doc.data().deposit,
          'Extra Kms':item.payload.doc.data().extra_kms,
          'Extra Kms Rental':item.payload.doc.data().extra_kms_rental,
          'Basic Rental' :item.payload.doc.data().basic_rental,  
          'Total Amount':item.payload.doc.data().amount, 
            
          'Gst Amount':item.payload.doc.data().gstamt,         
          'Payment Status':item.payload.doc.data().status,
          
          platform:item.payload.doc.data().mplatform
        };
      
      });  
//this.form.get('ctype').value=="Amex"

      this.amexarray = actionArray.map(item => {
        return {
          'Booking Id':item.payload.doc.data().booking_id,
          Car :item.payload.doc.data().carbrand+" "+item.payload.doc.data().carclass,
             
          'Start Date':item.payload.doc.data().start_date+" "+item.payload.doc.data().start_time,
          'End Date':item.payload.doc.data().end_date+ " "+item.payload.doc.data().end_time,
          Location:item.payload.doc.data().location,
          'Customer Name':item.payload.doc.data().customer_name,
        
          'Days':item.payload.doc.data().days,
          
          'Coupon Code':item.payload.doc.data().coupon_code,          
          'Coupon Discount':item.payload.doc.data().coupon_discount,
          'Kms Limit':item.payload.doc.data().kms_limit,
          'Deposit':item.payload.doc.data().deposit,
          'Extra Kms':item.payload.doc.data().extra_kms,
          'Extra Kms Rental':item.payload.doc.data().extra_kms_rental,
          'Basic Rental' :item.payload.doc.data().basic_rental,  
          'Total Amount':item.payload.doc.data().amount, 
            
          'Gst Amount':item.payload.doc.data().gstamt,         
          'Payment Status':item.payload.doc.data().status,
                    'Is Amex Used':item.payload.doc.data().isamexused,
          'Is Amex User':item.payload.doc.data().isamexuser,
          'Amex Type':item.payload.doc.data().amextype,  
          platform:item.payload.doc.data().mplatform
        };
      }); 
      
      

      this.iciciarray = actionArray.map(item => {
        return {  
          'Booking Id':item.payload.doc.data().booking_id,
          Car :item.payload.doc.data().carbrand+" "+item.payload.doc.data().carclass,
             
          'Start Date':item.payload.doc.data().start_date+" "+item.payload.doc.data().start_time,
          'End Date':item.payload.doc.data().end_date+ " "+item.payload.doc.data().end_time,
          Location:item.payload.doc.data().location,
          'Customer Name':item.payload.doc.data().customer_name,
        
          'Days':item.payload.doc.data().days,
          
          'Coupon Code':item.payload.doc.data().coupon_code,          
          'Coupon Discount':item.payload.doc.data().coupon_discount,
          'Kms Limit':item.payload.doc.data().kms_limit,
          'Deposit':item.payload.doc.data().deposit,
          'Extra Kms':item.payload.doc.data().extra_kms,
          'Extra Kms Rental':item.payload.doc.data().extra_kms_rental,
          'Basic Rental' :item.payload.doc.data().basic_rental,  
          'Total Amount':item.payload.doc.data().amount, 
            
          'Gst Amount':item.payload.doc.data().gstamt,         
          'Payment Status':item.payload.doc.data().status,
           'Isicici':item.payload.doc.data().isicici,
          'Icicicoupon':item.payload.doc.data().icicicoupon,
          platform:item.payload.doc.data().mplatform
        };
      }); 
console.log(this.amexarray)
  if(this.form.get('ctype').value=="Amex") 
this.excelarray=this.amexarray;
else if(this.form.get('ctype').value=="ICICI")
this.excelarray=this.iciciarray;
     }
       updateCalcs(event){
        if(document.getElementById("rwdate").style.display=="none")
        this.bindgrid("","",this.form.get('status_id').value);         
        else
        this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value,this.form.get('status_id').value);  
      }
      onConfirm(row) {

        this.service.changestatus(row); 
         const dialogConfig=new MatDialogConfig();
         dialogConfig.disableClose=true;
         dialogConfig.autoFocus=true;
         dialogConfig.width="60%";
     this.dialog.open(SdrivestatusComponent,dialogConfig);
     
       }
      onCreate(){
        this.service.initializeFormGroup();
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="60%";
    this.dialog.open(SdrivebookingComponent,dialogConfig);
      }

       onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
      }
      exportAsXLSX():void {  
        this.excelService.exportAsExcelFile(this.excelarray, 'Selfdrive_Booking');  
      }
      applyFilter() {
        
        this.listData.filter = this.searchKey.trim().toLowerCase();
      }
      onEdit(row) {

       this.service.populateForm(row); 
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="60%";
    this.dialog.open(SdrivebookingComponent,dialogConfig);
    
      }
    
     
     

}
