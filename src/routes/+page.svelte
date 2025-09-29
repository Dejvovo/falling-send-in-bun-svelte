<script lang="ts">
	const CANVAS_SIZE = 500;
	const CELL_SIZE = 5;
	const CELL_COUNT = (CANVAS_SIZE * CANVAS_SIZE) / (CELL_SIZE * CELL_SIZE);
	const CELLS_PER_ROW = CANVAS_SIZE / CELL_SIZE;

	const FPS = 100;
	const FRAME_DURATION = 1000 / FPS;
	let lastTime = 0;

	type ICoords = {
		x: number;
		y: number;
	};

	type ICell = {
		color: string;
		type: string;
	};

	const initCells = () => {
		const cells = new Array(CELL_COUNT).fill(0);
		const cellsWithCoordinates = cells.map((cell, idx) => ({
			color: 'white',
			type: 'empty',
			visited: false
		}));
		return cellsWithCoordinates;
	};

	const findCellForMouse = (coords: { x: number; y: number }) => {
		const yOfCell = Math.floor(coords.y / CELL_SIZE);
		const xOfCell = Math.floor(coords.x / CELL_SIZE);

		if (xOfCell > CELLS_PER_ROW || yOfCell > CELLS_PER_ROW) return undefined;
		return cells[yOfCell * CELLS_PER_ROW + xOfCell];
	};

	const findCell = (coords: { x: number; y: number }) => {
		if (coords.x > CELLS_PER_ROW || coords.y > CELLS_PER_ROW) return undefined;
		return cells[coords.y * CELLS_PER_ROW + coords.x];
	};

	const indexToCoords = (index: number) => {
		return {
			x: index % CELLS_PER_ROW,
			y: Math.floor(index / CELLS_PER_ROW)
		};
	};

	const coordsToIndex = (coords: ICoords) => {
		return coords.x + CELLS_PER_ROW * coords.y;
	};

	const getBottomCellIdx = (coords: { x: number; y: number }) => {
		const bottomCellCoords = { x: coords.x, y: coords.y + 1 };
		if (bottomCellCoords.x >= CELLS_PER_ROW || bottomCellCoords.y >= CELLS_PER_ROW)
			return undefined;
		return coordsToIndex(bottomCellCoords);
	};

	const swap = (aIdx: number, bIdx: number) => {
		const X = { ...cells[aIdx] };
		cells[aIdx] = { ...cells[bIdx] };
		cells[bIdx] = { ...X };
	};

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let cells = $state(initCells());
	let isMouseDown = $state(false);
	let currentMouseEvent = $state<MouseEvent | undefined>(undefined);

	const handleMouse = () => {
		if (!currentMouseEvent || !isMouseDown) return;
		const box = canvas.getBoundingClientRect();
		const coords = {
			x: currentMouseEvent.clientX - box.left,
			y: currentMouseEvent.clientY - box.top
		};

		const cell = findCellForMouse(coords);
		if (!cell) return;
		cell.type = 'sand';
		cell.color = Math.random() > 0.8 ? 'brown' : 'rosybrown';
	};

	const handleMouseDown = (event: MouseEvent) => {
		isMouseDown = true;
		currentMouseEvent = event;
	};

	const handleMouseMove = (event: MouseEvent) => {
		currentMouseEvent = event;
	};

	const handleMouseUp = (event: MouseEvent) => {
		isMouseDown = false;
		currentMouseEvent = undefined;
	};

	const cleanVisited = () => {
		cells.forEach((cell) => (cell.visited = false));
	};

	const step = () => {
		const timestamp = new Date().getTime();
		if (timestamp - lastTime < FRAME_DURATION) return;
		lastTime = timestamp;

		handleMouse();

		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			if (cell.visited) continue;
			if (cell.type === 'sand') {
				const bottomCellIdx = getBottomCellIdx(indexToCoords(i));
				if (bottomCellIdx) {
					if (cells[bottomCellIdx].type === 'empty') {
						swap(i, bottomCellIdx);
						cells[bottomCellIdx].visited = true;
					}
				}
				cell.visited = true;
			}
		}

		cleanVisited();
	};

	setInterval(() => {
		step();
	}, FRAME_DURATION);

	$effect(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		cells.forEach((cell, idx) => {
			const coords = indexToCoords(idx);
			ctx.fillStyle = cell.color;
			ctx.fillRect(coords.x * CELL_SIZE, coords.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		});
	});
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-900">
	<canvas
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		width={CANVAS_SIZE}
		height={CANVAS_SIZE}
		class={'border-green-500; self-center border-4'}
		bind:this={canvas}
	></canvas>
</div>

<button onclick={step}> Make step</button>
