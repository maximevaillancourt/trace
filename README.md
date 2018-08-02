![logo](https://user-images.githubusercontent.com/8457808/38818082-db3aea62-4167-11e8-8e59-7af47131c087.png)

# Trace

> A transparent supply chain management platform with end users in mind.

Trace is a decentralized application based on the Ethereum blockchain aiming to
let consumers see the data behind the products they buy every day. It currently 
allows industry experts to add products to the app, as well as create certifications
that can be added to products. A mobile companion app (not developed yet) would 
allow scanning Trace QR codes placed on the actual products to see the data
on-premise (e.g. at the grocery store).

Keep in mind that **this is a proof of concept**. It is *not* production ready by any means. However, we do invite you to play around with the project and use it as you see fit. There are some rough edges, so we definitely appreciate your help in improving the platform.

This project was developed under the supervision of Bessam Abdulrazak, director of the [Ambient Intelligence Lab](https://ami.usherbrooke.ca/welcome/en-lab/) at Université de Sherbrooke.

Made using the Truffle toolkit, React.js, Redux, and Webpack.

Logo design by [Laurence Mailhiot](https://twitter.com/mailhiotlaur).

## Screenshot

![scrot](https://user-images.githubusercontent.com/8457808/38819232-d35aed1e-4168-11e8-90e7-1d74fe726729.png)

## Installing / Getting started

0. Clone the repo:

    ```shell
    git clone https://github.com/maximevaillancourt/trace.git
    cd trace
    ```
    
1. Install the Truffle toolkit globally and install project dependencies:

    ```shell
    npm install -g truffle && npm install
    ```

2. In a new shell, start the Truffle development console:

    ```shell
    truffle develop
    ```

3. In the Truffle console, compile and deploy the smart contracts:

    This will effectively reset your local blockchain, meaning that all existing transactions will be deleted.

    ```shell
    migrate --reset
    ```

4. Back in a regular shell, start the Webpack server:

    ```shell
    npm run start
    ```

A browser window should then open automatically at `http://localhost:3000` (or whatever port you set manually).It might say in the browser window "Waiting for Web3..."  If it does, see steps 5-6.

5.  If you don't already have Metamask, get it (https://metamask.io/).  In Metamask, Import Account (click on the button with the person and arrows in a circle next to the hamburger), using Private Keys. Copy a private key from the output of the Truffle Develop and paste it into the Private Key in Metamask.

6.  Then, connect to your private network. Click the network chooser (it will likely say "Main Ethereum Network" at the top), and choose Custom RPC. In there, enter the URL in your truffle.js file (default in this repo is http://localhost:9545). Then click Save.

7. You should be able to interact with the application in the browser now!

## Developing

To change something in the "smart contracts" side of things, you need to compile your contracts every time you change something
using the following command in the Truffle console:

```shell
migrate --reset
```

As for the React app, the Webpack server should refresh the app automatically when a change is detected.

### Building

Once you're ready to bundle the front-end app, use the `build` script to bundle everything together.

```shell
npm run build
```

### Deploying

You're free to deploy the generated front-end bundle wherever you see fit. As for the smart contract, you can deploy it through Ganache/Truffle by adding a new network configuration. See [this guide](http://truffleframework.com/tutorials/deploying-to-the-live-network) for more information.

## Features

* Add a product to the platform
* Search for a particular product
* Add certifications to products (e.g. "biological", "non-GMO", etc.)
* Browse a product's version history
* See the product's previous positions on a map
* Combine products into one
* Split a product into many (WIP)

# Contributing

For bug fixes, documentation changes, and small features:  

1. [Fork it](https://github.com/maximevaillancourt/trace/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)  
3. Commit your changes (`git commit -am 'Add some feature'`)  
4. Push to the branch (`git push origin my-new-feature`)  
5. Create a new Pull Request

For larger new features: do everything as above, but first also make contact with the project maintainers to be sure your change fits with the project direction and you won't be wasting effort going in the wrong direction

## Links

- Repository: https://github.com/maximevaillancourt/trace
- Issue tracker: https://github.com/maximevaillancourt/trace/issues
- Related projects:
  - Provenance: http://provenance.org/
  - SCTS: https://github.com/AtrauraBlockchain/scts
  - Phinomenal: https://github.com/phi-nomenal/phi-nomenal
  - Sawtooth Lake traceability example: https://provenance.sawtooth.me/

## Licensing

The code in this project is licensed under MIT license. See the [LICENSE](LICENSE).
