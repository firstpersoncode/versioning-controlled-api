# versioning-controlled-api
## Check demo app in [here](https://evening-spire-77211.herokuapp.com/)
## Get started:

------

### Install [Node.js](https://nodejs.org/en/download/), NPM and [mongoDB](https://docs.mongodb.com/manual/installation/)
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
        "lowest": { // lowest result of timestamp
            "key": "mykey",
            "value": "value1",
            "timestamp": 6.00pm
        },
        "highest": { // highest result of timestamp
            "key": "mykey",
            "value": "value2",
            "timestamp": 6.05pm
        },
        "closest": { // closest result
            "key": "mykey",
            "value": "value1",
            "timestamp": 6.00pm // still return value 1 , because value 2 was only added at 6.05pm
        }
    }
} 
```


------

Method: GET 

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


All timestamps are unix timestamps according UTC timezone.
