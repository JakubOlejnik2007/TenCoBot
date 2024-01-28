class Queue<QueueItem> {
    private items: QueueItem[];
    constructor() {
        this.items = []
    }
    push = (item: QueueItem) => this.items.push(item);
    pop = (): QueueItem | undefined => this.items.shift();
    length = (): number => this.items.length;
    front = (): QueueItem => this.items[0]
    getElements = (): QueueItem[] => this.items;
}

export default Queue;