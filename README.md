# Concentrate README

A simple, extensible, config service. Create config areas, merge them together and extend upon your own templates.

Concentrate consists of an express server and your implementation of config provider (or a built in one). I'm assuming a working knowledge of express and promises. It's configured to provide a predefined set of area operations over HTTP, see [router.js](https://github.com/tanenbaum/concentrate/blob/master/src/router.js).

Like most things in the app, the above router is selected through [env.json](https://github.com/tanenbaum/concentrate/blob/master/src/env.json).

## Areas

An area is just a name for a bag of config. Areas can extend (inherit, if you like) other areas.

### Simple Example

Here's a basic example:

    {
        {
            "area": "smtp",
            "config": {
                "host": "smtp.domain.com",
                "port": 25
            }
        },

        {
            "area": "localSmtp",
            "extend": "smtp",
            "config": {
                "auth": "mycreds"
            }
        },

        {
            "area": "googleSmtp",
            "extend": "smtp",
            "config": {
                "host": "smtp.google.com"
            }
        }
    }

Area `googleSmtp` would result in

    {
        "host": "smtp.google.com",
        "port": 25
    }

### More Complex

A "more complex" (i.e. contrived) example:

    {
        {
            "area": "a",
            "config": {
                "foo": "bar",
                "no": "thanks"
            }
        },

        {
            "area": "b",
            "config": {
                "no": "thanks anyway"
            },
            "extend": "a"
        },

        {
            "area": "c",
            "config": {
                "fizz": "buzz"
            }
        },

        {
            "area": "d",
            "extend": ["b", "c"]
        }
    }

Area `d` would give us:

    {
        "foo": "bar",
        "no": "thanks anyway",
        "fizz": "buzz"
    }

## Config Providers

The concentrate server is as modular as possible (or at least should be). In particular, the provider that loads the areas could be anything that conforms to a simple interface:

```
    get areaName => if area then return config for area, 
                    otherwise return array of area names
    set areaSchema => overwrite area config
    remove areaName => remove area config
```

`areaName` is just a string. `areaSchema` refers to a valid schema representing an area, see [schema.json](https://github.com/tanenbaum/concentrate/blob/master/src/schema.json).

We could use each config provider directly in each request, but then we'd have to bake in the logic for extensions into each one. Rather, we use a config object that wraps the provider.

### Config Wrapper

The config object ([config.js](https://github.com/tanenbaum/concentrate/blob/master/src/config.js)) wraps a config provider, handling the extension of areas and caching. Once seeded with a path to a config provider, the app server creates one config object per request using middleware, like so:

```
app.use(function (req, res, next) {
    try {
        req.provider = new config(settings.configProvider);
    } catch (err) {
        res.status(500).json(err);
    }
    next();
});
```


### Local JSON

JSON local to the host is a default provider. After all, the server must be able to work with its own configuration. We use the json-local provider for this, allowing us to have inherited settings for production, test, dev, etc. Have a look in the [app.js](https://github.com/tanenbaum/concentrate/blob/master/src/app.js) startup code.

The usage is quite simple:

```
var config = require('./config');

var env = process.env.NODE_ENV || 'development';

var settings = new config(
    { 
        module: './config_providers/json-local',
        source: __dirname + '/env.json'
    });

// env set to process 
settings.get(env).then(function (area) {
    console.log(area);
});
```

### Other Providers

Erm, not yet... 

I'd like to create a simple one for Azure blob storage. 

### Packages

Ideally I'd make config providers available as npm packages. We're not quite there yet, mind.

First, the generic config wrapper must be a package.