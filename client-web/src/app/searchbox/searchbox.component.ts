import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchControlSharedStateService } from '../searchControlSharedState.service'

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent {
  query = new FormControl();

  constructor(private searchControlSharedState: SearchControlSharedStateService) {
    this.searchControlSharedState.query = this.query.valueChanges;
  }

  handleKeypress(keyCode: number) {
    if (keyCode == 13 || keyCode == 40) { // 13=enter, 40=down
      this.searchControlSharedState.setTyping(false);
    }
  }

  handleOnFocus() {
    this.searchControlSharedState.setTyping(true);
  }
}
