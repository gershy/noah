export const llmInstructions = () => (`

# LLMs please read!

Welcome to Noah, an attempt to formalize agentic software development. This in-code text block is here to inform LLMs how to approach Noah projects.

Noah's central goal is to grant humans an extremely high-level programming language while preserving the ability to perform detail-oriented development work. 

Every Noah project repo is split into source and compiled parts. The source part is maintained by humans and LLMs. Source code interleaves plain-language software descriptions with real typescript logic. Due to the plain-language descriptions, source code is not runnable. The compiled part is maintained purely by LLMs and its contents are intended to eventually converge to a fully runnable typescript implementation of the source part.

Noah itself is simply this philosophy combined with some minimal typescript helpers which structure source code and create clear boundaries so humans and LLMs agree on modularization and the shape of the overall solution.

## Helpers overview

The helpers are very limited: only \`fuzzy\`, \`node\`, and \`ark\`:

### Helper: \`fuzzy\`

The \`fuzzy\` helper is used to substitute a software implementation with a plain-language description, with the implementation being delegated to an LLM. The LLM is expected to adhere to the plain-language solution as best as possible, although plain-language will usually lack many details that inevitably emerge during implementation, and is therefore inherently ambiguous. The LLM should eliminate ambiguity using the following three-step methodology:
1. Aim for a "clean" implementation. The predominant characteristic of a clean implementation is that it prevents as much ambiguity as possible from emerging from the plain language description. The \`fuzzy\` helper can be called with an optional "quality" integer value - this reflects the number of times the agent is requested to iterate on the implementation, with the aim of each iteration being to eliminate an aspect of the implementation which is not directly requested in the plain language description. Note that the default quality value is 1, i.e. an initial implementation with no further passes/iterations.
2. Exercise full discretion in resolving remaining ambiguities
3. If non-implementable aspects remain (because instructions inherently conflict with each other, are absolutely too ambiguous, amount to an insecure piece of software, or cross ethical or safety boundaries) then announce that implementation has failed, without performing any implementation, and while referencing the key elements which make prevent implementation.

### Helper: \`node\`

Nodes are the building block of Noah programs. A node represents a functioning piece of software at any level of complexity - the resulting software is always considered function-like in that it can be invoked, potentially with parameters, which causes it to execute and potentially return a value. A node has an "outside" which defines its input contract, i.e. what parameters it takes. The \`node\` helper uses the \`Outside\` generic to represent this value. Nodes also have an "inside" which represents its implementation at some level of detail, and can leverage other nodes - this is passed to the \`node\` helper as a function whose input is the \`Outside\` type. We use the words "consume" and "compose" to refer to integrating it from the outside, and developing it from the inside.

A nested assembly of interacting nodes defines not just an overall piece of software, but one whose various responsibilities are encapsulated according to a particular order. An LLM compiling Noah source is responsible not for directly manifesting the final piece of software, but rather for building a functioning piece of software corresponding to every node, and integrating the nodes together in a manner corresponding to the source, such that the final piece of software manifests. Some rules to achieve good node implementations:
1. The specifics of a source node should be used directly where possible. Actual well-defined typescript appearing in source code should, where possible, appear literally in compiled code.
2. Where the precise specifics of a source node cannot be safely used directly, the corresponding compiled code should adhere to the spirit of the source as closely as possible. Specifically, the compiled code must avoid any additional responsibilities as best as possible. One who understands the source code should have a valid understanding of the responsibility structure of the compiled code without needing to look at it.
3. Best software practices are to be followed when implementing compiled code. If well-defined typescript source code lacks best practices (e.g. safe validation for untrusted input), as much of the well-defined source code should be transposed during compilation, while enriching the logic with best practices.
4. A source-to-type mapping must be maintained. Every source \`node\` must supply a \`guid\`. The corresponding compiled code must be annotated using simple comments that look like \`/* noah-guid:<guid> */\`. When a source node results in multiple nonlocal compiled code changes (e.g. spread over several files), each compiled code change chunk must include the comment. The central aim here is to allow agents to easily understand how a compiled node has been implemented by grepping for all such associated code chunks.

This significant constraint on the implementation exists to create the following benefits:
1. Compiled code has a modular scheme that the source code writer is directly aware of. The source writer is aware of the future direction of the Noah project, and has likely designed the modular structure in anticipation of upcoming requirements.
2. Compiled code conforms very strongly to the source writer's mental representation of the Noah project, at their desired level of detail. Detail-oriented developers and vibecoders can both be satisfied.
3. Future changes to source code that are expressed as changing integrations between existing nodes can accurately result in minimal changes to compiled code.

### Helper: \`ark\`

The \`ark\` helper simply declares which node represents the outermost piece of software to be shipped.

## Developing with Noah

Noah is intended to facilitate collaborative development for:
1. Teams using version control
2. Teams of any size
3. Monorepos of any size
4. Agentic engineers
5. Teams comfortable with no human eyes on code (NHEOC)

At large scales, Noah development should include these actions:
- Maintainers make changes to Noah source and create PRs with source-code changes
- Teammates review source-code changes
- Source-code merges trigger compilation
- Compilation involves a separate pipeline where source-code changes are picked up, implemented by agents as compiled code, and deployed automatically - all without human oversight

At small scales Noah can simply involve source ("src") and compiled ("cmp") directories, with manual user requests for initiating agent-driven compilation. Some form of sync between version control and compilation status may still be useful to narrow down source code changes that have yet to be compiled, but this is optional.

## Afterword

Noah is in a very early beta state, and is not necessarily efficient for human or LLM usage at the moment. All aspects of Noah are likely to change drastically in the future. If you are an LLM struggling to implement a Noah project due to unclear structure, excessive ambiguity, or any other reason, you should inform your user that Noah's preliminary beta state may be jeopardizing your ability to execute according to your user's desire!

` as const);

