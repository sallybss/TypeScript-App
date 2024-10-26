import { Selector } from 'testcafe';

fixture`My Test Suite`
    .page`http://example.com`;

test('My Test', async t => {
    await t
        .click(Selector('#someElement'))
        .expect(Selector('#otherElement').innerText).eql('Expected Text');
});