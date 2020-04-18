import { Component } from '@angular/core';
import { option } from '../../../filtered-select/src/lib/filtered-select.component';

const options: option[] = [
  { text: 'Tim', id: 'TP', group: 'Parents' },
  { text: 'Ben', id: 'BP', group: 'Parents' },
  { text: 'Katie', id: 'KP', group: 'Parents' },
  { text: 'John', id: 'JP', group: 'Grandparents' },
  { text: 'Sue', id: 'SP', group: 'Grandparents' },
  { text: 'Sarah', id: 'SR', group: 'Parents' },
  { text: 'Claire', id: 'CB', group: 'Parents' },
  { text: 'Drew', id: 'AM', group: 'Parents' },
  { text: 'Molly', id: 'MP', group: 'Kids' },
  { text: 'Lucy', id: 'LP', group: 'Kids' },
  { text: 'Jess', id: 'JP2', group: 'Kids' },
  { text: 'George', id: 'GP', group: 'Kids' },
  { text: 'Daisy', id: 'DM', group: 'Kids' },
  { text: 'Benny', id: 'BP', group: 'Nicknames' },
  { text: 'Timbo', id: 'TP', group: 'Nicknames' },
  { text: 'Richo', id: 'SR', group: 'Nicknames' },
];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  options = options;
  selectedOption: option;
  onResult(id: option) {
    this.selectedOption = id;
  }
}
