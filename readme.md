title: SQL*Plus set substitution variable from select
date: 2015-06-04
tags:
- Oracle
- PL/SQL
---


The best example to follow would be Java implementation of `try-catch-finally`. However in PL/SQL it would get messy and the code would remind good ol' spaghetti western with epic theme - The Good, The Bad and The Ugly.

https://www.youtube.com/watch?v=pLgJ7pk0X-s

* **The Good** - catch an exception using `try-catch` block
* **The Bad** - code in `finally` block is executed even an exception is thrown
* **The Ugly** - if code has a `return` statement inside the `try` or `catch` block, the code inside the `finally` block will get executed before returning from the method

## The Good

Exception handler in PL/SQL is quite simple
 
````PLSQL
DECLARE
    e EXCEPTION;
BEGIN
    dbms_output.put_line('in try block');
    RAISE e;
EXCEPTION
    WHEN e THEN
        dbms_output.put_line('in catch block');
        dbms_output.put_line(SQLERRM);
END;
````

## The Bad

To implement finally, we need a little workaround - define `finally` block as "inline" stored procedure.

````PLSQL
DECLARE
    e EXCEPTION;

    PROCEDURE finally IS
    BEGIN
        dbms_output.put_line('in finally block');
    END;

BEGIN
    dbms_output.put_line('in try block');
    RAISE e;
    finally;
EXCEPTION
    WHEN e THEN
        dbms_output.put_line('in catch block');
        dbms_output.put_line(SQLERRM);
        finally;
END;
````

## The Ugly

But the implementation is not complete, until it gets the third feature. And now it gets ugly ...
From countless implementations I've chosen these two

### Implement as function

#### Option A

**Pros**

* all "special" logic is in minimalistic subprograms
    * you don't need to change `the_result` method at all
    * cleanup code will be implemented in `finally` subprogram
* 

**Cons**

* this `the_result` method - I like the syntactic "sugar" in form of `RETURN the_result(value)`, but still its little bit weird

````PLSQL
FUNCTION try_catch_finally RETURN typ_method_result IS

    PROCEDURE finally IS
    BEGIN
        --TODO: implement finally code here
        --TODO: do not change result here - BAD PRACTICE
        NULL;
    END;

    --ensures that finally is called before returning from method
    FUNCTION the_result(a_value_in IN typ_method_result) RETURN typ_method_result IS
    BEGIN
        finally;
        RETURN a_value_in;
    END;
    
BEGIN
    --TODO: implement try block code here
    
    RETURN the_result(<result_normal>);
EXCEPTION
    WHEN e_expected_exception_return THEN
        --TODO: handle caught exception
        RETURN the_result(<result_catch>);
        
    WHEN OTHERS THEN
        finally;
        RAISE;
        
END;
````

#### Option B

**Pros**

* single point of return - I consider it Best Practice to have only one

**Cons**

* implementation of `try` block in subprograms - I just don't like subprograms

````PLSQL
FUNCTION fb_try_catch_finally RETURN typ_method_result IS

    l_result typ_method_result;

    PROCEDURE finally IS
    BEGIN
        --TODO: implement finally code here
        --TODO: do not change result here - BAD PRACTICE
        NULL;
    END;

    PROCEDURE try_catch IS
    BEGIN
        --TODO: implement try block code here
        l_result := <result_normal>;
    EXCEPTION
        WHEN e_expected_exception_return THEN
            --TODO: handle caught exception
            l_result := <result_catch>;
    END;

BEGIN
    BEGIN
        try_catch;
    EXCEPTION
        WHEN OTHERS THEN
            finally;
            RAISE;
    END;
    finally;
    RETURN l_result;
END;
````
