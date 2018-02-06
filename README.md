# Projet de session de la session d'hiver 2018 à l'Université de Sherbrooke

## Comment démarrer le projet

Assurez-vous de ne pas avoir l'extension MetaMask activée lors du développement de l'application (pour tout de suite -- on pourra corriger ça plus tard).

1. Installer Truffle globalement :

    ```
    npm install -g truffle
    ```

2. Dans une fenêtre de terminal, lancer la console de développement de Truffle :

    ```
    truffle develop
    ```

3. Dans la console de développement de Truffle qu'on vient de lancer, exécuter les commandes suivantes : 

    ```
    compile
    migrate
    ```

4. Dans une nouvelle fenêtre de terminal, lancer le serveur Webpack pour le front-end qui se hot-reload.

    ``` 
    npm run start
    ```

Ça devrait ouvrir une nouvelle fenêtre dans le navigateur à http://localhost:3000. :)