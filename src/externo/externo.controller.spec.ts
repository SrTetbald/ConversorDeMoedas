import { Test, TestingModule } from '@nestjs/testing';
import { ExternoController } from './externo.controller';

describe('ExternoController', () => {
    let controller: ExternoController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExternoController],
        }).compile();

        controller = module.get<ExternoController>(ExternoController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
