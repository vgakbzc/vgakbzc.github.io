function Grid(size) {
	this.multiplier   = 2;
	this.size = size;
	this.startTiles   = 2;

	this.cells = [];

	this.build();
	this.playerTurn = true;
}

function is_adj(a,b) {
	if(a.value<=-4 || b.value<=-4) return true;
	if(!a || !b) return false;
	return (a.x==b.x && (a.y-b.y==1 || b.y-a.y==1))||(a.y==b.y && (a.x-b.x==1 || b.x-a.x==1));
}

// pre-allocate these objects (for speed)
Grid.prototype.indexes = [];
for (var x=0; x<4; x++) {
	Grid.prototype.indexes.push([]);
	for (var y=0; y<4; y++) {
		Grid.prototype.indexes[x].push( {x:x, y:y} );
	}
}

// Build a grid of the specified size
Grid.prototype.build = function () {
	for (var x = 0; x < this.size; x++) {
		var row = this.cells[x] = [];

		for (var y = 0; y < this.size; y++) {
			row.push(null);
		}
	}
};


// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
	var cells = this.availableCells();

	if (cells.length) {
		return cells[Math.floor(Math.random() * cells.length)];
	}
};

Grid.prototype.availableCells = function () {
	var cells = [];
	var self = this;

	this.eachCell(function (x, y, tile) {
		if (!tile) {
			//cells.push(self.indexes[x][y]);
			cells.push( {x:x, y:y} );
		}
	});

	return cells;
};

Grid.prototype.availableCellsWeight = function () {
	var count = 0;
	var self = this;

	this.eachCell(function (x, y, tile) {
		if (!tile) {
			//cells.push(self.indexes[x][y]);
			count += 1;
		} else if(tile.value == -1) {
			count += 1;
		} else if(tile.value == -2) {
			count += 1.3;
		} else if(tile.value == -4) {
			count += 1.9;
		} else {
			count += 0;
		}
	});

	return count;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			callback(x, y, this.cells[x][y]);
		}
	}
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
	return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
	return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
	return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
	if (this.withinBounds(cell)) {
		return this.cells[cell.x][cell.y];
	} else {
		return null;
	}
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
	this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
	this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
	return position.x >= 0 && position.x < this.size &&
				 position.y >= 0 && position.y < this.size;
};

Grid.prototype.clone = function() {
	newGrid = new Grid(this.size);
	newGrid.playerTurn = this.playerTurn;
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			if (this.cells[x][y]) {
				newGrid.insertTile(this.cells[x][y].clone());
			}
		}
	}
	return newGrid;
};

// Set up the initial tiles to start the game with
Grid.prototype.addStartTiles = function () {
	for (var i=0; i<this.startTiles; i++) {
		this.addRandomTile();
	}
};

// Adds a tile in a random position
Grid.prototype.addRandomTile = function () {
	if (this.cellsAvailable()) {
		var value1 = (Math.random() < 0.9 ? 1 : 2)*this.multiplier;
		var value2 = Math.random() < 0.86 ? -1 : -2; // Do not change this
		var value = Math.random() < 0.87 ? value1 : value2;
		//var value = Math.random() < 0.9 ? 256 : 512;
		var tile = new Tile(this.randomAvailableCell(), value);

		this.insertTile(tile);
	}
};

// Save all tile positions and remove merger info
Grid.prototype.prepareTiles = function () {
	this.eachCell(function (x, y, tile) {
		if (tile) {
			tile.mergedFrom = null;
			tile.savePosition();
		}
	});
};

// Move a tile and its representation
Grid.prototype.moveTile = function (tile, cell) {
	this.cells[tile.x][tile.y] = null;
	this.cells[cell.x][cell.y] = tile;
	tile.updatePosition(cell);
};


Grid.prototype.vectors = {
	0: { x: 0,  y: -1 }, // up
	1: { x: 1,  y: 0 },  // right
	2: { x: 0,  y: 1 },  // down
	3: { x: -1, y: 0 }   // left
}

// Get the vector representing the chosen direction
Grid.prototype.getVector = function (direction) {
	// Vectors representing tile movement
	return this.vectors[direction];
};