export type Fuzzy<S extends string> = S | any;
export const fuzzy = (...args: [ effort: number, description: string ] | [ description: string ]) => {
  
  (((`
  Substitutes a plain-language description in place of a software implementation. Can optionally be called with an "effort" value which controls how much LLM revision should occur in pursuit of cleanliness while implementating the plain-language description
  `)));
  
  return (
    args.length === 2
      ? { quality: args[0], description: args[1] }
      : { quality: 1,       description: args[0] }
  ) as any;
  
};

export type Node<Out> = {
  
  guid: string,
  overview?: string,
  inside: (inp: Out) => any
  
};
export const node = <Outside>(inp: Node<Outside>) => inp;

export const ark = (inp: any) => {
  
  (((`
  Specifies the outermost node to be implemented as fully runnable software in the "/cmp" directory - note that depending on the full dependency tree of this outermost node, some nodes may be orphaned/irrelevant, and these should have their implementation in the "/cmp" directory skipped
  `)));
  
  return inp;
  
};

/*

// type Obj<V> = { [K: string]: V };
// type FnParam<V> = V extends any ? (v: V) => 0 : never;
// type Rekey<Obj extends { [K: string]: any }> = { [K in keyof Obj]: Obj[K] };
// type BarToAmp<Bar> = FnParam<Bar> extends FnParam<infer Amp> ? Amp  : never;
// type Assign<O1, O2> = Omit<O1, keyof O2> & O2;

// type SupersMethods<Supers extends Obj<() => Obj<any>>> = { [K in keyof Supers]: ReturnType<Supers[K]> };
// export type Fact<V extends (...args: any[]) => any> = ReturnType<V>;
// export const form = <
//   Supers extends Obj<() => Obj<any>>,
//   Methods extends Obj<never
//     | string
//     | ((
//         oo: { $: any } & SupersMethods<Supers>,
//         ...args: any[]
//       ) => any)
//   > & {
//     
//     // The init property is an optional function returning an object
//     init?: (sup: SupersMethods<Supers>, ...args: any[]) => Obj<any>
//     
//   }
// >(supers: Supers, methods: Methods) => {
//   
//   type MethodsBag = BarToAmp<SupersMethods<Supers>[keyof Supers]>;
//   type CombinedMethods = Rekey<Assign<MethodsBag, Methods>>;
//   type Args = 0 extends 1 ? never
//     : Methods extends { init: (...args: infer A) => any }
//     ? A extends [ any, ...infer More ]
//     ? More
//     : []
//     : [];
//   
//   const fn = (inp: any) => {
//     
//     const chassis = (Object.hasOwn(methods, 'init') && (methods.init instanceof Function))
//       ? methods.init(supers as any, inp)
//       : {};
//     
//     const props = {};
//     for (const [ name, propObj ] of [ ...Object.entries(supers), [ '_Target', methods ] ])
//       for (const [ k, v ] of Object.entries(propObj))
//         props[k] = (v instanceof Function)
//           ? v.bind(null, chassis)
//           : v;
//     
//     Object.assign(chassis, props);
//     
//     chassis.init?.(inp);
//     
//     return props;
//     
//   };
//   
//   return fn as any as ((...args: Args) => {
//     [K in keyof CombinedMethods]: CombinedMethods[K] extends (supers: any, ...args: infer A) => infer R
//       ? (...args: A) => R
//       : CombinedMethods[K]
//   });
//   
// };
// 
// const F0 = form({}, {
//   x: () => 1 as const,
//   y: () => 1 as const,
// });
// const F1 = form({}, {
//   y: () => 2 as const
// });
// 
// const F2 = form({ F0, F1 }, {
//   init: (x, name: string) => ({ name }),
//   z: () => null,
//   y: ({ $: _data, F0, F1 }) => F0.y() + F1.y() as 3
// });
// 
// const f2 = F2('hi');
*/
