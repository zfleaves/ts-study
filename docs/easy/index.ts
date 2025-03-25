// 第一个元素
// type arr1 = ['a', 'b', 'c'];
// type arr2 = [3, 2, 1];

// type head1 = First<arr1>; // expected to be 'a'
// type head2 = First<arr2>; // expected to be 3
{
    type arr1 = ['a', 'b', 'c'];
    // type First<T extends any[]> = T extends [] ? never : T[0];
    type First<T extends any[]> = T extends [infer F, ...infer R] ? F : never;
    type head1 = First<arr1>; // expected to be 'a'
}

// 获取元组长度
// type tesla = ['tesla', 'model 3', 'model X', 'model Y'];
// type spaceX = [
//   'FALCON 9',
//   'FALCON HEAVY',
//   'DRAGON',
//   'STARSHIP',
//   'HUMAN SPACEFLIGHT',
// ];

// type teslaLength = Length<tesla>; // expected 4
// type spaceXLength = Length<spaceX>; // expected 5
{
    type Length<T extends any[]> = T['length'];
    type tesla = ['tesla', 'model 3', 'model X', 'model Y'];
    type teslaLength = Length<tesla>; // expected 4
}

// 实现Awaited
// type Case1 = MyAwaited<Promise<string>>; // string
// type Case2 = MyAwaited<Promise<Promise<string>>>; // Promise<string>
// type Case3 = MyAwaited<Promise<Promise<Promise<string>>>>; // string
{
    type MyAwaited<T> = T extends | Promise<infer R> | { then: (onFullFilled: (arg: infer R) => any) => any } ? MyAwaited<R> : T;
    type Case3 = MyAwaited<Promise<Promise<Promise<number>>>>; // number
}

// 实现Concat
// type Result = Concat<[1], [2]> // expected to be [1, 2]
{
    type Concat<T extends any[], U extends any[]> = [...T, ...U];
    type Result = Concat<[1], [2]> // expected to be [1, 2]
}

// 实现Exclude
// type Result = MyExclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'
{
    // 触发分发特性
    // 'a' extends 'a' ? never : 'a' | 'b' extends 'a' ? never : 'b' | 'c' extends 'a' ? never : 'c'
    type MyExclude<T, U> = T extends U ? never : T;
    type Result = MyExclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'
}

// 实现If
// type A = If<true, 'a', 'b'>  // expected to be 'a'
// type B = If<false, 'a', 'b'> // expected to be 'b'
{
    type If<T extends boolean, U, K> = T extends true ? U : K;
    type A = If<false, 'a', 'b'>  // expected to be 'b'
}

// 实现Includes
// type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
{
    type MyEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

    type Includes<T extends readonly any[], U> = T extends [infer F, ...infer R]
        ? MyEqual<F, U> extends true
        ? true
        : // 递归判断剩余元素
        Includes<R, U>
        : false;

    type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
    type isPillarKars = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'> // expected to be `false`
}

// 实现Parameters
// const foo = (arg1: string, arg2: number): void => {}

// type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
{
    type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
    const foo = (arg1: string, arg2: number): void => { }
}

// 实现pick
// interface Todo {
//     title: string;
//     description: string;
//     completed: boolean;
// }

// type TodoPreview = MyPick<Todo, 'title' | 'completed'>;

// const todo: TodoPreview = {
//     title: 'Clean room',
//     completed: false,
// };
{
    type MyPick<T, K extends keyof T> = {
        [P in K]: T[P];
    }
}

// 实现Push
// type Result = Push<[1, 2], '3'>; // [1, 2, '3']
{
    type Push<T extends any[], U> = [...T, U];
    type Result = Push<[1, 2], '3'>; // [1, 2, '3'] 
}

// 实现Readonly
// interface Todo {
//     title: string;
//     description: string;
// }

// const todo: MyReadonly<Todo> = {
//     title: 'Hey',
//     description: 'foobar',
// };

// todo.title = 'Hello'; // Error: cannot reassign a readonly property
// todo.description = 'barFoo'; // Error: cannot reassign a readonly property
{
    type MyReadonly<T> = {
        readonly [P in keyof T]: T[P]
    }
}

// 实现Unshift
// type Result = Unshift<[1, 2], 0>; // [0, 1, 2,]
{
    type Unshift<T extends any[], U> = [U, ...T];
}

// 元组转换为对象
// const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;
// type result = TupleToObject<typeof tuple>;
// expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
{
    type TupleToObject<T extends any[]> ={
        [P in T[number]]: P;
    }
}