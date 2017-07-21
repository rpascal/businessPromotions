import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessPromosPage } from './business-promos';

@NgModule({
  declarations: [
    BusinessPromosPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessPromosPage),
  ],
  exports: [
    BusinessPromosPage
  ]
})
export class ViewBusinessesPageModule {}
