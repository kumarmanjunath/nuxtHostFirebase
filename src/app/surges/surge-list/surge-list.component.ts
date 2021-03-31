import { Component, OnInit ,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator } from '@angular/material';
import { SurgeService } from '../../shared/surge.service';
import { DialogService } from '../../shared/dialog.service';
import { Surge } from 'app/shared/surge.model';
import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialog,MatDialogConfig} from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { SurgeComponent } from '../surge/surge.component';

@Component({
  selector: 'app-surge-list',
  templateUrl: './surge-list.component.html',
  styleUrls: ['./surge-list.component.scss']
})
export class SurgeListComponent implements OnInit {

 
  constructor(private firestore:AngularFirestore,private toastr: ToastrService,private service: SurgeService,private dialogService:DialogService, private dialog:MatDialog)
   { }
   listData: MatTableDataSource<any>;
   displayedColumns: string[] = ['slno','cd','sd','ap','luxcd','luxsd','luxat','yachtsurge','updated_on','actions'];
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   searchKey: string;
   
   ngOnInit() {
            this.service.getEmployees().subscribe(actionArray => {
           let array = actionArray.map(item => {
             return {
               id: item.payload.doc['id'],
               ...item.payload.doc.data() as {}
             };
           
           });
          // console.log(array);
           this.listData = new MatTableDataSource(array);
         this.listData.sort = this.sort;
         this.listData.paginator = this.paginator;
         this.listData.filterPredicate = (data, filter) => {
           return this.displayedColumns.some(ele => {
            // console.log(data[ele]);
             return ele != 'actions' && ele != 'slno' && data[ele].toLowerCase().indexOf(filter) != -1;
             });
           }; 
  
         });
       }
      

       onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
      }
    
      applyFilter() {
        
        this.listData.filter = this.searchKey.trim().toLowerCase();
      }
      onEdit(emp: Surge) {
       // this.service.populateForm(emp);
     console.log(emp);
        this.service.formData = Object.assign({}, emp);
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="50%";
    this.dialog.open(SurgeComponent,dialogConfig);
    
      }
     
     
}
