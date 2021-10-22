/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, Injectable, NgZone } from '@angular/core';
/**
 * A mock implementation of {@link NgZone}.
 */
export class MockNgZone extends NgZone {
    constructor() {
        super({ enableLongStackTrace: false, shouldCoalesceEventChangeDetection: false });
        this.onStable = new EventEmitter(false);
    }
    run(fn) {
        return fn();
    }
    runOutsideAngular(fn) {
        return fn();
    }
    simulateZoneExit() {
        this.onStable.emit(null);
    }
}
MockNgZone.decorators = [
    { type: Injectable }
];
MockNgZone.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfem9uZV9tb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0aW5nL3NyYy9uZ196b25lX21vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRy9EOztHQUVHO0FBRUgsTUFBTSxPQUFPLFVBQVcsU0FBUSxNQUFNO0lBR3BDO1FBQ0UsS0FBSyxDQUFDLEVBQUMsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLGtDQUFrQyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFIekUsYUFBUSxHQUFzQixJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUkvRCxDQUFDO0lBRVEsR0FBRyxDQUFDLEVBQVk7UUFDdkIsT0FBTyxFQUFFLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFUSxpQkFBaUIsQ0FBQyxFQUFZO1FBQ3JDLE9BQU8sRUFBRSxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQzs7O1lBbEJGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtFdmVudEVtaXR0ZXIsIEluamVjdGFibGUsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuLyoqXG4gKiBBIG1vY2sgaW1wbGVtZW50YXRpb24gb2Yge0BsaW5rIE5nWm9uZX0uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNb2NrTmdab25lIGV4dGVuZHMgTmdab25lIHtcbiAgb3ZlcnJpZGUgb25TdGFibGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcihmYWxzZSk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe2VuYWJsZUxvbmdTdGFja1RyYWNlOiBmYWxzZSwgc2hvdWxkQ29hbGVzY2VFdmVudENoYW5nZURldGVjdGlvbjogZmFsc2V9KTtcbiAgfVxuXG4gIG92ZXJyaWRlIHJ1bihmbjogRnVuY3Rpb24pOiBhbnkge1xuICAgIHJldHVybiBmbigpO1xuICB9XG5cbiAgb3ZlcnJpZGUgcnVuT3V0c2lkZUFuZ3VsYXIoZm46IEZ1bmN0aW9uKTogYW55IHtcbiAgICByZXR1cm4gZm4oKTtcbiAgfVxuXG4gIHNpbXVsYXRlWm9uZUV4aXQoKTogdm9pZCB7XG4gICAgdGhpcy5vblN0YWJsZS5lbWl0KG51bGwpO1xuICB9XG59XG4iXX0=