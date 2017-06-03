import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { SearchService } from './search.service';
import { SearchControlSharedStateService } from './searchControlSharedState.service';
import { SearchresultsComponent } from './searchresults/searchresults.component'
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';
import { BlinkItemComponent } from './blink-item/blink-item.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    SearchboxComponent,
    SearchresultsComponent,
    SearchComponent,
    AboutComponent,
    BlinkItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: SearchComponent },
      { path: 'about', component: AboutComponent },
      { path: 'submit', component: BlinkItemComponent },
      { path: 'link/:id', component: BlinkItemComponent }      
    ], { useHash: true }),
    NgbModule.forRoot()],
  providers: [SearchService, SearchControlSharedStateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
