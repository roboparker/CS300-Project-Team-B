class Map {
    #size
    #cells

    constructor(size, cells) {
        this.size = size || 128
        this.cells = cells || filledArray2(this.size, () => new Cell())
    }

    get size() {
        return this.#size
    }

    set size(value) {
        this.#size = value
    }

    set cells(value) {
        if(!Array.isArray(value) || value.length < this.size || !Array.isArray(value[0]) || value[0].length < this.size)
            throw `cells must be a multidimensional array`

        this.#cells = filledArray2(this.size, () => null)
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if(!value[i][i] instanceof Cell)
                    throw `invalid cell at ${i}, ${j}. Expected instance of cell. Given ${value[i][i].name}`

                this.#cells[i][j]  = value[i][j]
            }
        }
    }

    is(position) {
        return this.#cells[position.x] !== undefined && this.#cells[position.y] !== undefined
    }

    get(position) {
        return this.#cells[position.x][position.y]
    }

    set(position, cell) {
        if(!cell instanceof Cell)
            throw `Invalid cell. Expected Cell. Given ${cell.name}`

        this.#cells[position.x][position.y] = cell
    }

    getRandomCellPosition() {
        return new Vector(Math.floor(Math.random() * this.#cells.length) + 1, Math.floor(Math.random() * this.#cells.length) + 1)
    }

    replaceRandomEmptyCell(cell) {
        let position = this.getRandomCellPosition()
        let cellAtPosition = this.#cells[position.x][position.y]
        while(cellAtPosition.constructor.name !== "Cell") { // violates liskov principle, refactor so cells contain things instead of things extending from cell
            position = this.getRandomCellPosition()
        }

        this.#cells[position.x][position.y] = cell
    }

    revealPosition(position) {
        this.get(position).isHidden = false
    }

    isRevealed(position) {
        return !this.get(position).isHidden
    }

    triggerPlayerCollision(player) {
        this.#cells[player.position.x][player.position.y].onPlayerCollision(player)
    }

    toString()
    {
        let string = `<div class="game-map">`
        for(let y = this.#cells.length - 1; y >= 0; y--) {
            string += `<div class="map-row">`
            for(let x = 0; x < this.#cells.length; x++) {
                const cell = this.#cells[x][y]
                string += `<div class="map-cell" style="background-color: ${cell.isHidden ? `#666` : cell.backgroundColor};">&nbsp;</div>`
            }
            string += `</div>`
        }
        return string
    }
}