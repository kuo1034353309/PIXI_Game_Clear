export class Test {

    constructor() {

        this.init(1, 2, 3, 4, 5, 6, 7, 78);

    }

    init(a, b, ...arg) {
        var iiii = 100;
        console.error("arguments", Math.max(...arg));


        var parent = {
            foo() {
                console.log("Hello from the Parent11");
            },
            foo1() {
                console.log("Hello from the Parent212222");
            }
        }

        var child = {
            foo() {
                super.foo();
                console.log("Hello from the Child");
            }
        }

        Object.setPrototypeOf(child, parent);
        child.foo(); // Hello from the Parent
        child.foo1(); // Hello from the Parent
        // Hello from the Child
    }



}