import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { LocationService } from '../../shared/location.service';
import { DialogService } from '../../shared/dialog.service';
import { Location } from 'app/shared/location.model';
import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

  constructor(private firestore: AngularFirestore, private toastr: ToastrService, public service: LocationService, private dialogService: DialogService, private dialog: MatDialog) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['slno', 'description', 'updatedon', 'active', 'actions'];
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
    // alert(this.form.get('isactive').value);
    this.service.getEmployees(this.service.frm.get('isactive').value).subscribe(actionArray => {
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
          return ele != 'actions' && ele != 'slno' && ele != 'active' && ele != 'updatedon' && data[ele].toLowerCase().indexOf(filter) != -1;
        });
      };

    });
  }

  onCreate() {

    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    this.dialog.open(LocationComponent, dialogConfig);
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    this.dialog.open(LocationComponent, dialogConfig);

  }

  onDelete(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'confirm-dialog-container';
    ;

    this.dialog.open(MatConfirmDialogComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res) {
          this.firestore.doc('location/' + id).delete();
          this.toastr.warning('Deleted Successfully', 'Record');
        }
      });

  }
}
