import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource,MatSort,MatPaginator } from '@angular/material';
import { OfferService } from '../../shared/offer.service';
import { DialogService } from '../../shared/dialog.service';

import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { OfferComponent } from '../offer/offer.component';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit {

  constructor(private firestore: AngularFirestore, private toastr: ToastrService, public service: OfferService, private dialogService: DialogService, private dialog: MatDialog) { }
 
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['slno', 'title', 'description', 'imgurl', 'updatedon', 'active', 'actions'];
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
   this.dialog.open(OfferComponent,dialogConfig);
     }

      onSearchClear() {
       this.searchKey = "";
       this.applyFilter();
     }
     bindgrid()
     {
      
       this.service.getEmployees( this.service.frm.get('isactive').value).subscribe(actionArray => {
         let array = actionArray.map(item => {
           return {
             id: item.payload.doc['id'],
             ...item.payload.doc.data() as {}
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
   
   this.dialog.open(OfferComponent,dialogConfig);
   
     }
    
     onDelete(id: string) {
       const dialogConfig=new MatDialogConfig();
       dialogConfig.disableClose=true;
       dialogConfig.panelClass='confirm-dialog-container';
     ;
    
   this.dialog.open(MatConfirmDialogComponent,dialogConfig)
   .afterClosed().subscribe(res =>{
     if(res){      
       this.firestore.doc('offers/' + id).delete();
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
