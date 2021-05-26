# Brainunfuck

This is a compiler for a custom programming language called "brainunfuck". "brainunfuck" compiles to brainfuck. It also contains an own interpreter for brainfuck, to immedeately run compiled brainfuck code.

## Example

Our example file:

```
print 'A';
```

Compiled brainfuck code using `unfuck compile ./path/to/file.unfuck`:

```
[-]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.
```

Output using `unfuck run ./path/to/file.unfuck` or `unfuck run --no-compiler ./path/to/compiled/file.bf`:

```
A
```

## Limitations

A big limitation is memory allocation. All memory has to be "allocated" at compile time, since brainfuck doesn't allow us to get the current position on the band. This means, that you basically only have global variables, if you define variables in loops, the same cells on the band in brainfuck are used on each iteration.

The same applies to all static strings or numbers in loops. They are redifined on every iteration, but on the exact same cells as in the last iteration.

## More Examples

### Literals

```
5; <- integer literal
'A'; <- char literal (single quoted)
"Hello"; <- string literal (double quoted)
```

### Maths

Currently, only addition and subtraction is implemented

```
5+5;
5-5;
```

### Variables

Valid variable names only contain the letters \[a-z\]

```
int $var; <- variable initalization
$var = 5; <- variable assignment
$var + 5; <- variable reference
```

### Loops and conditionals

```
if 0 {
    print "I won't be printed...";
}; <- note the semicolon at the end of the if clause

if 1 {
    print "I WILL be printed!";
}; <- note the semicolon at the end of the if clause


int $i;$i=10;
while $i {
    print "I will be printed 10 times!!!";
    $i = $i - 1;
}; <- also here, semicolon at the end
```
