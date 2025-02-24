import { Test, TestingModule } from '@nestjs/testing';
import { CatagoriesController } from './catagories.controller';

describe('CatagoriesController', () => {
  let controller: CatagoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatagoriesController],
    }).compile();

    controller = module.get<CatagoriesController>(CatagoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
