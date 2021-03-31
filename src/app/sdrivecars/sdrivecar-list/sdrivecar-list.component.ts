import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SdrivecarService } from '../../shared/sdrivecar.service';
import { DialogService } from '../../shared/dialog.service';

import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { SdrivecarComponent } from '../sdrivecar/sdrivecar.component';

import { ExcelServicesService } from '../../shared/excel-services'; 
@Component({
  selector: 'app-sdrivecar-list',
  templateUrl: './sdrivecar-list.component.html',
  styleUrls: ['./sdrivecar-list.component.scss']
})
export class SdrivecarListComponent implements OnInit {
  excelarray=[];
  constructor(private excelService:ExcelServicesService,
    private firestore: AngularFirestore, private toastr: ToastrService, public service: SdrivecarService, private dialogService: DialogService, private dialog: MatDialog) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['slno',  'carbrand', 'carclass', 'location', 'agent_show','price', 'kms_limit', 'deposit', 'updatedon', 'active', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit() {
    
    this.bindgrid();

  }
  bindgrid() {
    this.service.getEmployees(this.service.frm.get('isactive').value,this.service.frm.get('isltype').value).subscribe(actionArray => {
      let array = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        };

      });
     //this.excelarray=array;
     
     this.excelarray = actionArray.map(item => {
        return {
        
          Car :item.payload.doc.data().carbrand+" "+item.payload.doc.data().carclass,
           
          Location:item.payload.doc.data().location,
        
          Color:item.payload.doc.data().color,          
          'Launch Year':item.payload.doc.data().launch_year,
          'Kms Limit':item.payload.doc.data().kms_limit,
          'Package Hours':item.payload.doc.data().package_hours,
          'Deposit':item.payload.doc.data().deposit,
          'Extra Km Charge' :item.payload.doc.data().extra_km_charge,
         
          'Price':item.payload.doc.data().price
        };
      
      });
      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'actions' && ele != 'slno' && ele != 'active' && ele != 'agent_show' && ele != 'price' && ele != 'kms_limit' && ele != 'deposit' && ele != 'updatedon' && data[ele].toLowerCase().indexOf(filter) != -1;
        });
      };

    });
  }
  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(SdrivecarComponent, dialogConfig);
  }
  radioChange(event) {
    this.bindgrid();
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(SdrivecarComponent, dialogConfig);

  }
  exportAsXLSX():void {  
    this.excelService.exportAsExcelFile(this.excelarray, 'Selfdrive_CarFleet');  
  }
  onDelete(id) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'confirm-dialog-container';
    this.dialog.open(MatConfirmDialogComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res) {
          this.firestore.doc('sdrive_car/' + id).delete();
          this.toastr.warning('Deleted Successfully', 'Record');
        }
      });

  }

}
