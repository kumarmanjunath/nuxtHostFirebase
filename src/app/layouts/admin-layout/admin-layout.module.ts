import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CarbrandListComponent } from '../../carbrands/carbrand-list/carbrand-list.component';

import { CarbrandComponent } from '../../carbrands/carbrand/carbrand.component';

import { LocationComponent } from '../../locations/location/location.component';
import { LocationListComponent } from '../../locations/location-list/location-list.component';

import { SurgeComponent } from '../../surges/surge/surge.component';
import { SurgeListComponent } from '../../surges/surge-list/surge-list.component';

import { CarfeatureComponent } from '../../carfeatures/carfeature/carfeature.component';
import { CarfeatureListComponent } from '../../carfeatures/carfeature-list/carfeature-list.component';

import { AgentComponent } from '../../agents/agent/agent.component';
import { AgentListComponent } from '../../agents/agent-list/agent-list.component';

import { OfferComponent } from '../../offers/offer/offer.component';
import { OfferListComponent } from '../../offers/offer-list/offer-list.component';

import { EnquiryListComponent } from '../../enquiries/enquiry-list/enquiry-list.component';
import { ExcelComponent } from  '../../excelexport/excel-list/excel.component';
import { SubscriptionListComponent } from '../../subscriptions/subscription-list/subscription-list.component';
import { CustomerComponent } from '../../customers/customer/customer.component';
import { CustomerListComponent } from '../../customers/customer-list/customer-list.component';

import { CouponComponent } from '../../coupons/coupon/coupon.component';
import { CouponListComponent } from '../../coupons/coupon-list/coupon-list.component';
import { UploadComponent } from '../../upload/upload.component';

import { CarfleetComponent } from '../../carfleets/carfleet/carfleet.component';
import { CarfleetListComponent } from '../../carfleets/carfleet-list/carfleet-list.component';

import { SdrivecarComponent } from '../../sdrivecars/sdrivecar/sdrivecar.component';
import { SdrivecarListComponent } from '../../sdrivecars/sdrivecar-list/sdrivecar-list.component';
import { SdrivebookingComponent } from '../../sdrivebookings/sdrivebooking/sdrivebooking.component';

import { CdrivebookingComponentsms } from '../../cdrivebookings/cdrivebookingsms/cdrivebookingsms.component';
import { CdrivestatusComponent } from '../../cdrivebookings/cdrivestatus/cdrivestatus.component';
import { SdrivestatusComponent } from '../../sdrivebookings/sdrivestatus/sdrivestatus.component';
import { SdrivebookingComponentsms } from '../../sdrivebookings/sdrivebookingsms/sdrivebookingsms.component';
import { CdrivecarComponent } from '../../cdrivecars/cdrivecar/cdrivecar.component';
import { CdrivecarListComponent } from '../../cdrivecars/cdrivecar-list/cdrivecar-list.component';

import { CdrivebookingComponent } from '../../cdrivebookings/cdrivebooking/cdrivebooking.component';
import { CdrivebookingListComponent } from '../../cdrivebookings/cdrivebooking-list/cdrivebooking-list.component';

import { YachtbookingComponent } from '../../yachtbookings/yachtbooking/yachtbooking.component';
import { YachtbookingListComponent } from '../../yachtbookings/yachtbooking-list/yachtbooking-list.component';
import { SdrivebookingListComponent } from '../../sdrivebookings/sdrivebooking-list/sdrivebooking-list.component';
import { CarsComponent } from '../../cars/cars.component';

import { MatConfirmDialogComponent } from '../../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatConfirmDialogActionComponent } from '../../mat-confirm-dialogaction/mat-confirm-dialog.component';
import {
MatTableModule,
 MatIconModule,
 MatPaginatorModule,
 MatSortModule, 
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
MatToolbarModule,
   MatGridListModule,

   MatRadioModule,
 
   MatCheckboxModule,
    MatDatepickerModule,
 MatNativeDateModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
 MatIconModule,
 MatPaginatorModule,
 MatSortModule, 
  MatDialogModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatToolbarModule,
   MatGridListModule,

   MatRadioModule,
 
   MatCheckboxModule,
    MatDatepickerModule,
 MatNativeDateModule,
 HttpClientModule
  ],

  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    CarbrandListComponent,
    CarbrandComponent,
    LocationComponent,
    LocationListComponent,
    SurgeComponent,
    SurgeListComponent,
    CarfeatureComponent,
    CarfeatureListComponent,
    AgentComponent,
    AgentListComponent,
    OfferComponent,
    OfferListComponent,
    CouponComponent,
    CouponListComponent,
    EnquiryListComponent,
    ExcelComponent,
    SubscriptionListComponent,
    CustomerComponent,
    CustomerListComponent,
    UploadComponent,
    CarfleetComponent,
    CarfleetListComponent,
    SdrivecarComponent,
    SdrivecarListComponent,
    CarsComponent,
    CdrivecarComponent,
    CdrivecarListComponent,
    CdrivebookingComponent,
    YachtbookingComponent,
    CdrivebookingListComponent,
    YachtbookingListComponent,
    SdrivebookingComponent,
    CdrivebookingComponentsms,
    CdrivestatusComponent,
    SdrivestatusComponent,
    SdrivebookingComponentsms,
    SdrivebookingListComponent,
    MatConfirmDialogActionComponent,
    MatConfirmDialogComponent
  ],
  entryComponents:[CarbrandComponent,CdrivebookingComponentsms,CdrivestatusComponent,SdrivestatusComponent,SdrivebookingComponentsms,LocationComponent,CarfeatureComponent,SurgeComponent,AgentComponent,OfferComponent,CouponComponent,CarfleetComponent,CustomerComponent,SdrivecarComponent,CdrivecarComponent,SdrivebookingComponent,CdrivebookingComponent,YachtbookingComponent, MatConfirmDialogComponent, MatConfirmDialogActionComponent]
})

export class AdminLayoutModule {}
