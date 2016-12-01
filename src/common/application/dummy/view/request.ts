/// <reference path="../../../../_all.d.ts" />
"use strict";

export class Request {

    constructor(private name: string) { }

    getName(): string {
        return this.name;
    }

    public isValid(): boolean {
        return (this.name !== null && this.name !== undefined);
    }

}
