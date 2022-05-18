import * as React from 'react';

export const createEmbtrOptions = (options: EmbtrMenuOption[]): EmbtrMenuOptions => {
    let uniqueIdentifier = (Math.random() + 1).toString(36).substring(2);
    return { uniqueIdentifier: uniqueIdentifier, options: options };

}

export interface EmbtrMenuOptions {
    uniqueIdentifier: string,
    options: EmbtrMenuOption[]
}

export interface EmbtrMenuOption {
    name: string,
    onPress: Function
}