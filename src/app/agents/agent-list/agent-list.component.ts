import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { AgentService } from '../../shared/agent.service';
import { DialogService } from '../../shared/dialog.service';

import { MatTableDataSource,MatSort,MatPaginator } from '@angular/material';
import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { AgentComponent } from '../agent/agent.component';
@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss']
})
export class AgentListComponent implements OnInit {

  constructor(private firestore: AngularFirestore, private toastr: ToastrService, public service: AgentService, private dialogService: DialogService, private dialog: MatDialog) { }
 
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['slno', 'fullname', 'location_id', 'email', 'phone', 'updatedon', 'active', 'actions'];
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
    this.service.getEmployees( this.service.frm.get('isactive').value).subscribe(actionArray => {
      let array = actionArray.map(item => {
        return {
          id: item.payload.doc['id'],
          ...item.payload.doc.data() as {}
        };

      });

      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          // console.log(data[ele]);
          return ele != 'actions' && ele != 'slno' && ele != 'active'  && ele != 'updatedon' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
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
    this.dialog.open(AgentComponent, dialogConfig);
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
//alert(this.searchKey)
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
  onEdit(row) {
    this.service.populateForm(row);

    // this.service.form = Object.assign({}, row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(AgentComponent, dialogConfig);

  }

  onDelete(id) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'confirm-dialog-container';
    this.dialog.open(MatConfirmDialogComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res) {
          this.firestore.doc('agent/' + id).delete();
          this.toastr.warning('Deleted Successfully', 'Record');
        }
      });

  }

}
