import { dynamicLoadJs, firstUpperCase, log } from '../src/util';

test('dynamicLoadJs', async () => {
    expect.assertions(6);
    expect((<any>window).wx).toBeUndefined();
    const ret = await dynamicLoadJs();
    expect(ret).toBeUndefined();
    expect((<any>window).wx).toBeUndefined();
    return dynamicLoadJs('https://res.wx.qq.com/open/js/jweixin-1.3.2.js').then((ret) => {
        expect(ret).toBeUndefined();
        expect((<any>window).wx).not.toBeUndefined();
        expect(typeof (<any>window).wx).toBe('object');
    });
});

test('firstUpperCase', () => {
    expect.assertions(4);
    expect(firstUpperCase('bolt')).toBe('Bolt');
    expect(firstUpperCase('bolt doggy')).toBe('Bolt Doggy');
    expect(firstUpperCase('bolt-doggy')).toBe('Bolt-Doggy');
    expect(firstUpperCase('boltDoggy')).toBe('BoltDoggy');
});

test('log', () => {
    expect.assertions(2);
    expect(log).not.toBeUndefined();
    expect(typeof log).toBe('function');
});
