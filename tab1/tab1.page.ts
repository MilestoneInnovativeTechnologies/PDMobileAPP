import {Router} from '@angular/router';
import {Events, IonSearchbar} from '@ionic/angular';
import {Component, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {DataProviderService} from '../data-provider.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    @ViewChild('searchbar') searchbar: IonSearchbar;
    searchActive: boolean;
    search_text = '';
    pageIndex: number = 1;
    isSeraching: boolean = false;
    loader = false;
    products = [];
    product_fields = [];

    showLoader = false;
    ShowNoProducts = false;
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    constructor(private routes: Router, public events: Events, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService) {
        this.searchActive = false;
        console.log('cons');

        this.init();
        this.getWishlist();

        events.subscribe('user:created', (user) => {
            // user and time are the same arguments passed in `events.publish(user, time)`
            console.log('Welcome');
        });

    }

    // ionViewWillEnter() {
    //     console.log('ionViewWillEnter  enter');
    //     this.init();
    //     this.getWishlist();
    // }
    //
    // ionViewDidEnter() {
    //     console.log('ionViewWillEnter  enter');
    //     this.init();
    //     this.getWishlist();
    // }
    //
    // ngOnInit() {
    //     console.log('ngOnInit  enter');
    //     this.init();
    //     this.getWishlist();
    // }
    //
    // ngAfterViewInit() {
    //     console.log('ngAfterViewInit  enter');
    //     this.init();
    //     this.getWishlist();
    // }


    init() {

        console.log('init');

        this.storage.get('api').then((api) => {

            if (api !== undefined && api != null) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {
                    let url = api.url_api + '/init';
                    this.showLoader = true;
                    this.ShowNoProducts = false;
                    this.http.setDataSerializer('json');
                    this.http.get(url, {}, {})
                        .then(api => {

                            let tempData = JSON.parse(api.data);

                            this.product_fields = tempData.product_fields;

                            this.loadDataFirst();


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


    getWishlist() {
        console.log('ins get wishlist');
        this.storage.get('api').then((api) => {
            console.log(api);
            if (api !== undefined && api != null) {

                if (api.url_api !== undefined) {

                    this.storage.get('user').then((user) => {

                        if (user !== undefined && user !== null) {

                            if (user.id !== undefined && user.id !== null) {


                                let url = api.url_api + '/user?id=' + user.id;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {

                                        let tempData = JSON.parse(api.data);


                                        Object.keys(tempData.wish_lists).forEach(function (key, index) {
                                            if (tempData.wish_lists[key] !== undefined) {
                                                tempData.wish_lists[key].vendor.status = tempData.wish_lists[key].vendor.status === 'Active';
                                            }
                                        });

                                        this.dataprovider.changeWishList(tempData.wish_lists);
                                        this.dataprovider.changeSharedWishList(tempData.shared_wish_lists);


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


                } else {
                    console.log('2 tab1');
                }
            } else {
                console.log('1 tab1');
            }
        });

    }

    configureProductData(tempProducts) {
        // this.products = this.products.concat(tempProducts);
        let product_fields = this.product_fields;
        let TPro = [];
        Object.keys(tempProducts).forEach(function (key, index) {
            let obj = [];
            if (tempProducts[key] !== undefined) {


                obj['name'] = tempProducts[key].name;
                obj['id'] = tempProducts[key].id;
                obj['image'] = null;
                obj['fields'] = [];


                obj['description'] = tempProducts[key].description;

                if (Array.isArray(tempProducts[key].images)) {
                    if (tempProducts[key].images[0] !== null && tempProducts[key].images[0] !== undefined) {

                        if (tempProducts[key].images[0].__upload_file_details !== null && tempProducts[key].images[0].__upload_file_details !== undefined) {
                            obj['images'] = tempProducts[key].images;
                            obj['image'] = tempProducts[key].images[0].__upload_file_details.image.url;
                        } else {
                            obj['images'] = null;
                        }
                    }


                }


                Object.keys(product_fields).forEach(function (key1, index2) {
                    // for (let [key1, product_fields[key1]] of product_product_fields[key1]s) {

                    if (product_fields[key1] !== undefined && product_fields[key1] !== null) {
                        let keyob2 = [];


                        let key_name = [];
                        key_name['name'] = product_fields[key1].display_name;
                        if (tempProducts[key][product_fields[key1].field_name] !== null && tempProducts[key][product_fields[key1].field_name] !== undefined) {
                            if (tempProducts[key][product_fields[key1].field_name].name !== undefined) {


                                key_name['value'] = tempProducts[key][product_fields[key1].field_name].name;


                            } else {
                                key_name['value'] = tempProducts[key][product_fields[key1].field_name];
                            }
                        } else {

                            key_name['value'] = '';
                        }

                        keyob2.push(key_name);
                        obj['fields'].push(keyob2);

                    }
                });
            }

            TPro.push(obj);
        });

        this.products = this.products.concat(TPro);

    }


    showProduct(product) {
        this.dataprovider.changeSelectedProduct(product);

        this.routes.navigateByUrl('productdetail');

    }

    search(status) {

        this.searchActive = status;
        setTimeout(() => {
            this.searchbar.setFocus();
        });

    }


    loadDataFirst(clear = false) {

        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {


                    this.pageIndex = 1;

                    this.products.length = 0;

                    let url = api.url_api + '/index?page=' + this.pageIndex + '&term=' + this.search_text;
                    this.showLoader = true;
                    this.ShowNoProducts = false;
                    this.http.setDataSerializer('json');
                    this.http.get(url, {}, {})
                        .then(api => {

                            let tempData = JSON.parse(api.data);


                            this.pageIndex = parseInt(tempData.current_page) + 1;
                            this.showLoader = false;


                            if (tempData.next_page_url == null) {

                                this.infiniteScroll.disabled = true;
                            } else {

                                this.infiniteScroll.disabled = false;

                            }
                            if (tempData.data.length > 0) {

                                this.configureProductData(tempData.data);


                            } else {

                                // Stop Further Loadings
                                // if (infiniteInstance != undefined) {
                                //     infiniteInstance.enable(false);
                                // }
                            }
                            if (this.products.length <= 0) {
                                this.ShowNoProducts = true;

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


    loadData(event) {

        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {


                    let url = api.url_api + '/index?page=' + this.pageIndex + '&term=' + this.search_text;
                    this.showLoader = true;
                    this.ShowNoProducts = false;
                    this.http.setDataSerializer('json');
                    this.http.get(url, {}, {})
                        .then(api => {

                            event.target.complete();

                            let tempData = JSON.parse(api.data);
                            this.pageIndex = parseInt(tempData.current_page) + 1;
                            this.showLoader = false;


                            if (tempData.next_page_url == null) {

                                this.infiniteScroll.disabled = true;
                            } else {

                                this.infiniteScroll.disabled = false;

                            }
                            if (tempData.data.length > 0) {

                                this.configureProductData(tempData.data);


                            } else {

                                // Stop Further Loadings
                                // if (infiniteInstance != undefined) {
                                //     infiniteInstance.enable(false);
                                // }
                            }
                            if (this.products.length <= 0) {
                                this.ShowNoProducts = true;

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


}
