import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {DataProviderService} from '../data-provider.service';
import {AlertController, NavController} from '@ionic/angular';

@Component({
    selector: 'app-wishlistdetail',
    templateUrl: './wishlistdetail.page.html',
    styleUrls: ['./wishlistdetail.page.scss'],
})
export class WishlistdetailPage implements OnInit {
    products;
    wishlist;
    showLoader = false;
    disableButton = false;
    wishlistDetail;
    product_fields;
    wishListAlldetail;
    removeLoaderId;
    created_at;

    constructor(public alertController: AlertController, private routes: Router, public router: NavController, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService) {

        this.removeLoaderId = null;
        this.dataprovider.wishlist.subscribe(data => (this.wishlistDetail = data));
        console.log(this.wishListAlldetail);
        this.init();
        this.created_at = this.wishlistDetail.vendor.created_at;
    }


    init() {

        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {
                    let url = api.url_api + '/init';
                    this.showLoader = true;

                    this.http.setDataSerializer('json');
                    this.http.get(url, {}, {})
                        .then(api => {

                            let tempData = JSON.parse(api.data);

                            this.product_fields = tempData.product_fields;

                            this.getWishlistDetails();


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

    showShares() {

        this.routes.navigateByUrl('wishlistshares');


    }

    showSMessage() {

        this.routes.navigateByUrl('wishlistmessages');


    }


    showProduct(product) {
        this.dataprovider.changeSelectedProduct(product);

        this.routes.navigateByUrl('productdetail');

    }

    shareStatus(wishlist) {
        let status = wishlist.vendor.status ? 'Active' : 'Inactive';
        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {

                    this.storage.get('user').then((user) => {

                        if (user !== undefined && user !== null) {

                            if (user.id !== undefined && user.id !== null) {


                                let url = api.url_api + '/user/' + user.id + '/wishlist/' + wishlist.id + '/vendor/' + status;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {

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


    async showQuantityModal(product, index, e) {
        e.stopPropagation();
        console.log(index, 'index');
        const alert = await this.alertController.create({
            header: 'Prompt!',
            inputs: [
                {
                    name: 'quantity',
                    type: 'number',
                    placeholder: 'quantity'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        console.log('Confirm Ok' + data.quantity);
                        this.storage.get('api').then((api) => {

                            if (api !== undefined) {
                                // api = JSON.parse(api);


                                if (api.url_api !== undefined) {

                                    this.storage.get('user').then((user) => {

                                        if (user !== undefined && user !== null) {

                                            if (user.id !== undefined && user.id !== null) {


                                                let url = api.url_api + '/user/' + user.id + '/wishlist/' + this.wishlistDetail.id + '/product/' + product.id + '/add?quantity=' + data.quantity;


                                                this.http.setDataSerializer('json');
                                                this.http.get(url, {}, {})
                                                    .then(api => {

                                                        this.products[index].quantity = data.quantity;
                                                        this.dataprovider.presentToast('Product quantity updated');

                                                    }).catch(error => {

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
            ]
        });

        await alert.present();
    }


    configureProductData(tempProducts) {

        // this.products = this.products.concat(tempProducts);
        let product_fields = this.product_fields;
        let TPro = [];
        Object.keys(tempProducts).forEach(function (key, index) {
            let obj = [];
            if (tempProducts[key].product_status == 'Active') {

                if (tempProducts[key] !== undefined && tempProducts[key].product !== undefined) {


                    obj['name'] = tempProducts[key].product.name;
                    obj['quantity'] = tempProducts[key].quantity;
                    obj['id'] = tempProducts[key].product.id;
                    obj['image'] = null;
                    obj['fields'] = [];

                    //
                    // if (Array.isArray(tempProducts[key].images)) {
                    //
                    //     if (tempProducts[key].product.images[0] !== null && tempProducts[key].product.images[0] !== undefined) {
                    //
                    //         if (tempProducts[key].product.images[0].__upload_file_details !== null && tempProducts[key].product.images[0].__upload_file_details !== undefined) {
                    //             obj['images'] = tempProducts[key].product.images;
                    //             obj['image'] = tempProducts[key].product.images[0].__upload_file_details.image.url;
                    //         } else {
                    //             obj['images'] = null;
                    //         }
                    //     }
                    //
                    //
                    // }


                    obj['description'] = tempProducts[key].product.description;

                    if (Array.isArray(tempProducts[key].product.images)) {
                        if (tempProducts[key].product.images[0] !== null && tempProducts[key].product.images[0] !== undefined) {
                            if (tempProducts[key].product.images[0].__upload_file_details !== null && tempProducts[key].product.images[0].__upload_file_details !== undefined) {
                                obj['images'] = tempProducts[key].product.images;

                                obj['image'] = tempProducts[key].product.images[0].__upload_file_details.image.url;
                            }
                        }


                    }


                    Object.keys(product_fields).forEach(function (key1, index2) {
                        // for (let [key1, product_fields[key1]] of product_product_fields[key1]s) {

                        if (product_fields[key1] !== undefined && product_fields[key1] !== null) {
                            let keyob2 = [];


                            let key_name = [];
                            key_name['name'] = product_fields[key1].display_name;
                            if (tempProducts[key].product[product_fields[key1].field_name] !== null && tempProducts[key].product[product_fields[key1].field_name] !== undefined) {
                                if (tempProducts[key].product[product_fields[key1].field_name].name !== undefined) {


                                    key_name['value'] = tempProducts[key].product[product_fields[key1].field_name].name;


                                } else {
                                    key_name['value'] = tempProducts[key].product[product_fields[key1].field_name];
                                }
                            } else {

                                key_name['value'] = '';
                            }

                            keyob2.push(key_name);
                            obj['fields'].push(keyob2);

                        }
                    });
                }
                console.log(JSON.stringify(obj));
                TPro.push(obj);
            }
        });
        this.products = TPro;
        console.log(this.products);
    }

    deleteWishlist() {

        this.presentAlertConfirm();
    }


    async presentAlertConfirm() {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: 'Are you surely want to <strong>delete</strong>!!!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'alert_info',
                    handler: (blah) => {


                    }
                }, {
                    text: 'Delete',
                    cssClass: 'alert_danger',
                    handler: () => {
                        this.storage.get('api').then((api) => {

                            if (api !== undefined) {
                                // api = JSON.parse(api);


                                if (api.url_api !== undefined) {

                                    this.storage.get('user').then((user) => {

                                        if (user !== undefined && user !== null) {

                                            if (user.id !== undefined && user.id !== null) {


                                                let url = api.url_api + '/user/' + user.id + '/wishlist/' + this.wishlistDetail.id + '/delete';
                                                this.disableButton = true;

                                                this.http.setDataSerializer('json');
                                                this.http.get(url, {}, {})
                                                    .then(api => {
                                                        this.disableButton = false;

                                                        let tempData = JSON.parse(api.data);


                                                        Object.keys(tempData.wish_lists).forEach(function (key, index) {
                                                            if (tempData.wish_lists[key] !== undefined) {
                                                                tempData.wish_lists[key].vendor.status = tempData.wish_lists[key].vendor.status === 'Active';
                                                            }
                                                        });

                                                        this.dataprovider.changeWishList(tempData.wish_lists);

                                                        this.router.back();

                                                        // this.product_fields = tempData.product_fields;

                                                        // this.loadData();


                                                    }).catch(error => {
                                                    this.disableButton = false;
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
            ]
        });

        await alert.present();
    }


    removeProduct(product) {

        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {

                    this.storage.get('user').then((user) => {

                        if (user !== undefined && user !== null) {

                            if (user.id !== undefined && user.id !== null) {


                                let url = api.url_api + '/user/' + user.id + '/wishlist/' + this.wishlistDetail.id + '/product/' + product.id + '/remove';
                                this.removeLoaderId = product.id;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {

                                        let tempData = JSON.parse(api.data);

                                        this.wishListAlldetail = tempData;
                                        this.wishlistDetail = tempData.wishlist;
                                        this.wishlistDetail.vendor.status = this.wishlistDetail.vendor.status == 'Active';
                                        // this.dataprovider.changeSelectedWishList(tempData);

                                        this.dataprovider.presentToast('Product removed  successfully');

                                        if (tempData.items.length > 0) {

                                            this.configureProductData(tempData.items);


                                        } else {

                                            // Stop Further Loadings
                                            // if (infiniteInstance != undefined) {
                                            //     infiniteInstance.enable(false);
                                            // }
                                        }
                                        this.wishlistDetail.shares = tempData.shares;
                                        this.wishlistDetail.notes = tempData.notes;
                                        this.dataprovider.changeSelectedWishList(this.wishlistDetail);

                                    }).catch(error => {
                                    this.removeLoaderId = false;
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

    getWishlistDetails() {

        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {

                    this.storage.get('user').then((user) => {

                        if (user !== undefined && user !== null) {

                            if (user.id !== undefined && user.id !== null) {


                                let url = api.url_api + '/wishlist?id=' + this.wishlistDetail.id;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {

                                        let tempData = JSON.parse(api.data);

                                        this.wishListAlldetail = tempData;
                                        this.wishlistDetail = tempData.wishlist;
                                        this.wishlistDetail.vendor.status = this.wishlistDetail.vendor.status == 'Active';
                                        // this.dataprovider.changeSelectedWishList(tempData);


                                        if (tempData.items.length > 0) {

                                            this.configureProductData(tempData.items);


                                        } else {

                                            // Stop Further Loadings
                                            // if (infiniteInstance != undefined) {
                                            //     infiniteInstance.enable(false);
                                            // }
                                        }
                                        this.wishlistDetail.shares = tempData.shares;
                                        this.wishlistDetail.notes = tempData.notes;
                                        this.dataprovider.changeSelectedWishList(this.wishlistDetail);

                                        // this.product_fields = tempData.product_fields;

                                        // this.loadData();


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

    ngOnInit() {

    }

    back() {

        this.router.back();
    }
}
