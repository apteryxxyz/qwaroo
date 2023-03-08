import { Action } from 'maclary';

export class DestroyAction extends Action {
    public constructor() {
        super({ id: '.' });
    }

    public override onButton(button: Action.Button) {
        setTimeout(async () => {
            if (button.deferred || button.replied) return;
            await button.reply({ components: [] });
        }, 2_500);
    }
}