// Move tiles on the grid in the specified direction
// returns true if move was successful
Grid.prototype.move = function (direction) {
	// 0: up, 1: right, 2:down, 3: left
	var self = this;

	var cell, tile;

	var vector     = this.getVector(direction);
	var traversals = this.buildTraversals(vector);
	var moved      = false;
	var score      = 0;
	var won        = false;

	// Save the current tile positions and remove merger information
	this.prepareTiles();

	// Traverse the grid in the right direction and move tiles
	traversals.x.forEach(function (x) {
		traversals.y.forEach(function (y) {
			cell = self.indexes[x][y];
			tile = self.cellContent(cell);

			if (tile) {
				//if (debug) {
					//console.log('tile @', x, y);
				//}
				var positions = self.findFarthestPosition(cell, vector);
				var next      = self.cellContent(positions.next);

				// Only one merger per row traversal? (Fake)
				// Value condition:
				//  Two 65536s or Two O2s cannot merge.
				if (next && next.value === tile.value && !next.mergedFrom && !tile.mergedFrom
						&& tile.value<=32768 && tile.value>=-2) {
					var merged = new Tile(positions.next, tile.value * 2);
					merged.mergedFrom = [tile, next];

					self.insertTile(merged);
					self.removeTile(tile);

					// Converge the two tiles' positions
					tile.updatePosition(positions.next);

					// Update the score
					score += merged.value;

					// The mighty 65536 tile
					if (merged.value === 65536) {
						won = true;
					}
				}
				else if(next && next.value <= -1 && tile.value >= 0 && tile.value <= 32768 && !next.mergedFrom && !tile.mergedFrom && is_adj(tile,next)) {
					var merged = new Tile(positions.next, -tile.value * next.value);
					merged.mergedFrom = [tile, next];

					self.insertTile(merged);
					self.removeTile(tile);

					// Converge the two tiles' positions
					tile.updatePosition(positions.next);

					// Update the score
					score += merged.value;

					// The mighty 65536 tile
					if (merged.value === 65536) {
						won = true;
					}
				}
				else if(next && next.value >= 0 && tile.value <= -1 && next.value <= 32768  && !next.mergedFrom && !tile.mergedFrom && is_adj(tile,next)) {
					var merged = new Tile(positions.next, -next.value * tile.value);
					merged.mergedFrom = [tile, next];

					self.insertTile(merged);
					self.removeTile(tile);

					// Converge the two tiles' positions
					tile.updatePosition(positions.next);

					// Update the score
					score += merged.value;

					// The mighty 65536 tile
					if (merged.value === 65536) {
						won = true;
					}
				} else {
					//if (debug) {
						//console.log(cell);
						//console.log(tile);
					//}
					if(tile.value==-1) {
						if(!tile.age) tile.age=1;
						else tile.age++;
					}
					//if(tile.age>12) {self.removeTile(tile);}
					/*else */self.moveTile(tile, positions.farthest);
				}

				if (!self.positionsEqual(cell, tile)) {
					self.playerTurn = false;
					//console.log('setting player turn to ', self.playerTurn);
					moved = true; // The tile moved from its original cell!
				}
			}
		});
	});

	//console.log('returning, playerturn is', self.playerTurn);
	//if (!moved) {
		//console.log('cell', cell);
		//console.log('tile', tile);
		//console.log('direction', direction);
		//console.log(this.toString());
	//}
	return {moved: moved, score: score, won: won};
};

Grid.prototype.computerMove = function() {
	this.addRandomTile();
	this.playerTurn = true;
}

// Build a list of positions to traverse in the right order
Grid.prototype.buildTraversals = function (vector) {
	var traversals = { x: [], y: [] };

	for (var pos = 0; pos < this.size; pos++) {
		traversals.x.push(pos);
		traversals.y.push(pos);
	}

	// Always traverse from the farthest cell in the chosen direction
	if (vector.x === 1) traversals.x = traversals.x.reverse();
	if (vector.y === 1) traversals.y = traversals.y.reverse();

	return traversals;
};

