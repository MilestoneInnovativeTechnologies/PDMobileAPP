import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {DataProviderService} from '../data-provider.service';

@Component({
    selector: 'app-wishlistmessages',
    templateUrl: './wishlistmessages.page.html',
    styleUrls: ['./wishlistmessages.page.scss'],
})
export class WishlistmessagesPage implements OnInit {
    wishlist;
    shareList: ShareList = new ShareList();
    showLoader = false;

    constructor(public router: NavController, private routes: Router, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService) {
        this.dataprovider.wishlist.subscribe(data => (this.wishlist = data));


    }

    ngOnInit() {
    }

    back() {
        this.router.back();

    }


    validate() {

        if (!this.shareList.message.match(/\S/)) {
            this.dataprovider.presentToast('Enter a valid message');
            return false;
        }

        return true;
    }

    message() {

        if (!this.validate()) {
            return false;
        }


        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {

                    this.storage.get('user').then((user) => {

                        if (user !== undefined && user !== null) {

                            if (user.id !== undefined && user.id !== null) {


                                let url = api.url_api + '/user/' + user.id + '/wishlist/' + this.wishlist.id + '/note?message=' + this.shareList.message;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {
                                        this.showLoader = false;
                                        this.shareList.message = '';

                                        let tempData = JSON.parse(api.data);
                                        this.wishlist.vendor.status = this.wishlist.vendor.status == 'Active';
                                        this.wishlist.shares = tempData.shares;
                                        this.wishlist.notes = tempData.notes;
                                        this.dataprovider.changeSelectedWishList(this.wishlist);


                                        this.dataprovider.presentToast('Message send successfully');
                                    }).catch(error => {
                                    this.showLoader = false;
                                    console.log(error);
                                    console.log(error.status);
                                    console.log(error.error); // error message as string
                                    console.log(error.headers);

                                });
                            }

                        } else {
                            this.routes.navigate(['/login']);
                        }
                    });


                }
            }
        });


    }

}

// Modal class - ShareList
class ShareList {

    message: any = '';
}

