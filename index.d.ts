type Action = {
	type: string,
	payload?: any,
	meta?: object,
}

type StringifyOptions = {
	inlineLimit?: number,
	withColor?: boolean,
}

export function actionStringify(action: Action, options: StringifyOptions): string;
export function getActionHistoryStringify(options: StringifyOptions): string;
export function getActionHistoryStringifyAsync(): Promise<string>;
export function getActionHistory(): Action[] | Promise<Action>[];
export function getActionHistoryAsync(): Promise<Action>[];
export function clearActionHistory(): Action[] | Promise<Action>[];
export function reduxThunkHistory() : any;