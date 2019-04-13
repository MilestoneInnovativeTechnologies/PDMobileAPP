import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class DataProviderService {

    constructor(public toastController: ToastController) {
    }

    private dataSource = new BehaviorSubject('default message');
    private selectedWishlist = new BehaviorSubject('default message');
    private Wishlists = new BehaviorSubject('default message');
    private sharedWishlists = new BehaviorSubject('default message');

    serviceData = this.dataSource.asObservable();
    wishlist = this.selectedWishlist.asObservable();
    ServiceWishlists = this.Wishlists.asObservable();
    ServiceSharedWishlists = this.sharedWishlists.asObservable();

    changeSelectedProduct(data: any) {
        this.dataSource.next(data);
    }
    changeSelectedWishList(data: any) {
        this.selectedWishlist.next(data);
    }

    changeWishList(data: any) {
        this.Wishlists.next(data);
    }
    changeSharedWishList(data: any) {
        this.sharedWishlists.next(data);
    }

    async   presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }


}