Grid.prototype.findFarthestPosition = function (cell, vector) {
	var previous;

	// Progress towards the vector direction until an obstacle is found
	do {
		previous = cell;
		cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
	} while (this.withinBounds(cell) &&
					 this.cellAvailable(cell));

	return {
		farthest: previous,
		next: cell // Used to check if a merge is required
	};
};

Grid.prototype.movesAvailable = function () {
	return this.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
// returns the number of matches
Grid.prototype.tileMatchesAvailable = function () {
	var self = this;

	//var matches = 0;

	var tile;

	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			tile = this.cellContent({ x: x, y: y });

			if (tile) {
				for (var direction = 0; direction < 4; direction++) {
					var vector = self.getVector(direction);
					var cell   = { x: x + vector.x, y: y + vector.y };

					var other  = self.cellContent(cell);

					if (other && other.value === tile.value) {
						return true; //matches++; // These two tiles can be merged
					}
					
					if (other && other.value <= -1 && tile.value >= 0) { // 一个倍增格子可以与周围非倍增格子合并
						return true; //matches++;
					}
				}
			}
		}
	}

	//console.log(matches);
	return false; //matches;
};

Grid.prototype.positionsEqual = function (first, second) {
	return first.x === second.x && first.y === second.y;
};

Grid.prototype.toString = function() {
	string = '';
	for (var i=0; i<4; i++) {
		for (var j=0; j<4; j++) {
			if (this.cells[j][i]) {
				string += this.cells[j][i].value + ' ';
			} else {
				string += '_ ';
			}
		}
		string += '\n';
	}
	return string;
}

// counts the number of isolated groups.
Grid.prototype.islands = function() {
	var self = this;
	var mark = function(x, y, value) {
		if (x >= 0 && x <= 3 && y >= 0 && y <= 3 &&
				self.cells[x][y] &&
				self.cells[x][y].value == value &&
				!self.cells[x][y].marked ) {
			self.cells[x][y].marked = true;
			
			for (direction in [0,1,2,3]) {
				var vector = self.getVector(direction);
				mark(x + vector.x, y + vector.y, value);
			}
		}
	}

	var islands = 0;

	for (var x=0; x<4; x++) {
		for (var y=0; y<4; y++) {
			if (this.cells[x][y]) {
				this.cells[x][y].marked = false
			}
		}
	}
	for (var x=0; x<4; x++) {
		for (var y=0; y<4; y++) {
			if (this.cells[x][y] &&
					!this.cells[x][y].marked) {
				islands++;
				mark(x, y , this.cells[x][y].value);
			}
		}
	}
	
	return islands;
}


// measures how smooth the grid is (as if the values of the pieces
// were interpreted as elevations). Sums of the pairwise difference
// between neighboring tiles (in log space, so it represents the
// number of merges that need to happen before they can merge).
// Note that the pieces can be distant
Grid.prototype.smoothness = function() {
	var smoothness = 0;
	for (var x=0; x<4; x++) {
		for (var y=0; y<4; y++) {
			if ( this.cellOccupied( this.indexes[x][y] )) {
				if(this.cellContent( this.indexes[x][y] ).value <= 0) continue;
				var value = Math.log(this.cellContent( this.indexes[x][y] ).value) / Math.log(2);
				for (var direction=1; direction<=2; direction++) {
					var vector = this.getVector(direction);
					var targetCell = this.findFarthestPosition(this.indexes[x][y], vector).next;

					if (this.cellOccupied(targetCell)) {
						if(this.cellContent(targetCell).value <= 0) continue;
						var target = this.cellContent(targetCell);
						var targetValue = Math.log(target.value) / Math.log(2);
						smoothness -= Math.abs(value - targetValue);
					}
				}
			}
		}
	}
	return smoothness;
}

