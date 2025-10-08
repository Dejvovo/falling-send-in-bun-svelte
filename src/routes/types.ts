export type ICoords = {
	x: number;
	y: number;
};

export type ICell = {
	color: string;
	type: string;
	visited: boolean;
	dispersionRate: number;
};
