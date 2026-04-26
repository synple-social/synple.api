# Functional core

This repository holds the functional core for the synple application. It does not provide any way of interacting with nestjs itself, or a database. It provides ways to create and validate business objects and their associated logic.

## Rules

This repository can not have any side effect in any function or class, and should only define pure functions and abstractions tested via unit tests.