Grid.prototype.monotonicity = function() {
	var self = this;
	var marked = [];
	var queued = [];
	var highestValue = 0;
	var highestCell = {x:0, y:0};
	for (var x=0; x<4; x++) {
		marked.push([]);
		queued.push([]);
		for (var y=0; y<4; y++) {
			marked[x].push(false);
			queued[x].push(false);
			if (this.cells[x][y] &&
					this.cells[x][y].value > highestValue) {
				highestValue = this.cells[x][y].value;
				highestCell.x = x;
				highestCell.y = y;
			}
		}
	}

	increases = 0;
	cellQueue = [highestCell];
	queued[highestCell.x][highestCell.y] = true;
	markList = [highestCell];
	markAfter = 1; // only mark after all queued moves are done, as if searching in parallel

	var markAndScore = function(cell) {
		markList.push(cell);
		var value;
		if (self.cellOccupied(cell)) {
			value = Math.log(self.cellContent(cell).value) / Math.log(2);
		} else {
			value = 0;
		}
		for (direction in [0,1,2,3]) {
			var vector = self.getVector(direction);
			var target = { x: cell.x + vector.x, y: cell.y+vector.y }
			if (self.withinBounds(target) && !marked[target.x][target.y]) {
				if ( self.cellOccupied(target) ) {
					targetValue = Math.log(self.cellContent(target).value ) / Math.log(2);
					if ( targetValue > value ) {
						//console.log(cell, value, target, targetValue);
						increases += targetValue - value;
					}
				}
				if (!queued[target.x][target.y]) {
					cellQueue.push(target);
					queued[target.x][target.y] = true;
				}
			}
		}
		if (markAfter == 0) {
			while (markList.length > 0) {
				var cel = markList.pop();
				marked[cel.x][cel.y] = true;
			}
			markAfter = cellQueue.length;
		}
	}

	while (cellQueue.length > 0) {
		markAfter--;
		markAndScore(cellQueue.shift())
	}

	return -increases;
}

// measures how monotonic the grid is. This means the values of the tiles are strictly increasing
// or decreasing in both the left/right and up/down directions
Grid.prototype.monotonicity2 = function() {
	// scores for all four directions
	var totals = [0, 0, 0, 0];

	// up/down direction
	for (var x=0; x<4; x++) {
		var current = 0;
		var next = current+1;
		while ( next<4 ) {
			while ( next<4 && !this.cellOccupied( this.indexes[x][next] )) {
				next++;
			}
			if (next>=4) { next--; }
			var currentValue = this.cellOccupied({x:x, y:current}) ?
				Math.log(this.cellContent( this.indexes[x][current] ).value) / Math.log(2) :
				0;
			var nextValue = this.cellOccupied({x:x, y:next}) ?
				Math.log(this.cellContent( this.indexes[x][next] ).value) / Math.log(2) :
				0;
			if (currentValue > nextValue) {
				totals[0] += nextValue - currentValue;
			} else if (nextValue > currentValue) {
				totals[1] += currentValue - nextValue;
			}
			current = next;
			next++;
		}
	}

	// left/right direction
	for (var y=0; y<4; y++) {
		var current = 0;
		var next = current+1;
		while ( next<4 ) {
			while ( next<4 && !this.cellOccupied( this.indexes[next][y] )) {
				next++;
			}
			if (next>=4) { next--; }
			var currentValue = this.cellOccupied({x:current, y:y}) ?
				Math.log(this.cellContent( this.indexes[current][y] ).value) / Math.log(2) :
				0;
			var nextValue = this.cellOccupied({x:next, y:y}) ?
				Math.log(this.cellContent( this.indexes[next][y] ).value) / Math.log(2) :
				0;
			if (currentValue > nextValue) {
				totals[2] += nextValue - currentValue;
			} else if (nextValue > currentValue) {
				totals[3] += currentValue - nextValue;
			}
			current = next;
			next++;
		}
	}

	return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
}

