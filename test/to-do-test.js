import { Selector } from 'testcafe';

fixture`My TO DO test`
    .page`https://test.sallybss.dk/todo/`;

test('My Test', async t => {
    await t
        .click(Selector('#someElement'))
        .expect(Selector('#otherElement').innerText).eql('Expected Text');
});