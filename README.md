 
# Venturana

Venturana is a web app used for tracking travel plans.

# URL
https://s24-project1-connordiddy.onrender.com

# Resources
* Users
* Dreams
* Trips

## Users
Attributes:
* firstName (string)
* lastName (string)
* email (string)
* password (string)


### REST API Reference

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve users member     | GET    | /users/*\<id\>*
Create users member       | POST   | /users
Update users member       | PUT    | /users/*\<id\>*
Delete users member       | DELETE | /users/*\<id\>*

## Dreams (Bucket List Items)

Attributes:
* Name of place (string)
* Completed (boolean)
* Notes (string)
* Budget (number)

### REST API Reference

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve dreams collection | GET | /dreams
Retrieve dreams member | GET | /dreams/*<id\>*
Create dream        | POST   | /dreams
Update dream        | PUT    | /dreams/*\<id\>*
Delete dream        | DELETE | /dreams/*\<id\>*

## Trips

Attributes:
* Name of place (string)
* Details (string)
* Start Date (date)
* End Date (date)


### REST API Reference

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve trips collection | GET | /trips
Retrieve trips member | GET | /trips/*<id\>*
Create trip        | POST   | /trips
Delete trip        | DELETE | /trips/*\<id\>*