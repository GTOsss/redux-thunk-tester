type Action = {
	type: string,
	payload?: any,
	meta?: object,
}

type StringifyOptions = {
	inlineLimit?: number,
	withColor?: boolean,
}

declare class ReduxThunkTester {
	readonly actions: Array<object>;
	readonly promises: Array<Promise<any>>;

	static actionStringify(action: Action, options?: StringifyOptions): string;
	getActionHistoryStringify(options?: StringifyOptions): string;
	getActionHistoryStringifyAsync(options?: StringifyOptions): Promise<string>;
	getActionHistory(): Action[] | Promise<Action>[];
	getActionHistoryAsync(): Promise<Action>[];
	clearActionHistory(): Action[] | Promise<Action>[];
	createReduxThunkHistoryMiddleware() : any;
}

export default ReduxThunkTester;