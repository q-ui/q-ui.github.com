import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MembersComponent } from './members.component';
import { LogComponent } from './log.component';
import { CompareService } from './compare.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule],
  declarations: [
    AppComponent,
    MembersComponent,
    LogComponent
  ],
  providers: [
    CompareService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
