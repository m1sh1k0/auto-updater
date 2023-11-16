# Package version  changer
This script is used to change version of given repository for version
## Before run
Specify those .env variables to run auto update

 Which package to change? 
- PACKAGE_NAME #Name of package you want to check
- PACKAGE_NEW_VERSION #Version of this package

Which repo depends of this package?
- WORKSPACE #Client workspace name
- SLUG #Client project name
- ACCESS_TOKEN # Bit bucket access token

After filling this info you can run auto update by command ***npm start***