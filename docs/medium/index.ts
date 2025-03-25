// 获取函数返回类型
// const fn = (v: boolean) => {
//     if (v) return 1;
//     else return 2;
// };

// type a = MyReturnType<typeof fn>; // 应推导出 "1 | 2"
{
    type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
}

// 实现Omit
// interface Todo {
//     title: string;
//     description: string;
//     completed: boolean;
// }

// type TodoPreview = MyOmit<Todo, 'description' | 'title'>;

// const todo: TodoPreview = {
//     completed: false,
// };
{
    type MyOmit<T, K extends keyof T> = {
        [P in keyof T as P extends K ? never : P]: T[P];
    }
    interface Todo {
        title: string;
        description: string;
        completed: boolean;
    }
    type TodoPreview = MyOmit<Todo, 'description' | 'title'>; // { completed: boolean }  
}

// 实现DeepReadonly
// type X = {
//     x: {
//         a: 1;
//         b: 'hi';
//     };
//     y: 'hey';
// };

// type Expected = {
//     readonly x: {
//         readonly a: 1;
//         readonly b: 'hi';
//     };
//     readonly y: 'hey';
// };

// type Todo = DeepReadonly<X>; // should be same as `Expected`
{
    type DeepReadonly<T> = {
        readonly [P in keyof T]: T[P] extends Function
        ? T[P]
        : T[P] extends object
        ? DeepReadonly<T[P]>
        : T[P]
    }
}

// 元组转联合
// type Arr = ['1', '2', '3'];

// type Test = TupleToUnion<Arr>; // expected to be '1' | '2' | '3'
{
    type TupleToUnion<T extends any[]> = T[number];
    type Test = TupleToUnion<['1', '2', '3']>; // expected to be '1' | '2' | '3'
}

// 可串联构造器
// declare const config: Chainable;

// const result = config
//   .option('foo', 123)
//   .option('name', 'type-challenges')
//   .option('bar', { value: 'Hello World' })
//   .get();

// // 期望 result 的类型是：
// interface Result {
//   foo: number;
//   name: string;
//   bar: {
//     value: string;
//   };
// }
{
    type Chainable<T = {}> = {
        option<K extends string, S>(
            key: K extends keyof T ? never : K,
            value: S
        ): Chainable<
            {
                // 核心，从原来的 T 中排除 K 属性，这样交叉后的结果就是传入的 S 属性
                [P in keyof T as P extends K ? never : P]: T[P]
            } &
            {
                [P in K]: S;
            }
        >,
        get(): T;
    }
}

// 最后一个元素
// type arr1 = ['a', 'b', 'c'];
// type arr2 = [3, 2, 1];

// type tail1 = Last<arr1>; // expected to be 'c'
// type tail2 = Last<arr2>; // expected to be 1
{
    type Last<T extends any[]> = T extends [...infer F, infer R] ? R : never;
}

// 实现Pop、Shift
// type arr1 = ['a', 'b', 'c', 'd'];
// type arr2 = [3, 2, 1];

// type re1 = Pop<arr1>; // expected to be ['a', 'b', 'c']
// type re2 = Pop<arr2>; // expected to be [3, 2]
{
    type Pop<T extends any[]> = T extends [...infer F, infer R] ? F : [];
    type Shift<T extends any[]> = T extends [infer F, ...infer R] ? R : [];
}

// 实现Promise.all
// const promise1 = Promise.resolve(3);
// const promise2 = 42;
// const promise3 = new Promise<string>((resolve, reject) => {
//   setTimeout(resolve, 100, 'foo');
// });

// // expected to be `Promise<[number, 42, string]>`
// const p = PromiseAll([promise1, promise2, promise3] as const);
{
    type PromiseAll<T extends any[]> = {
        [P in keyof T]: T[P] extends Promise<infer R>
        ? R
        : T[P]
    }
}

// 实现按类型查找
// interface Cat {
//     type: 'cat';
//     breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal';
// }

// interface Dog {
//     type: 'dog';
//     breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer';
//     color: 'brown' | 'white' | 'black';
// }

// type MyDog = LookUp<Cat | Dog, 'dog'>; // expected to be `Dog`
{
    type Loockup<U, T> = U extends { type: T } ? U : never;
}

