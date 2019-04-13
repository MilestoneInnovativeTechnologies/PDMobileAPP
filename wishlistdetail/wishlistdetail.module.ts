import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WishlistdetailPage } from './wishlistdetail.page';

const routes: Routes = [
  {
    path: '',
    component: WishlistdetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WishlistdetailPage]
})
export class WishlistdetailPageModule {


}
