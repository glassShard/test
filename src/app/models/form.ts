export interface SimpleField {
    "fieldType": "simple";
    "field": Field;
    "name": string;
}

export interface GroupField {
    "fieldType": "group";
    "field": Array<Field>;
    "title": string;
    "type": "checkbox" | "radio";
    "name": string;
    "validators": FormValidator;
}

export interface FormValidator {
    "required"?: boolean;
    "regex"?: string;
    "email"?: boolean;
    "minChoice"?: number;
}

export interface Field {
    "name": string;
    "label": string;
    "type": string;
    "validators": FormValidator;
    "value"?: string;
    "checked"?: boolean;
    "onValue"?: Field;
}
