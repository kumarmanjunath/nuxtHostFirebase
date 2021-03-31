import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CarbrandListComponent } from '../../carbrands/carbrand-list/carbrand-list.component';
import { CouponListComponent } from '../../coupons/coupon-list/coupon-list.component';
import { LocationListComponent } from '../../locations/location-list/location-list.component';
import { CarsComponent } from '../../cars/cars.component';
import { SurgeListComponent } from '../../surges/surge-list/surge-list.component';
import { CarfeatureListComponent } from '../../carfeatures/carfeature-list/carfeature-list.component';
import { AgentListComponent } from '../../agents/agent-list/agent-list.component';
import { EnquiryListComponent } from '../../enquiries/enquiry-list/enquiry-list.component';
import { ExcelComponent } from '../../excelexport/excel-list/excel.component';
import { SubscriptionListComponent } from '../../subscriptions/subscription-list/subscription-list.component';
import { CustomerListComponent } from '../../customers/customer-list/customer-list.component';
import { UploadComponent } from '../../upload/upload.component';
import { CarfleetListComponent } from '../../carfleets/carfleet-list/carfleet-list.component';
import { SdrivecarListComponent } from '../../sdrivecars/sdrivecar-list/sdrivecar-list.component';
import { CdrivecarListComponent } from '../../cdrivecars/cdrivecar-list/cdrivecar-list.component';
import { CdrivebookingListComponent } from '../../cdrivebookings/cdrivebooking-list/cdrivebooking-list.component';
import { YachtbookingListComponent } from '../../yachtbookings/yachtbooking-list/yachtbooking-list.component';
import { SdrivebookingListComponent } from '../../sdrivebookings/sdrivebooking-list/sdrivebooking-list.component';
import { OfferListComponent } from '../../offers/offer-list/offer-list.component';
import { AuthGuard } from "../../shared/guard/auth.guard";
export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard',      component: DashboardComponent , canActivate: [AuthGuard] },

    { path: 'sdrive-car',      component: SdrivecarListComponent , canActivate: [AuthGuard] },
    { path: 'cdrive-car',      component: CdrivecarListComponent , canActivate: [AuthGuard] },
    { path: 'sdrive-carbooking',      component: SdrivebookingListComponent, canActivate: [AuthGuard] },
    { path: 'cdrive-carbooking',      component: CdrivebookingListComponent, canActivate: [AuthGuard] },
    { path: 'yacht-booking',      component: YachtbookingListComponent, canActivate: [AuthGuard] },
    { path: 'carfleet',   component: CarfleetListComponent , canActivate: [AuthGuard] },
    { path: 'carbrand',   component: CarbrandListComponent , canActivate: [AuthGuard] },
    { path: 'carfeature',   component: CarfeatureListComponent , canActivate: [AuthGuard] },
    { path: 'location',     component: LocationListComponent , canActivate: [AuthGuard] },
    { path: 'surge',     component: SurgeListComponent, canActivate: [AuthGuard] },
    { path: 'coupon',     component: CouponListComponent , canActivate: [AuthGuard] },   
    { path: 'agent',          component: AgentListComponent , canActivate: [AuthGuard] },
    { path: 'customer',  component: CustomerListComponent, canActivate: [AuthGuard] },
    { path: 'enquiry',  component: EnquiryListComponent, canActivate: [AuthGuard] },
    { path: 'excel',  component: ExcelComponent, canActivate: [AuthGuard] },
    { path: 'subscriptions',  component: SubscriptionListComponent, canActivate: [AuthGuard] },
    { path: 'offers',  component: OfferListComponent, canActivate: [AuthGuard] },
    { path: 'cars',  component: CarsComponent, canActivate: [AuthGuard] },
];
