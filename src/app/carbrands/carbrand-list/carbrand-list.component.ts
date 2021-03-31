import { Component, OnInit ,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator } from '@angular/material';
import { CarbrandService } from '../../shared/carbrand.service';
import { DialogService } from '../../shared/dialog.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Carbrand } from 'app/shared/carbrand.model';
import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialog,MatDialogConfig} from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CarbrandComponent } from '../carbrand/carbrand.component';

@Component({
  selector: 'app-carbrand-list',
  templateUrl: './carbrand-list.component.html',
  styleUrls: ['./carbrand-list.component.scss']
})
export class CarbrandListComponent implements OnInit {

 
  constructor(private firestore:AngularFirestore,private toastr: ToastrService,public service: CarbrandService,private dialogService:DialogService, private dialog:MatDialog)
   { }
   listData: MatTableDataSource<any>;
   displayedColumns: string[] = ['slno','ltype', 'description', 'updatedon', 'active', 'actions'];
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   searchKey: string; 
 
   ngOnInit() {
   
  
    this.bindgrid();
    
       }
      radioChange(event){        
        this.bindgrid();   
      }
     
       onCreate(){
     
      this.service.initializeFormGroup();       
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="50%";
    this.dialog.open(CarbrandComponent,dialogConfig);
      }

       onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
      }
      bindgrid()
      {
       
        this.service.getEmployees( this.service.frm.get('isactive').value,this.service.frm.get('isltype').value).subscribe(actionArray => {
          let array = actionArray.map(item => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data()
            };        
          });
         console.log(array);
          this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
           // console.log(data[ele]);
            return ele != 'actions' && ele != 'slno'  && ele != 'updatedon' && ele != 'active' && data[ele].toLowerCase().indexOf(filter) != -1;
            });
          }; 
    
        });
      }
      applyFilter() {
        
        this.listData.filter = this.searchKey.trim().toLowerCase();
      }
      onEdit(row) {
        this.service.populateForm(row);   
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="50%";
    
    this.dialog.open(CarbrandComponent,dialogConfig);
    
      }
     
      onDelete(id: string) {
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.panelClass='confirm-dialog-container';
      ;
     
    this.dialog.open(MatConfirmDialogComponent,dialogConfig)
    .afterClosed().subscribe(res =>{
      if(res){      
        this.firestore.doc('brand/' + id).delete();
        this.toastr.warning('Deleted Successfully','Record');
  }
}); 
   
        /* this.dialogService.openConfirmDialog("Are you sure to delete this record?")
        .afterClosed().subscribe(res =>{
          if(res){      
            this.firestore.doc('brand/' + id).delete();
            this.toastr.warning('Deleted successfully','carbrand. Register');
      }
    }); */
      }

}
