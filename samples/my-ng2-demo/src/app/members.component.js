"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var compare_service_1 = require("./compare.service");
var MembersComponent = (function () {
    function MembersComponent(compareService) {
        this.compareService = compareService;
        this.members = [];
    }
    MembersComponent.prototype.ngOnInit = function () {
        this.members = this.compareService.getMembers();
    };
    MembersComponent.prototype.onMemberClick = function (member) {
        var message = this.compareService.compareMembers(member);
        var frontEle = document.getElementById("compare-front");
        var afterEle = document.getElementById("compare-after");
        frontEle.classList.remove("compare-empty");
        frontEle.classList.remove("compare-full");
        frontEle.classList.remove("compare-win");
        frontEle.classList.remove("compare-equal");
        frontEle.classList.remove("compare-lose");
        afterEle.classList.remove("compare-empty");
        afterEle.classList.remove("compare-full");
        afterEle.classList.remove("compare-win");
        afterEle.classList.remove("compare-equal");
        afterEle.classList.remove("compare-lose");
        if (message == "store") {
            frontEle.classList.add("compare-full");
            afterEle.classList.add("compare-empty");
        }
        else {
            if (message == "win") {
                frontEle.classList.add("compare-win");
                afterEle.classList.add("compare-lose");
            }
            else if (message == "equal") {
                frontEle.classList.add("compare-equal");
                afterEle.classList.add("compare-equal");
            }
            else {
                frontEle.classList.add("compare-lose");
                afterEle.classList.add("compare-win");
            }
        }
    };
    return MembersComponent;
}());
MembersComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-page1',
        templateUrl: 'members.component.html',
        styleUrls: ['members.component.css']
    }),
    __metadata("design:paramtypes", [compare_service_1.CompareService])
], MembersComponent);
exports.MembersComponent = MembersComponent;
//# sourceMappingURL=members.component.js.map