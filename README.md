# BEM Tools Copy

## Install

Install BEM Tools copy plugin as simple npm module:
```
npm install bem-tools-cp
```

## CLI usage
```
BEM Tool Copy

Usage:
  cp COMMAND [OPTIONS] [ARGS]
  cp [OPTIONS] [ARGS]

Commands:
  completion : Shell completion

Options:
  -h, --help : Help
  -l LEVEL, --level=LEVEL : Name(s) of level. This option can be used multiple times

Arguments:
  SOURCE : source (required)
  DESTINATION : destination (required)
```

There are two required arguments: `source` and `destination` and `level` 
option with can be set multiple times. 

Source argument consist of two parts:
* level
* BEM entity declaration (with optional tech suffix(es))

```
[block.level]/block[__elem[_mod[_val]]][.{tech1,tech2}]
```

Valid source argument examples:
* `block1`
* `block1__elem1`
* `block1_mod1`
* `block1_mod1_val1`
* `block1__elem1_mod1_val1`
* `block1.js`
* `block1.{js,css}`
* `common.blocks/block1`
* `{common,desktop}.blocks/block1`
* `*.blocks/block1`

And all of possible level, block and tech combinations which satisfies these basic rules.

Destination argument should be strict. It can not contain any wildcard in level part. 
Also it can not contain tech part.

Valid destination argument examples:
* `block1`
* `block1__elem1`
* `block1_mod1`
* `block1_mod1_val1`
* `block1__elem1_mod1_val1`
* `common.blocks/block1`

In case of omitted source and optional levels all project levels will be used.
Destination level will be ignored if source level and optional levels 
are resolved into multiple project levels.

### CLI usage examples

Copy block to another block on all of project levels:
```
bem-tools cp block1 block2
```

Copy block to another block on `common.blocks` project level:
```
bem-tools cp common.blocks/block1 block2
```
or:
```
bem-tools cp block1 block2 -l common.blocks
```

Copy block to another block on `common.blocks` and `desktop.blocks` project levels:
```
bem-tools cp {common,desktop}.blocks/block1 block2
```
or:
```
bem-tools cp block1 block2 -l common.blocks -l desktop.blocks
```

Copy block to another block on all touch project levels:
```
bem-tools cp touch-*/block1 block2
```

Copy element to another element inside one block:
```
bem-tools cp block1__elem1 block1__elem2
```

Copy element between different blocks:
```
bem-tools cp block1__elem1 block2
```
or (with renaming element):
```
bem-tools cp block1__elem1 block2__elem2
```

Copy block modifier inside one block:
```
bem-tools cp block1_mod1 block1_mod2
```

Copy block modifier value inside the on of the block modifiers:
```
bem-tools cp block1_mod1_val1 block1_mod1_val2
```

Copy block modifier value to another modifier of the same block
```
bem-tools cp block1_mod1_val1 block1_mod2
```
or (with renaming modifier value):
```
bem-tools cp block1_mod1_val1 block1_mod2_val2
```

Copy block modifier to another block:
```
bem-tools cp block1_mod1 block2_mod1
```
or (with renaming modifier name):
```
bem-tools cp block1_mod1 block2_mod2
```

Copy block element modifier to another element inside one block
```
bem-tools cp block1_elem1_mod1 block1__elem1_mod2
```

Copy block element modifier value
```
bem-tools cp block1_elem1_mod1_value1 block1__elem1_mod1_value2
```

Copy block element modifier to element from the second block
```
bem-tools cp block1_elem1_mod1 block2__elem2
```
or (with renaming modifier)
```
bem-tools cp block1_elem1_mod1 block2__elem2_mod2
```

## API usage

BEM Tools cp also can be used from JS API

Example:
```
const cp = require('bem-tools-cp');

cp('common.blocks/block1', 'block2', ['desktop.blocks', 'touch-pad.blocks'])
    .then((entities) => {
        console.log(entities);
    });
```

## Contributing
