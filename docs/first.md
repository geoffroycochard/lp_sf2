# Introduction

Nous allons créer un premier bundle `TestBundle` afin de prendre en main le paradigme MVC dans une structure 
Symfony2.

Process :

1. Création d'un bundle
2. Création d'un controller de Test
3. Création d'une action
4. Templating d'une action
5. Templating d'un layout
    1. HTML
    2. CSS / Assets

# Création du bundle

Pour cela nous allons utliser une ligne de commande qui va nous permettre de générer un skeleton de Bundle.

*Cette commande n'est à effectuer qu'en environnement de developpement*

```
$ app/console generate:bundle
```
Un certain nombre d'informations seront nécessaires :

1. Namespace
	1. Vendor / Créateur - `Lp`
	2. Nom du bundle - `Test`
	3. Suffixe obligatoire - `Bundle`
	4. Donc `Lp/TestBundle`
2. Choisir le nom - Par convention on utilise la définition du namespace sans slash
3. Choisir la destination - `src/` car bundle application métier
4. Format de configuration - Prendre `annotation`
5. Structure à générer - `no`
6. Confirmation


**Que s'est-il passé ?**

Il faut se rendre dans le répertoire `src/Lp/TestBundle` afin de voir que des fichiers ont été généré.

1. Fichier `LpTestBundle.php` qui est le seul fichier obligatoire afin de charger le bundle dans le Kernel
2. Autochargement dans le `AppKernel`
3. Enregistrement de la définition de nos routes dans `src/Lp/TestBundle/Resources/config/routing.yml`

# Exercice

## Création d'un controller

Dans un controller nommé `TestController`, il nous faut différentes actions :

1. `index` : qui permet d'afficher un texte statique
2. `whatsMyName` : qui permet d'afficher une information en variable d'URL

Pour chacune de ses actions créer un tempate propre.

## Etendre un layout

* Twig
* Assetics





