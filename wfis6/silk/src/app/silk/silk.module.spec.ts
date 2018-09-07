import { SilkModule } from './silk.module';

describe('SilkModule', () => {
  let silkModule: SilkModule;

  beforeEach(() => {
    silkModule = new SilkModule();
  });

  it('should create an instance', () => {
    expect(silkModule).toBeTruthy();
  });
});
