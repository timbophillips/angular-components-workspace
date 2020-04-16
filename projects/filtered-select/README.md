# FilterSelectDev

Ultra simple clone of Select2 written in [pure Angular 9](https://angular.io)
No additional dependencies


## Usage

[StackBlitz example](https://stackblitz.com/edit/filtered-select-example-usage)

### CLI 
`npm install --save filtered-select`

### In `app.module.ts`:
`import { FilteredSelectModule } from "filtered-select";`
`...
`@NgModule({`
`  // Added FilteredSelectModule`
` imports: [..., FilteredSelectModule],`
`...`

### In Angular HTML Template
`<filtered-select`
`    [options]="options"`
`    [lines]="8"`
`    [backgroundColor]="'white'"`
`    (chosenOption)="onResult($event)"`
`    [grouped]=true`
`  >`
`  </filtered-select>`

### In Angular component TS file
`import { option } from 'filtered-select';`

`const options: option[] = [`
`  { text: 'Tim', id: 'TP', group: 'Parents' },`
`  { text: 'Ben', id: 'BP', group: 'Parents' },`
`  { text: 'Katie', id: 'KP', group: 'Parents' },`
`  { text: 'John', id: 'JP', group: 'Grandparents' },`
`  { text: 'Sue', id: 'SP', group: 'Grandparents' },`
`  { text: 'Sarah', id: 'SR', group: 'Parents' },`
`  { text: 'Claire', id: 'CB', group: 'Parents' },`
`  { text: 'Drew', id: 'AM', group: 'Parents' },`
`  { text: 'Molly', id: 'MP', group: 'Kids' },`
`  { text: 'Lucy', id: 'LP', group: 'Kids' },`
`  { text: 'Jess', id: 'JP2', group: 'Kids' },`
`  { text: 'George', id: 'GP', group: 'Kids' },`
`  { text: 'Daisy', id: 'DM', group: 'Kids' },`
`  { text: 'Benny', id: 'BP', group: 'Nicknames' },`
`  { text: 'Timbo', id: 'TP', group: 'Nicknames' },`
`  { text: 'Richo', id: 'SR', group: 'Nicknames' },`
`];`


