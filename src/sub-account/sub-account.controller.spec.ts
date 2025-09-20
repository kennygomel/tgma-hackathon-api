import { Test, TestingModule } from "@nestjs/testing";
import { SubAccountController } from "./sub-account.controller";

describe("SubAccountController", () => {
  let controller: SubAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubAccountController],
    }).compile();

    controller = module.get<SubAccountController>(SubAccountController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
