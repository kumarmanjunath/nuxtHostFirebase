import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CouponService } from '../../shared/coupon.service';
import { DialogService } from '../../shared/dialog.service';
import { Coupon } from 'app/shared/coupon.model';
import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { CouponComponent } from '../coupon/coupon.component';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent implements OnInit {

  constructor(private firestore: AngularFirestore, private toastr: ToastrService, public service: CouponService, private dialogService: DialogService, private dialog: MatDialog) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['slno','ltype', 'code', 'discount', 'discountAmt','startdate', 'enddate', 'description', 'updatedon', 'removedeposit','active', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit() {
   
    this.bindgrid();

  }
  radioChange(event) {
    this.bindgrid();
  }
  bindgrid() {
    this.service.getEmployees(this.service.frm.get('isactive').value,this.service.frm.get('isltype').value).subscribe(actionArray => {
      let array = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],     
          removedeposit:false,
          ...item.payload.doc.data() as {}
        };

      });
      // console.log(array);
      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {

          return ele != 'actions' && ele != 'slno' && ele != 'startdate'  && ele != 'enddate' && ele != 'updatedon' && ele != 'active' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      };
     // console.log(  this.listData);
    });
  }

  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CouponComponent, dialogConfig);
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
    this.dialog.open(CouponComponent, dialogConfig);

  }

  onDelete(id) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'confirm-dialog-container';
    this.dialog.open(MatConfirmDialogComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res) {
          this.firestore.doc('coupon/' + id).delete();
          this.toastr.warning('Deleted Successfully', 'Record');
        }
      });

  }

}
