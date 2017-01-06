@echo off

set projectName=
set /p "projectName=Please enter project name:"

IF not defined projectName (
    set projectName= "demo"
)

node nodejs/new_project.js %projectName%

pause