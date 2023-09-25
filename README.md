# server

## Prerequisites
node v18.16.0
npm install -g typescript nodemon
npm install -g @angular/cli


```
npm install
```

## Query mode

```
nodemon dist/
```

## Developer mode

To work, you must work with two terminals
Generate dist. Use it when programming. wear watch
```
tsc -w
```

Raise the server
```
nodemon dist/
```



## Fixes and solutions

If a port is in use
```
 sudo lsof -i :3000
 sudo kill -9 <PID>
```


## Others

