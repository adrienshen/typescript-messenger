import { getInputType } from "../src/constants/InputEntities";

describe("InputEntities", () => {

  it("Gets the correct input type", async () => {
    let inputTypeRelationShip = getInputType("RELATIONSHIP");
    let inputTypeMoney = getInputType("MONEY");
    let inputTypeNotExist = getInputType("NOTEXIST");
    expect(inputTypeRelationShip).toBe("text");
    expect(inputTypeMoney).toBe("number");
    expect(inputTypeNotExist).toBe(undefined);
  });

});