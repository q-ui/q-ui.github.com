import { Component, OnInit } from "@angular/core";

import { Member } from './member';
import { Log } from './log';
import { CompareService } from './compare.service';

@Component({
    moduleId: module.id,
    selector: 'my-page2',
    template: `
        <div class="listDiv">
            <ul>
                <li *ngFor="let log of logs" >
                    {{log.time}} {{log.frontMember}} {{log.winOrLose}} {{log.afterMember}}
                </li>
            </ul>
        </div>        
    `,
    styles: [`
        .listDiv {
            overflow: scroll;
            height: 400px;
            background-color: white;
            margin: 10px 5px 10px 5px;
            box-shadow: 1px 3px 3px #999999;
        }
    `]
})
export class LogComponent implements OnInit {
    members: Member[] = [];
    logs: Log[] = [];

    constructor(private compareService: CompareService) { }

    ngOnInit(): void {
        this.logs = this.compareService.getLogs();
    }
}