import permeatorCore from '../src';

const doT = async (j:permeatorCore|any, isWx:boolean) => {
    expect(j._name).toBe('jest');

    /**
     * 初始化
     */

    j.$interface(['todo']);

    j.$use({
        name: 'wx',
        envTest: () => isWx,
        permeator: {
            doSomething: () => 'I\'m wx'
        }
    });

    j.$use({
        name: 'ali',
        envTest: () => false,
        permeator: {
            doSomething: () => 'I\'m ali'
        }
    });

    j.$use({
        name: 'baidu',
        envTest: () => Promise.reject('no baidu'),
        permeator: {
            doSomething: () => 'I\'m baidu'
        }
    });

    j.$setRollBack({
        name: 'default',
        permeator: {
            doSomething: () => 'I\'m default'
        }
    })

    /**
     * 测试动态方法
     */

    expect(typeof j.inWx).toBe('function');
    expect(typeof j.inAli).toBe('function');
    expect(typeof j.inBaidu).toBe('function');

    await j.inWx(() => {
        expect(true).toBe(true);
    });

    await j.inAli(() => {
        expect(true).toBe(false);
    });

    await j.inBaidu(() => {
        expect(true).toBe(false);
    });

    /**
     * 测试内置方法
     */

    // 测试 getEnv 方法
    await j.getEnv((env: any) => {
        if (isWx) {
            expect(env.platform).toBe('wx');
        } else {
            expect(env.platform).toBeNull();
        }
    });

    // 测试 ready 方法
    await j.ready(() => {
        expect(typeof j.isWx).toBe('function');
        expect(typeof j.isAli).toBe('function');
        expect(typeof j.isBaidu).toBe('function');
        expect(typeof j.todo).toBe('function');
        expect(typeof j.doSomething).toBe('function');

        expect(j.isWx()).toBe(isWx);
        expect(j.isAli()).toBe(false);
        expect(j.isBaidu()).toBe(false);
        expect(j.todo()).toBeUndefined();
        if (isWx) {
            expect(j.doSomething()).toBe('I\'m wx');
        } else {
            expect(j.doSomething()).toBe('I\'m default');
        }
    });
};

test('new permeatorCore unnamed', async () => {
    expect.assertions(1);

    const j = new permeatorCore('');
    expect(j._name).not.toBe('');
});

test('new permeatorCore', async () => {
    expect.assertions(30);

    console.log('非 wx 平台');
    await doT(new permeatorCore('jest'), false);
    console.log('wx 平台');
    await doT(new permeatorCore('jest'), true);
});

test('new permeatorCore with config', async () => {
    expect.assertions(30);

    console.log('非 wx 平台');
    await doT(new permeatorCore('jest', {}), false);
    console.log('wx 平台');
    await doT(new permeatorCore('jest', {}), true);
});

test('new permeatorCore with config logger', async () => {
    expect.assertions(32);

    console.log('非 wx 平台');
    await doT(new permeatorCore('jest', {
        logger(log:string) {
            expect(log).toBe('no baidu');
        }
    }), false);
    console.log('wx 平台');
    await doT(new permeatorCore('jest', {
        logger(log:string) {
            if (log !== 'no baidu') {
                expect(log).toBe('jest: 检测到所在平台值为 wx');
            }
        }
    }), true);
});

test('new permeatorCore with config beforeReady', async () => {
    expect.assertions(32);

    console.log('非 wx 平台');
    await doT(new permeatorCore('jest', {
        beforeReady() {
            expect(true).toBe(true);
        }
    }), false);
    console.log('wx 平台');
    await doT(new permeatorCore('jest', {
        beforeReady() {
            expect(true).toBe(true);
        }
    }), true);
});
