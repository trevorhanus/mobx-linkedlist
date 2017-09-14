import { expect } from 'chai';
import { action, computed, observable } from 'mobx';
import { LinkedList } from "../src/LinkedList";

describe('LinkedList', () => {

    describe('constructor', () => {

        it('works', () => {
            const list = new LinkedList();
            expect(list).to.be.ok;
        });
    });

    describe('LinkedList#add()', () => {

        it('adds a el when empty', () => {
            const list = new LinkedList<string>();
            list.add('sam', '1');
            expect(list.get('sam')).to.equal('1');
            expect(list.getIndex('sam')).to.equal(0);
        });

        it('adds a el', () => {
            const list = new LinkedList();

            list.add('sam', 'sam');
            list.add('bill', 'bill');
            list.add('jeff', 'jeff');
            expect(list.getIndex('sam')).to.equal(0);
            expect(list.getIndex('bill')).to.equal(1);
            expect(list.getIndex('jeff')).to.equal(2);
        });

        it('adds a el to back', () => {
            const list = new LinkedList();
            list.add('sam', 'sam');
            list.add('bill', 'bill');
            list.add('jeff', 'jeff', 0);
            expect(list.getIndex('jeff')).to.equal(0);
            expect(list.getIndex('sam')).to.equal(1);
            expect(list.getIndex('bill')).to.equal(2);
        });

        it('add a el to out of bounds index', () => {
            const list = new LinkedList();
            list.add('sam', 'sam', -1);
            list.add('bill', 'bill', 0);
            list.add('jeff', 'jeff', 15);
            expect(list.getIndex('bill')).to.equal(0);
            expect(list.getIndex('sam')).to.equal(1);
            expect(list.getIndex('jeff')).to.equal(2);
        });

        it('add at length of list', () => {
            const list = new LinkedList();
            list.add('sam', 'sam');
            list.add('bill', 'bill');
            list.add('jeff', 'jeff', 3);
            expect(list.getIndex('sam')).to.equal(0);
            expect(list.getIndex('bill')).to.equal(1);
            expect(list.getIndex('jeff')).to.equal(2);
        });

        it('add in middle of list', () => {
            const list = new LinkedList();
            list.add('sam', 'sam');
            list.add('bill', 'bill');
            list.add('jeff', 'jeff');
            list.add('zac', 'zac');
            list.add('tim', 'tim', 2);
            expect(list.getIndex('sam')).to.equal(0);
            expect(list.getIndex('bill')).to.equal(1);
            expect(list.getIndex('tim')).to.equal(2);
            expect(list.getIndex('jeff')).to.equal(3);
            expect(list.getIndex('zac')).to.equal(4);
        });
    });

    describe('LinkedList#delete()', () => {

        it('delete when only one node', () => {
            const list = new LinkedList();
            list.add('sam', 'sam');
            expect(list.getIndex('sam')).to.equal(0);
            list.delete('sam');
            expect(list.get('sam')).to.equal(null);
            expect(list.values.length).to.equal(0);
        });

        it('delete when node is front', () => {
            const list = new LinkedList();
            list.add('sam', 'sam');
            list.add('jim', 'jim');
            list.delete('jim');
            expect(list.values.length).to.equal(1);
            expect(list.getIndex('sam')).to.equal(0);
        });

        it('delete when node is in middle', () => {
            const list = new LinkedList();
            list.add('sam', 'sam');
            list.add('node', 'node');
            list.add('jim', 'jim');

            list.delete('node');
            expect(list.size).to.equal(2);
            expect(list.getIndex('sam')).to.equal(0);
            expect(list.get('node')).to.equal(null);
            expect(list.getIndex('jim')).to.equal(1);
        });

        it('delete when node at back', () => {
            const list = new LinkedList();
            list.add('node', 'node');
            list.add('sam', 'sam');
            list.add('jim', 'jim');

            list.delete('node');
            expect(list.size).to.equal(2);
            expect(list.getIndex('sam')).to.equal(0);
            expect(list.getIndex('jim')).to.equal(1);
        });
    });

    // describe('LinkedList#moveForward()', () => {

    //     it('can move a layer forward', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jeff'));
    //         list.moveForward('bill');
    //         expect(list.get('sam').index).to.equal(1);
    //         expect(list.get('jeff').index).to.equal(2);
    //         expect(list.get('bill').index).to.equal(3);
    //     });

    //     it('move front layer forward', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jeff'));
    //         list.moveForward('jeff');
    //         expect(list.get('sam').index).to.equal(1);
    //         expect(list.get('bill').index).to.equal(2);
    //         expect(list.get('jeff').index).to.equal(3);
    //     });

    //     it('move back layer forward', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jeff'));
    //         list.moveForward('sam');
    //         expect(list.get('bill').index).to.equal(1);
    //         expect(list.get('sam').index).to.equal(2);
    //         expect(list.get('jeff').index).to.equal(3);
    //     });

    //     it('longer list', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jeff'));
    //         list.add(new Layer('fred'));
    //         list.add(new Layer('tim'));
    //         list.add(new Layer('greg'));
    //         list.moveForward('fred');
    //         expect(list.get('sam').index).to.equal(1);
    //         expect(list.get('bill').index).to.equal(2);
    //         expect(list.get('jeff').index).to.equal(3);
    //         expect(list.get('tim').index).to.equal(4);
    //         expect(list.get('fred').index).to.equal(5);
    //         expect(list.get('greg').index).to.equal(6);
    //     });
    // });

    // describe('LinkedList#moveToFront()', () => {

    //     it('can move back to the front', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jeff'));
    //         list.moveToFront('sam');
    //         expect(list.get('bill').index).to.equal(1);
    //         expect(list.get('jeff').index).to.equal(2);
    //         expect(list.get('sam').index).to.equal(3);
    //     });

    //     it('move a middle el to the front', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jack'));
    //         list.add(new Layer('jeff'));
    //         list.moveToFront('bill');
    //         expect(list.get('sam').index).to.equal(1);
    //         expect(list.get('jack').index).to.equal(2);
    //         expect(list.get('jeff').index).to.equal(3);
    //         expect(list.get('bill').index).to.equal(4);
    //     });

    //     it('move front to the front', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jack'));
    //         list.add(new Layer('jeff'));
    //         list.moveToFront('jeff');
    //         expect(list.get('sam').index).to.equal(1);
    //         expect(list.get('bill').index).to.equal(2);
    //         expect(list.get('jack').index).to.equal(3);
    //         expect(list.get('jeff').index).to.equal(4);
    //     });
    // });

    // describe('LinkedList#moveToBack()', () => {

    //     it('can move front to the back', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jeff'));
    //         list.moveToBack('jeff');
    //         expect(list.get('jeff').index).to.equal(1);
    //         expect(list.get('sam').index).to.equal(2);
    //         expect(list.get('bill').index).to.equal(3);
    //     });

    //     it('move a middle el to the back', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('node'));
    //         list.add(new Layer('jack'));
    //         list.moveToBack('node');

    //         expect(list.get('node').index).to.equal(1);
    //         expect(list.get('sam').index).to.equal(2);
    //         expect(list.get('bill').index).to.equal(3);
    //         expect(list.get('jack').index).to.equal(4);
    //     });

    //     it('move back to the back', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('bill'));
    //         list.add(new Layer('jack'));
    //         list.add(new Layer('jeff'));
    //         list.moveToBack('sam');
    //         expect(list.get('sam').index).to.equal(1);
    //         expect(list.get('bill').index).to.equal(2);
    //         expect(list.get('jack').index).to.equal(3);
    //         expect(list.get('jeff').index).to.equal(4);
    //     });
    // });

    // describe('LinkedList#moveBackward()', () => {

    //     it('move front layer backward', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('jeff'));
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('jack'));
    //         list.add(new Layer('node'));

    //         list.moveBackward('node');

    //         expect(list.get('jeff').index).to.equal(1);
    //         expect(list.get('sam').index).to.equal(2);
    //         expect(list.get('node').index).to.equal(3);
    //         expect(list.get('jack').index).to.equal(4);
    //     });

    //     it('can move a layer backward', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('jeff'));
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('node'));
    //         list.add(new Layer('jack'));

    //         list.moveBackward('node');

    //         expect(list.get('jeff').index).to.equal(1);
    //         expect(list.get('node').index).to.equal(2);
    //         expect(list.get('sam').index).to.equal(3);
    //         expect(list.get('jack').index).to.equal(4);
    //     });

    //     it('can move the second layer backward', () => {
    //         const list = new LinkedList();
    //         list.add(new Layer('sam'));
    //         list.add(new Layer('node'));
    //         list.add(new Layer('jeff'));

    //         list.moveBackward('node');

    //         expect(list.get('node').index).to.equal(1);
    //         expect(list.get('sam').index).to.equal(2);
    //         expect(list.get('jeff').index).to.equal(3);
    //     });
    // });

    // describe('LinkedList#values', () => {

    //     it('returns all values', () => {
    //         const list = new LinkedList();

    //         const jeff = new Layer('jeff');
    //         const sam = new Layer('sam');
    //         const jack = new Layer('jack');
    //         const bill = new Layer('bill');

    //         list.add(jeff);
    //         list.add(sam);
    //         list.add(jack);
    //         list.add(bill);

    //         expect(list.values).to.deep.equal([jeff, sam, jack, bill]);
    //     });
    // });

    // describe('LinkedList#clear()', () => {

    //     it('can clear', () => {
    //         const list = new LinkedList();

    //         const jeff = new Layer('jeff');
    //         const sam = new Layer('sam');
    //         const jack = new Layer('jack');
    //         const bill = new Layer('bill');

    //         list.add(jeff);
    //         list.add(sam);
    //         list.add(jack);
    //         list.add(bill);

    //         expect(list.size).to.equal(4);
    //         list.clear();
    //         expect(list.size).to.equal(0);
    //     });
    // });
});
