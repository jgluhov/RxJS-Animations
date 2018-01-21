import * as Rx from './rx';

const hand = <HTMLElement>document.querySelector('.hand')!;
const balls = <NodeListOf<HTMLElement>>document.querySelectorAll('.ball');

const distance = (d: number) => (t: number) => t * d;

const msElapsed$ = (scheduler = Rx.animationFrame) => {
    return Rx.defer(() => {
        const start = scheduler.now(),
            substractTime = () => scheduler.now() - start;
        
        return Rx.interval(0, scheduler)
            .pipe(Rx.map(substractTime));
    });
};

const duration$ = (ms: number, scheduler = Rx.animationFrame) => {
    return msElapsed$(scheduler)
        .pipe(
            Rx.map((ems: number) => ems / ms),
            Rx.takeWhile(t => t <= 1)
        );
};

type EasingFn = (t: number) => number;

const elasticOut: EasingFn = (t: number) => {
    return Math.sin(-13.0 * (t + 1.0) * 
    Math.PI/2) * 
    Math.pow(2.0, -10.0 * t) + 
    1.0;
};

const moveDown = (el: HTMLElement) => (duration$: Rx.Observable<number>) => {
    return duration$
        .pipe(
            Rx.map(elasticOut), 
            Rx.map(distance(300)), 
            Rx.concat(Rx.of(300)),
            Rx.tap((distance: number) => {
                el.style.transform = `translate3d(0, ${distance}px, 0)`;
            })
        );
};

const ballsAnimation$ = Rx.from(balls)
    .pipe(
        Rx.concatMap((ball: HTMLElement, i: number) => {
            return duration$(3000).pipe(moveDown(ball));
        })
    );

const tween = (ms: number, easing: EasingFn) => (source$: Rx.Observable<number>) => {
    return source$
        .pipe(
            Rx.pairwise(),
            Rx.switchMap(([p, n]) => {
                return duration$(ms)
                    .pipe(
                        Rx.map(easing), 
                        Rx.map(distance(n - p)),
                        Rx.map(v => n + v)
                    );
            })
        );
};

const rotateAnimation$ = (el: HTMLElement) => Rx.timer(0, 1000)
    .pipe(
        Rx.map(t => t * 360 / 60),
        tween(900, elasticOut),
        Rx.tap(degree => {
            el.style.transform = `rotate(${degree}deg)`;
        })
    );

const handAnimtion$ = Rx.of(hand)
    .pipe(Rx.switchMap(rotateAnimation$));

// Start animations
ballsAnimation$.subscribe();    
handAnimtion$.subscribe();
