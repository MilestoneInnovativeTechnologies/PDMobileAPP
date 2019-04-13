import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Events} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {DataProviderService} from '../data-provider.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    wishlists;
    sharedwishlists;
    showLoader = false;
    ShowNoWishlist = false;
    segment = true;

    constructor(private routes: Router, public events: Events, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService) {

        this.dataprovider.ServiceWishlists.subscribe(data => (this.wishlists = data));
        this.dataprovider.ServiceSharedWishlists.subscribe(data => (this.sharedwishlists = data));
    }

    ShowWishList(product) {

        this.dataprovider.changeSelectedWishList(product);
        console.log('aaaa', product);
        this.routes.navigateByUrl('wishlistdetail');
    }

    newWishlist() {
        this.routes.navigateByUrl('addsharelist');
    }

    segmentButtonClicked(status) {
        this.segment = status;
    }

    shareStatus(wishlist) {
        let status = wishlist.vendor.status ? 'Active' : 'Inactive';
        this.storage.get('api').then((api) => {
            console.log(api);
            if (api !== undefined) {
                // api = JSON.parse(api);
                console.log(api);
                console.log(api.url_api);

                if (api.url_api !== undefined) {

                    this.storage.get('user').then((user) => {

                        if (user !== undefined && user !== null) {

                            if (user.id !== undefined && user.id !== null) {


                                let url = api.url_api + '/user/' + user.id + '/wishlist/' + wishlist.id + '/vendor/' + status;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {
                                        console.log(api);
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
