import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';



class MenuItem {
	title: string;
	url: string;
	active: boolean = false;


	constructor(title, url) {
		this.title = title;
		this.url = url;
	}
}
@Component({
	selector: 'header',
	templateUrl: './header.component.html'
})


export class HeaderComponent {
	menuItems: Array<MenuItem> = new Array<MenuItem>();

	constructor(private userService: UserService, private route: Router) {

		this.userService.user.subscribe(user => {
			this.menuItems = new Array<MenuItem>();
			this.menuItems.push(new MenuItem("Kezdőlap", ""));
			
			if (user.success) {
				this.menuItems.push(new MenuItem("Munkák", "jobs"));
			}
			else{
				this.menuItems.push(new MenuItem("Regisztráció", "registration"));
			}
			let url = this.route.url.split('/');
			for (let item of this.menuItems) {
				if (item.url == url[1]) {
					item.active = true;
				}
			}
		});


		this.route.events
			.subscribe((event) => {
				let url = this.route.url.split('/');
				for (let item of this.menuItems) {
					if (item.url == url[1]) {
						item.active = true;
					}
					else {
						item.active = false;
					}
				}
			});
	}

	navi(item: MenuItem) {
		this.route.navigate([item.url]);
	}
}
