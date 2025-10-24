

export type Const<T> = T[keyof T]

export type ObjectVal<T> = T[keyof T];

export type ToastStatus = 'error' | 'success' | 'warning' | 'info'

export interface DateSelected {
	day: number;
	month: number;
	year: number;
}

export type ToastState = {
	status: ToastStatus
	header: string
	description: string
}




export const REQUEST_TIMOUT_MS = 25000;