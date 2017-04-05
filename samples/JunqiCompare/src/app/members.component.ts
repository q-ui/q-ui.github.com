import { Component, OnInit } from "@angular/core";

import { Member } from './member'
import { CompareService } from './compare.service';

@Component({
    moduleId: module.id,
    selector: 'my-page1',
    templateUrl: 'members.component.html',
    styleUrls: ['members.component.css']
})
export class MembersComponent implements OnInit {
    members: Member[] = [];

    constructor(private compareService: CompareService) { }

    ngOnInit(): void {
        this.members = this.compareService.getMembers();
    }

    onMemberClick(member: Member): void {
        let message: String = this.compareService.compareMembers(member);
        let frontEle = document.getElementById("compare-front");
        let afterEle = document.getElementById("compare-after");
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
        } else {
            if (message == "win") {
                frontEle.classList.add("compare-win");
                afterEle.classList.add("compare-lose");
            } else if (message == "equal") {
                frontEle.classList.add("compare-equal");
                afterEle.classList.add("compare-equal");
            } else {
                frontEle.classList.add("compare-lose");
                afterEle.classList.add("compare-win");
            }
        }
    }

}