// 实现TrimLeft
// type trimed = TrimLeft<'  Hello World  '>; // 应推导出 'Hello World  '
{
    // ${' ' | '\n' | '\t'} 占据一个字符，R 匹配剩余的字符，如果能够匹配，证明第一个字符就是空白字符，此时需要继续处理剩余字符 R，否则返回当前字符 S
    type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}`
        ? TrimLeft<R>
        : S;
}

// 实现Trim
// type trimed = Trim<'  Hello World  '>; // expected to be 'Hello World'
{
    type Trim<S extends string> = S extends
        | `${' ' | '\n' | '\t'}${infer M}`
        | `${infer M}${' ' | '\n' | '\t'}`
        ? Trim<M>
        : S;
}

// 实现Replace
// type replaced = Replace<'types are fun!', 'fun', 'awesome'>; // 期望是 'types are awesome!'
{
    type Replace<S extends string, From extends string, To extends string> =
        From extends ''
        ? S
        : S extends `${infer F}${From}${infer R}`
        ? `${F}${To}${R}`
        : S;
    type replaced = Replace<'types are fun!', 'fun', 'awesome'>;
}

// 实现ReplaceAll
// type replaced = ReplaceAll<'t y p e s', ' ', ''>; // 期望是 'types'
{
    type ReplaceAll<S extends string, From extends string, To extends string> =
        From extends ''
        ? S
        : S extends `${infer F}${From}${infer R}`
        ? `${F}${To}${ReplaceAll<R, From, To>}`
        : S;
    type replaced = ReplaceAll<'t y p e s', ' ', ''>; // 期望是 'types'
}

// 追加参数
// type Fn = (a: number, b: string) => number;

// type Result = AppendArgument<Fn, boolean>;
// // 期望是 (a: number, b: string, x: boolean) => number
{
    type AppendArgument<Fn extends Function, A> =
        // 推断入参和返回值
        Fn extends (...args: infer P) => infer R
        ? // 生成新的入参和返回值
        (...args: [...P, A]) => R
        : never;
    type Fn = (a: number, b: string) => number;
    type Result = AppendArgument<Fn, boolean>;
}

// 实现全排列
// type perm = Permutation<'A' | 'B' | 'C'>; 
// expected ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
{
    type Permutation<T, C = T> =
        [T] extends [never]
        ? []
        : T extends any
        ? [T, ...Permutation<Exclude<C, T>>]
        : never;
    type perm = Permutation<'A' | 'B' | 'C'>;
}

// 实现Flatten
// type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, 5]
{
    type Flatten<T> = T extends [infer F, ...infer R]
        ? F extends any[]
        ? [...Flatten<F>, ...Flatten<R>]
        : [F, ...Flatten<R>]
        : [];
    type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, 5]
}

// AppendToObject
// type Test = { id: '1' };
// type Result = AppendToObject<Test, 'value', 4>; // expected to be { id: '1', value: 4 }
{
    type Merge<T> = {
        [P in keyof T]: T[P];
    }
    type AppendToObject<T, U extends string, V> = Merge<
        T & {
            [K in U]: V;
        }
    >
    type Test = { id: '1' };
    type Result = AppendToObject<Test, 'value', 4>; // expected to be { id: '1', value: 4 }
}

// 实现Absolute
// type Test = -100;
// type Result = Absolute<Test>; // expected to be "100"
{
    type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer S}`
        ? `${S}`
        : `${T}`;
    type Test = -100;
    type Result = Absolute<Test>
}

// 字符转联合
// type Test = '123';
// type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"
{
    type StringToUnion<T extends string> = T extends `${infer F}${infer R}`
        ? F | StringToUnion<R>
        : never;
    type Test = '123';
    type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"

    type StringToTuple<T extends string> = T extends `${infer F}${infer R}`
        ? [F, ...StringToTuple<R>]
        : [];
    type Result1 = StringToTuple<Test>; // expected to be "1" | "2" | "3"
}

// 实现Merge
// type foo = {
//     name: string;
//     age: string;
// };

// type coo = {
//     age: number;
//     sex: string;
// };

// type Result = Merge<foo, coo>; // expected to be {name: string, age: number, sex: string}
{
    type Merge<F, S> = {
        [P in keyof F | keyof S]: P extends keyof S
        ? S[P]
        : P extends keyof F
        ? F[P]
        : never
    }
}

