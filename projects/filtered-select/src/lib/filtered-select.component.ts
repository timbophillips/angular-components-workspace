import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, of, fromEvent, merge } from 'rxjs';
import {
  filter,
  map,
  tap,
  distinctUntilChanged,
  debounceTime,
  delay,
  withLatestFrom,
  startWith,
  mapTo,
} from 'rxjs/operators';

export type option = {
  text: string;
  id: string;
  group?: string;
  selected?: boolean;
};

type groupedOptions = { groupName: string; options: option[] };

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'filtered-select',
  templateUrl: './filtered-select.component.html',
  styleUrls: ['./filtered-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilteredSelectComponent implements OnInit, AfterViewInit {
  // use the angular decorator to get the controls within the template
  @ViewChild('filterInput') filterInputElementRef: ElementRef;
  @ViewChild('selectBox') selectBoxElementRef: ElementRef;
  @ViewChild('fakeInput') fakeInputElementRef: ElementRef;

  // recieve an array of options
  @Input() options: option[];

  // boolean to declare whether we grouped or not
  @Input() grouped = false;

  // styling input variables all with a preset default
  @Input() lines = 5;
  // the background colour needs to be hardcoded so that it isn't transperant
  @Input() backgroundColor = '#fff';
  // likewise with border needs hard coding
  @Input() borderStyle = '1px solid #999';

  // produce a single chosen option as output
  @Output() chosenOption = new EventEmitter<option>();

  // observables used in the angular template
  filteredOptions: Observable<option[]>;
  filteredGroupedOptions: Observable<groupedOptions[]>;
  active: Observable<boolean>;
  chosenText: Observable<string>;

  // the three controls that are in the template
  // all found using @ViewChild above
  selectBox: HTMLSelectElement;
  filterInput: HTMLInputElement;
  fakeInput: HTMLInputElement;

  // these observables take care of the control
  // pretending to be just like a normal HTML
  // control...
  fakeInputFocus: Observable<boolean>;
  changeFilterText: Observable<string>;
  filterInputBlurFocusSelect: Observable<boolean>;
  selectFocusOrBlur: Observable<boolean>;
  optionChosen: Observable<option>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // use the @ViewChild obatined ElementRef to get the controls
    this.selectBox = this.selectBoxElementRef.nativeElement;
    this.filterInput = this.filterInputElementRef.nativeElement;
    this.fakeInput = this.fakeInputElementRef.nativeElement;

    // the "typeahead" style observable triggered by keyup on the filterInput control
    this.changeFilterText = fromEvent(this.filterInput, 'keyup').pipe(
      // if the down arrow is hit then give the focus to the selectBox control
      tap((e) =>
        (e as KeyboardEvent).key === 'ArrowDown' ? this.selectBox.focus() : null
      ),
      // ignore enter key and down arrow key from here onwards
      // (enter key dealth with elsewhere)
      filter(
        (e) =>
          (e as KeyboardEvent).key !== 'Enter' &&
          (e as KeyboardEvent).key !== 'ArrowDown'
      ),
      // prevent to rapid a change
      debounceTime(100),
      // only fire if text is different
      distinctUntilChanged(),
      // the payloiad
      map(() => this.filterInput.value),
      // kick off with an empty string
      startWith('')
    );

    // when user focuses on the fakeInput control, give the focus to the filterInput
    this.fakeInputFocus = merge(
      fromEvent(this.fakeInput, 'focus'),
      fromEvent(this.fakeInput, 'keyup'),
      fromEvent(this.fakeInput, 'click')
    ).pipe(
      mapTo(true),
      // needs the delay so that the dropdown div has appeared otherwise doesn't work
      tap(() => setTimeout(() => this.filterInput.focus(), 20))
    );

    // observable that returns true when selectBox gets focus and false when it loses it (blur)
    this.selectFocusOrBlur = merge(
      fromEvent(this.selectBox, 'blur').pipe(mapTo(false)),
      fromEvent(this.selectBox, 'focus').pipe(mapTo(true))
    ).pipe(startWith(false));

    // filter input blur event and the select component receives focus
    // this observable will fire every time the filterInput loses focus
    // true = selectBox got focus, false = it didn't
    this.filterInputBlurFocusSelect = fromEvent(this.filterInput, 'blur').pipe(
      // mapTo(true),
      // delay so that...
      delay(10),
      // ... the selectFocusOrBlur observable can be used
      // to decide if _the focus has left the filter but not gone to the select_
      withLatestFrom(this.selectFocusOrBlur),
      // spit out the most recent returned boolean from this.selectFocusOrBlur
      map(([, y]) => y)
    );

    // observable that produces the filtered array of options
    // which is used to fill the box (via ngFor* and async in the template)
    this.filteredOptions = merge(this.changeFilterText, of('')).pipe(
      map((filterString) =>
        this.options
          // filter them ignorning case
          .filter(
            (x) =>
              // look for the string in both the text and the group strings
              // use the JS || shorthand to replace undefined group field with ""
              (x.text.toLowerCase() + (x.group || '').toLowerCase()).indexOf(
                filterString.toLowerCase()
              ) > -1
          )
          // make them all "unselected"
          .map((y) => {
            y.selected = false;
            return y;
          })
          .sort((a, b) =>
            ((a.group || '') + a.text).localeCompare((b.group || '') + b.text)
          )
      ),
      map((x) => {
        // if the array is non-zero...
        if (x[0]) {
          // make the first one the selected one by default
          x[0].selected = true;
        }
        return x;
      })
    );

    // observable that produces the filtered AND GROUPED array of options
    // which is used to fill the second alternative (grouped) box
    this.filteredGroupedOptions = this.filteredOptions.pipe(
      map((x) =>
        // get the list of groups by mapping the group field of the options
        // and then deleting duplicates using Array.from(new Set(_original_array_))
        Array.from(new Set(x.map((y) => y.group)))
          // for each one of these groups create a groupedOptions object
          .map((group) => ({
            // with the group name
            groupName: group,
            // and an appropriately selected (filtered) group of options
            options: x.filter((y) => y.group === group),
          }))
      )
    );

    // observable to fire when the user chooses an option
    this.optionChosen = merge(
      // by clicking an item the selectBox or hitting enter in
      // either the filterInput or the selectBox
      fromEvent(this.selectBox, 'keyup').pipe(
        filter((e) => (e as KeyboardEvent).key === 'Enter')
      ),
      fromEvent(this.selectBox, 'click'),
      fromEvent(this.filterInput, 'keyup').pipe(
        filter((e) => (e as KeyboardEvent).key === 'Enter'),
        mapTo(true)
      )
    ).pipe(
      // transform the output into an option type variable
      map(() => ({
        text: this.selectBox.options[this.selectBox.selectedIndex].text,
        id: this.selectBox.options[this.selectBox.selectedIndex].value,
        // group: this.selectBox.options[this.selectBox.selectedIndex].label,
      })),
      // emit the chosenOption for the parent HTML control to read
      tap((x) => this.chosenOption.emit(x))

    );

    // observable to keep the text in the fakeInput up to date
    this.chosenText = this.optionChosen.pipe(map((x) => x.text));

    // observable that determines whether the dropdown + inner divs are visible or not
    // true = should be visible, false = should be hidden
    // used by the angular template as [hidden]="!(active | async)"
    this.active = merge(
      // this observable will fire every time the filterInput loses focus
      // true = selectBox got focus, false = it didn't
      this.filterInputBlurFocusSelect,
      // this input fires true if the fakeInput gets focus
      this.fakeInputFocus,
      // this observable fires false if the selectBox loses focus
      merge(fromEvent(this.selectBox, 'blur')).pipe(map(() => false)),
      // this observable fires if the user chooses an option
      this.optionChosen.pipe(mapTo(false))
      // this observable fires if the fakeInput text changes for whatever reason
      // this.chosenText.pipe(map(() => false))
    );

    // because we are creating all these observables in ngAfterViewInit
    // (cant do them in ngOnInit because the @ViewChild doesnt work)
    // we need to run change detection manually once
    this.cdr.detectChanges();
  }
}
