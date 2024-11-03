import { Selector } from 'testcafe';

fixture("My TO DO test")
    .page("https://test.sallybss.dk/todo/");

test('Mark all todos as completed', async t => {
    await t
        .typeText('#todo-input', 'Test Todo 1')
        .click('.todo-form button[type="submit"]')
        .typeText('#todo-input', 'Test Todo 2')
        .click('.todo-form button[type="submit"]');

    await t
        .click('#mark-all-completed');

    const checkboxes = Selector('.todo-item input[type="checkbox"]');
    for (let i = 0; i < await checkboxes.count; i++) {
        await t.expect(checkboxes.nth(i).checked).ok();
    }
});

test('Show only todos due today', async t => {
    await t
        .typeText('#todo-input', 'Today Todo')
        .typeText('#date-input', new Date().toISOString().split('T')[0])
        .click('.todo-form button[type="submit"]')
        .typeText('#todo-input', 'Future Todo')
        .typeText('#date-input', '2100-01-01')
        .click('.todo-form button[type="submit"]');

    await t
        .click('#filter-due-today');

    const todos = Selector('.todo-item');
    await t.expect(todos.count).eql(1);
    await t.expect(todos.nth(0).innerText).contains('Today Todo');
});