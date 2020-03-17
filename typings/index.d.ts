declare module 'endb' {
	import {EventEmitter} from 'events';

	export type EndbOptions = {
		uri?: string;
		namespace?: string;
		serialize?: () => any;
		deserialize?: () => any;
		adapter?: string;
		store?: any;
		collection?: string;
		table?: string;
		keySize?: number;
	};

	type Element = {
		key: string;
		value?: any;
	};

	export class Endb extends EventEmitter {
		public options: EndbOptions;
		constructor(options?: EndbOptions);
		public static multi(
			names: string[],
			options?: EndbOptions
		): Record<string, Endb>;

		public all(): Promise<Element[] | undefined>;
		public clear(): Promise<undefined>;
		public delete(key: string | string[]): Promise<boolean | boolean[]>;
		public ensure(key: string, value: any): Promise<any | undefined>;
		public find(fn: () => any, thisArg?: any): Promise<Element | undefined>;
		public get(key: string, path?: string): Promise<any | undefined>;
		public has(key: string): Promise<boolean>;
		public keys(): Promise<string[]>;
		public push(key: string, value: any, path?: string): Promise<any>;
		public remove(key: string, value: any, path?: string): Promise<any>;
		public set(key: string, value: any, path?: string): Promise<true>;
		public values(): Promise<any[]>;
	}

	export class Util {
		public static addKeyPrefix(
			key: string | string[],
			namespace: string
		): string;

		public static isBufferLike(value: any): boolean;
		public static get(
			object: object,
			path: string,
			defaultValue: object
		): object | undefined;

		public static load(options: EndbOptions): any;
		public static parse(text: string): object;
		public static math(base: number, op: string, opand: number): number;
		public static mergeDefault(def: object, given: object): object;
		public static removeKeyPrefix(key: string, namespace: string): string;
		public static safeRequire(id: string): any | undefined;
		public static set(
			object: object,
			path: string | string[],
			value: object
		): object;

		public static stringify(value: any, space?: string | number): string;
		public static validateOptions(options?: EndbOptions): void;
	}
}
