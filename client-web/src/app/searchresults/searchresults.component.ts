import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { SearchService } from '../search.service'
import { SearchControlSharedStateService } from '../searchControlSharedState.service'
import { BlinkItem } from '../blink-item';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-searchresults',
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.css']
})
export class SearchresultsComponent implements OnInit {

  results: BlinkItem[] = [];

  @ViewChild('res') firstResult; // all <a> elements are tagged with 'res'. ViewChild will return the first

  constructor(private searchService: SearchService, private searchControlSharedState: SearchControlSharedStateService) { }

  ngOnInit() {
    this.searchControlSharedState.query.debounceTime(1000).distinctUntilChanged()
      .switchMap(q => this.searchService.search(q))  // to prevent out of order responses https://angular-2-training-book.rangle.io/handout/http/search_with_switchmap.html
      .subscribe(rs => this.results = rs);

    this.searchControlSharedState.isTyping.distinctUntilChanged().subscribe(isTyping => {
      if (!isTyping) {
        this.firstResult.nativeElement.focus();
      }
    });
  }

  handleKeypress(event: KeyboardEvent) {
    if (event.keyCode == 40) { //40=down
      let target = new ElementRef(event.srcElement.nextSibling).nativeElement;
      if (target.className && target.className.indexOf("list-group-item") >= 0) {
        target.focus();
      }
    }
    else if (event.keyCode == 38) { //38=up
      let target = new ElementRef(event.srcElement.previousSibling).nativeElement;
      if (target.className && target.className.indexOf("list-group-item") >= 0) {
        target.focus();
      }
    }
    else if (event.keyCode == 13) { //13=enter
      let target = new ElementRef(event.srcElement).nativeElement;
      if (target.className && target.className.indexOf("list-group-item") >= 0) {
        target.click();
      }
    }
  }
}
