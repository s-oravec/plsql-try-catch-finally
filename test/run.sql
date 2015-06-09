@&&run_dir_begin

prompt Creating package UT_TRY_CATCH_FINALLY
@@ut_try_catch_finally.pkg

set serveroutput on size unlimited
exec pete.run_test_package(a_package_name_in => 'UT_TRY_CATCH_FINALLY');

@&&run_dir_end
