// SimpleVue
// const instance = SimpleVue({
//     data() {
//         return {
//             firstname: 'Type',
//             lastname: 'Challenges',
//             amount: 10,
//         };
//     },
//     computed: {
//         fullname() {
//             return this.firstname + ' ' + this.lastname;
//         },
//     },
//     methods: {
//         hi() {
//             alert(this.fullname.toLowerCase());
//         },
//     },
// });
declare function SimpleVue<D, C, M>(options: {
    data: (this: void) => void;
    computed: C & ThisType<D>;
    methods: M & ThisType<D & M & {
        [P in keyof C]: C[P] extends (...args: any[]) => infer R ? R : never;
    }>
}): any;

// 柯里化
// const add = (a: number, b: number) => a + b;
// const three = add(1, 2);

// const curriedAdd = Currying(add);
// const five = curriedAdd(2)(3);
// 由于需要递归，所以需要单独伶出来一个类型来做递归
type CurriedFn<Fn> =
    // 匹配入参 P 和 返回值 R
    Fn extends (...args: infer P) => infer R
    ? // 匹配第一个参数 F 和其他参数 Other
    P extends [infer F, ...infer Other]
    ? // 如果入参不为空，返回新的函数，入参就是第一个参数 F
    (arg: F) => // 判断剩余参数为空
        Other extends []
        ? // 如果剩余参数为空，那么就是返回值本身
        R
        : // 否则还需要进行一次柯里化，也可以看出来
        // 递归的过程中，已经排除了入参为空的情况
        CurriedFn<(...args: Other) => R>
    : // 入参为空，就返回函数自身，应对初始入参为空的情况
    Fn
    : never;

declare function Currying<F>(fn: F): CurriedFn<F>;

// UnionToIntersection
// type I = Union2Intersection<'foo' | 42 | true>; // expected to be 'foo' & 42 & true
{
    type UnionToIntersection<U> =
        // 利用分发特性生成 (arg: a) => any | (arg: b) => any
        (U extends any ? (arg: U) => any : never) extends (arg: infer P) => any
        ? // 利用逆变特性，P = a & b
        P
        : never;
    type I = UnionToIntersection<'foo' | 42 | true>;
}