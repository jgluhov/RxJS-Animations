import { Observable } from 'rxjs/observable';
import { defer } from 'rxjs/observable/defer';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';
import { concat } from 'rxjs/operators/concat';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { takeWhile } from 'rxjs/operators/takeWhile'
import { animationFrame } from 'rxjs/scheduler/animationFrame';

const distance = (d: number) => (t: number) => t * d;

const msElapsed$ = (scheduler = animationFrame) => {
    return defer(() => {
        const start = scheduler.now(),
            substractTime = () => scheduler.now() - start;
        
        return interval(0, scheduler)
            .pipe(map(substractTime));
    });
};

const duration$ = (ms: number, scheduler = animationFrame) => {
    return msElapsed$(scheduler)
        .pipe(
            map((ems: number) => ems / ms),
            takeWhile(t => t <= 1)
        );
};

const elasticOut = (t: number) => {
    return Math.sin(-13.0 * (t + 1.0) * 
    Math.PI/2) * 
    Math.pow(2.0, -10.0 * t) + 
    1.0;
};

const moveDown = (el: HTMLElement) => (duration$: Observable<number>) => {
    return duration$
        .pipe(
            map(elasticOut), 
            map(distance(300)), 
            concat(of(300)),
            tap((distance: number) => {
                el.style.transform = `translate3d(0, ${distance}px, 0)`;
            })
        );
};

const balls = <NodeListOf<HTMLElement>>document.querySelectorAll('.ball');

from(balls)
    .pipe(
        mergeMap((ball: HTMLElement, i: number) => {
            return duration$(3000).pipe(moveDown(ball));
        })
    )
    .subscribe();






