# Valid8r - The True Validator

**Valid8r** is a lightweight and efficient npm package designed to handle all your input and form validation needs with ease and precision.

![NPM](https://img.shields.io/npm/v/@c4code/valid8r)

![TypeScript](https://img.shields.io/badge/language-typescript-blue)

[Documentation](https://bitbybit-1.gitbook.io/valid8r-docs/)


# Get Started
Valid8r is a node.js library, which means any application that runs on node.js can use valid8r.  

Start by installing `valid8r`
```javascript
npm install '@c4code/valid8r';
```
Installing Valid8r is quick and simple. Just run npm install valid8r to get started, and you're ready to validate your fields with minimal setup.

## Appendix

- [Installation](#1-installation)
- [Demo](#2-demo)
- [Import](#3-import)
- [Default Configuration](#4-default-configuration)
- [Authors](#5-authors)
- [License](#6-license)
- [BMAC 😉](#7-buy-me-a-coffee-😉)

## 1. Installation

Install Valid8r with npm / yarn / bun

```bash
  npm install @c4code/valid8r // For npm
  yarn add @c4code/valid8r // For Yarn
  bun add @c4code/valid8r // For Bun
```

## 2. Demo

To use Valid8r in your project, simply import it with the following line

```javascript
import valid8r from '@c4code/valid8r';
```
That it! Once imported, you can start using its validation functions right away.
Here's how to use Valid8r for basic field validation
```typescript
import valid8r from '@c4code/valid8r';

// Your input's value
const input: string = "Jay Carlos";
const [isValid, errors] = valid8r.name(input);

console.log(isValid); // true

const input2: string = "M4rk Black";
valid8r.name(input); // throws NameValidationFailed error
```

The functions return true if the input is valid, and null as the second parameter. If the validation fails however it will throw an Error.

if you don't want it to throw error and instead return all the errors, use the `{ safe: true }` flag

```typescript
import valid8r from '@c4code/valid8r';

const input2: string = "M4rk Black";
const [valid, errors2] = valid8r.name(input, { safe: true });

if (!valid) {
    console.log(errors2);
    // [{ "noSpChars": "Name should not contain any special characters." }]
}
```

## 3. Import

Use ES6 Module Import to import `valid8r`

```javascript
import valid8r from '@c4code/valid8r';
```

## 4. Default Configuration

Valid8r provides a way to default all your validation configuration globally for your project in on go, you just need to provide all the configuration for all the fields in one place.

Once you’ve **configured globally** for all the fields, every validation in your project will by default follow that configuration if not provided explicitly.

Here's how you can achieve that,
In any of your file in the global context:

```javascript
import valid8r from '@c4code/valid8r';
```

Call defaults function in the valid8r and pass an object of all the fields as the first argument that you want to configure:

```javascript
valid8r.defaults({
    name: {
        fullNameWithMiddle: true,
        allowNumbers: true,
    },
    email: {
        allowedDomains: ['gmail.com', 'outlook.com'],
        allowDisposables: false,
        customDisposables: ['xyz.com', 'dispmail.com'],
    }
}); // defaults to all the validation in the project
```

Then import the config file to any of the main files for this to work.

```javascript
import './config.ts';
```

That's it! Now all the validation functions used in the project will use this as their default configuration, until they are specifically provided with their own configuration. Such as:

```typescript
import valid8r from '@bitbybit/valid8r';

// Your input's value
const input: string = "Jonathan Wilson2";
const [isValid, errors] = valid8r.name(input);

console.log(isValid); // true, as allowNumbers is set to true.

const input2: string = "D4nny Wils0n";
valid8r.name(input, { allowNumbers: false }); 
// throws NameValidationFailed error
```

The configuration is flexible and can be customized according to the projects need.

#### Error Messages
If you don't like the default error messages, and want to configure the error messages according to you valid8r provides a simple way to configure every error message efficiently.

```javascript
import valid8r from '@bitbybit/valid8r';
```

Call defaults function in the valid8r and pass an object that of all the field's error messages your want to configure as the second argument.

```javascript
valid8r.defaults({
    /* Field configurations */
}, {
    name: {
        onlyLast: "Only last name is allowed!",
        noSpChars: "Please dont input any special characters!",
    },
}); // defaults to all the validation in the project
```

However, some fields accept dynamic values that get converts to their relative values when the error is thrown,

```javascript
import valid8r from '@bitbybit/valid8r';

valid8r.defaults({
    /* Field configurations */
}, {
    name: {
        minLen: "Name should atleast be {minLen} char long!"
    },
});

// Your input's value
const input: string = "J";
const [isValid, errors] = valid8r.name(input, {
    minLen: 4,
    safe: true
});

if (!isValid) {
    console.log(errors);
    // [{ minLen: "Name should atleast be 4 char long!"  }]
}
```

You can configure all the field's error message to be used as default in any of the validator

If any validation function requires a specific error you can easily set the error message as the third parameter in any validation function

```javascript
import valid8r from '@bitbybit/valid8r';

// Your input's value
const input: string = "Jay Carlo$";
const [isValid, errors] = valid8r.name(input, { safe: true }, {
    noSpChar: "Special character cannot be included!"
});

if (!isValid) {
    console.log(errors);
    // [{ noSpChar: "Special character cannot be included!"  }]
}
```

## 5. Authors

- [@kushalwithk](https://www.github.com/kushalwithk)

## 6. License

MIT License

Copyright (c) 2024 Kushal Shah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 7. Buy Me a Coffee 😉

#### If you like this package, show your support & love!

[![buy me a coffee](https://res.cloudinary.com/customzone-app/image/upload/c_pad,w_200/v1712840190/bmc-button_wl78gx.png)](https://buymeacoffee.com/powerr)