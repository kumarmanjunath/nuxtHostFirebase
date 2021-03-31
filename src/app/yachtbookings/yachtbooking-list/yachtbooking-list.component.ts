import { Component, OnInit ,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { YachtbookingService } from '../../shared/yachtbooking.service';
import { DialogService } from '../../shared/dialog.service';

import {MatDialog,MatDialogConfig} from '@angular/material';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { YachtbookingComponent } from '../yachtbooking/yachtbooking.component';
import { AppDateAdapter, APP_DATE_FORMATS} from  '../../shared/date.adapter';
import { ExcelServicesService } from '../../shared/excel-services'; 

@Component({
  selector: 'app-yachtbooking-list',
  templateUrl: './yachtbooking-list.component.html',
  styleUrls: ['./yachtbooking-list.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class YachtbookingListComponent implements OnInit {
  excelarray=[];  
  amexarray=[];
  credarray=[];
  iciciarray=[];
  carfeatures: any = undefined;

  constructor(private excelService:ExcelServicesService,private firestore:AngularFirestore,private toastr: ToastrService,private service: YachtbookingService,private dialogService:DialogService, private dialog:MatDialog)
   { }
   
   selectedOption:"1";
   listData: MatTableDataSource<any>;
   displayedColumns: string[] = ['slno','booking_id','customer_name','phone','yachtname','location','yachthrs','start_date','yachtprice','booking_source_id','createdon','status','actions'];
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   searchKey: string;
   form: FormGroup = new FormGroup({
    startdate : new FormControl(''),
    enddate : new FormControl('')  ,
    package_id  : new FormControl('') ,
    ctype :  new FormControl(''),
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
    enddate : todayenddate,
    package_id  : '0',
    ctype : "All",
    datetype : "1",
    status_id:"Done"
    });
    this.bindgrid("","","Done");  
      
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
     
      this.service.getEmployees(sdate,edate,statusid).subscribe(actionArray => {
      let array = actionArray.map(item => {
        var mampm="PM";
        if(item.payload.doc.data().yachtname=="Ashena")
        {
          mampm="AM";
        }
        return {
          id: item.payload.doc.id,
          booking_id:"-",
          booking_source_id:"Website",
         mampm:mampm,
          ...item.payload.doc.data()
        };
      });
     console.log(array);
  //  this.excelarray =array;
   //  this.fnexcel(actionArray);
 


      this.listData = new MatTableDataSource(array);

//      console.log(this.listData);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
       // console.log(data[ele]);
        return ele != 'actions' && ele != 'slno'   && ele != 'createdon'   && ele != 'start_date' && ele != 'fromtime'  && data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      }; 

    });}
     
     fnexcel(actionArray)
     {
      this.excelarray = actionArray.map(item => {
        return {
          'Booking Id':item.payload.doc.data().booking_id,
          Car :item.payload.doc.data().brand+" "+item.payload.doc.data().class,
          
          'Start Date':item.payload.doc.data().start_date+" "+item.payload.doc.data().start_time,
          'End Date':item.payload.doc.data().end_date+ " "+item.payload.doc.data().end_time,
          Location:item.payload.doc.data().location,
          'Customer Name':item.payload.doc.data().customer_name,
        
         
          'Package':item.payload.doc.data().package,
          'Standard Package Kms':item.payload.doc.data().package_kms1,
          'Days':item.payload.doc.data().days,
          'Outstation Package Kms':item.payload.doc.data().package_kms2,
          
          'Parking Fees':item.payload.doc.data().parking_fee,
          'Airport Name':item.payload.doc.data().selectatport,
          'Airport Type':item.payload.doc.data().selectattype,
          'Toll':item.payload.doc.data().toll,
          'Price':item.payload.doc.data().price_per_day,
          
          'GST Amt':item.payload.doc.data().gstamt,
          'GST Percent':item.payload.doc.data().gstpercent,
          'Coupon Code':item.payload.doc.data().coupon_code,          
          'Coupon Discount':item.payload.doc.data().coupon_discount,
          'Driver Allowance Charges':item.payload.doc.data().driver_allowance_charges,
          'Extra Kms':item.payload.doc.data().extra_kms,
          'Extra Kms Rental':item.payload.doc.data().extra_kms_rental,
          'Extra Hrs':item.payload.doc.data().extra_hrs,
          'Extra Hrs Rental':item.payload.doc.data().extra_hrs_rental,
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
          Car :item.payload.doc.data().brand+" "+item.payload.doc.data().class,
          
          'Start Date':item.payload.doc.data().start_date+" "+item.payload.doc.data().start_time,
          'End Date':item.payload.doc.data().end_date+ " "+item.payload.doc.data().end_time,
          Location:item.payload.doc.data().location,
          'Customer Name':item.payload.doc.data().customer_name,
        
         
          'Package':item.payload.doc.data().package,
          'Standard Package Kms':item.payload.doc.data().package_kms1,
          'Days':item.payload.doc.data().days,
          'Outstation Package Kms':item.payload.doc.data().package_kms2,
          
          'Parking Fees':item.payload.doc.data().parking_fee,
          'Airport Name':item.payload.doc.data().selectatport,
          'Airport Type':item.payload.doc.data().selectattype,
          'Toll':item.payload.doc.data().toll,
          'Price':item.payload.doc.data().price_per_day,
          
          'GST Amt':item.payload.doc.data().gstamt,
          'GST Percent':item.payload.doc.data().gstpercent,
          'Coupon Code':item.payload.doc.data().coupon_code,          
          'Coupon Discount':item.payload.doc.data().coupon_discount,
          'Driver Allowance Charges':item.payload.doc.data().driver_allowance_charges,
          'Extra Kms':item.payload.doc.data().extra_kms,
          'Extra Kms Rental':item.payload.doc.data().extra_kms_rental,
          'Extra Hrs':item.payload.doc.data().extra_hrs,
          'Extra Hrs Rental':item.payload.doc.data().extra_hrs_rental,
          'Basic Rental' :item.payload.doc.data().basic_rental,  
          'Total Amount':item.payload.doc.data().amount, 
            
          'Gst Amount':item.payload.doc.data().gstamt,         
          'Payment Status':item.payload.doc.data().status,
          'Credit Used' :item.payload.doc.data().creditused,
          'Is Amex Used':item.payload.doc.data().isamexused,
          'Is Amex User':item.payload.doc.data().isamexuser,        
          'Amex Type':item.payload.doc.data().amextype,
          platform:item.payload.doc.data().mplatform
        };
      }); 
      
      this.credarray = actionArray.map(item => {
        return {
         
          'Cred Coupon':item.payload.doc.data().credcoupon,
          'Credit Used' :item.payload.doc.data().creditused         
        };
      });

      this.iciciarray = actionArray.map(item => {
        return {  
          'Booking Id':item.payload.doc.data().booking_id,
          Car :item.payload.doc.data().brand+" "+item.payload.doc.data().class,
          
          'Start Date':item.payload.doc.data().start_date+" "+item.payload.doc.data().start_time,
          'End Date':item.payload.doc.data().end_date+ " "+item.payload.doc.data().end_time,
          Location:item.payload.doc.data().location,
          'Customer Name':item.payload.doc.data().customer_name,
        
         
          'Package':item.payload.doc.data().package,
          'Standard Package Kms':item.payload.doc.data().package_kms1,
          'Days':item.payload.doc.data().days,
          'Outstation Package Kms':item.payload.doc.data().package_kms2,
          
          'Parking Fees':item.payload.doc.data().parking_fee,
          'Airport Name':item.payload.doc.data().selectatport,
          'Airport Type':item.payload.doc.data().selectattype,
          'Toll':item.payload.doc.data().toll,
          'Price':item.payload.doc.data().price_per_day,
          
          'GST Amt':item.payload.doc.data().gstamt,
          'GST Percent':item.payload.doc.data().gstpercent,
          'Coupon Code':item.payload.doc.data().coupon_code,          
          'Coupon Discount':item.payload.doc.data().coupon_discount,
          'Driver Allowance Charges':item.payload.doc.data().driver_allowance_charges,
          'Extra Kms':item.payload.doc.data().extra_kms,
          'Extra Kms Rental':item.payload.doc.data().extra_kms_rental,
          'Extra Hrs':item.payload.doc.data().extra_hrs,
          'Extra Hrs Rental':item.payload.doc.data().extra_hrs_rental,
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
      radioChange(event){        
        if(document.getElementById("rwdate").style.display=="none")
        this.bindgrid("","",this.form.get('status_id').value);         
        else
        this.bindgrid(this.form.get('startdate').value,this.form.get('enddate').value,this.form.get('status_id').value);  
      }
     
exportAsXLSX():void {  
  this.excelService.exportAsExcelFile(this.excelarray, 'Chauffeurdrive_Booking');  
}
      onCreate(){
        this.service.initializeFormGroup();
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="60%";
    this.dialog.open(YachtbookingComponent,dialogConfig);
      }

       onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
      }
    
      applyFilter() {
      //  alert(this.searchKey)
        this.listData.filter = this.searchKey.trim().toLowerCase();
      }
      onEdit(row) {

       this.service.populateForm(row); 
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="60%";
    this.dialog.open(YachtbookingComponent,dialogConfig);
    
      }
    
     

}
