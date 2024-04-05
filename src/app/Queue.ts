class Queue<T> {
    items: T[]

    constructor() {
        this.items = []
    }

    enqueue(item: T): void {
        this.items.push(item)
    }

    dequeue() {
        return this.items.shift()
    }
}

export {Queue}