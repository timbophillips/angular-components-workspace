import { NgModule } from '@angular/core';
import { FilteredSelectComponent } from './filtered-select.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FilteredSelectComponent],
  imports: [ CommonModule
  ],
  exports: [FilteredSelectComponent]
})
export class FilteredSelectModule { }
