import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <h2 class="first-title">{{title}}</h2>
      <nav>
        <a #membersTab class="link-style tab-clicked" routerLink="/members" routerLinkAction="active" (click)=onLinkClick(membersTab)>Members</a>
        <a #logsTab class="link-style tab-normal" routerLink="/log" routerLinkAction="active" (click)=onLinkClick(logsTab)>Logs</a>
      </nav>
      <router-outlet></router-outlet>
  `,
  styles: [`
      .first-title {
          text-align: center;
          font-size:18px;
          color: #223233;
      }
      .link-style {
          text-decoration: none;
          display: inline-block;
          width:80px;
          text-align:center;
          padding: 4px 2px 4px 2px;
      }
      nav {
        border-bottom: 1px solid #aaaaaa;
        margin: 0px 5px 0px 5px;
      }
      .tab-normal {
          background-color: #dddddd;
      }
      .tab-clicked {
          background-color: #5fa2dd;
          color: white;
      }
  `]
})
export class AppComponent {
  title = 'Enjoy your compare'

  onLinkClick(me: Element): void {
    // debugger;
    let eles: HTMLCollection = me.parentElement.children;
    for (let i: number = 0; i < eles.length; i++) {
      if (eles[i] === me) {
        eles[i].classList.remove('tab-normal');
        eles[i].classList.add('tab-clicked');
      } else {
        eles[i].classList.remove('tab-clicked');
        eles[i].classList.add('tab-normal');
      }
    }
  }
}
