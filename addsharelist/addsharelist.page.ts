import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {DataProviderService} from '../data-provider.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-addsharelist',
    templateUrl: './addsharelist.page.html',
    styleUrls: ['./addsharelist.page.scss'],
})
export class AddsharelistPage implements OnInit {
    showLoader = false;
    wishlist = {name: '', description: '', vendor: {status: true}};
    wishlists;

    constructor(public router: NavController, private routes: Router, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService) {

    }

    ngOnInit() {

    }


    back() {
        this.router.back();
    }


    create() {


        this.storage.get('api').then((api) => {
            console.log(api);
            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {

                    this.storage.get('user').then((user) => {

                        if (user !== undefined && user !== null) {

                            if (user.id !== undefined && user.id !== null) {


                                let url = api.url_api + '/user/' + user.id + '/create_wishlist?name=' + this.wishlist.name + '&description=' + this.wishlist.description;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {
                                        this.showLoader = false;

                                        let tempData = JSON.parse(api.data);
                                        this.wishlist = tempData.wishlist;
                                        this.wishlist.vendor.status = true;
                                        this.dataprovider.ServiceWishlists.subscribe(data => (this.wishlists = <any>data));
                                        this.wishlists.push(this.wishlist);
                                        this.dataprovider.changeWishList(this.wishlists);
                                        this.wishlist = {name: '', description: '', vendor: {status: true}};

                                        this.dataprovider.presentToast('Wish list added successfully');

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
