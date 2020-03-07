const Grid = [];

class Wall extends BranthGameObject {
	constructor(c, r) {
		super(0, 0);
		this.c = c;
		this.r = r;
		this.spriteName = 'tiles';
		this.imageIndex = this.getAutoTileIndex();
		this.updatePosition();
	}
	updatePosition() {
		this.x = this.c * 64;
		this.y = this.r * 64;
	}
	getAutoTileIndex() {
		let i = 0;
		let wallUp = false;
		let wallLeft = false;
		let wallDown = false;
		let wallRight = false;
		let wallUpLeft = false;
		let wallUpRight = false;
		let wallDownLeft = false;
		let wallDownRight = false;
		if (this.r > 0) {
			if (Grid[this.c][this.r - 1] !== null) {
				wallUp = true;
			}
		}
		if (this.c > 0) {
			if (Grid[this.c - 1][this.r] !== null) {
				wallLeft = true;
			}
		}
		if (this.r < Grid[0].length - 1) {
			if (Grid[this.c][this.r + 1] !== null) {
				wallDown = true;
			}
		}
		if (this.c < Grid.length - 1) {
			if (Grid[this.c + 1][this.r] !== null) {
				wallRight = true;
			}
		}
		if (this.c > 0 && this.r > 0) {
			if (Grid[this.c - 1][this.r - 1] !== null) {
				wallUpLeft = true;
			}
		}
		if (this.c < Grid.length - 1 && this.r > 0) {
			if (Grid[this.c + 1][this.r - 1] !== null) {
				wallUpRight = true;
			}
		}
		if (this.c > 0 && this.r < Grid[0].length - 1) {
			if (Grid[this.c - 1][this.r + 1] !== null) {
				wallDownLeft = true;
			}
		}
		if (this.c < Grid.length - 1 && this.r < Grid[0].length - 1) {
			if (Grid[this.c + 1][this.r + 1] !== null) {
				wallDownRight = true;
			}
		}
		i = 44;
		if (wallUp) {
			i = 0;
			if (wallRight) {
				i = 4;
				if (wallDown) {
					i = 12;
					if (wallLeft) {
						i = 28;
						if (wallUpRight) {
							i = 29;
							if (wallDownRight) {
								i = 33;
								if (wallDownLeft) {
									i = 39;
									if (wallUpLeft) {
										i = 43;
									}
								}
								else if (wallUpLeft) {
									i = 43;
								}
							}
							else if (wallDownLeft) {
								i = 37;
								if (wallUpLeft) {
									i = 36;
								}
							}
							else if (wallUpLeft) {
								i = 36;
							}
						}
						else if (wallDownRight) {
							i = 30;
							if (wallDownLeft) {
								i = 34;
								if (wallUpLeft) {
									i = 42;
								}
							}
							else if (wallUpLeft) {
								i = 38;
							}
						}
						else if (wallDownLeft) {
							i = 31;
							if (wallUpLeft) {
								i = 35;
							}
						}
						else if (wallUpLeft) {
							i = 32;
						}
					}
					else if (wallUpRight) {
						i = 16;
						if (wallDownRight) {
							i = 18;
						}
					}
					else if (wallDownRight) {
						i = 17;
					}
				}
				else if (wallLeft) {
					i = 15;
					if (wallUpRight) {
						i = 25;
						if (wallUpLeft) {
							i = 27;
						}
						else if (wallUpLeft) {
							i = 26;
						}
					}
					else if (wallUpRight) {
						i = 8;
					}
				}
				else if (wallDown) {
					i = 45;
					if (wallLeft) {
						i = 14;
						if (wallDownLeft) {
							i = 22;
							if (wallUpLeft) {
								i = 24;
							}
						}
						else if (wallUpLeft) {
							i = 23;
						}
					}
				}
				else if (wallLeft) {
					i = 7;
					if (wallUpLeft) {
						i = 11;
					}
				}
			}
			else if (wallRight) {
				i = 1;
				if (wallDown) {
					i = 5;
					if (wallLeft) {
						i = 13;
						if (wallDownRight) {
							i = 19;
							if (wallDownLeft) {
								i = 21;
							}
						}
						else if (wallDownLeft) {
							i = 20;
						}
					}
					else if (wallDownRight) {
						i = 9;
					}
				}
				else if (wallLeft) {
					i = 46;
				}
			}
		}
		else if (wallDown) {
			i = 2;
			if (wallLeft) {
				i = 6;
				if (wallDownLeft) {
					i = 10;
				}
			}
		}
		else if (wallLeft) {
			i = 3;
		}
		return i;
	}
}

OBJ.add(Wall);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	Draw.addStrip(Vector2.zero, 'tiles', 'src/img/tile_template_strip47.png', 47);
	for (let i = 0; i < Room.w / 64; i++) {
		Grid.push([]);
		for (let j = 0; j < Room.h / 64; j++) {
			Grid[i].push(null);
		}
	}
};

Game.update = () => {
	if (Input.mouseHold(0)) {
		let m = Input.mousePosition;
		m = new Vector2(~~(m.x / 64), ~~(m.y / 64));
		if (Grid[m.x][m.y] === null) {
			Grid[m.x][m.y] = OBJ.create(Wall, m.x, m.y);
			for (const i of OBJ.take(Wall)) {
				i.imageIndex = i.getAutoTileIndex();
			}
		}
	}
};

BRANTH.start();
Room.start('Game');