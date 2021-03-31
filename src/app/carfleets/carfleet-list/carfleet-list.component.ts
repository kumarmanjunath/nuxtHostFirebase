/*import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CarfleetService } from '../../shared/carfleet.service';
import { DialogService } from '../../shared/dialog.service';
import { Carfleet } from 'app/shared/carfleet.model';
import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { CarfleetComponent } from '../carfleet/carfleet.component';
import { ExcelServicesService } from '../../shared/excel-services';  */ 

import { Component, OnInit ,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator,NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { CarfleetService } from '../../shared/carfleet.service';
import { DialogService } from '../../shared/dialog.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {MatDialog,MatDialogConfig} from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CarfleetComponent } from '../carfleet/carfleet.component';
import { AppDateAdapter, APP_DATE_FORMATS} from  '../../shared/date.adapter';
import { ExcelServicesService } from '../../shared/excel-services';

@Component({
  selector: 'app-carfleet-list',
  templateUrl: './carfleet-list.component.html',
  styleUrls: ['./carfleet-list.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class CarfleetListComponent implements OnInit {
  excelarray:[];
  carfeatures: any = undefined;
   
   fuel:Array<any>;
  constructor(private excelService:ExcelServicesService,private firestore: AngularFirestore, private toastr: ToastrService, public service: CarfleetService, private dialogService: DialogService, private dialog: MatDialog) {
    
   }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['slno','ltype', 'brand', 'class',  'imgcar', 'updatedon', 'active', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit() {
    
    this.bindgrid();

  }
  radioChange(event) {
    this.bindgrid();
  }

  exportAsXLSX():void {  
    this.excelService.exportAsExcelFile(this.excelarray, 'carfleet');  
  }  
  bindgrid() {
   // alert(this.service.frm.get('isactive').value);
    this.service.getEmployees(this.service.frm.get('isactive').value,this.service.frm.get('isltype').value).subscribe(actionArray => {
      let array = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          fuel:"-",
          ...item.payload.doc.data()
        };

      });
     // this.excelarray =array;
     
     this.excelarray = actionArray.map(item => {
        return {
        
          Car:item.payload.doc.data().brand + " "+item.payload.doc.data().class,
          Fuel:item.payload.doc.data().fuel,
          Gear:item.payload.doc.data().gear,
          
          Lugguage:item.payload.doc.data().lugguage,
          Seats:item.payload.doc.data().seat
        };

      });  
      //
     
     
     
      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          // console.log(data[ele]);
          return ele != 'actions' && ele != 'slno'  && ele != 'imgcar' && ele != 'updatedon' && ele != 'active' && data[ele].toLowerCase().indexOf(filter) != -1;
        });
      };

    });
  }
  orders = [
    { id: 100, name: 'order 1' },
    { id: 200, name: 'order 2' },
    { id: 300, name: 'order 3' },
    { id: 400, name: 'order 4' }
  ];



  onCreate() {
    localStorage.setItem('acarbrand', '');
    localStorage.setItem('acarclass', '');
    localStorage.setItem('aimgslider', '');
    localStorage.setItem('aimgcar', ''); 
    localStorage.setItem('aimgcarmob', ''); 
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CarfleetComponent, dialogConfig);
    this.service.imgsliderarr=[];
    this.service.landingimg="";

   }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {

    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
  onEdit(row) {
    localStorage.setItem('acarbrand', '');
    localStorage.setItem('acarclass', '');
    localStorage.setItem('aimgslider', '');
    localStorage.setItem('aimgcar', ''); 
    localStorage.setItem('aimgcarmob', ''); 
    // this.service.populateForm(emp);
    this.service.populateForm(row);


    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CarfleetComponent, dialogConfig);

  }

 /* onDelete(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'confirm-dialog-container';
    ;

    this.dialog.open(MatConfirmDialogComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res) {
          this.firestore.doc('carfleet/' + id).delete();
          this.toastr.warning('Deleted Successfully', 'Record');
        }
      });

  }*/


}
