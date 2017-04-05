"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'Enjoy your compare';
    }
    AppComponent.prototype.onLinkClick = function (me) {
        // debugger;
        var eles = me.parentElement.children;
        for (var i = 0; i < eles.length; i++) {
            if (eles[i] === me) {
                eles[i].classList.remove('tab-normal');
                eles[i].classList.add('tab-clicked');
            }
            else {
                eles[i].classList.remove('tab-clicked');
                eles[i].classList.add('tab-normal');
            }
        }
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n      <h2 class=\"first-title\">{{title}}</h2>\n      <nav>\n        <a #membersTab class=\"link-style tab-clicked\" routerLink=\"/members\" routerLinkAction=\"active\" (click)=onLinkClick(membersTab)>Members</a>\n        <a #logsTab class=\"link-style tab-normal\" routerLink=\"/log\" routerLinkAction=\"active\" (click)=onLinkClick(logsTab)>Logs</a>\n      </nav>\n      <router-outlet></router-outlet>\n  ",
        styles: ["\n      .first-title {\n          text-align: center;\n          font-size:18px;\n          color: #223233;\n      }\n      .link-style {\n          text-decoration: none;\n          display: inline-block;\n          width:80px;\n          text-align:center;\n          padding: 4px 2px 4px 2px;\n      }\n      nav {\n        border-bottom: 1px solid #aaaaaa;\n        margin: 0px 5px 0px 5px;\n      }\n      .tab-normal {\n          background-color: #dddddd;\n      }\n      .tab-clicked {\n          background-color: #5fa2dd;\n          color: white;\n      }\n  "]
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map