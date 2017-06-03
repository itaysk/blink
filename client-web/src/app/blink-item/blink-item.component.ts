import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BlinkItem } from '../blink-item'
import { SearchService } from '../search.service'

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-blink-item',
  templateUrl: './blink-item.component.html',
  styleUrls: ['./blink-item.component.css']
})
export class BlinkItemComponent implements OnInit {
  public model: BlinkItem = new BlinkItem();
  public formState: BehaviorSubject<FormState> = new BehaviorSubject<FormState>(FormState.Ready);
  public formMode: BehaviorSubject<FormMode> = new BehaviorSubject<FormMode>(FormMode.Submit);
  public FormState = FormState;
  public FormMode = FormMode;
  @ViewChild("tags") private tagsInputElement;

  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.formMode.next(FormMode.Submit);
    if (this.route.snapshot.params["id"]) {
      this.formMode.next(FormMode.Edit);
    }

    this.formMode.subscribe(m => {
      if (m == FormMode.Edit) {
        this.route.params
          .switchMap((params: Params) => this.searchService.lookup(params['id']))
          .subscribe((res: BlinkItem) => this.model = res);
      }
    });
  }

  onSubmit() {
    if (this.formMode.getValue() == FormMode.Submit) {
      this.searchService.submit(this.model).subscribe((i: BlinkItem) => this.router.navigate(['/link', i.id]));//TODO: handle errors
    } else if (this.formMode.getValue() == FormMode.Edit) {
      this.searchService.update(this.model).subscribe((i: BlinkItem) => {
        this.formMode.next(FormMode.Edit);
        this.formState.next(FormState.Ready);
      });//TODO: handle errors
    }
    this.formState.next(FormState.Processing);
  }

  //ng-bootstrap typeahead component methods
  /*
  Important: functions must be defined as arrow functions \ lambdas in order to create a clojure on 'this', otherwise 'this' will be undefined. See:
  https://github.com/ng-bootstrap/ng-bootstrap/issues/917
  https://ng-bootstrap.github.io/#/components/typeahead
  `Note that the "this" argument is undefined so you need to explicitly bind it to a desired "this" target.`
  */

  searchTag = (query: Observable<string>): Observable<string[]> =>
    query.debounceTime(400).filter((q) => q.length > 0).distinctUntilChanged().switchMap(
      q => this.searchService.searchTags(q)
        .map(o => [q].concat(o))
        .catch((err) => {
          console.log(err);
          return Observable.create([]);
        })
    );

  addTag(event) {
    event.preventDefault();
    let tag = event.item;
    this.model.tags.push(tag);
    this.tagsInputElement.nativeElement.value = '';
    this.tagsInputElement.nativeElement.focus();
  }
  
  removeTag(tag: string) {
    let foundTagIndex: number = this.model.tags.findIndex(t => t == tag);
    this.model.tags.splice(foundTagIndex, 1);
    this.tagsInputElement.nativeElement.focus();
  }
}

enum FormState {
  Ready = 0,
  Processing
}

enum FormMode {
  Submit = 0,
  Edit
}
