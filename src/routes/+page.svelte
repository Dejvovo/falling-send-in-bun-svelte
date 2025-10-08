<script lang="ts">
	import { FRAME_DURATION, CELL_SIZE, CANVAS_SIZE } from './constants';
	import { mouseHandlerUtils } from './mouseHandlerUtils';
	import type { ICoords } from './types';
	import { cleanVisited, getBottomCellIdx, indexToCoords, initCells, swap } from './utils';

	const mouseHandler = mouseHandlerUtils();
	let lastTime = 0;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let cells = initCells();

	const findCellIdxToFall = (coords: ICoords, yVelocity: number) => {
		const cellsToCheckCount = Math.round(yVelocity);
		let bottomCellIdxResult = undefined;
		let bottomCellCoords = coords;
		let cellsChecked = 0;
		while (true) {
			if (cellsChecked > cellsToCheckCount) break;

			cellsChecked++;
			const bottomCellIdx = getBottomCellIdx(bottomCellCoords);
			if (!bottomCellIdx) break;
			if (cells[bottomCellIdx].type !== 'empty') break;

			bottomCellIdxResult = bottomCellIdx;
			bottomCellCoords = indexToCoords(bottomCellIdx);
		}
		return { bottomCellIdx: bottomCellIdxResult, distance: cellsChecked };
	};

	const step = () => {
		const timestamp = new Date().getTime();
		if (timestamp - lastTime < FRAME_DURATION) return;
		lastTime = timestamp;

		mouseHandler.handleMouse(cells, canvas);

		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			if (cell.visited) continue;
			if (cell.type === 'sand') {
				cell.visited = true;

				// Podivam se na blok pod tim jestli je prazdny
				const { bottomCellIdx, distance } = findCellIdxToFall(indexToCoords(i), cell.yVelocity);
				if (!bottomCellIdx) {
					// Stop falling
					console.log('Final velocity: ', cells[i].yVelocity);
					cells[i].yVelocity = 1;
					continue;
				}

				cells = swap(cells, i, bottomCellIdx);
				cells[bottomCellIdx].yVelocity = cell.yVelocity * 1.02 ** distance;
				cells[bottomCellIdx].visited = true;
			}
		}

		cleanVisited(cells);
	};

	setInterval(() => {
		step();
		draw();
	}, FRAME_DURATION);

	const draw = () => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		cells.forEach((cell, idx) => {
			const coords = indexToCoords(idx);
			ctx.fillStyle = cell.color;
			ctx.fillRect(coords.x * CELL_SIZE, coords.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		});
	};
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-900">
	<canvas
		onmousedown={mouseHandler.handleMouseDown}
		onmousemove={mouseHandler.handleMouseMove}
		onmouseup={mouseHandler.handleMouseUp}
		width={CANVAS_SIZE}
		height={CANVAS_SIZE}
		class={'border-green-500; self-center border-4'}
		bind:this={canvas}
	></canvas>
</div>

<button onclick={step}> Make step</button>
