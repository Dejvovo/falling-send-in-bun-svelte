import { CELL_COUNT, CELLS_PER_ROW } from './constants';
import type { ICell, ICoords } from './types';

export const initCells = (): ICell[] => {
	const cells = new Array(CELL_COUNT).fill(0);
	const cellsWithCoordinates: ICell[] = cells.map((cell, idx) => ({
		color: 'white',
		type: 'empty',
		visited: false,
		dispersionRate: 0,
		yVelocity: 1,
		xVelocity: 0
	}));
	return cellsWithCoordinates;
};

export const findCell = (cells: ICell[], coords: ICoords) => {
	if (coords.x > CELLS_PER_ROW || coords.y > CELLS_PER_ROW) return undefined;
	return cells[coords.y * CELLS_PER_ROW + coords.x];
};

export const indexToCoords = (index: number): ICoords => {
	return {
		x: index % CELLS_PER_ROW,
		y: Math.floor(index / CELLS_PER_ROW)
	};
};

export const coordsToIndex = (coords: ICoords) => {
	return coords.x + CELLS_PER_ROW * coords.y;
};

const areCoordinatesOutOfBounds = (coords: ICoords) => {
	return coords.x >= CELLS_PER_ROW || coords.y >= CELLS_PER_ROW || coords.x < 0 || coords.y < 0;
};
export const getBottomCellIdx = (coords: { x: number; y: number }) => {
	const bottomCellCoords = { x: coords.x, y: coords.y + 1 };
	if (areCoordinatesOutOfBounds(bottomCellCoords)) return undefined;
	return coordsToIndex(bottomCellCoords);
};

export const getLeftCellIdx = (coords: { x: number; y: number }) => {
	const bottomCellCoords = { x: coords.x - 1, y: coords.y };
	if (areCoordinatesOutOfBounds(bottomCellCoords)) return undefined;
	return coordsToIndex(bottomCellCoords);
};

export const getRightCellIdx = (coords: { x: number; y: number }) => {
	const bottomCellCoords = { x: coords.x + 1, y: coords.y };
	if (areCoordinatesOutOfBounds(bottomCellCoords)) return undefined;
	return coordsToIndex(bottomCellCoords);
};

export const swap = (cells: ICell[], aIdx: number, bIdx: number) => {
	const X = { ...cells[aIdx] };
	cells[aIdx] = { ...cells[bIdx] };
	cells[bIdx] = { ...X };
	return cells;
};

export const cleanVisited = (cells: ICell[]) => {
	return cells.map((cell) => (cell.visited = false));
};
