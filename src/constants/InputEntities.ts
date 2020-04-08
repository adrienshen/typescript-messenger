interface InputEntitiesType {
  EMAIL: string,
  ID: string,
  LOCATION: string,
  MONEY: string,
  NUMBER: string,
  OCCUPATION: string,
  ORDINAL: string,
  ORGANIZATION: string,
  PERCENT: string,
  PHONE: string,
  RELATIONSHIP: string,
  TIMEX: string,
  URL: string,
  NNP: string,
  [key: string]: string;
}

export const InputEntities: InputEntitiesType = {
  EMAIL: "email",
  ID: "text",
  LOCATION: "text",
  MONEY: "number",
  NUMBER: "number",
  OCCUPATION: "text",
  ORDINAL: "number",
  ORGANIZATION: "text",
  PERCENT: "number",
  PHONE: "tel",
  RELATIONSHIP: "text",
  TIMEX: "time",
  URL: "url",
  NNP: "text",
}

export const getInputType = (lastMessageEntity: string): string => {
  return InputEntities[lastMessageEntity];
}
