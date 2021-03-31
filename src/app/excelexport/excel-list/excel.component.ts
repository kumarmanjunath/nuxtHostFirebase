import { Component, OnInit,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ExcelServicesService } from '../../shared/excel-services'; 
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import { ToastrService } from 'ngx-toastr';
//import { EnquiryComponent } from '../enquiry/enquiry.component';
import { AppDateAdapter, APP_DATE_FORMATS} from  '../../shared/date.adapter';
@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.scss'],
 
})
export class ExcelComponent implements OnInit {  
  title = 'excel-upload-download';  
  ngOnInit(){  
    alert("dg")
  }  
   excel=[];  
 /*   constructor(private excelService:ExcelServicesService,private http: HttpClient){  
    this.getJSON().subscribe(data => {  
      console.log("data :"+data)
      data.forEach(row => {  
        this.excel.push(row);  
      });  
     });  
  }   */
    constructor(private excelService:ExcelServicesService,private http: HttpClient){  
     
      var row= {employee_name:"asdsfsd",
      employee_salary:"234324",
      employee_age:"234",
      id:"234234"
    }
     
          this.excel.push(row);  
       
    }  
      
    exportAsXLSX():void {  
       this.excelService.exportAsExcelFile(this.excel, 'sample');  
    }  
    public getJSON(): Observable<any> {  
      return this.http.get('http://dummy.restapiexample.com/api/v1/employees');  
    }  
}  