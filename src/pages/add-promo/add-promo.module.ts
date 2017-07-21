import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPromoPage } from './add-promo';

import { AuthProvider } from '../../providers/auth/auth';

@NgModule({
  declarations: [
    AddPromoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPromoPage),
  ],
  exports: [
    AddPromoPage
  ],
  providers:[
    AuthProvider
  ]
  
})
export class AddPromoPageModule {}
