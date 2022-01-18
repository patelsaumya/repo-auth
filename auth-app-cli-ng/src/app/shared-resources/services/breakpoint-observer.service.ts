import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { startWith, map, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import {EnumScreenSizes} from '../enum-types';

const QUERY: Map<EnumScreenSizes, string> = new Map([
  [EnumScreenSizes.xl, '(min-width: 1920px)'],
  [EnumScreenSizes.lg, '(min-width: 1280px)'],
  [EnumScreenSizes.md, '(min-width: 960px)'],
  [EnumScreenSizes.sm, '(min-width: 600px)'],
  [EnumScreenSizes.xs, '(min-width: 0px)'],
]);

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {
  private readonly $screenSize$: Observable<EnumScreenSizes>;

  constructor(
  ) {
    this.$screenSize$ = fromEvent(window, 'resize')
      .pipe(
        startWith(this._getScreenSize()),
        map(this._getScreenSize),
        distinctUntilChanged(),
        shareReplay(1)
      );

    this.$screenSize$.subscribe(p => {
      // console.log(p);
    });
  }

  public get screenSize$(): Observable<EnumScreenSizes> {
    return this.$screenSize$;
  }

  private _getScreenSize(): EnumScreenSizes {
    const [[newSize]] = Array.from(QUERY.entries())
      .filter(([screenSize, mediaQuery]) => window.matchMedia(mediaQuery).matches);
    return newSize;
  }
}
