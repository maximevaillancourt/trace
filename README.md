# Projet de session de la session d'hiver 2018 à l'Université de Sherbrooke

## Comment démarrer le projet

Assurez-vous de ne pas avoir l'extension MetaMask activée lors du développement de l'application (pour tout de suite -- on pourra corriger ça plus tard).

0. Cloner le projet et y naviguer

    ```
    git clone https://[VOTRE_CIP]@depot.ami.usherbrooke.ca/Passage_Group/Passage_Project.git
    cd Passage_Project
    ```
    
    Ne pas oublier pas de remplacer [VOTRE_CIP] par votre CIP :)

1. Installer Truffle globalement, et installer les dépendances de projet :

    ```
    npm install -g truffle && npm install
    ```

2. Dans une fenêtre de terminal, lancer la console de développement de Truffle :

    ```
    truffle develop
    ```

3. Dans la console de développement de Truffle qu'on vient de lancer, entrer la commande suivante pour compiler et déployer les contrats intelligents : 

    ```
    migrate --reset
    ```
    
    Noter que cette commande réinitialise votre blockchain local, donc toutes les données y étant stockées seront perdues.

4. Dans une nouvelle fenêtre de terminal, lancer le serveur Webpack pour le front-end.

    ``` 
    npm run start
    ```

Une nouvelle fenêtre devrait s'ouvrir dans le navigateur à l'adresse `http://localhost:3000`.