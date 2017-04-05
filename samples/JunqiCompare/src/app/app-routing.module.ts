import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MembersComponent } from './members.component';
import { LogComponent } from './log.component';

const routes: Routes = [{
    path: '',
    redirectTo: '/members',
    pathMatch: 'full'
}, {
    path: 'members',
    component: MembersComponent
}, {
    path: 'log',
    component: LogComponent
}];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }