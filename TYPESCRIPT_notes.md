===========================================================
TYPESCRIPT — QUICK FUTURE REFERENCE
===========================================================

1. TypeScript
-----------------------------------------------------------
TypeScript is JavaScript with static type checking.
It helps find type-related errors before running the code.


2. Type Annotation
-----------------------------------------------------------
Used to explicitly tell TypeScript what type a variable,
parameter, or property should have.

Example:
username: string
age: number
isActive: boolean


3. Type Inference
-----------------------------------------------------------
TypeScript automatically detects the type from the value.

Example:
const username = "Arshad";

→ TypeScript knows username is a string.


4. Primitive Types
-----------------------------------------------------------
Use lowercase types:

string
number
boolean

Avoid:
String
Number
Boolean


5. Union Type
-----------------------------------------------------------
Allows a value to have more than one possible type.

Example:
string | number

→ Value can be either string or number.


6. null
-----------------------------------------------------------
Means the value can intentionally have no value.

Example:
string | null

→ Value can be a string OR null.


7. Non-null Assertion (!)
-----------------------------------------------------------
Tells TypeScript that you are sure a value is not null
or undefined.

Example:
value!.replace(...)


8. Nullish Coalescing (??)
-----------------------------------------------------------
Provides a fallback value when the value is null or
undefined.

Example:
value ?? ""


9. any
-----------------------------------------------------------
Disables TypeScript type checking for that value.

Use it carefully because it removes type safety.


10. unknown
-----------------------------------------------------------
Represents a value whose type is not known yet.
TypeScript requires you to check the type before using it.


11. Interface
-----------------------------------------------------------
Defines the structure that an object should follow.

Example:
interface User {
    name: string;
    age: number;
}


12. Type
-----------------------------------------------------------
Can also be used to define custom types or object structures.

Example:
type User = {
    name: string;
    age: number;
};


13. Page / Locator
-----------------------------------------------------------
Playwright provides its own types.

Page:
Represents the Playwright browser page.

Locator:
Represents an element/locator on the page.

Example:
page: Page;
loginButton: Locator;


14. Class Property
-----------------------------------------------------------
Properties should be declared with their expected type.

Example:
page: Page;
username: Locator;


15. Constructor
-----------------------------------------------------------
Used to initialize class properties when an object is created.

Example:
constructor(page: Page) {
    this.page = page;
}


16. async / await
-----------------------------------------------------------
async makes a function asynchronous.

await waits for an asynchronous operation to finish.


17. Promise
-----------------------------------------------------------
An async function returns a Promise.

Example:
async login() { }

→ returns a Promise.


18. Locator vs Promise<Locator>
-----------------------------------------------------------
page.getByText() returns a Locator.

An async method returning getByText() returns
Promise<Locator>.

Don't use async if the method doesn't perform
an asynchronous operation.


19. import / export
-----------------------------------------------------------
Modern TypeScript uses import/export to share classes,
functions, variables, etc. between files.

Example:
export class LoginPage {}

import { LoginPage } from "./LoginPage";


20. CommonJS vs ES Modules
-----------------------------------------------------------
CommonJS:
require()
module.exports

TypeScript / ES Modules:
import
export


21. strict
-----------------------------------------------------------
strict: true enables stronger TypeScript type checking
and helps catch possible errors early.


22. Type Assertion
-----------------------------------------------------------
Tells TypeScript to treat a value as a specific type.

Example:
value as string


23. Access Modifiers
-----------------------------------------------------------
public   → accessible normally
private  → accessible only inside the class
protected → accessible inside the class and child classes


24. readonly
-----------------------------------------------------------
Prevents a property from being reassigned after it is
initialized.

Example:
readonly page: Page;


25. Return Type
-----------------------------------------------------------
Defines what a function returns.

Example:
function add(a: number, b: number): number {
    return a + b;
}

===========================================================
MOST IMPORTANT FOR PLAYWRIGHT
===========================================================

Page       → Playwright browser page
Locator    → Playwright element locator
string     → text values
number     → numeric values
boolean    → true / false
null       → no value
!          → "I know this is not null"
??         → fallback if null/undefined
async      → asynchronous function
await      → wait for Promise to finish
Promise    → result of an async operation
import     → bring something from another file
export     → make something available to other files
strict     → stronger TypeScript checking

===========================================================
*/