// 实现KebabCase
// type FooBarBaz = KebabCase<'FooBarBaz'>;
// const foobarbaz: FooBarBaz = 'foo-bar-baz';

// type DoNothing = KebabCase<'do-nothing'>;
// const doNothing: DoNothing = 'do-nothing';
{
    type KebabCase<S extends string> = S extends `${infer F}${infer R}`
        ? // 判断剩余字符的首字母是否大写
        R extends Uncapitalize<R>
        ? // 如果是小写，那么直接拼接递归处理后的剩余字符
        `${Lowercase<F>}${KebabCase<R>}`
        : // 如果是大写，那么增加 - 拼接
        `${Lowercase<F>}-${KebabCase<R>}`
        : '';
    type FooBarBaz = KebabCase<'FooBarBaz'>;
}

// 实现Diff
// type Foo = {
//     a: string;
//     b: number;
// };
// type Bar = {
//     a: string;
//     c: boolean;
// };

// type Result1 = Diff<Foo, Bar>; // { b: number, c: boolean }
// type Result2 = Diff<Bar, Foo>; // { b: number, c: boolean }
{
    type Diff<O, O1> = {
        [P in keyof O | keyof O1 as P extends keyof O & keyof O1
        ? never
        : P]: P extends keyof O ? O[P] : P extends keyof O1 ? O1[P] : never; // 补充属性值即可
    }
}

// AnyOf
// type Sample1 = AnyOf<[1, '', false, [], {}]>; // expected to be true.
// type Sample2 = AnyOf<[0, '', false, [], {}]>; // expected to be false.
{
    type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
    type Zerolist = 0 | false | '' | [] | undefined | null;
    type AnyOf<T extends readonly any[]> = T extends [infer F, ...infer R]
        ? F extends Zerolist
        ? AnyOf<R>
        : // 单独处理 {} 的判定
        Equal<F, {}> extends true
        ? AnyOf<R>
        : true
        : false;
    type Sample2 = AnyOf<[0, '', false, [], {}]>; // expected to be false.
}

// isNever
// type A = IsNever<never>; // expected to be true
// type B = IsNever<undefined>; // expected to be false
// type C = IsNever<null>; // expected to be false
// type D = IsNever<[]>; // expected to be false
// type E = IsNever<number>; // expected to be false
{
    type IsNever<T> = [T] extends [never] ? true : false;
    type A = IsNever<never>; // expected to be true
    type B = IsNever<undefined>; // expected to be false
}


// isUnion
// type case1 = IsUnion<string>; // false
// type case2 = IsUnion<string | number>; // true
// type case3 = IsUnion<[string | number]>; // false
{
    type IsUnion<T, K = T> =
        // 是 never ，那么返回 false
        [T] extends [never]
        ? false
        : // 触发分发特性
        T extends any
        ? // 比较原始类型和分发后的类型，如果一致，证明不是联合类型，否则就是联合类型
        // [] 是为了消除联合类型的分发特性
        [K] extends [T]
        ? false
        : true
        : false;
    type case1 = IsUnion<string>; // false
}

// 百分比解析器
// type PString1 = '';
// type PString2 = '+85%';
// type PString3 = '-85%';
// type PString4 = '85%';
// type PString5 = '85';

// type R1 = PercentageParser<PString1>; // expected ['', '', '']
// type R2 = PercentageParser<PString2>; // expected ["+", "85", "%"]
// type R3 = PercentageParser<PString3>; // expected ["-", "85", "%"]
// type R4 = PercentageParser<PString4>; // expected ["", "85", "%"]
// type R5 = PercentageParser<PString5>; // expected ["", "85", ""]
{
    type P1<T extends string> = T extends `${infer F extends '+' | '-'}${infer R}`
        ? F
        : '';
    type P2<T extends string> = T extends `${infer F extends '+' | '-'}${infer M}%`
        ? M
        : T extends `${infer F extends '+' | '-'}${infer M}`
        ? M
        : T extends `${infer M}%`
        ? M
        : T;

    type P3<T extends string> = T extends `${string}%` ? '%' : '';
    type PercentageParser<T extends string> = [P1<T>, P2<T>, P3<T>];
}