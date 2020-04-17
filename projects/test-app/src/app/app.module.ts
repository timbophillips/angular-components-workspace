import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// added for filtered-select
import { FilteredSelectModule } from '../../../filtered-select/src/lib/filtered-select.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FilteredSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
