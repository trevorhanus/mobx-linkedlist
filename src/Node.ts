import { observable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

export class Node<T> {
    private _id: string;
    @observable index: number;
    @observable.ref next: Node<T>;
    private _value: T;

    constructor(value: T) {
        this._id = uuidv4();
        this._value = value;
        this.index = null;
        this.next = null;
    }

    get id(): string {
        return this._id;
    }

    get value(): T {
        return this._value;
    }
}
