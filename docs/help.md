# Ligne de commande

Symfony2 intègre des commandes disponibles via l'invite de commandes (sous Windows) ou le terminal (sous Linux). Il existe pas mal de commandes qui vont nous servir assez souvent lors du développement.

Les outils disponibles en ligne de commande ont pour objectif de nous faciliter la vie. Vous pourrez à partir de là générer une base de code source pour certains fichiers récurrents, vider le cache, ajouter des utilisateurs par la suite, etc...

Afin d'y accéder, il faut ouvrir un terminal et se placer dans le root de notre application en y tappant :

```
$ app/console
```

On peut lister les command disponible :

```
$ app/console list
```

Avoir de l'aide sur une command :

```
$ app/console generate:bundle --help
```
[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/components/console/introduction.html)

# Assetic

Ce bundle va nous permettre de gérer tous les appels statics (CSS, JS, IMG).

[<span class="btn btn-info">+ informations</span>](https://symfony.com/doc/current/cookbook/assetic/asset_management.html)

# Format de configuration

Symfony2 support différents formats de configuration (Controller, Entity)

* yml
* xml
* annotation 
* php

# FormBuilder

# Services
