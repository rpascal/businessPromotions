import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewBusinessesPage } from './view-businesses';

@NgModule({
  declarations: [
    ViewBusinessesPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewBusinessesPage),
  ],
  exports: [
    ViewBusinessesPage
  ]
})
export class ViewBusinessesPageModule {}
