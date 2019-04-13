import {Component, OnInit} from '@angular/core';
import {Events, NavController} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {DataProviderService} from '../data-provider.service';
import {IonicSelectableComponent} from 'ionic-selectable';
import {Router} from '@angular/router';

@Component({
    selector: 'app-wishlistshares',
    templateUrl: './wishlistshares.page.html',
    styleUrls: ['./wishlistshares.page.scss'],
})
export class WishlistsharesPage implements OnInit {
    wishlist;
    shareList: ShareList = new ShareList();
    showLoader = false;

    constructor(public router: NavController, private routes: Router, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService) {
        this.dataprovider.wishlist.subscribe(data => (this.wishlist = data));
        console.log(this.wishlist.shares);
    }



    ngOnInit() {

    }

    back() {
        this.router.back();
    }
    validate() {

        if (this.shareList.name == '') {
            this.dataprovider.presentToast('Enter a valid name');
            return false;
        }

        let emailField = this.shareList.email;

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if ( re.test(String(emailField).toLowerCase()) === false) {

            this.dataprovider.presentToast('Enter a valid email id');

            return false;
        }

        return true;
    }





    share() {

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


                                let url = api.url_api + '/user/' + user.id + '/wishlist/' + this.wishlist.id + '/share?email=' + this.shareList.email + '&name=' + this.shareList.name + '&number=' + this.shareList.number;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {
                                        this.showLoader = false;

                                        this.shareList.name = '';
                                        this.shareList.email = '';
                                        this.shareList.number = '';


                                        let tempData = JSON.parse(api.data);
                                        this.wishlist.vendor.status = this.wishlist.vendor.status == 'Active';
                                        this.wishlist.shares = tempData.shares;
                                        this.wishlist.notes = tempData.notes;
                                        this.dataprovider.changeSelectedWishList(this.wishlist);


                                        this.dataprovider.presentToast('shared successfully');
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

    name: any = '';
    number: any = '';
    email: any = '';
}
