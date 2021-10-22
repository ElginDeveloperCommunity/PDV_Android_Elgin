import * as tslib_1 from "tslib";
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';
import { raf } from './util/util';
export var appInitialize = function (config, doc, zone) {
    return function () {
        var win = doc.defaultView;
        if (win && typeof window !== 'undefined') {
            var Ionic = win.Ionic = win.Ionic || {};
            Ionic.config = tslib_1.__assign({}, config, { _zoneGate: function (h) { return zone.run(h); } });
            var aelFn_1 = '__zone_symbol__addEventListener' in doc.body
                ? '__zone_symbol__addEventListener'
                : 'addEventListener';
            return applyPolyfills().then(function () {
                return defineCustomElements(win, {
                    exclude: ['ion-tabs', 'ion-tab'],
                    syncQueue: true,
                    raf: raf,
                    jmp: function (h) { return zone.runOutsideAngular(h); },
                    ael: function (elm, eventName, cb, opts) {
                        elm[aelFn_1](eventName, cb, opts);
                    },
                    rel: function (elm, eventName, cb, opts) {
                        elm.removeEventListener(eventName, cb, opts);
                    }
                });
            });
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWluaXRpYWxpemUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImFwcC1pbml0aWFsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUUsY0FBYyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFJMUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVsQyxNQUFNLENBQUMsSUFBTSxhQUFhLEdBQUcsVUFBQyxNQUFjLEVBQUUsR0FBYSxFQUFFLElBQVk7SUFDdkUsT0FBTztRQUNMLElBQU0sR0FBRyxHQUE0QixHQUFHLENBQUMsV0FBa0IsQ0FBQztRQUM1RCxJQUFJLEdBQUcsSUFBSSxPQUFRLE1BQWMsS0FBSyxXQUFXLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUUxQyxLQUFLLENBQUMsTUFBTSx3QkFDUCxNQUFNLElBQ1QsU0FBUyxFQUFFLFVBQUMsQ0FBTSxJQUFLLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBWCxDQUFXLEdBQ25DLENBQUM7WUFFRixJQUFNLE9BQUssR0FBRyxpQ0FBaUMsSUFBSyxHQUFHLENBQUMsSUFBWTtnQkFDbEUsQ0FBQyxDQUFDLGlDQUFpQztnQkFDbkMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO1lBRXZCLE9BQU8sY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUMzQixPQUFPLG9CQUFvQixDQUFDLEdBQUcsRUFBRTtvQkFDL0IsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQztvQkFDaEMsU0FBUyxFQUFFLElBQUk7b0JBQ2YsR0FBRyxLQUFBO29CQUNILEdBQUcsRUFBRSxVQUFDLENBQU0sSUFBSyxPQUFBLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBekIsQ0FBeUI7b0JBQzFDLEdBQUcsRUFBSCxVQUFJLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUk7d0JBQ3pCLEdBQVcsQ0FBQyxPQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUMzQyxDQUFDO29CQUNELEdBQUcsWUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxJQUFJO3dCQUMxQixHQUFHLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDL0MsQ0FBQztpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBhcHBseVBvbHlmaWxscywgZGVmaW5lQ3VzdG9tRWxlbWVudHMgfSBmcm9tICdAaW9uaWMvY29yZS9sb2FkZXInO1xuXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuL3Byb3ZpZGVycy9jb25maWcnO1xuaW1wb3J0IHsgSW9uaWNXaW5kb3cgfSBmcm9tICcuL3R5cGVzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgcmFmIH0gZnJvbSAnLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgYXBwSW5pdGlhbGl6ZSA9IChjb25maWc6IENvbmZpZywgZG9jOiBEb2N1bWVudCwgem9uZTogTmdab25lKSA9PiB7XG4gIHJldHVybiAoKTogYW55ID0+IHtcbiAgICBjb25zdCB3aW46IElvbmljV2luZG93IHwgdW5kZWZpbmVkID0gZG9jLmRlZmF1bHRWaWV3IGFzIGFueTtcbiAgICBpZiAod2luICYmIHR5cGVvZiAod2luZG93IGFzIGFueSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBJb25pYyA9IHdpbi5Jb25pYyA9IHdpbi5Jb25pYyB8fCB7fTtcblxuICAgICAgSW9uaWMuY29uZmlnID0ge1xuICAgICAgICAuLi5jb25maWcsXG4gICAgICAgIF96b25lR2F0ZTogKGg6IGFueSkgPT4gem9uZS5ydW4oaClcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFlbEZuID0gJ19fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXInIGluIChkb2MuYm9keSBhcyBhbnkpXG4gICAgICAgID8gJ19fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXInXG4gICAgICAgIDogJ2FkZEV2ZW50TGlzdGVuZXInO1xuXG4gICAgICByZXR1cm4gYXBwbHlQb2x5ZmlsbHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRlZmluZUN1c3RvbUVsZW1lbnRzKHdpbiwge1xuICAgICAgICAgIGV4Y2x1ZGU6IFsnaW9uLXRhYnMnLCAnaW9uLXRhYiddLFxuICAgICAgICAgIHN5bmNRdWV1ZTogdHJ1ZSxcbiAgICAgICAgICByYWYsXG4gICAgICAgICAgam1wOiAoaDogYW55KSA9PiB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKGgpLFxuICAgICAgICAgIGFlbChlbG0sIGV2ZW50TmFtZSwgY2IsIG9wdHMpIHtcbiAgICAgICAgICAgIChlbG0gYXMgYW55KVthZWxGbl0oZXZlbnROYW1lLCBjYiwgb3B0cyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWwoZWxtLCBldmVudE5hbWUsIGNiLCBvcHRzKSB7XG4gICAgICAgICAgICBlbG0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNiLCBvcHRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcbiJdfQ==