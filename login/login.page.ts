import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {any} from 'codelyzer/util/function';
import {DataProviderService} from '../data-provider.service';
import {MenuController, NavController} from '@ionic/angular';
import {Events} from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginUser: LoginUser = new LoginUser();
    disableButton = false;
    showcode = true;
    Api;

    constructor(public events: Events,public menu: MenuController, public  navController: NavController, private routes: Router, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService) {


        this.presentHome();
    }

    ngOnInit() {
    }

    presentHome() {

        this.storage.get('api').then((api) => {

            if (api !== undefined) {
                this.storage.get('user').then((user) => {

                    if (user !== undefined && user !== null) {

                        if (user.id !== undefined && user.id !== null) {
                            this.menu.enable(true, 'first');
                            // this.menu.open('first');
                            console.log('menu enabled');
                            this.routes.navigate(['/tabs/tab1']);

                        }

                    }
                });
            }

            this.storage.get('CODE').then((val) => {
                console.log(val);
                if (val !== undefined && val != null) {
                    this.loginUser.code = val;
                    this.showcode = false;

                }
            });


            this.menu.enable(false, 'first');

        });

    }


// set a key/value


// Or to get a key/value pair

    getData(name) {
        console.log(name);
        this.storage.get(name).then((val) => {
            console.log(val);
            return val;
        });
    }


    storeData(name, value) {
        this.storage.set(name, value);
    }

    validate() {

        if (this.loginUser.code == '') {
            this.dataprovider.presentToast('Enter a valid code');
            return false;
        }


        if (this.loginUser.name == '') {
            this.dataprovider.presentToast('Enter a valid name');
            return false;
        }

        let emailField = this.loginUser.email;

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (re.test(String(emailField).toLowerCase()) === false) {

            this.dataprovider.presentToast('Enter a valid email id');

            return false;
        }

        return true;

    }

    showCode() {
        this.storage.clear();

        let url = 'http://milestoneit.net/api/pd?code=' + this.loginUser.code;

        this.http.setDataSerializer('json');
        this.http.get(url, {}, {})
            .then(api => {

                this.Api = JSON.parse(api.data);
                console.log(this.Api);
                if (this.Api.url_api != null || this.Api.url_api != undefined) {

                    console.log(this.Api.url_api);
                    this.storeData('api', this.Api);
                    this.showcode = false;
                } else {
                    this.showcode = true;
                    this.dataprovider.presentToast('Enter valid code');
                }


                // console.log(data.data); // data received by server
                // console.log(data.headers);

            })
            .catch(error => {
                this.showcode = true;
                this.dataprovider.presentToast('Enter valid code');
                this.disableButton = false;
                console.log(error);
                console.log(error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);

            });
    }

    login() {

        if (!this.validate()) {
            return false;
        }
        this.storage.get('api').then((api) => {

            if (api !== undefined && api !== null) {
                // api = JSON.parse(api);


                if (api.url_api !== undefined) {
                    let url = api.url_api + '/register?name=' + this.loginUser.name + '&email=' + this.loginUser.email + '&number=' + this.loginUser.phone;
                    this.disableButton = true;
                    this.http.get(url, {}, {})
                        .then(data => {

                            this.disableButton = false;
                            let apiData = JSON.parse(data.data);
                            this.storeData('user', apiData.user);
                            this.storeData('CODE', this.loginUser.code);

                            if (apiData.user.id) {
                                this.loginUser.name = '';
                                this.loginUser.email = '';
                                this.loginUser.phone = '';

                                this.menu.enable(true, 'first');
                                this.events.publish('user:login','');

                                // setTimeout(() => {
                                //     console.log("go tab1")

                                this.routes.navigate(['/tabs/tab1']);
                                // }, 1000);
                            } else {
                                this.dataprovider.presentToast('Login error');

                            }
                            // this.presentHome();
                        })
                        .catch(error => {
                            console.log(error);
                            console.log(error.status);
                            console.log(error.error); // error message as string
                            console.log(error.headers);

                        });

                } else {
                    // this.showcode = true;
                    this.showCode();
                    // this.login();
                }
            } else {
                    console.log("api null")
                // this.showcode = true;
                this.showCode();
                // this.login();
            }

        });
    }
}

// Modal class - LoginUser
class LoginUser {
    code: any = '';
    name: any = '';
    phone: any = '';
    email: any = '';
    // code: any = '19EK01';
    // name: any = 'sujith';
    // phone: any = '7736190194';
    // email: any = 'sujith2014@gmail.com';
}
