import {Component, OnInit, ViewChild} from '@angular/core';
import {Events, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {DataProviderService} from '../data-provider.service';
import {IonicSelectableComponent} from 'ionic-selectable';

class Wish {
    public id: number;
    public name: string;
}

@Component({
    selector: 'app-productdetail',
    templateUrl: './productdetail.page.html',
    styleUrls: ['./productdetail.page.scss'],
})
export class ProductdetailPage implements OnInit {
    product: any;
    showLoader = false;
    product_fields = [];
    showAddWishList = false;
    wishlists: Wish[];
    Wish: Wish;
    quantity;

    slideOpts = {
        effect: 'flip'
    };
    wishlitId = null;

    @ViewChild('mySelect') selectRef: IonicSelectableComponent;

    constructor(public events: Events, public router: NavController, private routes: Router, public navCtrl: NavController, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService
    ) {


        this.dataprovider.serviceData.subscribe(data => (this.product = data));
        this.dataprovider.ServiceWishlists.subscribe(data => (this.wishlists = <any>data));
        this.quantity = 1;

        console.log(this.product);

        // this.wishlists = [
        //     { id: 1, name: 'Tokai' },
        //     { id: 2, name: 'Vladivostok' },
        //     { id: 3, name: 'Navlakhi' }
        // ];

    }

    back() {
        console.log('clicked');
        this.router.back();

    }

    showAddWishlist(status) {
        console.log(status);
        this.showAddWishList = status;
    }

    wishChange(wishlist) {


        this.wishlitId = wishlist.id;


        //     this.selectRef.close();


    }


    init() {

        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);
                console.log(api);
                console.log(api.url_api);

                if (api.url_api !== undefined) {
                    let url = api.url_api + '/init';
                    this.showLoader = true;

                    this.http.setDataSerializer('json');
                    this.http.get(url, {}, {})
                        .then(api => {

                            let tempData = JSON.parse(api.data);

                            this.product_fields = tempData.product_fields;

                            this.loadData();


                        }).catch(error => {
                        this.showLoader = false;
                        console.log(error);
                        console.log(error.status);
                        console.log(error.error); // error message as string
                        console.log(error.headers);

                    });

                }
            }
        });

    }

    loadData() {
        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);
                console.log(api);
                console.log(api.url_api);

                if (api.url_api !== undefined) {
                    let url = api.url_api + '/product?id=' + this.product.id;
                    this.showLoader = true;

                    this.http.setDataSerializer('json');
                    this.http.get(url, {}, {})
                        .then(api => {

                            let tempData = JSON.parse(api.data);
                            console.log(tempData);

                            this.showLoader = false;

                            if (tempData.data.length > 0) {

                                this.configureProductData(tempData.data);


                            } else {

                                // Stop Further Loadings
                                // if (infiniteInstance != undefined) {
                                //     infiniteInstance.enable(false);
                                // }
                            }


                        }).catch(error => {
                        this.showLoader = false;
                        console.log(error);
                        console.log(error.status);
                        console.log(error.error); // error message as string
                        console.log(error.headers);

                    });

                } else {
                    console.log('api undefined');
                }
            } else {
                console.log('api undefined');
            }
        });

    }

    configureProductData(tempProducts) {
        // this.products = this.products.concat(tempProducts);
        let product_fields = this.product_fields;


        let obj = [];
        if (tempProducts !== undefined) {


            obj['name'] = tempProducts.name;
            obj['image'] = null;
            obj['fields'] = [];


            obj['description'] = tempProducts.description;

            if (Array.isArray(tempProducts.images)) {
                if (tempProducts.images[0] !== null && tempProducts.images[0] !== undefined) {
                    if (tempProducts.images[0].__upload_file_details !== null && tempProducts.images[0].__upload_file_details !== undefined) {
                        obj['image'] = tempProducts.images[0].__upload_file_details.image.url;
                    }
                }


            }


            Object.keys(product_fields).forEach(function (key1, index2) {
                // for (let [key1, product_fields[key1]] of product_product_fields[key1]s) {

                if (product_fields[key1] !== undefined && product_fields[key1] !== null) {
                    let keyob2 = [];


                    let key_name = [];
                    key_name['name'] = product_fields[key1].display_name;
                    if (tempProducts[product_fields[key1].field_name] !== null && tempProducts[product_fields[key1].field_name] !== undefined) {
                        if (tempProducts[product_fields[key1].field_name].name !== undefined) {


                            key_name['value'] = tempProducts[product_fields[key1].field_name].name;
                            console.log(key_name['value']);

                        } else {
                            console.log(tempProducts[product_fields[key1].field_name]);
                            key_name['value'] = tempProducts[product_fields[key1].field_name];
                        }
                    } else {
                        console.log(tempProducts);

                        console.log(product_fields[key1].field_name);
                        key_name['value'] = '';
                    }

                    keyob2.push(key_name);
                    obj['fields'].push(keyob2);

                }
            });
        }


        this.product = obj;

    }


    ngOnInit() {
    }


    addWishList() {

        // this.routes.navigate(['/tabs/tab2']);
        // this.selectRef.open();
        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {

                    this.storage.get('user').then((user) => {

                        if (user !== undefined && user !== null) {

                            if (user.id !== undefined && user.id !== null) {

                                console.log(' :', this.product);
                                let url = api.url_api + '/user/' + user.id + '/wishlist/' + this.wishlitId + '/product/' + this.product.id + '/add?quantity=' + this.quantity;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {
                                        this.showLoader = false;
                                        this.quantity = '';
                                        this.dataprovider.presentToast('Product added to wish list');
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