// Snakepathity
// We call a grid snakepathy if the tiles are ordered decreasing from bottom to top on a path like 'z' or 's';
Grid.prototype.snakepathity = function() {
	var nextPos = function(cells,i,j,type,flag) {
		if(type) j = 3-j;
		if(flag) {
			if(i%2) j++;
			else j--;
			if(j>3 || j<0) {
				i--;
				if(i<0) return null;
				if(i%2) j++;
				else j--;
			}
		}
		while(!cells[type?(3-j):j][i]) {
			if(i%2) j++;
			else j--;
			if(j>3 || j<0) {
				i--;
				if(i<0) return null;
				if(i%2) j++;
				else j--;
			}
		}
		if(type) return [i,3-j];
		else     return [i,j];
	};
	
	var i = 0;
	var j = 0;
	var tp = 0;
	if(!this.cells[3][3] || (this.cells[0][3] && this.cells[0][3].value > this.cells[3][3])) {
		i = 3;
		j = 0;
		tp = 0;
	}
	else {
		i = 3;
		j = 3;
		tp = 1;
	}
	if(!this.cells[j][i]) return -5;
	if(Math.log(this.cells[j][i].value)/Math.log(2) != this.maxValue()) {
		return -40;
	}
	var nxt = [0,0];
	var ret = 0;
	while(1) {
		nxt = nextPos(this.cells,i,j,tp,1);
		if(!nxt) return ret;
		// console.log("find:",i,j);
		var va = Math.log(this.cells[j][i].value) / Math.log(2);
		var vb = Math.log(this.cells[nxt[1]][nxt[0]].value) / Math.log(2);
		if(i==nxt[0] && !isNaN(va) && !isNaN(vb) && va!=vb) {
			var mat = Math.abs(nxt[1]-j)==1?1:0.2;
			if(vb < va) {
				ret -= mat*0.2*(va-vb-1);
			}
			else {
				ret -= mat*vb-va;
			}
		}
		i = nxt[0];
		j = nxt[1];
	}
	return ret;
}

Grid.prototype.maxValue = function() {
	var max = 0;
	for (var x=0; x<4; x++) {
		for (var y=0; y<4; y++) {
			if (this.cellOccupied(this.indexes[x][y])) {
				var value = this.cellContent(this.indexes[x][y]).value;
				if (value > max) {
					max = value;
				}
			}
		}
	}
	
	if(max<=0) return 0;
	return Math.log(max) / Math.log(2);
}

Grid.prototype.cornerbit = function() {
	var max = 0;
	for (var x=0; x<4; x++) {
		for (var y=0; y<4; y++) {
			if (this.cellOccupied(this.indexes[x][y])) {
				var value = this.cellContent(this.indexes[x][y]).value;
				if (value > max) {
					max = value;
				}
			}
		}
	}
	
	if(this.cellOccupied(this.indexes[0][0]) && this.cellContent(this.indexes[0][0]).value == max) {
	    return 1;
	}
	if(this.cellOccupied(this.indexes[0][3]) && this.cellContent(this.indexes[0][3]).value == max) {
	    return 1;
	}
	if(this.cellOccupied(this.indexes[3][0]) && this.cellContent(this.indexes[3][0]).value == max) {
	    return 1;
	}
	if(this.cellOccupied(this.indexes[3][3]) && this.cellContent(this.indexes[3][3]).value == max) {
	    return 1;
	}
	return 0;
}

// WIP. trying to favor top-heavy distributions (force consolidation of higher value tiles)

Grid.prototype.valueSum = function() {
	var valueCount = [];
	for (var i=0; i<11; i++) {
		valueCount.push(0);
	}

	for (var x=0; x<4; x++) {
		for (var y=0; y<4; y++) {
			if (this.cellOccupied(this.indexes[x][y])) {
				valueCount[Math.log(this.cellContent(this.indexes[x][y]).value) / Math.log(2)]++;
			}
		}
	}

	var sum = 0;
	for (var i=1; i<11; i++) {
		sum += valueCount[i] * Math.pow(2, i) + i;
	}

	return sum;
}

// check for win
Grid.prototype.isWin = function() {
	var self = this;
	for (var x=0; x<4; x++) {
		for (var y=0; y<4; y++) {
			if (self.cellOccupied(this.indexes[x][y])) {
				if (self.cellContent(this.indexes[x][y]).value == 65536) {
					return true;
				}
			}
		}
	}
	return false;
}

//Grid.prototype.zobristTable = {}
//for
//Grid.prototype.hash = function() {
//}
