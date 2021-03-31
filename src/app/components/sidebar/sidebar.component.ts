import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
declare interface MRouteInfo {
  path: string;
  title: string;
  span: string;
  class: string;
}
export const DROUTES: RouteInfo[] = [   
  { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },  
/*   { path: '/car', title: 'Cars',  icon: 'person', class: '' },   */
];
export const SROUTES: MRouteInfo[] = [   
 
  { path: '/surge', title: 'Surge', span: 'SG', class: '' },
    { path: '/coupon', title: 'Coupon',  span: 'CP', class: '' },
    { path: '/offers', title: 'Offers',  span: 'OF', class: '' },
];
export const CROUTES: MRouteInfo[] = [   
 
  { path: '/carfleet', title: 'Car Fleet',  span: 'CF', class: '' },
  { path: '/sdrive-car', title: 'Self-Drive',  span: 'SD', class: '' },
  { path: '/cdrive-car', title: 'Chauffeur / Airport',  span: 'C/A', class: '' },
   
];
export const ROUTES: MRouteInfo[] = [
/*     { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' }, */
   
    { path: '/sdrive-carbooking', title: 'Self Drive',  span:'SD', class: '' },
    { path: '/cdrive-carbooking', title: 'Chauffeur / Airport',  span:'C/A', class: '' },
   
    { path: '/customer', title: 'Customers',  span:'CS', class: '' },
    { path: '/enquiry', title: 'Enquiries',  span:'EQ', class: '' },
    { path: '/subscriptions', title: 'Subscriptions',  span:'SB', class: '' },
   
];
export const MROUTES: MRouteInfo[] = [   
      { path: '/carbrand', title: 'Car Brand',  span: 'CB', class: '' },
      { path: '/carfeature', title: 'Car Features',  span:'CF', class: '' },
      { path: '/location', title: 'Location',  span:'LC', class: '' },     
      { path: '/agent', title: 'Agents',  span:'AG', class: '' },    
  ];
  export const YROUTES: MRouteInfo[] = [   
    { path: '/yacht-booking', title: 'Yacht Booking',  span: 'YB', class: '' },
    
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  dItems: any[];
  menuItems: any[];
  masterItems: any[];
  yachtitems:any[];
  sItems: any[];
  cItems: any[];
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.dItems = DROUTES.filter(menuItem => menuItem);
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.masterItems = MROUTES.filter(menuItem => menuItem);
    this.yachtitems=YROUTES.filter(menuItem => menuItem);
    this.sItems = SROUTES.filter(menuItem => menuItem);
    this.cItems = CROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
