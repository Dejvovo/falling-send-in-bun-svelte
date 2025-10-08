import { CELL_SIZE, CELLS_PER_ROW } from './constants';
import type { ICell, ICoords } from './types';

export const mouseHandlerUtils = () => {
	let currentMouseEvent: MouseEvent | undefined = undefined;
	let isMouseDown: boolean = false;

	const handleMouseDown = (event: MouseEvent) => {
		isMouseDown = true;
		currentMouseEvent = event;
	};

	const handleMouseMove = (event: MouseEvent) => {
		currentMouseEvent = event;
	};

	const handleMouseUp = () => {
		isMouseDown = false;
		currentMouseEvent = undefined;
	};

	const handleMouse = (cells: ICell[], canvas: HTMLElement) => {
		if (!currentMouseEvent || !isMouseDown) return;
		const box = canvas.getBoundingClientRect();
		const coords = {
			x: currentMouseEvent.clientX - box.left,
			y: currentMouseEvent.clientY - box.top
		};

		const cell = findCellForMouse(cells, coords);
		if (!cell) return;
		cell.type = 'sand';
		cell.color = Math.random() > 0.8 ? 'brown' : 'rosybrown';
	};

	const findCellForMouse = (cells: ICell[], coords: ICoords): ICell | undefined => {
		const yOfCell = Math.floor(coords.y / CELL_SIZE);
		const xOfCell = Math.floor(coords.x / CELL_SIZE);

		if (xOfCell > CELLS_PER_ROW || yOfCell > CELLS_PER_ROW) return undefined;
		return cells[yOfCell * CELLS_PER_ROW + xOfCell];
	};

	return {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleMouse
	};
};
