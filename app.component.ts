import {Component} from '@angular/core';

import {MenuController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    public appPages = [

        {
            title: 'Products',
            url: '/tabs/tab1',
            icon: 'apps'
        },
        {
            title: 'Wishlist',
            url: '/tabs/tab2',
            icon: 'flash'
        }, {
            title: 'Profile',
            url: '/tabs/tab3',
            icon: 'person'
        },

        // {
        //     title: 'List',
        //     url: '/list',
        //     icon: 'list'
        // },
        // {
        //     title: 'logout',
        //     url: '/login',
        //     icon: 'exit'
        // }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private storage: Storage,
        private menu: MenuController,
        private nav: NavController,
    ) {
        this.initializeApp();

        platform.ready().then(() => {

            this.storage.get('user').then((user) => {

                if (user !== undefined && user !== null) {

                    if (user.id !== undefined && user.id !== null) {
                        console.log('user******************');

                        // this.router.navigate(['/tabs/tab1']);
                        this.nav.navigateRoot('/tabs/tab1');

                    } else {
                        console.log('no user******************');
                    }

                } else {
                    this.nav.navigateRoot('/login');
                    // this.router.navigate(['/login']);
                    console.log('no user******************');
                }

            });


            // this.platform.backButton.subscribe(() => {
            //     // code that is executed when the user pressed the back button
            //     console.log("back presseda");
            //     console.log(JSON.stringify(this.router))
            // });

            this.platform.ready().then(() => {
                document.addEventListener('backbutton', () => {
                    // code that is executed when the user pressed the back button

                    console.log(this.router.url);

                    if (this.router.url == '/tabs/tab1' || this.router.url == '/tabs/tab2' || this.router.url == '/tabs/tab3'|| this.router.url == '/login') {
                        console.log('app is exiting');
                        navigator['app'].exitApp();
                    } else {
                        this.nav.back();
                    }


                    //
                    // /tabs/tab3  /tabs/tab2 /tabs/tab1

                });
            });

        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    logout() {
        console.log('logout');
        // this.menu.enable(false, 'first');
        this.menu.toggle('first');

        this.storage.get('CODE').then((val) => {
            console.log(val);
            this.storage.get('api').then((api) => {
                this.storage.clear();
                this.storage.set('api', api);

                this.storage.set('CODE', val);

                this.router.navigate(['/login']);

            });
        });


    }

    menuOpened(event) {
        console.log(event);
    }

    menuClosed(event) {
        console.log(event);
    }
}
