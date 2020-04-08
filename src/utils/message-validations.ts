import { IMessage } from "../types";

export const isQuickMessageText = ({text, actions, sender}: IMessage): boolean => {
    let check = (text && actions && sender === "chatbot");
    return Boolean(check);
}

export const simpleText = ({text, elements, sender, actions}: IMessage): boolean => {
    let check = (text && !elements && sender === "chatbot" && !actions);
    return Boolean(check);
}

export const userSimpleText = ({text, elements, sender, actions}: IMessage): boolean => {
    let check = (text && !elements && !sender && !actions);
    return Boolean(check);
}
