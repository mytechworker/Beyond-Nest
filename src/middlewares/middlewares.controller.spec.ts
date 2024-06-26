import { Test, TestingModule } from '@nestjs/testing';
import { MiddlewaresController } from './middlewares.controller';

describe('MiddlewaresController', () => {
  let controller: MiddlewaresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MiddlewaresController],
    }).compile();

    controller = module.get<MiddlewaresController>(MiddlewaresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
