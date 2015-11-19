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

# Création d'un controller

Dans un controller nommé `DemoController`, il nous faut différentes actions :

1. `index` : qui permet d'afficher un texte statique
2. `whatsMyName` : qui permet d'afficher une information en variable d'URL

Pour chacune de ses actions créer un template propre.

## Class Controller

Une Class Controller permet de gérer différentes actions appelées par le routing.

Lors de la génération du skeleton de notre bundle, nous avons un répertoire `Controller`. Si nous observons 
le fichier de routing de notre application 'app/config/routing.yml', on constate que nous chargeons toutes les actions
paramétrées dans les class se trouvant dans le dossier `Controller`

    lp_test:
        resource: "@LpTestBundle/Controller/"
        type:     annotation
        prefix:   /
    
    app:
        resource: "@AppBundle/Controller/"
        type:     annotation

Donc il suffit de créer la Class ci-dessous dans un fichier nommé `DemoController.php`(nommage autoload PSR-4) :
 
    <?php
    
    namespace Lp\TestBundle\Controller; # déclaration du namespace
    
    use Symfony\Bundle\FrameworkBundle\Controller\Controller; # import de la Class Controller (héritage)
    use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route; # utiliser pour configuration en annotation
    use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template; # utiliser pour configuration en annotation
    
    class DemoController extends Controller
    {
    
    }

Et pour créer une action, il suffit d'écrire une méthode annotée dans cette classe 

    /**
     * @Route("/index", name="_index") # route
     * @Template() # template partial appellé : LpTestBundle:Demo:index.html.twig
     */
    public function indexAction()
    {
        return array(   # retourne un tableau clé / valeur et les clés sont exposées dans le template
                // ...
            );    
	}
	
Il existe une commande afin de générer un controller :

    $ app/console generate:controller
	
## Gestion des paramètres en annotation
     
     /**
      * @Route("/index/{param}") # route
      * @Template() # template partial appellé : LpTestBundle:Demo:index.html.twig
      */
     public function indexAction($param)
     {
         return array(   # retourne un tableau clé / valeur et les clés sont exposées dans le template
                 // ...
             );    
 	}

Afin d'indiquer la récupération d'un paramètre, il faut le définir dans le route.
Il est passé en argument de la méthode.

**On peut y intégrer l'objet Request**

    use Symfony\Component\HttpFoundation\Request;
    
    public function indexAction($Request $request)
    {
        $page = $request->query->get('page', 1);
    
        // ...
    }

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/book/controller.html)

# Gestion du templating

Le templating dans le framework Symfony est géré par défault avec Twig. 

Que ce soit au niveau App ou Bundle, tous les templates se localisent dans `Resources/views`.

## Localisé un template partial

A partir d'un controller afin d'éxécuter le rendu de l'action on fait appel à un template. Il est localisé en faisant 
appel à la méthode `render()` de la class `Symfony\Bundle\FrameworkBundle\Controller\Controller` dans laquelle est 
injecté le service `twig` à qui appartient cette fonction et renvoie un object `Response`.

**En PHP**

    // renders app/Resources/views/hello/greetings/index.html.twig
    return $this->render('hello/greetings/index.html.twig', array(
        'name' => $name
    ));

**En Annotation**

     /**
      * @Template("LpTestBundle:Demo:another.html.twig")
      */

## Gestion d'un layout

Par défault, la création du projet génère un template `app/Ressources/views/base.html.twig` (block mappés) et celui-ci 
peut-être étendu grâce à la fonction twig `{% extends ::base.html.twig %}`

On peut aussi stocké un layout dans nos Bundles. Afin de le localiser il faut utiliser le ShortName du Bundle 
`LpTestBundle:layout.html.twig` faisant référence au fichier se trouvant dans 
`src/Lp/TestBundle/Ressources/views/layout.html.twig` 

## Par exemple

Nous avons via la définition de notre routing attaqué le controller `LpTestBundle:DemoController:indexAction` qui par 
défault le rendu va être compilé dans le template `LpTestBundle:Demo:index.html.twig` qui est localisé dans 
`src/Lp/TestBundle/Resources/views/Demo/index.html.twig`. Dans ce template partial on fait appel à un layout que nous avons 
crééer dans notre Bundle `src/Lp/TestBundle/Resources/views/layout.html.twig`.

    # src/Lp/TestBundle/Resources/views/index.html.twig
    {% extends "LpTestBundle:layout.html.twig" %}
    
    {% block title %}LpTestBundle:Demo:index{% endblock %}
    
    {% block body %}
    	<h1>Welcome to the Demo:index page</h1>
    {% endblock %}

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/book/templating.html)

## Créer son layout

Faire évoluer le layout en intégrant le [starter template bootstrap](https://getbootstrap.com/examples/starter-template/) en mappant 
les zones dynamiques suivantes (block):

* `{% block title %}` - balise title
* `{% block stylesheets %}` - import des JS
* `{% block body %}` - corps balise body
* `{% block javascripts %}` - import des JS

**Faire appel via un CDN, les librairies externes (CSS/JS)**

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
    
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" crossorigin="anonymous">
    
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>

<p class="text-primary">Bien-sûr une fois correctement mappé, faire appel à ce layout dans le rendu des deux actions définies</p>

## Lien 

Dans le layout, mettre en place un menu avec les 2 actions définies dans la class DemoController

Afin de récupérer l'url d'une action il suffit d'utiliser le helper twig spécialement fait pour Symfony2 `path()`, 
qui prend comme premier argument le nom de la route et en second, un tableau `{}` qui représente les paramètres. 

    <a href="{{ path('_index') }}">Go to index</a>
    
**En annotation, on définit le nom d'une route comme ci-dessous**

    /**
     * @Route("/index", name="_index")
     * @Template()
     */

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/book/templating.html#linking-to-pages)

## Web Assets

L'organisation des fichiers dans un projet symfony2 impose que seul le répertoire `web` est accessible du Web.
Nos fichiers static doivent y être donc stockés afin de les servir au client.

Ces assets, dépendants de nos bundles, doivent être stockés dans `src/Lp/TestBunble/Resources/public`. Afin de les 
rendre accessible, il faut les publier 

```
$ app/console assets:install --symlink
```

L'option `-symlink` permet de faire un lien symbolique.

Passer les assets appelés dans le layout en CDN par le bundle `LpTestBundle` en local.

**Par exemple**
 
    <link rel="stylesheet" href="{{ asset('css/main.css') }}" /> # Stocké dans app/Resources/public/css/main.css
    <link rel="stylesheet" href="{{ asset('bundle/lptest/css/main.css') }}" /> # Stocké dans src/Lp/TestBundle/Resources/Public/css/main.css


### Assetic

Assetic se basant sur Asset est un Bundle Symfony Framework afin de gérer les fichiers static en les filtrants, comme :
 
* Compilé LESS / SAAS / CoffeeScript
* Minifiier / Combiné
* Optimisation d'images

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/cookbook/assetic/asset_management.html)


# Doctrine

# Form






