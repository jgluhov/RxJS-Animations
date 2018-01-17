import { Observable } from 'rxjs/observable';
import { defer } from 'rxjs/observable/defer';
import { interval } from 'rxjs/observable/interval';
import { map } from 'rxjs/operators/map';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

const msElapsed$ = (scheduler = animationFrame) => {
    return defer(() => {
        const start = scheduler.now(),
            substractTime = () => scheduler.now() - start;
        
        return interval(0, scheduler)
            .pipe(map(substractTime));
    });
}

const pixelsPerSecond = (v: number) => (ms: number) => v * ms / 1000;

msElapsed$()
    .pipe(
        map(pixelsPerSecond(50))
    )    
    .subscribe((time: number) => {
        console.log(time);
    });
