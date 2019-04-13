import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Events} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {DataProviderService} from '../data-provider.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
    loginUser: LoginUser = new LoginUser();
    showLoader = false;

    constructor(private routes: Router, public events: Events, private http: HTTP, private storage: Storage, private dataprovider: DataProviderService) {
        this.setData();
    }

    setData() {
        this.storage.get('user').then((user) => {

            if (user !== undefined && user !== null) {

                if (user.id !== undefined && user.id !== null) {
                    this.loginUser.name = user.name;
                    this.loginUser.phone = user.number;
                    this.loginUser.email = user.email;

                }
            }
        });
    }


    validate() {

        if(this.loginUser.name==''){
            this.dataprovider.presentToast('Enter a valid name');
            return false;
        }

        let emailField = this.loginUser.email;

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if ( re.test(String(emailField).toLowerCase()) === false) {

            this.dataprovider.presentToast('Enter a valid email id');

            return false;
        }

        return true;

    }


    save() {

        if (!this.validate()) {
            return false;
        }


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


                                let url = api.url_api + '/user/' + user.id + '/update?email=' + this.loginUser.email + '&name=' + this.loginUser.name + '&number=' + this.loginUser.phone;
                                this.showLoader = true;

                                this.http.setDataSerializer('json');
                                this.http.get(url, {}, {})
                                    .then(api => {
                                        this.showLoader = false;
                                        let apiData = JSON.parse(api.data);
                                        this.storage.set('user', apiData.user);

                                        this.dataprovider.presentToast('User details updated successfully');

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

// Modal class - LoginUser
class LoginUser {
    name: any = 'sujith';
    phone: any = '7736190194';
    email: any = 'sujith2014@gmail.com';
}
