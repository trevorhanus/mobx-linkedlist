import { action, computed, observable, ObservableMap } from 'mobx';
import { isNullOrUndefined } from './utils';
import { Node } from './Node';

export interface ILinkedList<T> {
    add: (key: string, value: T, index?: number) => void;
    delete: (key: string) => void;
    get: (key: string) => T;
    getIndex: (key: string) => number;
    has: (key: string) => boolean;
    clear: () => void;
    size: number;
    forEach: (iterator: (value: T, index: number) => void) => void;
    moveForward: (key: string) => void;
    moveBackward: (key: string) => void;
    moveToBack: (key: string) => void;
    moveToFront: (key: string) => void;
    values: T[];
}

export class LinkedList<T> implements ILinkedList<T> {
    @observable private _nodes: ObservableMap<Node<T>>;
    @observable.ref private _back: Node<T>;
    @observable.ref private _front: Node<T>;

    constructor() {
        this._nodes = observable.map<Node<T>>();
        this._back = null;
        this._front = null;
    }

    @computed
    get size(): number {
        return this._nodes.size;
    }

    @action
    add(key: string, value: T, index?: number): void {
        const newNode = new Node(value);
        this._nodes.set(key, newNode);

        if (this.size === 1) {
            // first el in list
            newNode.index = 0;
            this._back = newNode;
            this._front = newNode;
            return;
        }

        if (isNullOrUndefined(index)) {
            // add at front
            newNode.index = this.size - 1;
            this._front.next = newNode;
            this._front = newNode;
            return;
        }

        if (index <= 0) {
            // add at back
            newNode.next = this._back;
            this._back = newNode;
            this._reindex();
            return;
        }

        if (index >= this.size) {
            index = this.size;
        }

        const prev = this._nodeAtIndex(index - 1);
        newNode.next = prev.next;
        prev.next = newNode;
        this._reindex();
    }

    get(key: string): T {
        if (this.has(key)) {
            return this._nodes.get(key).value;
        } else {
            return null;
        }
    }

    getIndex(key: string): number {
        return this._nodes.get(key).index;
    }

    has(key: string): boolean {
        return this._nodes.has(key);
    }

    delete(key: string): void {
        if (!this.has(key)) return;

        const node = this._nodes.get(key);

        if (this.size === 1) {
            node.index = null;
            this.clear();
            return;
        }

        if (this._isFront(node)) {
            // original     ['sam', 'node']
            // new          ['sam']
            const sam = this._nodeAtIndex(this.size - 2);
            sam.next = null;
            this._front = sam;
            this._nodes.delete(key);
            node.index = null;
            return;
        }

        if (this._isBack(node)) {
            // original     ['node', 'same', 'jim']
            // new          ['sam', 'jim']
            const sam = node.next;
            this._back = sam;
            node.next = null;
            node.index = null;
            this._nodes.delete(key);
            this._reindex();
            return;
        }

        // original     ['sam', 'node', 'jim']
        // new          ['sam', 'jim']
        const sam = this._nodeAtIndex(node.index - 1);
        const jim = node.next;
        sam.next = jim;
        node.index = null;
        this._nodes.delete(key);
        this._reindex();
    }

    @computed
    get values(): T[] {
        const list: T[] = [];
        let node = this._back;
        while (node !== null) {
            list.push(node.value);
            node = node.next;
        }
        return list;
    }

    @action
    clear(): void {
        this._nodes.clear();
        this._back = null;
        this._front = null;
    }

    @action
    forEach(iterator: (value: T, index: number) => void): void {
        if (this._back === null) {
            return;
        }
        let node = this._back;
        while (node !== null) {
            iterator(node.value, node.index);
            node = node.next;
        }
    }

    @action
    moveForward(key: string): void {
        if (!this.has(key)) return;
        const node = this._nodes.get(key);
        if (this._isFront(node)) {
            return;
        }
        if (this._isBack(node)) {
            const newBack = node.next;
            node.next = node.next.next;
            newBack.next = node;
            this._back = newBack;
            this._reindex();
            return;
        }

        // original order   ['one', 'two', 'three']
        // new order        ['one', 'three', 'two']
        const one = this._nodeAtIndex(node.index - 1);
        const two = node;
        const three = node.next;
        one.next = three;
        two.next = three.next;
        three.next = two;
        this._reindex();
    }

    @action
    moveBackward(key: string): void {
        if (!this.has(key)) return;
        const node = this._nodes.get(key);
        if (this._isBack(node)) {
            return;
        }
        if (this._isFront(node)) {
            // ['jeff', 'sam', 'jack', 'el']
            // move el backward, becomes
            // ['jeff', 'sam', 'el', 'jack']
            const sam = this._nodeAtIndex(node.index - 2);
            const jack = sam.next;
            this._front = jack;
            sam.next = node;
            node.next = jack;
            jack.next = null;
            this._reindex();
            return;
        }
        if (node.index === 2) {
            // ['jeff', 'el', 'sam', 'jack']
            // move el backward, becomes
            // ['el', 'jeff', 'sam', 'jack']
            const jeff = this._back;
            const sam = node.next;
            this._back = node;
            node.next = jeff;
            jeff.next = sam;
            this._reindex();
            return;
        }
        // ['jeff', 'sam', 'el', 'jack']
        // move el backward, becomes
        // ['jeff', 'el', 'sam', 'jack']
        const jeff = this._nodeAtIndex(node.index - 2);
        const sam = jeff.next;
        const jack = node.next;
        jeff.next = node;
        node.next = sam;
        sam.next = jack;
        this._reindex();
    }

    @action
    moveToBack(key: string): void {
        if (!this.has(key)) return;
        const node = this._nodes.get(key);
        if (this._isBack(node)) {
            return;
        }
        if (this._isFront(node)) {
            const newFront = this._nodeAtIndex(this.size - 2);
            newFront.next = null;
            this._front = newFront;
            node.next = this._back;
            this._back = node;
            this._reindex();
            return;
        }
        // [sam, bill, el, jack]
        // move el to back, becomes...
        // [el, sam, bill, jack]
        const bill = this._nodeAtIndex(node.index - 1);
        const sam = this._back;
        const jack = node.next;
        bill.next = jack;
        this._back = node;
        node.next = sam;
        this._reindex();
    }

    @action
    moveToFront(key: string): void {
        if (!this.has(key)) return;
        const node = this._nodes.get(key);
        if (this._isFront(node)) {
            return;
        }
        if (this._isBack(node)) {
            const front = this._front;
            front.next = node;
            this._back = node.next;
            this._front = node;
            node.next = null;
            this._reindex();
            return;
        }
        const prev = this._nodeAtIndex(node.index - 1);
        prev.next = node.next;
        this._front.next = node;
        node.next = null;
        this._front = node;
        this._reindex();
    }

    // private methods

    private _isFront(node: Node<T>): boolean {
        return node.id === this._front.id;
    }

    private _isBack(node: Node<T>): boolean {
        return node.id === this._back.id;
    }

    private _nodeAtIndex(index: number): Node<T> {
        if (index < 0 || index >= this.size) {
            return null;
        }
        if (index === this.size - 1) {
            return this._front;
        }
        let node = this._back;
        while (node.index < index) {
            node = node.next;
        }
        return node;
    }

    @action
    private _reindex(): void {
        let index = 0;
        setIndex(this._back);

        function setIndex(node: Node<T>): void {
            node.index = index;
            if (node.next !== null) {
                index++;
                setIndex(node.next);
            }
        }
    }
}

