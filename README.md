# versioning-controlled-api
## [Check demo live app in here](https://evening-spire-77211.herokuapp.com/)
## Get started:

------

### Install [Node.js, NPM](https://nodejs.org/en/download/) and [mongoDB](https://docs.mongodb.com/manual/installation/)
### Clone this project
```shell
https://github.com/firstpersoncode/versioning-controlled-api.git
```
### Install dependencies
```shell
npm install
```
### Run app
***Will also run test***
```shell
npm start
```
***If you don't have mongoDB installed on your environtment***
```shell
npm run nodb
```
### Test app with mocha unit testing
```shell
npm run test
```

------

Method: GET

Endpoint: /object/ // list all items

Endpoint: /object/?order=asc // set timestamp order of result (asc for ascending and desc for descending)

Response:
```javascript
{
  "data":[
    {
      "key":"mykey",
      "value":"value1",
      "timestamp": time
    },
    {
      "key":"mykey",
      "value":"value2",
      "timestamp": time
    }
    ...
  ]
}
```

------

Method: GET

Endpoint: /object/?keys=key|timestamp // set object properties

Endpoint: /object/mykey?keys=key|timestamp

Endpoint: /object/mykey?filter=newest // only show the latest created object based on timestamp (oldest will show only the oldest created object)

Endpoint: /object/mykey?filter=newest&keys=key|timestamp

Response:
```javascript
{
  "data": {
    "key":"mykey",
    "timestamp": newest
  },
}
```

------

Method: POST

Endpoint: /object

Body: JSON: {mykey : value1}

Time: 6.00 pm

Response:
```javascript
{
    "data": {
        "key": "mykey",
        "value": "value1",
        "timestamp": time // Where time is timestamp of the post request (6.00pm) .
    }
}
```

------

Method: GET

Endpoint: /object/mykey

Endpoint: /object/mykey?order=asc // set timestamp order of result (asc for ascending and desc for descending)

Response:
```javascript
{
  "data":[
    {
      "key":"mykey",
      "value":"value1",
      "timestamp": time
    },
    {
      "key":"mykey",
      "value":"value2",
      "timestamp": time
    }
    ...
  ]
}
```

------

Method: POST

Endpoint: /object

Body: JSON: {mykey : value2}

Time: 6.05 pm

Response:
```javascript
{
    "data": {
        "key": "mykey",
        "value": "value2",
        "timestamp": time // Where time is timestamp of the post request (6.05pm) .
    }
}
```

------

Method: GET

Endpoint: /object/mykey?timestamp=1440568980 [6.03pm] // notice that the time here is not exactly 6.00pm

Response:
```javascript
{
    "data": {
        "compare": [
          { // lowest result of timestamp
              "lowest": {
                "key": "mykey",
                "value": "value1",
                "timestamp": 6.00pm
              }
          },
          { // highest result of timestamp
              "highest": {
                "key": "mykey",
                "value": "value2",
                "timestamp": 6.05pm
              }
          },
        ],
        "closest": { // closest result
            "key": "mykey",
            "value": "value1",
            "timestamp": 6.00pm // still return value 1 , because value 2 was only added at 6.05pm
        }
    }
}
```


------

Method: POST

Endpoint: /object/generate/2 // Will generate random items limited to 2.

Endpoint: /object/generate/random // Will generate random items, min 5 max 25 items.

Response:
```javascript
{
    "data": [
        {
            "key": "randomKey1",
            "value": "random value 1",
            "timestamp": time
        },
        {
            "key": "randomKey2",
            "value": "random value 2",
            "timestamp": time
        }
    ]
}
```

------

Method: DELETE

Endpoint: /object/mykey? // pass key name as parameter to delete the item that match with the parameter

Endpoint: /object/* // *becareful*, * (asterisk) will remove everything

Body: JSON: {key : mykey} // or use body

Body: JSON: {key : *} // remove everything

Response:
```javascript
{
    "deleted": {
        "key": "mykey"
    }
}

```


All timestamps are unix timestamps according UTC timezone.
