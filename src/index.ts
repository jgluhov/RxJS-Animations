import { Observable } from 'rxjs/observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { map } from 'rxjs/operators/map';
import { concat } from 'rxjs/operators/concat';
import { takeWhile } from 'rxjs/operators/takeWhile'
import { animationFrame } from 'rxjs/scheduler/animationFrame';

const ball = <HTMLElement>document.querySelector('.ball');
const distance = (d: number) => (t: number) => t * d;

const msElapsed$ = (scheduler = animationFrame) => {
    return defer(() => {
        const start = scheduler.now(),
            substractTime = () => scheduler.now() - start;
        
        return interval(0, scheduler)
            .pipe(map(substractTime));
    });
}

const duration$ = (ms: number, scheduler = animationFrame) => {
    return msElapsed$(scheduler)
        .pipe(
            map((ems: number) => ems / ms),
            takeWhile(t => t <= 1)
        );
}

duration$(3000)
    .pipe(map(distance(300)), concat(of(300)))
    .subscribe((distance) => {
        console.log(distance);
        ball.style.transform = `translate3d(0, ${distance}px, 0)`;
    });
