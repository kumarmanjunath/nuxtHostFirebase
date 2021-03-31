import { Component, OnInit ,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator } from '@angular/material';
import {CdrivecarService } from '../../shared/cdrivecar.service';
import { DialogService } from '../../shared/dialog.service';

import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialog,MatDialogConfig} from '@angular/material';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExcelServicesService } from '../../shared/excel-services'; 
import { ToastrService } from 'ngx-toastr';
import { CdrivecarComponent } from '../cdrivecar/cdrivecar.component';

@Component({
  selector: 'app-cdrivecar-list',
  templateUrl: './cdrivecar-list.component.html',
  styleUrls: ['./cdrivecar-list.component.scss']
})
export class CdrivecarListComponent implements OnInit {

  constructor(private excelService:ExcelServicesService,private firestore:AngularFirestore,private toastr: ToastrService,public service: CdrivecarService,private dialogService:DialogService, private dialog:MatDialog)
   { }
 
   listData: MatTableDataSource<any>;
   excelarray=[];
   //excelarray: Array<any>;
   displayedColumns: string[] = ['slno','carbrand','carclass','location','agent_show','active1','active2','active3','updatedon','active','actions'];
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   searchKey: string;
   
   ngOnInit() {
   
      this.bindgrid();
      
       }
      bindgrid()
      {       this.service.getEmployees(this.service.frm.get('isactive').value,this.service.frm.get('isltype').value).subscribe(actionArray => {
        let array = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          };
        
        });
        //this.excelarray = array;
       this.excelarray = actionArray.map(item => {
        return {
        
          'Car' :item.payload.doc.data().carbrand+" "+item.payload.doc.data().carclass,
         
          'Location':item.payload.doc.data().location,
          'Color':item.payload.doc.data().color,          
          'Launch Year':item.payload.doc.data().launch_year,
          'Is Standard':item.payload.doc.data().active1,
          'Standard Package' :item.payload.doc.data().package_hours1+"Hr - "+item.payload.doc.data().package_kms1+"Kms",
          'Standard Price':item.payload.doc.data().price1,
          'Is Outstation':item.payload.doc.data().active2,
          'Outstation Package':item.payload.doc.data().package_hrs2+"Hr - "+item.payload.doc.data().package_kms2+"Kms",
          'Outstation Price':item.payload.doc.data().price2,
          'Is Airport':item.payload.doc.data().active3,
          'Toll'   :item.payload.doc.data().toll,       
          'Parking Fee':item.payload.doc.data().parking_fee,
          'Airport Price':item.payload.doc.data().price3
          
        };
      
      }); 
        this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
        return ele != 'actions' && ele != 'slno' && ele != 'active' && ele != 'active1' && ele != 'active2' && ele != 'active3' && ele != 'price' && ele != 'kms_limit' && ele != 'deposit' && ele != 'agent_show' && ele != 'updatedon' && data[ele].toLowerCase().indexOf(filter) != -1;
          });
        }; 

      });}
       onCreate(){
       this.service.initializeFormGroup();
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="70%";
    this.dialog.open(CdrivecarComponent,dialogConfig);
      }
      radioChange(event){        
        this.bindgrid();   
      }
      exportAsXLSX():void {  
        this.excelService.exportAsExcelFile(this.excelarray, 'Chauffeur_CarFleet');  
      }
       onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
      }
    
      applyFilter() {
        
        this.listData.filter = this.searchKey.trim().toLowerCase();
      }
      onEdit(row) {
    this.service.populateForm(row);    
  
     // this.service.form = Object.assign({}, row);
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="70%";
    this.dialog.open(CdrivecarComponent,dialogConfig);
    
      }
     
      onDelete(id) {
     
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.panelClass='confirm-dialog-container';     
    this.dialog.open(MatConfirmDialogComponent,dialogConfig)
    .afterClosed().subscribe(res =>{
      if(res){      
        this.firestore.doc('cdrive_car/' + id).delete();
        this.toastr.warning('Deleted Successfully','Record');
  }
}); 
   
      }

}
