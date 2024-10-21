import { Api } from "./Api.mjs";
import { Notify } from "./Notify";

export class Container{
    #bindings;

    constructor(){
        this.#bindings = {};
        this.resolve();
    }

    resolve(){
        this.bind('Api', () => {return new Api()});
        this.bind('Notify', () => new Notify());
    }

    bind(key, callback){
        this.#bindings[key] = callback;
    }

    get(key) {
        if (!Object.hasOwn(this.#bindings, key)){
            throw new ReferenceError("class doesnt exists in container");
        }
        return this.#bindings[key]();
    }

    static app(){
        return new this;
    }
}