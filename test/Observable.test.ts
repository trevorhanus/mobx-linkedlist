import { autorun } from 'mobx';
import { expect } from 'chai';
import { LinkedList } from '../src/LinkedList';

describe('Observable LinkedList', () => {

    it('works', () => {
        const list = new LinkedList<string>();
        let v: string = null;

        autorun(() => {
            v = `[${list.values.join(', ')}]`;
        });

        expect(v).to.equal('[]');

        list.add('sam', 'sam');
        expect(v).to.equal('[sam]');

        list.add('bill', 'bill');
        expect(v).to.equal('[sam, bill]');

        list.add('jeff', 'jeff', 1);
        expect(v).to.equal('[sam, jeff, bill]');

        list.add('tom', 'tom', 10);
        expect(v).to.equal('[sam, jeff, bill, tom]');

        list.delete('jeff');
        expect(v).to.equal('[sam, bill, tom]');

        const valIndex: any = {};
        list.forEach((val, i) => {
            valIndex[val] = i;
        });
        expect(valIndex).to.deep.equal({ sam: 0, bill: 1, tom: 2 });

        expect(list.has('bill')).to.be.true;
        expect(list.has('jeff')).to.be.false;

        expect(list.getIndex('sam')).to.equal(0);

        list.clear();
        expect(list.size).to.equal(0);
    });
});
